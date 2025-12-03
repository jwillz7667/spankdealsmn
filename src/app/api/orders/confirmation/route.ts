/** Send order confirmation email */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateOnly, formatTimeSlot } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order details
    const supabase = await createServerSupabaseClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (email, full_name, phone),
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const userEmail = order.profiles.email;
    const userName = order.profiles.full_name || 'Valued Customer';
    const deliveryTime = new Date(order.delivery_slot);

    // Build order items HTML
    const itemsHtml = order.order_items
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; color: #374151;">${item.product_title}</td>
          <td style="padding: 12px 0; text-align: center; color: #374151;">×${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; color: #374151;">${formatCurrency(item.price_at_purchase * item.quantity)}</td>
        </tr>
      `
      )
      .join('');

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: 'DankDeals <orders@dankdeals.com>',
      to: userEmail,
      subject: `Order Confirmation #${order.id.slice(0, 8)}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #111827; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
    .header { background: linear-gradient(135deg, #1a2b4d 0%, #1f3a5f 100%); color: #fbbf24; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-item { border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px; background: #f9fafb; }
    .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
    .info-value { font-size: 16px; font-weight: 600; color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { text-align: left; padding: 12px 0; border-bottom: 2px solid #fbbf24; color: #111827; font-weight: 600; }
    .total-row { display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #fbbf24; font-size: 18px; font-weight: 600; color: #111827; }
    .badge { display: inline-block; background: #fbbf24; color: #1a2b4d; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .cta-button { display: inline-block; background: #fbbf24; color: #1a2b4d; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for your order, ${userName}</p>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">Order Details</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Order Number</div>
            <div class="info-value">#${order.id.slice(0, 8)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Order Date</div>
            <div class="info-value">${formatDateOnly(new Date(order.created_at))}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value"><span class="badge">${order.status}</span></div>
          </div>
          <div class="info-item">
            <div class="info-label">Estimated Delivery</div>
            <div class="info-value">${formatTimeSlot(deliveryTime)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Delivery Address</div>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 3px solid #fbbf24;">
          <p style="margin: 0; color: #111827; font-weight: 600;">${order.delivery_address.street}</p>
          ${order.delivery_address.apt ? `<p style="margin: 4px 0; color: #374151;">${order.delivery_address.apt}</p>` : ''}
          <p style="margin: 4px 0; color: #374151;">${order.delivery_address.city}, ${order.delivery_address.state} ${order.delivery_address.zip}</p>
          ${order.delivery_instructions ? `<p style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;"><strong>Instructions:</strong> ${order.delivery_instructions}</p>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Order Summary</div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal</span>
            <span>${formatCurrency(order.subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Tax</span>
            <span>${formatCurrency(order.tax)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Delivery Fee</span>
            <span>${formatCurrency(order.delivery_fee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0;">
            <span>Tip</span>
            <span>${formatCurrency(order.tip)}</span>
          </div>
        </div>

        <div class="total-row">
          <span>Total Due</span>
          <span style="color: #fbbf24;">${formatCurrency(order.total)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Method</div>
        <div style="background: #fef3c7; border-left: 3px solid #fbbf24; padding: 15px; border-radius: 6px;">
          <p style="margin: 0; color: #111827;"><strong>💵 Cash on Delivery</strong></p>
          <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">Please have exact cash ready when the driver arrives.</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin-bottom: 15px;">Need help? Contact us at <strong>support@dankdeals.com</strong> or call <strong>612-930-1390</strong></p>
        <p style="color: #6b7280; font-size: 12px; margin: 0;">Questions about your order? Visit your account dashboard to track status.</p>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 DankDeals. All rights reserved. Managed by Viral Ventures LLC.</p>
      <p>This email contains your order confirmation. Please keep it for your records.</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail the API if email fails - order was already created
      return NextResponse.json(
        {
          ok: true,
          warning: 'Order created but confirmation email could not be sent',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Confirmation email error:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
