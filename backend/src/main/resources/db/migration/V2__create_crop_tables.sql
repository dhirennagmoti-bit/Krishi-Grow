CREATE TABLE crops (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    description TEXT,
    default_shelf_life_days INT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE crop_varieties (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_shelf_life_days INT
);

CREATE TABLE crop_grades (
    id BIGSERIAL PRIMARY KEY,
    crop_id BIGINT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    grade_code VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE farmer_crops (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    variety_id BIGINT REFERENCES crop_varieties(id),
    custom_variety VARCHAR(255),
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    quantity_kg DECIMAL(10, 2) NOT NULL,
    quality_level VARCHAR(100),
    grade VARCHAR(50),
    moisture DECIMAL(5, 2),
    size VARCHAR(50),
    damage_percentage DECIMAL(5, 2),
    organic BOOLEAN DEFAULT FALSE,
    harvest_date DATE,
    shelf_life_days INT,
    storage_condition VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    state VARCHAR(100),
    district VARCHAR(100),
    taluka VARCHAR(100),
    village VARCHAR(100),
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
