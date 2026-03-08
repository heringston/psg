-- =============================================
-- FoodBridge Database Schema
-- Run this in pgAdmin after creating the database:
--   CREATE DATABASE foodbridge;
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Users Table ─────────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('restaurant', 'ngo')),
    phone VARCHAR(20),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    fssai_id VARCHAR(50),
    ngo_darpan_id VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(10) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_verified ON users(is_verified);
CREATE INDEX idx_users_location ON users(latitude, longitude);

-- ─── Food Listings Table ─────────────────────────────────
CREATE TABLE food_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_type VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    unit VARCHAR(30) NOT NULL DEFAULT 'servings',
    expiration_time TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(10) DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'expired')),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_food_listings_restaurant ON food_listings(restaurant_id);
CREATE INDEX idx_food_listings_status ON food_listings(status);
CREATE INDEX idx_food_listings_expiration ON food_listings(expiration_time);
CREATE INDEX idx_food_listings_status_exp ON food_listings(status, expiration_time);

-- ─── Donations Table ─────────────────────────────────────
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    ngo_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(12) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'picked_up', 'completed', 'cancelled')),
    pickup_time TIMESTAMP WITH TIME ZONE,
    completion_photo_url VARCHAR(500),
    meals_saved INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_donations_food_listing ON donations(food_listing_id);
CREATE INDEX idx_donations_ngo ON donations(ngo_id);
CREATE INDEX idx_donations_restaurant ON donations(restaurant_id);
CREATE INDEX idx_donations_status ON donations(status);

-- ─── Verification Logs Table ─────────────────────────────
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(10) NOT NULL CHECK (verification_type IN ('fssai', 'ngo_darpan')),
    submitted_id VARCHAR(100) NOT NULL,
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_verification_user ON verification_logs(user_id);
CREATE INDEX idx_verification_status ON verification_logs(status);
CREATE INDEX idx_verification_type ON verification_logs(verification_type);
