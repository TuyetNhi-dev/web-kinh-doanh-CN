-- Mã SQL mẫu dùng cho CSDL Aiven MySQL để hỗ trợ website

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(15, 2) NOT NULL,
  `category` VARCHAR(50),
  `image_url` VARCHAR(255),
  `stock_quantity` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu Mẫu (Mock Data)
INSERT INTO `products` (`name`, `description`, `price`, `category`) VALUES
('MacBook Pro 16" M3 Max', 'Chiếc MacBook Pro mạnh mẽ nhất từng được tạo ra.', 89990000, 'Laptop'),
('iPhone 15 Pro Max 256GB', 'Smartphone khung viền Titan siêu cứng cáp.', 29500000, 'Smartphone'),
('Tai nghe Sony WH-1000XM5', 'Chống ồn chủ động tốt nhất hiện nay.', 7990000, 'Phụ Kiện'),
('Apple Watch Ultra 2', 'Đồng hồ thông minh hoạt động ngoài trời bền bỉ.', 21000000, 'Smartwatch');
