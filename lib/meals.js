import sql from 'better-sqlite3';

// Establish db connection (passing meals.db - db name)
const db = sql('meals.db');

export async function getMeals(){
    await new Promise((resolve) => setTimeout(resolve, 2000)); //for learning and testing purposes 
    return db.prepare('SELECT * FROM meals').all();
}