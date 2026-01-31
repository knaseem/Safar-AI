-- Migration: Create orders table for storing Duffel bookings
-- This table stores bookings made through the custom checkout flow

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duffel_order_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('flight', 'stay')),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
    total_amount DECIMAL(10, 2) NOT NULL,
    markup_amount DECIMAL(10, 2),
    currency TEXT NOT NULL DEFAULT 'USD',
    passengers JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_duffel_order_id ON orders(duffel_order_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own orders (for cancellation)
CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

-- Comment explaining the table
COMMENT ON TABLE orders IS 'Stores flight and hotel bookings made through Duffel custom checkout';
COMMENT ON COLUMN orders.duffel_order_id IS 'The order ID from Duffel API';
COMMENT ON COLUMN orders.markup_amount IS 'Our service fee/markup applied to the booking';
COMMENT ON COLUMN orders.passengers IS 'JSONB array of passenger details';
COMMENT ON COLUMN orders.metadata IS 'Additional booking metadata (booking reference, etc.)';
