-- ============================================================
-- VNPay Payment Integration - Database Schema
-- Run this SQL in your MySQL database (defaultdb)
-- ============================================================

-- payments table: stores all payment records for orders
CREATE TABLE IF NOT EXISTS payments (
  id              INT           AUTO_INCREMENT PRIMARY KEY,
  order_id        INT           NOT NULL,
  amount          DECIMAL(15,2) NOT NULL,
  method          VARCHAR(50)   NOT NULL DEFAULT 'vnpay',
  status          ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  transaction_id  VARCHAR(100)  DEFAULT NULL COMMENT 'VNPay vnp_TransactionNo',
  bank_code       VARCHAR(20)   DEFAULT NULL COMMENT 'VNPay vnp_BankCode',
  pay_date        VARCHAR(30)   DEFAULT NULL COMMENT 'VNPay vnp_PayDate (yyyyMMddHHmmss)',
  response_code   VARCHAR(10)   DEFAULT NULL COMMENT 'VNPay vnp_ResponseCode (00 = success)',
  secure_hash     VARCHAR(256)  DEFAULT NULL COMMENT 'vnp_SecureHash for audit trail',
  raw_data        TEXT          DEFAULT NULL COMMENT 'Full JSON of VNPay return params',
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Prevent duplicate pending records per order per method
  UNIQUE KEY uq_order_method (order_id, method),
  INDEX idx_order_id    (order_id),
  INDEX idx_status      (status),
  INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Verify the orders table has required columns ─────────────────────────────
-- If your orders table is missing payment_info, run:
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_info JSON DEFAULT NULL
    COMMENT 'Stores VNPay/MoMo payment metadata as JSON';

-- ── Status reference ──────────────────────────────────────────────────────────
-- orders.status values:
--   pending     → order created, awaiting payment
--   processing  → payment confirmed (vnpay responseCode = "00")
--   completed   → order fulfilled
--   cancelled   → payment failed or user cancelled
--
-- payments.status values:
--   pending     → payment URL created, user not yet returned
--   paid        → vnp_ResponseCode = "00", hash verified
--   failed      → vnp_ResponseCode != "00" or signature mismatch
--   cancelled   → user clicked "Quay lại" (vnp_ResponseCode = "24")

-- ── Example queries ───────────────────────────────────────────────────────────

-- Get payment details for an order:
-- SELECT p.*, o.status AS order_status
-- FROM payments p
-- JOIN orders o ON p.order_id = o.id
-- WHERE p.order_id = 42;

-- Find all successful VNPay payments today:
-- SELECT * FROM payments
-- WHERE method = 'vnpay' AND status = 'paid'
--   AND DATE(created_at) = CURDATE();

-- Revenue report by payment method:
-- SELECT method, SUM(amount) AS total, COUNT(*) AS count
-- FROM payments WHERE status = 'paid'
-- GROUP BY method;
