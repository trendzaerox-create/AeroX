-- Rename this migration only if the same Flyway version already exists.
-- Adds minimal production-safety fields for Shiprocket.

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS pickup_generated_at TIMESTAMPTZ;

ALTER TABLE shiprocket_orders
    ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
