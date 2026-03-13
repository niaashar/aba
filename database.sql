USE `aba_pro`;

-- Удаляем старые таблицы
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `meetings`;
DROP TABLE IF EXISTS `users`;

-- Создаём таблицу users заново со всеми колонками
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `phone` VARCHAR(20),
  `password` VARCHAR(255),
  `role` ENUM('owner', 'client') DEFAULT 'client',
  `status` VARCHAR(50) DEFAULT 'new',
  `child_info` TEXT,
  `comments` TEXT,
  `progress` INT DEFAULT 0,
  `start_date` DATE,
  `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `steps_clarification` BOOLEAN DEFAULT FALSE,
  `steps_immersion` BOOLEAN DEFAULT FALSE,
  `steps_program` BOOLEAN DEFAULT FALSE,
  `steps_support` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Создаём остальные таблицы
CREATE TABLE IF NOT EXISTS `meetings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `description` TEXT,
  `link` VARCHAR(500),
  `access` VARCHAR(50) DEFAULT 'all',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `type` VARCHAR(50),
  `file_name` VARCHAR(255),
  `file_path` VARCHAR(500),
  `upload_date` DATE,
  `uploaded_by` VARCHAR(100),
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_id` INT NOT NULL,
  `from` VARCHAR(50) NOT NULL,
  `from_name` VARCHAR(100),
  `subject` VARCHAR(200),
  `message` TEXT NOT NULL,
  `date` DATE,
  `read` BOOLEAN DEFAULT FALSE,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Добавляем тестовые данные
INSERT IGNORE INTO `users` (`name`, `email`, `phone`, `password`, `role`, `status`) 
VALUES ('Слесь Ирина Анатольевна', 'owner@aba-pro.ru', '', 'owner123', 'owner', 'active');

INSERT IGNORE INTO `users` (`name`, `email`, `phone`, `password`, `role`, `status`, `child_info`, `progress`, `start_date`) 
VALUES ('Иванова Мария', 'client@aba-pro.ru', '+7 (999) 999-99-99', 'client123', 'client', 'consultation', 'Ребёнок 5 лет', 25, '2026-01-15');

INSERT IGNORE INTO `meetings` (`title`, `date`, `time`, `description`, `link`, `access`) VALUES
('Поведение как коммуникация', '2026-02-10', '19:00', 'Почему ребёнок ведёт себя так, а не иначе — и как понять его сигналы.', 'https://zoom.us/j/123456789', 'all'),
('Перенос навыков в жизнь', '2026-02-17', '18:30', 'Как сделать так, чтобы ребёнок использовал новые умения не только на занятиях.', 'https://zoom.us/j/987654321', 'all');