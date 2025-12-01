import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import DOMPurify from 'isomorphic-dompurify';
import { sendOrderConfirmationEmail } from '@/lib/email';

// Tax rates from environment
const SALES_TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_MN_SALES_TAX || '0.06875');
const EXCISE_TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_CANNABIS_EXCISE_TAX || '0.10');

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

interface OrderRequest {
  order: {
    subtotal: number;
    tax: number;
    delivery_fee: number;
    tip: number;
    total: number;
    delivery_address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      apt?: string;
    };
    delivery_slot: string;
    delivery_instructions?: string;
  };
  items: OrderItem[];
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(title, images))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: OrderRequest = await request.json();

    // Validate request body structure
    if (!body.order || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Limit order items (prevent abuse)
    if (body.items.length > 50) {
      return NextResponse.json({ error: 'Too many items in order' }, { status: 400 });
    }

    // Fetch actual product prices from database
    const productIds = body.items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, title, price, stock, is_active')
      .in('id', productIds);

    if (productsError || !products) {
      return NextResponse.json({ error: 'Failed to verify products' }, { status: 500 });
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate each item and calculate server-side totals
    let serverSubtotal = 0;
    const validatedItems: { product_id: string; quantity: number; price_at_purchase: number; product_title: string }[] = [];

    for (const item of body.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (!product.is_active) {
        return NextResponse.json(
          { error: `Product is no longer available: ${product.title}` },
          { status: 400 }
        );
      }

      if (item.quantity <= 0 || item.quantity > 100) {
        return NextResponse.json(
          { error: `Invalid quantity for ${product.title}` },
          { status: 400 }
        );
      }

      if (item.quantity > product.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}. Available: ${product.stock}` },
          { status: 400 }
        );
      }

      // Use server-side price (ignore client price)
      serverSubtotal += product.price * item.quantity;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price, // Server-validated price
        product_title: product.title,
      });
    }

    // Calculate server-side totals
    const serverTax = serverSubtotal * (SALES_TAX_RATE + EXCISE_TAX_RATE);
    const deliveryFee = Math.max(0, body.order.delivery_fee || 0);
    const tip = Math.max(0, Math.min(body.order.tip || 0, 1000)); // Cap tip at $1000
    const serverTotal = serverSubtotal + serverTax + deliveryFee + tip;

    // Sanitize delivery instructions to prevent XSS
    const sanitizedInstructions = body.order.delivery_instructions
      ? DOMPurify.sanitize(body.order.delivery_instructions, { ALLOWED_TAGS: [] }).slice(0, 500)
      : null;

    // Create order with server-calculated values
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal: Math.round(serverSubtotal * 100) / 100,
        tax: Math.round(serverTax * 100) / 100,
        delivery_fee: Math.round(deliveryFee * 100) / 100,
        tip: Math.round(tip * 100) / 100,
        total: Math.round(serverTotal * 100) / 100,
        delivery_address: body.order.delivery_address,
        delivery_slot: body.order.delivery_slot,
        delivery_instructions: sanitizedInstructions,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items with validated prices
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) throw itemsError;

    // Update product stock (decrement)
    for (const item of validatedItems) {
      // Use direct update instead of RPC for type safety
      // The decrement_stock RPC function exists but isn't in generated types
      const { error: stockError } = await supabase
        .from('products')
        .update({
          stock: (productMap.get(item.product_id)?.stock || 0) - item.quantity,
        })
        .eq('id', item.product_id);

      if (stockError) {
        console.error(`Failed to update stock for ${item.product_id}:`, stockError.message);
      }
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    // Send order confirmation email (non-blocking)
    if (profile?.email) {
      // Fetch order with items for email
      const { data: orderWithItems } = await supabase
        .from('orders')
        .select('*, order_items(*, products(title, images))')
        .eq('id', order.id)
        .single();

      if (orderWithItems) {
        sendOrderConfirmationEmail({
          order: orderWithItems,
          items: orderWithItems.order_items as any,
          customerEmail: profile.email,
          customerName: profile.full_name,
        }).catch((err) => console.error('Failed to send order email:', err));
      }
    }

    return NextResponse.json(
      {
        ...order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    console.error('Order creation error:', errorMessage);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
