ALTER TABLE products
    ADD COLUMN IF NOT EXISTS variant_group_code VARCHAR(120),
    ADD COLUMN IF NOT EXISTS color_name VARCHAR(80),
    ADD COLUMN IF NOT EXISTS color_hex VARCHAR(20),
    ADD COLUMN IF NOT EXISTS variant_display_order INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_variant_group_code
    ON products (variant_group_code)
    WHERE variant_group_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_variant_group_order
    ON products (
        variant_group_code,
        variant_display_order,
        display_order,
        id
    )
    WHERE variant_group_code IS NOT NULL
      AND is_active = TRUE
      AND is_deleted = FALSE;
