CREATE TABLE IF NOT EXISTS order_shipments (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    courier_name VARCHAR(100) NOT NULL,

    tracking_id VARCHAR(150) NOT NULL,

    tracking_url VARCHAR(500),

    shipped_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_order_shipments_order_id
        UNIQUE (order_id),

    CONSTRAINT uk_order_shipments_tracking_id
        UNIQUE (tracking_id),

    CONSTRAINT fk_order_shipments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_shipments_tracking_id
    ON order_shipments(tracking_id);

CREATE INDEX IF NOT EXISTS idx_order_shipments_order_id
    ON order_shipments(order_id);