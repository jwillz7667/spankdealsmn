-- Stock management functions for order processing
-- This migration adds functions to safely decrement stock atomically

-- Function to decrement stock when order is placed
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - quantity,
      updated_at = NOW()
  WHERE id = product_id
    AND stock >= quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment stock (for order cancellations/returns)
CREATE OR REPLACE FUNCTION increment_stock(product_id UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock + quantity,
      updated_at = NOW()
  WHERE id = product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add composite index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_active_featured
ON products(category, is_active, is_featured);

-- Add index for order lookups by status
CREATE INDEX IF NOT EXISTS idx_orders_status_created
ON orders(status, created_at DESC);

-- Add composite index for user order history
CREATE INDEX IF NOT EXISTS idx_orders_user_created
ON orders(user_id, created_at DESC);
