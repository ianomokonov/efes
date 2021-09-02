-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'UserRole'
-- 
-- ---

DROP TABLE IF EXISTS `UserRole`;
		
CREATE TABLE `UserRole` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'User'
-- 
-- ---

DROP TABLE IF EXISTS `User`;
		
CREATE TABLE `User` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `phone` VARCHAR(20) NULL,
  -- `name` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  -- `surname` VARCHAR(200) NULL DEFAULT NULL,
  -- `lastname` VARCHAR(200) NULL DEFAULT NULL,
  `isAdmin` bit NOT NULL DEFAULT 0,
  `roleId` INTEGER(10) NOT NULL,
  PRIMARY KEY (`id`)
);


-- ---
-- Table 'RefreshTokens'
-- 
-- ---

DROP TABLE IF EXISTS `RefreshTokens`;
		
CREATE TABLE `RefreshTokens` (
  `id` INTEGER(10) AUTO_INCREMENT,
  `userId` INTEGER(10) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);


-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `RefreshTokens` ADD FOREIGN KEY (userId) REFERENCES `User` (`id`) ON DELETE CASCADE;
ALTER TABLE `User` ADD FOREIGN KEY (roleId) REFERENCES `UserRole` (`id`);


-- Заполнение данными

INSERT INTO `UserRole` (`id`, `name`) VALUES
(1, 'Застройщик'), (2, 'Ген. подрядчик'), (3, 'Подрядчик');

INSERT INTO `User` (`id`, `login`, `password`, `email`, `phone`, `isAdmin`, `roleId`) VALUES
(1, 'inomokonov', '$2y$10$GqAKHsx2hGLBlrYGhWGn.OUe8NUhXut0XUpi7x5Xb4Y3DOs4g/.pa', 'nomokonov.vana@gmail.com', '89151999845', 1, 1);