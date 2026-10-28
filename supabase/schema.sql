-- ==============================================================================
-- APNAMART (https://apnamart.space)
-- PRODUCTION SUPABASE POSTGRESQL SCHEMA WITH REALTIME & CLOUD STORAGE
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  brand text default '',
  sku text unique not null,
  category text not null,
  category_id text default '',
  subcategory text,
  subcategory_id text,
  short_description text default '',
  description text default '',
  regular_price numeric not null,
  sale_price numeric,
  stock integer not null default 0,
  in_stock boolean default true,
  rating numeric default 5.0,
  review_count integer default 0,
  badges jsonb default '[]'::jsonb,
  images jsonb default '[]'::jsonb,
  video_url text,
  has_variants boolean default false,
  variants jsonb default '[]'::jsonb,
  variant_attributes jsonb default '[]'::jsonb,
  specifications jsonb default '[]'::jsonb,
  is_featured boolean default false,
  is_new_arrival boolean default false,
  is_best_seller boolean default false,
  is_hidden boolean default false,
  created_at text default to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text default '',
  icon text,
  image text default '',
  item_count integer default 0,
  subcategories jsonb default '[]'::jsonb,
  status text default 'Active',
  featured boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id text primary key,
  user_id text,
  created_at text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  payment_method text not null,
  payment_status text not null default 'Pending',
  subtotal numeric not null,
  discount numeric default 0,
  coupon_discount numeric default 0,
  shipping_fee numeric default 0,
  total numeric not null,
  status text not null default 'New Order',
  tracking_number text default '',
  estimated_delivery text default '',
  tracking_history jsonb default '[]'::jsonb,
  created_timestamp timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. INVENTORY LOGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.inventory_logs (
  id text primary key,
  product_id text not null,
  product_name text not null,
  variant_id text,
  variant_name text,
  previous_stock integer not null,
  new_stock integer not null,
  quantity_changed integer not null,
  change_type text not null,
  reason text not null,
  adjusted_by text not null,
  timestamp text not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 5. COUPONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.coupons (
  code text primary key,
  discount_percentage integer,
  discount_amount numeric,
  min_spend numeric default 0,
  expires_at text,
  usage_count integer default 0,
  max_uses integer,
  status text default 'Active',
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 6. HOMEPAGE CMS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.homepage_cms (
  id text primary key, -- 'hero_slides', 'promo_banners', 'homepage_sections'
  data jsonb not null,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 7. REVIEWS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id text primary key,
  product_id text not null,
  product_name text not null,
  user_name text not null,
  user_avatar text,
  rating integer not null default 5,
  date text not null,
  comment text not null,
  status text not null default 'Approved',
  verified_purchase boolean default true,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 8. STORE SETTINGS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.settings (
  id text primary key default 'store_settings',
  store_name text default 'ApnaMart',
  store_description text default 'Pakistan''s premier online shopping destination',
  contact_email text default 'support@apnamart.space',
  contact_phone text default '+92 300 1234567',
  whatsapp_number text default '923001234567',
  address text default 'Main Boulevard, Gulberg III',
  city text default 'Lahore',
  country text default 'Pakistan',
  currency text default 'PKR',
  currency_symbol text default 'Rs.',
  currency_position text default 'left',
  default_shipping_fee numeric default 250,
  free_shipping_threshold numeric default 5000,
  enable_cod boolean default true,
  enable_card_payment boolean default true,
  enable_mobile_wallet boolean default true,
  maintenance_mode boolean default false,
  meta_title text default 'ApnaMart - Modern E-Commerce Platform',
  meta_description text default 'Authentic smartphones, electronics, footwear & fashion.',
  logo_url text,
  favicon_url text,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 9. CUSTOMERS / USERS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.customers (
  id text primary key,
  email text unique not null,
  name text not null,
  phone text,
  avatar text,
  city text,
  default_address jsonb,
  addresses jsonb default '[]'::jsonb,
  role text,
  created_at text default to_char(now(), 'YYYY-MM-DD'),
  updated_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.orders enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.coupons enable row level security;
alter table public.homepage_cms enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;
alter table public.customers enable row level security;

-- Products: Everyone can read; Anyone can insert/update/delete with anon key
create policy "Allow public read on products" on public.products for select using (true);
create policy "Allow all modifications on products" on public.products for all using (true) with check (true);

-- Categories: Everyone can read and write
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow all modifications on categories" on public.categories for all using (true) with check (true);

-- Orders: Everyone can read and write (e-commerce customer checkout and admin order management)
create policy "Allow public read on orders" on public.orders for select using (true);
create policy "Allow public insert on orders" on public.orders for insert with check (true);
create policy "Allow public update on orders" on public.orders for update using (true) with check (true);

-- Inventory logs: Everyone can read and write
create policy "Allow public read on inventory_logs" on public.inventory_logs for select using (true);
create policy "Allow public insert on inventory_logs" on public.inventory_logs for insert with check (true);

-- Coupons: Everyone can read and manage
create policy "Allow public read on coupons" on public.coupons for select using (true);
create policy "Allow all modifications on coupons" on public.coupons for all using (true) with check (true);

-- Homepage CMS: Everyone can read and update
create policy "Allow public read on homepage_cms" on public.homepage_cms for select using (true);
create policy "Allow all modifications on homepage_cms" on public.homepage_cms for all using (true) with check (true);

-- Reviews: Everyone can read and submit
create policy "Allow public read on reviews" on public.reviews for select using (true);
create policy "Allow all modifications on reviews" on public.reviews for all using (true) with check (true);

-- Settings: Everyone can read and update
create policy "Allow public read on settings" on public.settings for select using (true);
create policy "Allow all modifications on settings" on public.settings for all using (true) with check (true);

-- Customers: Everyone can read and update
create policy "Allow public read on customers" on public.customers for select using (true);
create policy "Allow all modifications on customers" on public.customers for all using (true) with check (true);

-- ==============================================================================
-- REALTIME REPLICATION CONFIGURATION
-- ==============================================================================
-- Enable Realtime on all e-commerce tables so websocket events fire immediately
begin;
  -- Drop if existing to avoid duplication
  alter publication supabase_realtime drop table if exists products, categories, orders, inventory_logs, coupons, homepage_cms, reviews, settings, customers;
  
  -- Add all tables to realtime publication
  alter publication supabase_realtime add table products;
  alter publication supabase_realtime add table categories;
  alter publication supabase_realtime add table orders;
  alter publication supabase_realtime add table inventory_logs;
  alter publication supabase_realtime add table coupons;
  alter publication supabase_realtime add table homepage_cms;
  alter publication supabase_realtime add table reviews;
  alter publication supabase_realtime add table settings;
  alter publication supabase_realtime add table customers;
commit;

-- ==============================================================================
-- STORAGE BUCKETS SETUP (For Product Images, Banners, Avatars, Store Logo)
-- ==============================================================================
insert into storage.buckets (id, name, public)
values
  ('apnamart-products', 'apnamart-products', true),
  ('apnamart-banners', 'apnamart-banners', true),
  ('apnamart-avatars', 'apnamart-avatars', true),
  ('apnamart-assets', 'apnamart-assets', true)
on conflict (id) do nothing;

-- Storage policies: Anyone can view images publicly
create policy "Public Access to Products Bucket" on storage.objects for select using (bucket_id = 'apnamart-products');
create policy "Public Access to Banners Bucket" on storage.objects for select using (bucket_id = 'apnamart-banners');
create policy "Public Access to Avatars Bucket" on storage.objects for select using (bucket_id = 'apnamart-avatars');
create policy "Public Access to Assets Bucket" on storage.objects for select using (bucket_id = 'apnamart-assets');

-- Storage policies: Anyone can upload images
create policy "Allow Upload to Products Bucket" on storage.objects for insert with check (bucket_id = 'apnamart-products');
create policy "Allow Upload to Banners Bucket" on storage.objects for insert with check (bucket_id = 'apnamart-banners');
create policy "Allow Upload to Avatars Bucket" on storage.objects for insert with check (bucket_id = 'apnamart-avatars');
create policy "Allow Upload to Assets Bucket" on storage.objects for insert with check (bucket_id = 'apnamart-assets');

-- Storage policies: Anyone can update/delete images
create policy "Allow Update on Products Bucket" on storage.objects for update using (bucket_id = 'apnamart-products');
create policy "Allow Update on Banners Bucket" on storage.objects for update using (bucket_id = 'apnamart-banners');
create policy "Allow Update on Avatars Bucket" on storage.objects for update using (bucket_id = 'apnamart-avatars');
create policy "Allow Update on Assets Bucket" on storage.objects for update using (bucket_id = 'apnamart-assets');
