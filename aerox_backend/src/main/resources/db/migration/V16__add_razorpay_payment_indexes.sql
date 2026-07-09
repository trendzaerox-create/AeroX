ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100);

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100);

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uk_orders_razorpay_order_id
    ON orders (razorpay_order_id)
    WHERE razorpay_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_orders_razorpay_payment_id
    ON orders (razorpay_payment_id)
    WHERE razorpay_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_payment_status
    ON orders (payment_status);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders (status);