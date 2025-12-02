-- ============================================================================
-- DANKDEALS ENTERPRISE DATABASE ENHANCEMENTS
-- ============================================================================
-- Apply this migration via Supabase Dashboard > SQL Editor
-- This migration adds enterprise-grade features for scalability and performance
-- ============================================================================

-- ============================================================================
-- 1. STOCK MANAGEMENT FUNCTIONS (from migration 003)
-- ============================================================================

-- Atomic stock decrement with race condition protection
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = NOW()
  WHERE id = p_product_id
    AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic stock increment (for cancellations/returns)
CREATE OR REPLACE FUNCTION increment_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock + p_quantity,
      updated_at = NOW()
  WHERE id = p_product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. AUDIT LOGGING TABLE
-- ============================================================================
-- Enterprise requirement: Track all changes to sensitive data

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES profiles(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by table and record
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- RLS: Only admins can view audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to log order changes automatically
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (
      'orders',
      NEW.id,
      'UPDATE',
      to_jsonb(OLD),
      to_jsonb(NEW),
      auth.uid()
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (
      'orders',
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      auth.uid()
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to audit order changes
DROP TRIGGER IF EXISTS orders_audit_trigger ON orders;
CREATE TRIGGER orders_audit_trigger
  AFTER UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_changes();

-- ============================================================================
-- 3. ORDER STATUS HISTORY TABLE
-- ============================================================================
-- Track order status changes with timestamps for customer visibility

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id, created_at DESC);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order history" ON order_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage order history" ON order_status_history
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to auto-log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status::TEXT, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS orders_status_history_trigger ON orders;
CREATE TRIGGER orders_status_history_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- ============================================================================
-- 4. PRODUCT REVIEWS TABLE
-- ============================================================================
-- Customer reviews with moderation support

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(product_id, rating);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON product_reviews
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can create reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON product_reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger for reviews updated_at
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 5. SAVED ADDRESSES TABLE
-- ============================================================================
-- Multiple delivery addresses per user

CREATE TABLE IF NOT EXISTS saved_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  street TEXT NOT NULL,
  apt TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MN',
  zip TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  delivery_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_addresses_user ON saved_addresses(user_id);

ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses" ON saved_addresses
  FOR ALL USING (auth.uid() = user_id);

CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON saved_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 6. FAVORITES/WISHLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 7. PROMO CODE USAGE TRACKING
-- ============================================================================
-- Track which users used which promo codes (prevent reuse)

CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON promo_code_usage(user_id);

ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own promo usage" ON promo_code_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage promo usage" ON promo_code_usage
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 8. NOTIFICATIONS TABLE
-- ============================================================================
-- In-app notifications for users

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order_update', 'promotion', 'system', 'review_approved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================================================
-- 9. INVENTORY TRANSACTIONS TABLE
-- ============================================================================
-- Track all stock changes for auditing

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('order', 'return', 'adjustment', 'restock', 'damage', 'expiry')),
  reference_id UUID, -- order_id or other reference
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_product ON inventory_transactions(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_reason ON inventory_transactions(reason);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory transactions" ON inventory_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 10. ENHANCED INDEXES FOR PERFORMANCE
-- ============================================================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category_active_featured
  ON products(category, is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price_range
  ON products(price) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_stock_low
  ON products(stock) WHERE is_active = TRUE AND stock <= 10;

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_status_created
  ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_driver
  ON orders(driver_id) WHERE driver_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_delivery_slot
  ON orders(delivery_slot) WHERE status IN ('confirmed', 'preparing', 'out_for_delivery');

-- Order Items (for analytics)
CREATE INDEX IF NOT EXISTS idx_order_items_product
  ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_created
  ON order_items(created_at DESC);

-- JSONB indexes for address searches
CREATE INDEX IF NOT EXISTS idx_orders_address_city
  ON orders((delivery_address->>'city'));
CREATE INDEX IF NOT EXISTS idx_orders_address_zip
  ON orders((delivery_address->>'zip'));

-- ============================================================================
-- 11. MATERIALIZED VIEW FOR ANALYTICS
-- ============================================================================
-- Pre-computed product analytics for dashboard performance

CREATE MATERIALIZED VIEW IF NOT EXISTS product_analytics AS
SELECT
  p.id AS product_id,
  p.title,
  p.category,
  COUNT(DISTINCT oi.order_id) AS total_orders,
  COALESCE(SUM(oi.quantity), 0) AS total_units_sold,
  COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0) AS total_revenue,
  COALESCE(AVG(pr.rating), 0) AS avg_rating,
  COUNT(DISTINCT pr.id) AS review_count,
  p.stock AS current_stock,
  p.is_active,
  p.created_at
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
GROUP BY p.id, p.title, p.category, p.stock, p.is_active, p.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_analytics_id ON product_analytics(product_id);

-- Function to refresh analytics (call periodically via cron or after orders)
CREATE OR REPLACE FUNCTION refresh_product_analytics()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 12. DAILY REVENUE VIEW
-- ============================================================================

CREATE OR REPLACE VIEW daily_revenue AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) AS order_count,
  SUM(total) AS total_revenue,
  SUM(subtotal) AS subtotal,
  SUM(tax) AS total_tax,
  SUM(delivery_fee) AS total_delivery_fees,
  SUM(tip) AS total_tips,
  AVG(total) AS avg_order_value
FROM orders
WHERE status != 'cancelled'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- 13. CUSTOMER LIFETIME VALUE VIEW
-- ============================================================================

CREATE OR REPLACE VIEW customer_ltv AS
SELECT
  p.id AS user_id,
  p.email,
  p.full_name,
  p.created_at AS customer_since,
  COUNT(o.id) AS total_orders,
  COALESCE(SUM(o.total), 0) AS lifetime_value,
  COALESCE(AVG(o.total), 0) AS avg_order_value,
  MAX(o.created_at) AS last_order_date,
  p.loyalty_points
FROM profiles p
LEFT JOIN orders o ON p.id = o.user_id AND o.status = 'delivered'
WHERE p.role = 'customer'
GROUP BY p.id, p.email, p.full_name, p.created_at, p.loyalty_points;

-- ============================================================================
-- 14. SEARCH FUNCTION WITH FULL-TEXT SEARCH
-- ============================================================================

CREATE OR REPLACE FUNCTION search_products(search_query TEXT)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE is_active = TRUE
    AND (
      title ILIKE '%' || search_query || '%'
      OR description ILIKE '%' || search_query || '%'
      OR search_query = ANY(tags)
    )
  ORDER BY
    CASE WHEN title ILIKE search_query || '%' THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 15. LOYALTY POINTS FUNCTIONS
-- ============================================================================

-- Award loyalty points after order completion
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  points_to_award INTEGER;
BEGIN
  -- Only award points when order is delivered
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- 1 point per dollar spent
    points_to_award := FLOOR(NEW.total);

    UPDATE profiles
    SET loyalty_points = loyalty_points + points_to_award
    WHERE id = NEW.user_id;

    -- Log the points award
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'system',
      'Loyalty Points Earned!',
      'You earned ' || points_to_award || ' loyalty points from your order.',
      jsonb_build_object('points', points_to_award, 'order_id', NEW.id)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS orders_loyalty_points_trigger ON orders;
CREATE TRIGGER orders_loyalty_points_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION award_loyalty_points();

-- ============================================================================
-- 16. DRIVER ASSIGNMENT OPTIMIZATION
-- ============================================================================

-- Add driver performance tracking columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS driver_rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_deliveries INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_for_delivery BOOLEAN DEFAULT FALSE;

-- Index for finding available drivers
CREATE INDEX IF NOT EXISTS idx_profiles_available_drivers
  ON profiles(available_for_delivery) WHERE role = 'driver';

-- ============================================================================
-- 17. DATABASE CONSTRAINTS FOR DATA INTEGRITY
-- ============================================================================

-- Ensure order totals are positive
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_total_positive;
ALTER TABLE orders ADD CONSTRAINT orders_total_positive CHECK (total >= 0);

-- Ensure product prices are positive
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_price_positive;
ALTER TABLE products ADD CONSTRAINT products_price_positive CHECK (price > 0);

-- Ensure stock is non-negative
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_stock_non_negative;
ALTER TABLE products ADD CONSTRAINT products_stock_non_negative CHECK (stock >= 0);

-- ============================================================================
-- 18. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE audit_logs IS 'Audit trail for all sensitive data changes';
COMMENT ON TABLE order_status_history IS 'Tracks order status changes for customer visibility';
COMMENT ON TABLE product_reviews IS 'Customer reviews with moderation workflow';
COMMENT ON TABLE saved_addresses IS 'Multiple delivery addresses per customer';
COMMENT ON TABLE favorites IS 'Customer wishlist/favorites';
COMMENT ON TABLE promo_code_usage IS 'Tracks promo code redemptions per user';
COMMENT ON TABLE notifications IS 'In-app notifications with realtime support';
COMMENT ON TABLE inventory_transactions IS 'Complete audit trail of stock changes';
COMMENT ON MATERIALIZED VIEW product_analytics IS 'Pre-computed product metrics for dashboard';

-- ============================================================================
-- SUMMARY: Enterprise Features Added
-- ============================================================================
-- 1. Stock management functions with atomic operations
-- 2. Audit logging for compliance and debugging
-- 3. Order status history for customer tracking
-- 4. Product reviews with moderation
-- 5. Multiple saved addresses per user
-- 6. Favorites/wishlist functionality
-- 7. Promo code usage tracking (prevent abuse)
-- 8. In-app notifications with realtime
-- 9. Inventory transaction logging
-- 10. Performance indexes for scale
-- 11. Materialized views for analytics
-- 12. Daily revenue analytics view
-- 13. Customer lifetime value view
-- 14. Enhanced search function
-- 15. Loyalty points automation
-- 16. Driver performance tracking
-- 17. Data integrity constraints
-- ============================================================================
