CREATE TABLE IF NOT EXISTS shiprocket_orders (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    shiprocket_order_id BIGINT,
    shiprocket_shipment_id BIGINT,

    awb_code VARCHAR(150),
    courier_name VARCHAR(150),
    courier_company_id VARCHAR(80),

    tracking_url VARCHAR(500),
    status VARCHAR(80),

    request_json TEXT,
    response_json TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_shiprocket_orders_order_id
        UNIQUE (order_id),

    CONSTRAINT uk_shiprocket_orders_shiprocket_order_id
        UNIQUE (shiprocket_order_id),

    CONSTRAINT uk_shiprocket_orders_shiprocket_shipment_id
        UNIQUE (shiprocket_shipment_id),

    CONSTRAINT fk_shiprocket_orders_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_order_id
    ON shiprocket_orders(order_id);

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_awb_code
    ON shiprocket_orders(awb_code);

CREATE INDEX IF NOT EXISTS idx_shiprocket_orders_status
    ON shiprocket_orders(status);
