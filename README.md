# Flavora - Recipe Management Platform

Flavora is a premium full-stack web application for discovering, managing, and sharing recipes.

## Features
- **Premium UI**: Olive Green & Gold theme, glassmorphism, soft shadows.
- **Authentication**: JWT-based login/register.
- **Recipes**: Complete CRUD operations, upload images, search, filter.
- **Favorites**: Save your favorite recipes.
- **Shopping List**: Manage ingredients you need to buy.

## Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6), Bootstrap 5, Axios.
- **Backend**: Node.js, Express, MySQL, JWT, bcrypt, Multer.

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g. XAMPP phpMyAdmin, MySQL Workbench, or CLI).
2. Create the database and tables by running the SQL script provided at:
   `backend/flavora_db.sql`

### 2. Backend Setup
1. Navigate to the root directory `c:\Flavora`.
2. Configure your database connection in the `.env` file (update `DB_PASSWORD` with your MySQL password).
3. Start the server:
   ```bash
   node backend/server.js
   ```
   *The server runs on port 5000 by default.*

### 3. Frontend Setup
1. Since the frontend uses plain HTML/CSS/JS, you can simply open `frontend/index.html` in your browser.
2. Alternatively, you can use an extension like VS Code Live Server to serve the `frontend/` folder.
