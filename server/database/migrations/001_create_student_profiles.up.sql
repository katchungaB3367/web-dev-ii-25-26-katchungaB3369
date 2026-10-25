-- Proposed initial schema: student bio registration without login/accounts.
-- Select the application database in MySQL Workbench before running once.
-- MySQL DDL commits implicitly. Review existing tables before applying.

CREATE TABLE student_profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_number VARCHAR(50) NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  course VARCHAR(150) NULL,
  year_of_study TINYINT UNSIGNED NULL,
  bio TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_student_profiles_email UNIQUE (email),
  CONSTRAINT uq_student_profiles_student_number UNIQUE (student_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
