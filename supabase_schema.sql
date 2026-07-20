-- Yemen Engineer Platform - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize all tables and seed default values.

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS ye_users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    type TEXT NOT NULL, -- client, engineer, office, workshop, company, agent, admin
    phone TEXT,
    governorate TEXT,
    city TEXT,
    specialty TEXT,
    license_number TEXT,
    experience_years INTEGER,
    bio TEXT,
    avatar TEXT,
    is_verified BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending', -- approved, pending, rejected
    rating NUMERIC DEFAULT 5.0,
    rating_count INTEGER DEFAULT 0,
    activity_type TEXT,
    office_name TEXT,
    workshop_name TEXT,
    company_name TEXT,
    product_types TEXT,
    brands TEXT,
    store_id TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    certificates TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Services Table
CREATE TABLE IF NOT EXISTS ye_services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image TEXT,
    price_range TEXT,
    count_providers TEXT,
    related_user_types TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Requests Table
CREATE TABLE IF NOT EXISTS ye_requests (
    id TEXT PRIMARY KEY,
    client_id TEXT REFERENCES ye_users(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES ye_services(id) ON DELETE SET NULL,
    request_type TEXT DEFAULT 'service', -- service, consultation
    target_provider_id TEXT REFERENCES ye_users(id) ON DELETE SET NULL,
    category TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    governorate TEXT,
    city TEXT,
    location TEXT,
    budget NUMERIC DEFAULT 0,
    duration TEXT,
    status TEXT DEFAULT 'NEW', -- NEW, IN_PROGRESS, COMPLETED, CANCELLED
    selected_offer_id TEXT,
    images TEXT[] DEFAULT '{}',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Offers Table
CREATE TABLE IF NOT EXISTS ye_offers (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES ye_requests(id) ON DELETE CASCADE,
    provider_id TEXT REFERENCES ye_users(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    provider_specialty TEXT,
    provider_avatar TEXT,
    price NUMERIC NOT NULL,
    duration TEXT,
    arrival_time TEXT,
    notes TEXT NOT NULL,
    status TEXT DEFAULT 'submitted', -- submitted, accepted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Messages Table
CREATE TABLE IF NOT EXISTS ye_messages (
    id TEXT PRIMARY KEY,
    request_id TEXT REFERENCES ye_requests(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL, -- User ID or 'SYSTEM'
    receiver_id TEXT, -- User ID or Null
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Notifications Table
CREATE TABLE IF NOT EXISTS ye_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES ye_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Stores Table
CREATE TABLE IF NOT EXISTS ye_stores (
    id TEXT PRIMARY KEY,
    agent_id TEXT REFERENCES ye_users(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    governorate TEXT NOT NULL,
    brands TEXT[] DEFAULT '{}'::text[],
    description TEXT,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Products Table
CREATE TABLE IF NOT EXISTS ye_products (
    id TEXT PRIMARY KEY,
    store_id TEXT REFERENCES ye_stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    specifications TEXT,
    price NUMERIC NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Reviews Table
CREATE TABLE IF NOT EXISTS ye_reviews (
    id TEXT PRIMARY KEY,
    target_id TEXT NOT NULL, -- User ID or store ID being reviewed
    reviewer_name TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create Ads Table
CREATE TABLE IF NOT EXISTS ye_ads (
    id TEXT PRIMARY KEY,
    advertiser_id TEXT REFERENCES ye_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    link TEXT,
    type TEXT DEFAULT 'banner', -- banner, sidebar
    pricing_model TEXT DEFAULT 'CPC', -- CPC, CPM
    budget NUMERIC DEFAULT 0,
    cpc_rate NUMERIC DEFAULT 150,
    cpm_rate NUMERIC DEFAULT 2500,
    clicks INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- active, pending, completed, paused
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_client ON ye_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_offers_request ON ye_offers(request_id);
CREATE INDEX IF NOT EXISTS idx_messages_request ON ye_messages(request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON ye_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_products_store ON ye_products(store_id);
