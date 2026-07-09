ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_inr INTEGER NOT NULL DEFAULT 0;

UPDATE products
SET discount_inr =
    CASE
        WHEN mrp_inr IS NOT NULL
         AND price_inr IS NOT NULL
         AND mrp_inr > price_inr
        THEN mrp_inr - price_inr
        ELSE 0
    END;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'chk_products_discount_inr_non_negative'
    ) THEN
        ALTER TABLE products
        ADD CONSTRAINT chk_products_discount_inr_non_negative
        CHECK (discount_inr >= 0);
    END IF;
END $$;