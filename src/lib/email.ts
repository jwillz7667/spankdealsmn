/**
 * Email service using Resend for transactional emails.
 *
 * Setup:
 * 1. Install Resend: pnpm add resend
 * 2. Add RESEND_API_KEY to .env
 * 3. Verify your domain in Resend dashboard
 */

import { Resend } from 'resend';
import type { Order, OrderItem } from '@/types/database';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'orders@dankdeals.com';
const COMPANY_NAME = 'DankDeals';

interface OrderEmailData {
  order: Order;
  items: (OrderItem & { products: { title: string; images: string[] } })[];
  customerEmail: string;
  customerName: string | null;
}

/**
 * Formats currency for display
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formats date for display
 */
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Generates order confirmation email HTML
 */
function generateOrderConfirmationHtml(data: OrderEmailData): string {
  const { order, items, customerName } = data;
  const greeting = customerName ? `Hi ${customerName.split(' ')[0]}` : 'Hi there';

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #333;">
          <strong style="color: #D4AF37;">${item.product_title}</strong>
          <br><span style="color: #888;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right; color: #fff;">
          ${formatCurrency(item.price_at_purchase * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  const address = order.delivery_address as {
    street: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #D4AF37; font-size: 32px; margin: 0; letter-spacing: 2px;">DANKDEALS</h1>
          <p style="color: #888; margin: 10px 0 0;">Premium Cannabis Delivery</p>
        </div>

        <!-- Confirmation Message -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; margin-bottom: 24px; border: 1px solid #333;">
          <h2 style="color: #D4AF37; margin: 0 0 16px; font-size: 24px;">${greeting}, your order is confirmed!</h2>
          <p style="color: #ccc; margin: 0; line-height: 1.6;">
            Thank you for your order. We're preparing your items for delivery and will notify you when your driver is on the way.
          </p>
        </div>

        <!-- Order Details -->
        <div style="background: #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #333;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Order Number</p>
              <p style="color: #fff; margin: 4px 0 0; font-family: monospace; font-size: 14px;">${order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div style="text-align: right;">
              <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Delivery Time</p>
              <p style="color: #D4AF37; margin: 4px 0 0; font-size: 14px;">${formatDate(order.delivery_slot)}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 12px 0; border-bottom: 2px solid #D4AF37; text-align: left; color: #888; font-size: 12px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px 0; border-bottom: 2px solid #D4AF37; text-align: right; color: #888; font-size: 12px; text-transform: uppercase;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #333;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888;">Subtotal</span>
              <span style="color: #fff;">${formatCurrency(order.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888;">Tax</span>
              <span style="color: #fff;">${formatCurrency(order.tax)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888;">Delivery Fee</span>
              <span style="color: #fff;">${formatCurrency(order.delivery_fee)}</span>
            </div>
            ${
              order.tip > 0
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #888;">Tip</span>
              <span style="color: #fff;">${formatCurrency(order.tip)}</span>
            </div>
            `
                : ''
            }
            <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 1px solid #D4AF37;">
              <span style="color: #D4AF37; font-weight: bold; font-size: 18px;">Total</span>
              <span style="color: #D4AF37; font-weight: bold; font-size: 18px;">${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div style="background: #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #333;">
          <h3 style="color: #D4AF37; margin: 0 0 12px; font-size: 14px; text-transform: uppercase;">Delivery Address</h3>
          <p style="color: #fff; margin: 0; line-height: 1.6;">
            ${address.street}${address.apt ? `, ${address.apt}` : ''}<br>
            ${address.city}, ${address.state} ${address.zip}
          </p>
          ${
            order.delivery_instructions
              ? `
          <p style="color: #888; margin: 12px 0 0; font-style: italic;">
            "${order.delivery_instructions}"
          </p>
          `
              : ''
          }
        </div>

        <!-- Payment Method -->
        <div style="background: #1a1a2e; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #333;">
          <h3 style="color: #D4AF37; margin: 0 0 12px; font-size: 14px; text-transform: uppercase;">Payment Method</h3>
          <p style="color: #fff; margin: 0;">Cash on Delivery</p>
          <p style="color: #888; margin: 8px 0 0; font-size: 14px;">
            Please have ${formatCurrency(order.total)} ready for your driver.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #333;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            Questions? Reply to this email or text us at (612) 555-DANK
          </p>
          <p style="color: #666; margin: 16px 0 0; font-size: 12px;">
            ${COMPANY_NAME} | Minneapolis-St. Paul, MN
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Generates order status update email HTML
 */
function generateStatusUpdateHtml(
  order: Order,
  customerName: string | null,
  status: string
): string {
  const greeting = customerName ? `Hi ${customerName.split(' ')[0]}` : 'Hi there';

  const statusMessages: Record<string, { title: string; message: string; emoji: string }> = {
    confirmed: {
      title: 'Order Confirmed',
      message: "We've received your order and it's being prepared.",
      emoji: '✅',
    },
    preparing: {
      title: 'Preparing Your Order',
      message: 'Your items are being carefully prepared for delivery.',
      emoji: '📦',
    },
    out_for_delivery: {
      title: 'Out for Delivery',
      message: 'Your driver is on the way! Please have payment ready.',
      emoji: '🚗',
    },
    delivered: {
      title: 'Delivered',
      message: 'Your order has been delivered. Enjoy!',
      emoji: '🎉',
    },
    cancelled: {
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. Contact us if you have questions.',
      emoji: '❌',
    },
  };

  const statusInfo = statusMessages[status] || {
    title: 'Order Update',
    message: `Your order status is now: ${status}`,
    emoji: '📋',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${statusInfo.title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #D4AF37; font-size: 32px; margin: 0; letter-spacing: 2px;">DANKDEALS</h1>
        </div>

        <!-- Status Update -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #333;">
          <div style="font-size: 48px; margin-bottom: 16px;">${statusInfo.emoji}</div>
          <h2 style="color: #D4AF37; margin: 0 0 16px; font-size: 24px;">${statusInfo.title}</h2>
          <p style="color: #ccc; margin: 0 0 24px; line-height: 1.6;">
            ${greeting}, ${statusInfo.message}
          </p>
          <div style="background: #0a0a0f; border-radius: 8px; padding: 16px; display: inline-block;">
            <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Order Number</p>
            <p style="color: #fff; margin: 4px 0 0; font-family: monospace; font-size: 18px;">${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <!-- Delivery Time Reminder -->
        ${
          status === 'out_for_delivery'
            ? `
        <div style="background: #1a1a2e; border-radius: 16px; padding: 24px; margin-top: 24px; border: 1px solid #333; text-align: center;">
          <p style="color: #D4AF37; margin: 0; font-size: 18px; font-weight: bold;">
            Scheduled Delivery: ${formatDate(order.delivery_slot)}
          </p>
          <p style="color: #888; margin: 12px 0 0;">
            Please have ${formatCurrency(order.total)} ready in cash.
          </p>
        </div>
        `
            : ''
        }

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #333;">
          <p style="color: #888; margin: 0; font-size: 14px;">
            Questions? Reply to this email or text us at (612) 555-DANK
          </p>
          <p style="color: #666; margin: 16px 0 0; font-size: 12px;">
            ${COMPANY_NAME} | Minneapolis-St. Paul, MN
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

/**
 * Sends order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmed - ${data.order.id.slice(0, 8).toUpperCase()}`,
      html: generateOrderConfirmationHtml(data),
    });

    if (error) {
      console.error('Failed to send confirmation email:', error);
      return { success: false, error: error.message };
    }

    console.log('Order confirmation email sent:', result?.id);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Email send error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Sends order status update email
 */
export async function sendOrderStatusEmail(
  order: Order,
  customerEmail: string,
  customerName: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  const statusLabels: Record<string, string> = {
    confirmed: 'Confirmed',
    preparing: 'Being Prepared',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const statusLabel = statusLabels[order.status] || order.status;

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order ${statusLabel} - ${order.id.slice(0, 8).toUpperCase()}`,
      html: generateStatusUpdateHtml(order, customerName, order.status),
    });

    if (error) {
      console.error('Failed to send status email:', error);
      return { success: false, error: error.message };
    }

    console.log('Order status email sent:', result?.id);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Email send error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
