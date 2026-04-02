-- BELLAQA GmbH - Database Schema

CREATE EXTENSION IF NOT EXISTS 'uuid-ossp';

-- Enum Types
CREATE TYPE user_type AS ENUM ('b2b', 'b2c', 'admin');
CREATE TYPE user_lang AS ENUM ('de', 'sq', 'en', 'tr', 'fr');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'picking', 'shipped', 'delivered', 'cancelled');
CREATE TYPE product_category AS ENUM ('food', 'beverage', 'service', 'other');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  vat_id VARCHAR(50),
  user_type user_type NOT NULL DEFAULT 'b2c',
  language user_lang NOT NULL DEFAULT 'de',
  stripe_customer_id VARCHAR(255),
  firebase_token TEXT,
  address_street VARCHAR(255),
  address_city VARCHAR(100),
  address_zip VARCHAR(20),
  address_country VARCHAR(2) DEFAULT 'DE',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name_de VARCHAR(255) NOT NULL,
  name_sq VARCHAR(255),
  name_en VARCHAR(255),
  name_tr VARCHAR(255),
  name_fr VARCHAR(255),
  description_de TEXT,
  description_en TEXT,
  category product_category NOT NULL DEFAULT 'food',
  -- Financial data
  unit_net_price DECIMAL(12,4) NOT NULL,       -- Net price (excl. VAT)
  vat_rate DECIMAL(5,4) NOT NULL DEFAULT 0.07, -- 7% food, 19% beverages
  pfand DECIMAL(8,4) NOT NULL DEFAULT 0,       -- Deposit (non-taxable)
  -- Computed gross = unit_net_price * (1 + vat_rate) + pfand
  unit_in_stock INTEGER DEFAULT 0,
  unit_reserved INTEGER DEFAULT 0,
  weight_g INTEGER,
  image_url TEXT,
  image_original_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  channel user_type NOT NULL,              -- b2b or b2c
  status order_status NOT NULL DEFAULT 'pending',
  language user_lang NOT NULL DEFAULT 'de',
  -- Financial summary
  subtotal_net DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_vat DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_pfand DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_gross DECIMAL(12,4) NOT NULL DEFAULT 0,
  -- Payment
  stripe_payment_intent_id VARCHAR(255),
  stripe_payment_status VARCHAR(50),
  notes TEXT,
  delivery_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Line Items Table (IMMUTABLE AUDIT TRAIL)
CREATE TABLE order_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  -- IMMUTABLE SNAPSHOT at time of order (for audit compliance)
  snapshot_sku VARCHAR(100) NOT NULL,
  snapshot_name VARCHAR(255) NOT NULL,
  snapshot_unit_net_price DECIMAL(12,4) NOT NULL,   -- Captured net price
  snapshot_vat_rate DECIMAL(5,4) NOT NULL,           -- Captured VAT rate
  snapshot_pfand DECIMAL(12,4) NOT NULL,             -- Captured Pfand
  -- Computed line totals
  line_net_total DECIMAL(12,4) NOT NULL,
  line_vat_total DECIMAL(12,4) NOT NULL,
  line_pfand_total DECIMAL(12,4) NOT NULL,
  line_gross_total DECIMAL(12,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES users(id),
  status invoice_status NOT NULL DEFAULT 'draft',
  language user_lang NOT NULL DEFAULT 'de',
  -- Financial
  subtotal_net DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_vat DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_pfand DECIMAL(12,4) NOT NULL DEFAULT 0,
  total_gross DECIMAL(12,4) NOT NULL DEFAULT 0,
  -- Tax
  vat_7_base DECIMAL(12,4) DEFAULT 0,
  vat_7_amount DECIMAL(12,4) DEFAULT 0,
  vat_19_base DECIMAL(12,4) DEFAULT 0,
  vat_19_amount DECIMAL(12,4) DEFAULT 0,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Image Processing Jobs
CREATE TABLE image_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  original_url TEXT NOT NULL,
  processed_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Sequences for readable IDs
CREATE SEQUENCE order_seq START 10000;
CREATE SEQUENCE invoice_seq START 20000;

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_channel ON orders(channel);
CREATE INDEX idx_order_items_order_id ON order_line_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);

-- Seed admin user (password: Admin@2024)
INSERT INTO users (email, password_hash, name, user_type, language)
VALUES (
  'admin@bellaqa.de',
  '$2b$10$rQnV8bQfRjRHCYQ8.w8NxOJhH5L8vVK4TYcK8gM4W5LHfGu9Zj4Ky',
  'BELLAQA Admin',
  'admin',
  'de'
);

-- Seed sample products
INSERT INTO products (sku, name_de, name_en, name_tr, name_sq, name_fr, category, unit_net_price, vat_rate, pfand) VALUES
('APFELSAFT-1L', 'Apfelsaft 1L', 'Apple Juice 1L', 'Elma Suyu 1L', 'Lëng Molle 1L', 'Jus de Pomme 1L', 'beverage', 1.2500, 0.19, 0.25),
('MINERALWASSER-500', 'Mineralwasser 500ml', 'Mineral Water 500ml', 'Maden Suyu 500ml', 'Ujë Mineral 500ml', 'Eau Minérale 500ml', 'beverage', 0.4500, 0.19, 0.15),
('VOLLMILCH-1L', 'Bio Vollmilch 1L', 'Organic Whole Milk 1L', 'Organik Tam Yağlı Süt 1L', 'Qumësht Bio 1L', 'Lait Entier Bio 1L', 'food', 0.8900, 0.07, 0.00),
('BROT-500G', 'Vollkornbrot 500g', 'Wholegrain Bread 500g', 'Tam Buğday Ekmeği 500g', 'Bukë Integrale 500g', 'Pain Complet 500g', 'food', 2.1500, 0.07, 0.00),
('KAESE-200G', 'Gouda Käse 200g', 'Gouda Cheese 200g', 'Gouda Peyniri 200g', 'Djathë Gouda 200g', 'Fromage Gouda 200g', 'food', 1.7800, 0.07, 0.00);

