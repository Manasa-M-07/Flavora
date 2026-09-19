const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';

const mealAPI = {

    async fetchWithCache(url, cacheKey) {
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) {
                sessionStorage.removeItem(cacheKey);
            }
        }

        try {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            const data = await res.json();

            sessionStorage.setItem(cacheKey, JSON.stringify(data));

            return data;
        } catch (error) {
            console.error('TheMealDB API Error:', error);
            throw error;
        }
    },


    // ==========================================
    // SEARCH BY NAME
    // ==========================================

    async searchByName(name) {

        const cleanName = (name || '').trim();

        if (!cleanName) {
            return { meals: [] };
        }

        const url =
            `${MEALDB_API_URL}/search.php?s=${encodeURIComponent(cleanName)}`;

        return this.fetchWithCache(
            url,
            `search_${cleanName.toLowerCase()}`
        );
    },


    // ==========================================
    // GET RECIPE BY ID
    // ==========================================

    async getById(id) {

        const url =
            `${MEALDB_API_URL}/lookup.php?i=${encodeURIComponent(id)}`;

        return this.fetchWithCache(
            url,
            `meal_${id}`
        );
    },


    // ==========================================
    // RANDOM RECIPE
    // ==========================================

    async getRandom() {

        try {

            const res =
                await fetch(`${MEALDB_API_URL}/random.php`);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            return await res.json();

        } catch (error) {

            console.error('TheMealDB API Error:', error);

            throw error;
        }
    },


    // ==========================================
    // CATEGORIES
    // ==========================================

    async getCategories() {

        return this.fetchWithCache(
            `${MEALDB_API_URL}/categories.php`,
            'categories'
        );
    },


    // ==========================================
    // CUISINES
    // ==========================================

    async getCuisines() {

        return this.fetchWithCache(
            `${MEALDB_API_URL}/list.php?a=list`,
            'cuisines'
        );
    },


    // ==========================================
    // INGREDIENTS
    // ==========================================

    async getIngredients() {

        return this.fetchWithCache(
            `${MEALDB_API_URL}/list.php?i=list`,
            'ingredients'
        );
    },


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    async filterByCategory(category) {

        const cleanCategory = (category || '').trim();

        if (!cleanCategory) {
            return { meals: [] };
        }

        return this.fetchWithCache(
            `${MEALDB_API_URL}/filter.php?c=${encodeURIComponent(cleanCategory)}`,
            `filter_c_${cleanCategory}`
        );
    },


    // ==========================================
    // CUISINE FILTER
    // ==========================================

    async filterByCuisine(cuisine) {

        const selected =
            (cuisine || '').trim().toLowerCase();

        if (!selected) {
            return { meals: [] };
        }


        // Different search words for different cuisines.
        // This prevents Indian and American from showing
        // the same small collection.

        const cuisineTerms = {

    indian: [
        'biryani',
        'curry',
        'masala',
        'paneer',
        'naan',
        'tikka',
        'dosa',
        'samosa',
        'dal',
        'chicken',
        'rice',
        'roti',
        'paratha',
        'kofta',
        'kebab',
        'tandoori',
        'vindaloo',
        'chutney',
        'pakora',
        'korma',
        'chapati',
        'aloo',
        'matar',
        'palak',
        'rajma',
        'idli',
        'sambar'
    ],

    american: [
        'burger',
        'steak',
        'sandwich',
        'pancake',
        'waffle',
        'bbq',
        'chicken',
        'beef',
        'potato',
        'pie',
        'mac',
        'cheese',
        'salad',
        'soup',
        'ribs',
        'meatloaf',
        'chili',
        'corn',
        'turkey',
        'pork',
        'hotdog',
        'cookie',
        'brownie',
        'cake',
        'muffin'
    ],

    italian: [
        'pasta',
        'pizza',
        'risotto',
        'lasagna',
        'spaghetti',
        'tortellini',
        'ravioli',
        'carbonara',
        'pesto',
        'parmesan'
    ],

    chinese: [
        'noodle',
        'rice',
        'chow',
        'dumpling',
        'chicken',
        'beef',
        'soup',
        'wonton',
        'sweet',
        'sour'
    ],

    mexican: [
        'taco',
        'burrito',
        'enchilada',
        'chilli',
        'bean',
        'chicken',
        'beef',
        'salsa',
        'quesadilla',
        'nachos'
    ],

    japanese: [
        'sushi',
        'ramen',
        'teriyaki',
        'rice',
        'noodle',
        'chicken',
        'miso',
        'tempura'
    ]

};

        const terms =
            cuisineTerms[selected] || [
                'chicken',
                'rice',
                'beef',
                'potato',
                'pasta',
                'soup'
            ];


        let allMeals = [];


        try {

            // Run searches one by one.
            // This is safer for the API.

            for (const term of terms) {

                const result =
                    await this.searchByName(term);

                if (result && result.meals) {

                    allMeals.push(...result.meals);
                }
            }


            // Remove duplicate recipes

            const uniqueMeals =
                Array.from(
                    new Map(
                        allMeals.map(
                            meal => [meal.idMeal, meal]
                        )
                    ).values()
                );


            // Area names returned by the API can differ
            // slightly from dropdown names.

            const areaMap = {

                indian: [
                    'india',
                    'indian'
                ],

                american: [
                    'america',
                    'american',
                    'united states'
                ],

                british: [
                    'british',
                    'united kingdom'
                ],

                italian: [
                    'italy',
                    'italian'
                ],

                chinese: [
                    'china',
                    'chinese'
                ],

                mexican: [
                    'mexico',
                    'mexican'
                ],

                french: [
                    'france',
                    'french'
                ],

                japanese: [
                    'japan',
                    'japanese'
                ],

                greek: [
                    'greece',
                    'greek'
                ],

                thai: [
                    'thailand',
                    'thai'
                ]

            };


            const validAreas =
                areaMap[selected] || [selected];


            const filtered =
                uniqueMeals.filter(meal => {

                    const area =
                        (meal.strArea || '')
                            .trim()
                            .toLowerCase();

                    return validAreas.includes(area);
                });


            return {
                meals: filtered
            };


        } catch (error) {

            console.error(
                'Cuisine search error:',
                error
            );

            return {
                meals: []
            };
        }
    },


    // ==========================================
    // INGREDIENT FILTER
    // ==========================================

    async filterByIngredient(ingredient) {

        const cleanIngredient =
            (ingredient || '').trim();

        if (!cleanIngredient) {
            return { meals: [] };
        }

        return this.fetchWithCache(
            `${MEALDB_API_URL}/filter.php?i=${encodeURIComponent(cleanIngredient)}`,
            `filter_i_${cleanIngredient}`
        );
    }
};


// ==========================================
// SEARCH HISTORY
// ==========================================

const historyUtil = {

    get() {

        try {

            return JSON.parse(
                localStorage.getItem('searchHistory')
            ) || [];

        } catch (error) {

            return [];
        }
    },


    add(term) {

        if (!term || !term.trim()) {
            return;
        }

        term = term.trim();

        let history = this.get();

        history =
            history.filter(
                h =>
                    h.toLowerCase() !==
                    term.toLowerCase()
            );

        history.unshift(term);

        if (history.length > 5) {
            history.pop();
        }

        localStorage.setItem(
            'searchHistory',
            JSON.stringify(history)
        );
    },


    clear() {

        localStorage.removeItem(
            'searchHistory'
        );
    }
};


// ==========================================
// RECENT RECIPES
// ==========================================

const recentUtil = {

    get() {

        try {

            return JSON.parse(
                sessionStorage.getItem('recentRecipes')
            ) || [];

        } catch (error) {

            return [];
        }
    },


    add(meal) {

        if (!meal) {
            return;
        }

        let recent = this.get();

        recent =
            recent.filter(
                m => m.idMeal !== meal.idMeal
            );

        recent.unshift({

            idMeal: meal.idMeal,

            strMeal: meal.strMeal,

            strMealThumb: meal.strMealThumb

        });

        if (recent.length > 4) {
            recent.pop();
        }

        sessionStorage.setItem(
            'recentRecipes',
            JSON.stringify(recent)
        );
    }
};