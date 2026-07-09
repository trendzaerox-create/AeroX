ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS status_code VARCHAR(40);

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS latest_activity TEXT;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS latest_location VARCHAR(255);

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS last_tracked_at TIMESTAMPTZ;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMPTZ;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS expected_delivery_at TIMESTAMPTZ;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS webhook_json TEXT;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS tracking_json TEXT;

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_last_tracked_at
    ON shiprocket_orders(last_tracked_at);

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_delivered_at
    ON shiprocket_orders(delivered_at);

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_picked_up_at
    ON shiprocket_orders(picked_up_at);