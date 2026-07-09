-- =========================================
-- V2__seed_data.sql (FINAL CORRECTED)
-- =========================================

-- Admin
insert into users (name, email, password_hash, role, phone)
values (
  'Admin',
  'admin@gmail.com',
  '$2a$10$NNWDLRTzRKUrkQzQjdsMUOSccRlsMcMl1y0uN6bZttf3xNt1VoEgG',
  'ADMIN',
  '9733116221'
)
on conflict do nothing;

-- Demo Customer
insert into users (name, email, password_hash, role, phone)
values (
  'Demo Customer',
  'customer@gmail.com',
  '$2a$10$NNWDLRTzRKUrkQzQjdsMUOSccRlsMcMl1y0uN6bZttf3xNt1VoEgG',
  'CUSTOMER',
  '9876543210'
)
on conflict do nothing;

-- Categories
insert into categories (name)
values
  ('Smart watch'),
  ('Earbuds')
on conflict do nothing;

-- Products
insert into products (
  title,
  description,
  price_inr,
  mrp_inr,
  stock,
  category_id
)
select
  'Xorox',
  'Premium Electronics watch',
  1999,
  2499,
  20,
  (select id from categories where name = 'Smart watch')
where not exists (
  select 1 from products where title = 'Xorox'
);

insert into products (
  title,
  description,
  price_inr,
  mrp_inr,
  stock,
  category_id
)
select
  'Earbud pro 6',
  'Compact size for every ears',
  999,
  1299,
  40,
  (select id from categories where name = 'Earbuds')
where not exists (
  select 1 from products where title = 'Earbud pro 6'
);

-- Product Images
insert into product_images (product_id, image_url)
select id, '/images/tote1.jpg'
from products
where title = 'Xorox'
and not exists (
  select 1 from product_images
  where image_url = '/images/tote1.jpg'
);

insert into product_images (product_id, image_url)
select id, '/images/sling1.jpg'
from products
where title = 'Earbud pro 6'
and not exists (
  select 1 from product_images
  where image_url = '/images/sling1.jpg'
);

-- Address
insert into addresses (
  user_id,
  full_name,
  phone,
  line1,
  line2,
  city,
  state,
  pincode,
  country,
  is_default
)
select
  u.id,
  'Demo Customer',
  '9876543210',
  'Park Street',
  'Near Metro Station',
  'Kolkata',
  'West Bengal',
  '700016',
  'India',
  true
from users u
where u.email = 'customer@gmail.com'
and not exists (
  select 1 from addresses where user_id = u.id
);

-- Product Reviews
insert into product_reviews (
  product_id,
  reviewer_name,
  rating,
  review_text,
  is_featured
)
select
  p.id,
  'Rahul Sharma',
  5,
  'Excellent product quality and premium look.',
  true
from products p
where p.title = 'Xorox'
and not exists (
  select 1 from product_reviews
  where product_id = p.id and reviewer_name = 'Rahul Sharma'
);

insert into product_reviews (
  product_id,
  reviewer_name,
  rating,
  review_text,
  is_featured
)
select
  p.id,
  'Ankit Verma',
  4,
  'Good sound quality and comfortable fitting.',
  true
from products p
where p.title = 'Earbud pro 6'
and not exists (
  select 1 from product_reviews
  where product_id = p.id and reviewer_name = 'Ankit Verma'
);

-- Coupons
insert into coupons (
  code,
  description,
  discount_type,
  discount_value,
  min_order_value,
  max_discount,
  usage_limit,
  active
)
values
(
  'WELCOME10',
  '10 percent welcome discount',
  'PERCENTAGE',
  10,
  500,
  200,
  100,
  true
)
on conflict do nothing;

insert into coupons (
  code,
  description,
  discount_type,
  discount_value,
  min_order_value,
  max_discount,
  usage_limit,
  active
)
values
(
  'FLAT100',
  'Flat 100 rupees discount',
  'FLAT',
  100,
  999,
  100,
  50,
  true
)
on conflict do nothing;

-- Gift Boxes
insert into gift_boxes (
  name,
  description,
  price_inr,
  image_path,
  stock,
  is_active
)
select
  'Premium Black Gift Box',
  'Luxury gift box for premium packaging',
  199,
  '/images/gift-box-black.jpg',
  50,
  true
where not exists (
  select 1 from gift_boxes where name = 'Premium Black Gift Box'
);

-- Cart
insert into carts (user_id)
select u.id
from users u
where u.email = 'customer@gmail.com'
on conflict do nothing;

-- Cart Items
insert into cart_items (
  cart_id,
  product_id,
  quantity,
  unit_price_snapshot
)
select
  c.id,
  p.id,
  1,
  p.price_inr
from carts c
join users u on u.id = c.user_id
join products p on p.title = 'Xorox'
where u.email = 'customer@gmail.com'
and not exists (
  select 1 from cart_items
  where cart_id = c.id and product_id = p.id
);

-- Hero Section
insert into hero_sections (
  title,
  description,
  image_url,
  product_id,
  sort_order,
  is_active
)
select
  'Premium Smart Watch Collection',
  'Explore stylish and powerful smart watches for everyday use.',
  '/images/hero-smartwatch.jpg',
  p.id,
  1,
  true
from products p
where p.title = 'Xorox'
and not exists (
  select 1 from hero_sections where title = 'Premium Smart Watch Collection'
);

-- Brand Showcase
insert into brand_showcases (
  title,
  subtitle,
  model_image_url,
  display_order,
  is_active
)
select
  'Trendz AeroX Collection',
  'Modern electronics designed for everyday performance.',
  '/images/brand-showcase.jpg',
  1,
  true
where not exists (
  select 1 from brand_showcases where title = 'Trendz AeroX Collection'
);

-- Brand Showcase Items
insert into brand_showcase_items (
  brand_showcase_id,
  product_id,
  display_order
)
select
  bs.id,
  p.id,
  1
from brand_showcases bs
join products p on p.title = 'Xorox'
where bs.title = 'Trendz AeroX Collection'
and not exists (
  select 1 from brand_showcase_items
  where brand_showcase_id = bs.id and product_id = p.id
);

-- Bulk Order Inquiry
insert into bulk_order_inquiries (
  product_id,
  customer_name,
  email,
  phone,
  company_name,
  quantity,
  message,
  status
)
select
  p.id,
  'Demo Buyer',
  'buyer@example.com',
  '9876543210',
  'Demo Company',
  25,
  'Need bulk pricing for corporate gifting.',
  'NEW'
from products p
where p.title = 'Xorox'
and not exists (
  select 1 from bulk_order_inquiries
  where email = 'buyer@example.com'
);

-- Newsletter Subscribers
insert into newsletter_subscribers (email)
values
  ('newsletter@example.com'),
  ('offer@example.com')
on conflict do nothing;

-- Password Reset Token Dummy
insert into password_reset_tokens (
  user_id,
  token_hash,
  expires_at
)
select
  u.id,
  'dummy_password_reset_token_hash_123456789012345678901234567890',
  now() + interval '15 minutes'
from users u
where u.email = 'customer@gmail.com'
and not exists (
  select 1 from password_reset_tokens
  where token_hash = 'dummy_password_reset_token_hash_123456789012345678901234567890'
);

-- Mobile Password Reset OTP Dummy
insert into mobile_password_reset_otps (
  user_id,
  phone,
  otp_hash,
  expires_at
)
select
  u.id,
  u.phone,
  'dummy_mobile_otp_hash_1234567890123456789012345678901234',
  now() + interval '10 minutes'
from users u
where u.email = 'customer@gmail.com'
and not exists (
  select 1 from mobile_password_reset_otps
  where otp_hash = 'dummy_mobile_otp_hash_1234567890123456789012345678901234'
);

-- Demo Order
insert into orders (
  order_number,
  user_id,
  payment_method,
  payment_status,
  status,
  subtotal_amount,
  shipping_amount,
  discount_amount,
  total_amount,
  coupon_code,
  address_full_name,
  address_phone,
  address_line1,
  address_line2,
  address_city,
  address_state,
  address_pincode,
  address_country
)
select
  'ORD-DEMO-1001',
  u.id,
  'COD',
  'PENDING',
  'PLACED',
  1999,
  0,
  0,
  1999,
  null,
  'Demo Customer',
  '9876543210',
  'Park Street',
  'Near Metro Station',
  'Kolkata',
  'West Bengal',
  '700016',
  'India'
from users u
where u.email = 'customer@gmail.com'
and not exists (
  select 1 from orders where order_number = 'ORD-DEMO-1001'
);

-- Demo Order Item
insert into order_items (
  order_id,
  product_id,
  product_title,
  image_url,
  quantity,
  unit_price,
  line_total
)
select
  o.id,
  p.id,
  p.title,
  '/images/tote1.jpg',
  1,
  p.price_inr,
  p.price_inr
from orders o
join products p on p.title = 'Xorox'
where o.order_number = 'ORD-DEMO-1001'
and not exists (
  select 1 from order_items
  where order_id = o.id and product_id = p.id
);