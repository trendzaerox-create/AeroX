ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_inr INTEGER NOT NULL DEFAULT 0;

UPDATE products
SET discount_inr = price_inr
WHERE discount_inr IS NULL
   OR discount_inr <= 0
   OR discount_inr > mrp_inr
   OR price_inr > discount_inr;