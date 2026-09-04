-- IMPORTANT: Rename this file to your NEXT Flyway version before running,
-- for example V17__guest_magic_checkout.sql. Do not guess the version in production.

ALTER TABLE orders
    ALTER COLUMN user_id DROP NOT NULL,
    ALTER COLUMN address_full_name DROP NOT NULL,
    ALTER COLUMN address_phone DROP NOT NULL,
    ALTER COLUMN address_line1 DROP NOT NULL,
    ALTER COLUMN address_city DROP NOT NULL,
    ALTER COLUMN address_state DROP NOT NULL,
    ALTER COLUMN address_pincode DROP NOT NULL,
    ALTER COLUMN address_country DROP NOT NULL;

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS customer_email VARCHAR(180),
    ADD COLUMN IF NOT EXISTS checkout_mode VARCHAR(30) NOT NULL DEFAULT 'STANDARD';

CREATE INDEX IF NOT EXISTS idx_orders_customer_email
    ON orders(customer_email);

CREATE INDEX IF NOT EXISTS idx_orders_checkout_mode
    ON orders(checkout_mode);
