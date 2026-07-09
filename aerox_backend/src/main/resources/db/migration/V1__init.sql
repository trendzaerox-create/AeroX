-- =========================================
-- V1__complete_init.sql
-- COMPLETE SINGLE, IDEMPOTENT MIGRATION FILE
-- PostgreSQL
-- =========================================

-- Flyway executes PostgreSQL migrations transactionally by default.

-- =========================================
-- CORE TABLES
-- =========================================

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
  phone VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price_inr INTEGER NOT NULL,
  mrp_inr INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id BIGINT REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_boxes (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price_inr INTEGER NOT NULL,
  image_path VARCHAR(500),
  cloudinary_public_id VARCHAR(255),
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price_snapshot NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  status VARCHAR(30) NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  subtotal_amount NUMERIC(12,2) NOT NULL,
  shipping_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  coupon_code VARCHAR(50),
  address_full_name VARCHAR(120) NOT NULL,
  address_phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  address_city VARCHAR(120) NOT NULL,
  address_state VARCHAR(120) NOT NULL,
  address_pincode VARCHAR(20) NOT NULL,
  address_country VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_title VARCHAR(200) NOT NULL,
  image_url VARCHAR(500),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(120) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type VARCHAR(20) NOT NULL,
  discount_value NUMERIC(12,2) NOT NULL,
  min_order_value NUMERIC(12,2),
  max_discount NUMERIC(12,2),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id BIGSERIAL PRIMARY KEY,
  coupon_id BIGINT NOT NULL REFERENCES coupons(id),
  user_id BIGINT NOT NULL REFERENCES users(id),
  order_id BIGINT REFERENCES orders(id),
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brand_showcases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(500),
  model_image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS brand_showcase_items (
  id BIGSERIAL PRIMARY KEY,
  brand_showcase_id BIGINT NOT NULL REFERENCES brand_showcases(id),
  product_id BIGINT NOT NULL REFERENCES products(id),
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hero_sections (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(255),
  product_id BIGINT NOT NULL REFERENCES products(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_set_carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_set_cart_items (
  id BIGSERIAL PRIMARY KEY,
  gift_set_cart_id BIGINT NOT NULL REFERENCES gift_set_carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  gift_box_id BIGINT NOT NULL REFERENCES gift_boxes(id),
  product_price_snapshot INTEGER NOT NULL,
  gift_box_price_snapshot INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uk_gift_set_cart_product UNIQUE (gift_set_cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS gift_set_orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id),
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  subtotal_amount NUMERIC(12,2) NOT NULL,
  shipping_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  coupon_code VARCHAR(50),
  address_full_name VARCHAR(120) NOT NULL,
  address_phone VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  address_city VARCHAR(120) NOT NULL,
  address_state VARCHAR(120) NOT NULL,
  address_pincode VARCHAR(20) NOT NULL,
  address_country VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gift_set_order_items (
  id BIGSERIAL PRIMARY KEY,
  gift_set_order_id BIGINT NOT NULL REFERENCES gift_set_orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_title VARCHAR(200) NOT NULL,
  product_image_url VARCHAR(500),
  product_price_snapshot NUMERIC(12,2) NOT NULL,
  gift_box_id BIGINT NOT NULL REFERENCES gift_boxes(id),
  gift_box_name VARCHAR(200) NOT NULL,
  gift_box_image_url VARCHAR(500),
  gift_box_price_snapshot NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bulk_order_inquiries (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  company_name VARCHAR(160),
  quantity INTEGER NOT NULL,
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instagram_auth (
  id BIGSERIAL PRIMARY KEY,
  instagram_user_id VARCHAR(100) NOT NULL,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  refreshed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS instagram_media_cache (
  id BIGSERIAL PRIMARY KEY,
  cache_key VARCHAR(100) NOT NULL UNIQUE,
  payload_json TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- =========================================
-- PASSWORD RESET TOKEN TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================================
-- MOBILE PASSWORD RESET OTP TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS mobile_password_reset_otps (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  otp_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mobile_password_reset_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- =========================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(160) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ADDITIONAL CATEGORY COLUMNS
-- =========================================

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS banner_image_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS thin_banner_image_url VARCHAR(500);

-- =========================================
-- ADDITIONAL PRODUCT COLUMNS
-- =========================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_highlights TEXT,
  ADD COLUMN IF NOT EXISTS specifications_json TEXT,
  ADD COLUMN IF NOT EXISTS feature_highlights_json TEXT,
  ADD COLUMN IF NOT EXISTS faq_json TEXT,
  ADD COLUMN IF NOT EXISTS warranty_info TEXT,
  ADD COLUMN IF NOT EXISTS box_contents_json TEXT,
  ADD COLUMN IF NOT EXISTS compatibility TEXT,
  ADD COLUMN IF NOT EXISTS demo_video_url VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS pdp_banners_json TEXT;

-- =========================================
-- WISHLIST TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_wishlist_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_wishlist_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE,

  CONSTRAINT uk_wishlist_user_product
    UNIQUE (user_id, product_id)
);

-- =========================================
-- CATEGORY MULTIPLE IMAGE TABLES
-- =========================================

CREATE TABLE IF NOT EXISTS category_images (
  category_id BIGINT NOT NULL,
  sort_order INTEGER NOT NULL,
  image_url VARCHAR(500),

  CONSTRAINT fk_category_images_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_banner_images (
  category_id BIGINT NOT NULL,
  sort_order INTEGER NOT NULL,
  image_url VARCHAR(500),

  CONSTRAINT fk_category_banner_images_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_thin_banner_images (
  category_id BIGINT NOT NULL,
  sort_order INTEGER NOT NULL,
  image_url VARCHAR(500),

  CONSTRAINT fk_category_thin_banner_images_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

-- Copy existing single category images only when the same migrated row
-- is not already present. This prevents duplicates when this file is rerun.

INSERT INTO category_images (category_id, sort_order, image_url)
SELECT c.id, 0, c.image_url
FROM categories c
WHERE c.image_url IS NOT NULL
  AND c.image_url <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM category_images ci
    WHERE ci.category_id = c.id
      AND ci.sort_order = 0
      AND ci.image_url = c.image_url
  );

INSERT INTO category_banner_images (category_id, sort_order, image_url)
SELECT c.id, 0, c.banner_image_url
FROM categories c
WHERE c.banner_image_url IS NOT NULL
  AND c.banner_image_url <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM category_banner_images cbi
    WHERE cbi.category_id = c.id
      AND cbi.sort_order = 0
      AND cbi.image_url = c.banner_image_url
  );

INSERT INTO category_thin_banner_images (category_id, sort_order, image_url)
SELECT c.id, 0, c.thin_banner_image_url
FROM categories c
WHERE c.thin_banner_image_url IS NOT NULL
  AND c.thin_banner_image_url <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM category_thin_banner_images ctbi
    WHERE ctbi.category_id = c.id
      AND ctbi.sort_order = 0
      AND ctbi.image_url = c.thin_banner_image_url
  );

-- =========================================
-- PRODUCT DISPLAY ORDER
-- =========================================
-- The backfill runs only when display_order is first added.
-- Existing display_order values are never overwritten.

DO $$
DECLARE
  display_order_is_missing BOOLEAN;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'products'
      AND column_name = 'display_order'
  )
  INTO display_order_is_missing;

  IF display_order_is_missing THEN
    ALTER TABLE products
      ADD COLUMN display_order INT NOT NULL DEFAULT 0;

    WITH ordered_products AS (
      SELECT
        id,
        ROW_NUMBER() OVER (ORDER BY id DESC) AS new_display_order
      FROM products
    )
    UPDATE products p
    SET display_order = ordered_products.new_display_order
    FROM ordered_products
    WHERE p.id = ordered_products.id;
  END IF;
END
$$;

-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS idx_brand_showcases_active_deleted_order
  ON brand_showcases (is_active, is_deleted, display_order, id);

CREATE INDEX IF NOT EXISTS idx_brand_showcase_items_showcase_order
  ON brand_showcase_items (brand_showcase_id, display_order, id);

CREATE INDEX IF NOT EXISTS idx_hero_sections_active_deleted_sort
  ON hero_sections (is_active, is_deleted, sort_order);

CREATE INDEX IF NOT EXISTS idx_gift_set_cart_items_cart_id
  ON gift_set_cart_items (gift_set_cart_id);

CREATE INDEX IF NOT EXISTS idx_gift_set_cart_items_product_id
  ON gift_set_cart_items (product_id);

CREATE INDEX IF NOT EXISTS idx_gift_set_cart_items_gift_box_id
  ON gift_set_cart_items (gift_box_id);

CREATE INDEX IF NOT EXISTS idx_gift_set_orders_user_id
  ON gift_set_orders (user_id);

CREATE INDEX IF NOT EXISTS idx_gift_set_order_items_order_id
  ON gift_set_order_items (gift_set_order_id);

CREATE INDEX IF NOT EXISTS idx_bulk_order_inquiries_created_at
  ON bulk_order_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bulk_order_inquiries_product_id
  ON bulk_order_inquiries (product_id);

CREATE INDEX IF NOT EXISTS idx_instagram_auth_active
  ON instagram_auth (is_active);

CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash
  ON password_reset_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_password_reset_user_id
  ON password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_expires_at
  ON password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_mobile_reset_phone
  ON mobile_password_reset_otps(phone);

CREATE INDEX IF NOT EXISTS idx_mobile_reset_otp_hash
  ON mobile_password_reset_otps(otp_hash);

CREATE INDEX IF NOT EXISTS idx_category_images_category_id
  ON category_images(category_id);

CREATE INDEX IF NOT EXISTS idx_category_banner_images_category_id
  ON category_banner_images(category_id);

CREATE INDEX IF NOT EXISTS idx_category_thin_banner_images_category_id
  ON category_thin_banner_images(category_id);

CREATE INDEX IF NOT EXISTS idx_products_display_order
  ON products(display_order);

