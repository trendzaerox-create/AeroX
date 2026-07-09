CREATE TABLE IF NOT EXISTS order_review_email_jobs (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    scheduled_at TIMESTAMPTZ NOT NULL,

    sent_at TIMESTAMPTZ,

    attempts INTEGER NOT NULL DEFAULT 0,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_order_review_email_jobs_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_order_review_email_jobs_order_id
        UNIQUE (order_id)
);

CREATE INDEX IF NOT EXISTS idx_order_review_email_jobs_due
    ON order_review_email_jobs(status, scheduled_at);