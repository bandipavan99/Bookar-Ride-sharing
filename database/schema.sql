-- ============================================================
-- Ride Sharing Platform - MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS ridesharing;
USE ridesharing;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    driver_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    vehicle_type ENUM('BIKE', 'CAR', 'AUTO') NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    availability_status BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 4.50,
    total_rides INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rides Table
CREATE TABLE IF NOT EXISTS rides (
    ride_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    vehicle_type ENUM('BIKE', 'CAR', 'AUTO') NOT NULL,
    ride_status ENUM('REQUESTED', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REQUESTED',
    fare DECIMAL(10,2),
    distance_km DECIMAL(6,2),
    ride_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_ride_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_ride_driver FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ride_id BIGINT NOT NULL UNIQUE,
    payment_method ENUM('CASH', 'CARD', 'UPI', 'WALLET') NOT NULL DEFAULT 'CASH',
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(10,2),
    paid_at TIMESTAMP NULL,
    CONSTRAINT fk_payment_ride FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE
);

-- Default Admin user (password: admin123 - BCrypt hashed)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin', 'admin@rideshare.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwJ3KXWDVR6i', '9999999999', 'ADMIN');
