import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

// Establish db connection (passing meals.db - db name)
const db = sql('meals.db');

export async function getMeals(){
    await new Promise((resolve) => setTimeout(resolve, 2000)); //for learning and testing purposes 
    //throw new Error('Loading meals failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export function saveMeal(meal) {
    meal.slug = slugify(meal.title, {lower: true}); // to force all chars to lowercase

    // remove any harmfulcontent from instructions
    meal.instructions = xss(meal.instructions);
}