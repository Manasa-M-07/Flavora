CREATE DATABASE IF NOT EXISTS flavora_db;
USE flavora_db;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO Categories (category_name) VALUES 
('Breakfast'), ('Lunch'), ('Dinner'), ('Snacks'), 
('Desserts'), ('Drinks'), ('Vegetarian'), 
('Non-Vegetarian'), ('Vegan')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

CREATE TABLE IF NOT EXISTS Recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    preparation_steps TEXT NOT NULL,
    preparation_time INT,
    cooking_time INT,
    total_time INT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    servings INT,
    calories INT,
    cuisine VARCHAR(100),
    category VARCHAR(100),
    image VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS Shopping_List (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ingredient VARCHAR(255) NOT NULL,
    quantity VARCHAR(100),
    purchased BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
