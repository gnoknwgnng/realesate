-- PostgreSQL Schema for MedProperties Real Estate Application
-- Optimized for 10,000+ properties, Cloudflare R2 media, and medical ecosystem

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    period VARCHAR(20) DEFAULT 'month',
    beds INTEGER NOT NULL,
    baths NUMERIC(3, 1) NOT NULL,
    dimensions VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL, -- Primary cover image (R2 URL)
    is_popular BOOLEAN DEFAULT false,
    category VARCHAR(20) DEFAULT 'rent', -- 'rent', 'buy', 'sell'
    property_type VARCHAR(100) DEFAULT 'Independent Floor',
    description TEXT,
    hospital_distance VARCHAR(255),
    virtual_tour_url TEXT,
    owner_email VARCHAR(255),
    owner_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'pending', 'rented'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. CLOUDFLARE R2 PROPERTY IMAGES TABLE
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL, -- Key in Cloudflare R2 bucket (e.g. properties/{id}/{filename})
    r2_url TEXT NOT NULL, -- Public or signed URL for Cloudflare R2
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'doctor', -- 'doctor', 'landlord', 'superadmin'
    phone VARCHAR(50),
    hospital VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'offline', -- 'online', 'offline'
    last_login TIMESTAMPTZ,
    device VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. INQUIRIES / TOUR BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    medical_role VARCHAR(100),
    tour_date VARCHAR(100),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. LEADS TABLE (LANDLORD NETWORK)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'landlord',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(property_id, user_id)
);

-- PERFORMANCE INDEXES (Optimized for 10,000+ properties)
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_beds ON properties(beds);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_owner_email ON properties(owner_email);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id, display_order);
CREATE INDEX IF NOT EXISTS idx_property_images_primary ON property_images(property_id) WHERE is_primary = true;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
