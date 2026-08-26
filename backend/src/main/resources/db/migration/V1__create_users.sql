CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_size DECIMAL(10, 2),
    state VARCHAR(100),
    district VARCHAR(100),
    taluka VARCHAR(100),
    village VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_privacy VARCHAR(50) DEFAULT 'APPROXIMATE',
    verification_status VARCHAR(50) DEFAULT 'PENDING'
);

CREATE TABLE buyer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    buyer_type VARCHAR(50) NOT NULL,
    gst_number VARCHAR(50),
    address TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    taluka VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    verification_status VARCHAR(50) DEFAULT 'PENDING'
);
