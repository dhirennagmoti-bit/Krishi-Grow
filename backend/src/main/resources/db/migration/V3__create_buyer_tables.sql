CREATE TABLE buyer_requirements (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL REFERENCES buyer_profiles(id) ON DELETE CASCADE,
    crop_id BIGINT NOT NULL REFERENCES crops(id),
    quantity_required DOUBLE PRECISION NOT NULL,
    target_date DATE,
    target_price DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'SOURCING',
    delivery_location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
