-- ====================================================================
-- AI-Powered Sales Data Analysis and Visualization System
-- Target Database: MySQL 8.0+
-- Schema Definition with Foreign Keys, Constraints, and Indexes
-- ====================================================================

DROP DATABASE IF EXISTS sales_analytics_db;
CREATE DATABASE sales_analytics_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE sales_analytics_db;

-- 1. REGIONS TABLE
CREATE TABLE regions (
    region_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    manager_name VARCHAR(120) NOT NULL,
    target_quarterly DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (region_id)
) ENGINE=InnoDB;

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
    category_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id)
) ENGINE=InnoDB;

-- 3. USERS TABLE (Spring Security / Auth)
CREATE TABLE users (
    user_id VARCHAR(36) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL DEFAULT 'ROLE_USER',
    department VARCHAR(80),
    avatar_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- 4. CUSTOMERS TABLE
CREATE TABLE customers (
    customer_id VARCHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    region_id VARCHAR(36) NOT NULL,
    segment ENUM('Enterprise', 'Mid-Market', 'SMB', 'Startup') NOT NULL DEFAULT 'SMB',
    phone VARCHAR(30),
    total_spent DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    orders_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id),
    CONSTRAINT fk_customers_region 
        FOREIGN KEY (region_id) REFERENCES regions(region_id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_customers_region (region_id),
    INDEX idx_customers_email (email)
) ENGINE=InnoDB;

-- 5. PRODUCTS TABLE
CREATE TABLE products (
    product_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id),
    CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) REFERENCES categories(category_id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_positive_prices 
        CHECK (unit_price >= 0 AND unit_cost >= 0),
    INDEX idx_products_category (category_id),
    INDEX idx_products_sku (sku)
) ENGINE=InnoDB;

-- 6. SALES ORDERS TABLE
CREATE TABLE sales (
    sale_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    order_date DATE NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    revenue DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    cost DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    profit DECIMAL(14, 2) GENERATED ALWAYS AS ((quantity * unit_price) - (quantity * unit_cost)) STORED,
    payment_method ENUM('Credit Card', 'Wire Transfer', 'ACH', 'PayPal') NOT NULL DEFAULT 'Credit Card',
    status ENUM('Completed', 'Pending', 'Shipped', 'Cancelled') NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (sale_id),
    CONSTRAINT fk_sales_product 
        FOREIGN KEY (product_id) REFERENCES products(product_id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sales_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id) 
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_sales_order_date (order_date),
    INDEX idx_sales_product (product_id),
    INDEX idx_sales_customer (customer_id),
    INDEX idx_sales_status (status)
) ENGINE=InnoDB;

-- 7. ANALYTICS VIEW FOR REPORTING
CREATE OR REPLACE VIEW view_monthly_sales_summary AS
SELECT 
    DATE_FORMAT(s.order_date, '%Y-%m') AS sale_month,
    COUNT(s.sale_id) AS total_orders,
    SUM(s.quantity) AS total_units_sold,
    SUM(s.revenue) AS total_revenue,
    SUM(s.cost) AS total_cost,
    SUM(s.profit) AS total_profit,
    ROUND((SUM(s.profit) / SUM(s.revenue)) * 100, 2) AS overall_margin_pct
FROM sales s
WHERE s.status IN ('Completed', 'Shipped')
GROUP BY DATE_FORMAT(s.order_date, '%Y-%m')
ORDER BY sale_month DESC;
