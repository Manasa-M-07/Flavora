const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seed() {
    try {
        console.log('Connecting to database...');
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'flavora_db'
        });

        // 1. Create a dummy user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        let userId;
        const [existing] = await db.execute('SELECT id FROM Users WHERE email = ?', ['chef@flavora.com']);
        if (existing.length > 0) {
            userId = existing[0].id;
        } else {
            const [userResult] = await db.execute(
                'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
                ['Master Chef', 'chef@flavora.com', hashedPassword]
            );
            userId = userResult.insertId;
        }

        console.log('Dummy user created/found with ID:', userId);

        // 2. Clear existing recipes for clean slate (optional, but good for seeding)
        // await db.execute('DELETE FROM Recipes');

        // 3. Define sample recipes with high-quality unsplash images
        const recipes = [
            {
                title: 'Classic Truffle Pasta',
                description: 'A creamy, luxurious truffle pasta that brings the authentic taste of Italy to your kitchen in under 30 minutes.',
                ingredients: '1 lb Fettuccine pasta\n2 tbsp Truffle oil\n1 cup Heavy cream\n1/2 cup Parmesan cheese, grated\n2 cloves Garlic, minced\nSalt and pepper to taste\nFresh parsley, chopped (for garnish)',
                steps: '1. Boil a large pot of salted water and cook fettuccine according to package instructions until al dente.\n2. In a large skillet, heat the truffle oil over medium heat. Add minced garlic and sauté until fragrant (about 1 minute).\n3. Pour in the heavy cream and bring to a gentle simmer.\n4. Stir in the grated parmesan cheese until the sauce is smooth and creamy.\n5. Drain the pasta and toss it into the sauce, ensuring every strand is beautifully coated.\n6. Season with salt and pepper. Garnish with fresh parsley before serving.',
                prep: 10, cook: 15, difficulty: 'Medium', servings: 4, cals: 650,
                cuisine: 'Italian', category: 'Dinner',
                image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800',
                notes: 'For an extra luxurious touch, shave some fresh black truffle over the pasta right before serving!'
            },
            {
                title: 'Avocado Toast with Poached Egg',
                description: 'The ultimate healthy breakfast. Crispy sourdough topped with creamy avocado, a perfectly poached egg, and red pepper flakes.',
                ingredients: '2 slices Sourdough bread\n1 ripe Avocado\n2 large Eggs\n1 tsp Lemon juice\nSalt and black pepper\nRed pepper flakes (optional)',
                steps: '1. Toast the sourdough bread slices until golden brown and crispy.\n2. In a small bowl, mash the avocado with lemon juice, salt, and pepper.\n3. Bring a pot of water to a gentle simmer. Create a vortex and gently drop in the eggs. Poach for 3-4 minutes.\n4. Spread the mashed avocado evenly over the toasted bread.\n5. Carefully place one poached egg on top of each slice.\n6. Sprinkle with red pepper flakes and extra black pepper before serving.',
                prep: 10, cook: 5, difficulty: 'Easy', servings: 2, cals: 320,
                cuisine: 'American', category: 'Breakfast',
                image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
                notes: 'Add a drizzle of balsamic glaze or sriracha for a sweet or spicy kick.'
            },
            {
                title: 'Grilled Salmon with Asparagus',
                description: 'A light, nutritious, and incredibly flavorful dinner option packed with Omega-3s and fresh herbs.',
                ingredients: '2 Salmon fillets\n1 bunch Asparagus, trimmed\n2 tbsp Olive oil\n2 cloves Garlic, minced\n1 Lemon (sliced)\nFresh dill\nSalt and pepper',
                steps: '1. Preheat your grill or grill pan to medium-high heat.\n2. Toss the asparagus with 1 tbsp olive oil, salt, and pepper.\n3. Rub the salmon fillets with the remaining olive oil, minced garlic, salt, and pepper.\n4. Grill the salmon for about 4-5 minutes per side, until it flakes easily with a fork.\n5. Grill the asparagus for 3-5 minutes until tender and slightly charred.\n6. Serve the salmon topped with fresh dill and lemon slices alongside the asparagus.',
                prep: 15, cook: 10, difficulty: 'Medium', servings: 2, cals: 450,
                cuisine: 'Healthy', category: 'Dinner',
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
                notes: 'Do not overcook the salmon! It should be slightly pink in the center for the best texture.'
            },
            {
                title: 'Berry Acai Bowl',
                description: 'A refreshing, antioxidant-packed smoothie bowl topped with fresh fruits, granola, and a drizzle of honey.',
                ingredients: '1 packet Frozen Acai puree\n1/2 cup Frozen mixed berries\n1/2 Banana (frozen)\n1/2 cup Almond milk\nToppings: Fresh strawberries, blueberries, granola, chia seeds, honey',
                steps: '1. In a blender, combine the frozen acai, mixed berries, frozen banana, and almond milk.\n2. Blend until smooth and thick. You may need to stop and scrape down the sides a few times.\n3. Pour the smoothie mixture into a bowl.\n4. Arrange the fresh toppings (strawberries, blueberries, granola) beautifully on top.\n5. Sprinkle with chia seeds and finish with a drizzle of honey.',
                prep: 10, cook: 0, difficulty: 'Easy', servings: 1, cals: 280,
                cuisine: 'Brazilian', category: 'Breakfast',
                image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800',
                notes: 'For a thicker bowl, use less almond milk and ensure all fruits are completely frozen.'
            },
            {
                title: 'Spicy Beef Tacos',
                description: 'Authentic street-style beef tacos with fresh cilantro, onions, and a squeeze of lime.',
                ingredients: '1 lb Ground beef\n1 packet Taco seasoning\n8 Small corn tortillas\n1/2 cup White onion, finely diced\n1/4 cup Fresh cilantro, chopped\n1 Lime, cut into wedges\nSalsa of your choice',
                steps: '1. Heat a large skillet over medium-high heat. Add the ground beef and cook until browned, breaking it apart with a spatula.\n2. Drain excess fat, then stir in the taco seasoning and a splash of water. Simmer for 5 minutes.\n3. Warm the corn tortillas in a dry skillet or microwave until soft and pliable.\n4. Build the tacos by adding a spoonful of beef to each tortilla.\n5. Top with diced onions, fresh cilantro, and a drizzle of salsa.\n6. Serve immediately with a squeeze of fresh lime juice.',
                prep: 10, cook: 10, difficulty: 'Easy', servings: 4, cals: 420,
                cuisine: 'Mexican', category: 'Lunch',
                image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800',
                notes: 'Double up the corn tortillas for a true street-taco experience that won\'t fall apart.'
            },
            {
                title: 'Decadent Chocolate Lava Cake',
                description: 'A rich, warm chocolate cake with a molten, gooey center. The ultimate luxury dessert.',
                ingredients: '1/2 cup Unsalted butter\n4 oz Semi-sweet chocolate\n2 large Eggs\n2 Egg yolks\n1/4 cup Sugar\n2 tbsp All-purpose flour\nPowdered sugar (for dusting)\nVanilla ice cream (optional)',
                steps: '1. Preheat the oven to 425°F (220°C). Butter and lightly flour 4 ramekins.\n2. Melt the butter and chocolate together in a microwave-safe bowl (in 30-second increments) or over a double boiler. Stir until completely smooth.\n3. In a separate bowl, whisk together the eggs, egg yolks, and sugar until thick and pale.\n4. Fold the melted chocolate mixture into the egg mixture until well combined.\n5. Gently fold in the flour just until no streaks remain.\n6. Divide the batter evenly among the ramekins.\n7. Bake for 12-14 minutes. The edges should be firm but the center slightly jiggly.\n8. Let sit for 1 minute, then invert onto a plate. Dust with powdered sugar and serve immediately.',
                prep: 15, cook: 14, difficulty: 'Hard', servings: 4, cals: 580,
                cuisine: 'French', category: 'Desserts',
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800',
                notes: 'Timing is crucial! Ovens vary, so keep a close eye on them to ensure the center stays molten.'
            }
        ];

        console.log('Inserting sample recipes...');
        for (let r of recipes) {
            // Check if it already exists to prevent duplicates on multiple runs
            const [existing] = await db.execute('SELECT id FROM Recipes WHERE title = ?', [r.title]);
            if (existing.length === 0) {
                const total = r.prep + r.cook;
                await db.execute(
                    `INSERT INTO Recipes 
                    (user_id, title, description, ingredients, preparation_steps, preparation_time, cooking_time, total_time, difficulty, servings, calories, cuisine, category, image, notes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [userId, r.title, r.description, r.ingredients, r.steps, r.prep, r.cook, total, r.difficulty, r.servings, r.cals, r.cuisine, r.category, r.image, r.notes]
                );
            }
        }

        console.log('Database seeded successfully with sample recipes!');
        await db.end();
    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

seed();
