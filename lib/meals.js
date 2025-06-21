import fs from 'node:fs'; // this allows us to work with the file system
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

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, {lower: true}); // to force all chars to lowercase

    // remove any harmfulcontent from instructions
    meal.instructions = xss(meal.instructions);

    // get extension of the uploaded image (jpeg or png)
    const extension = meal.image.name.split('.').pop(); // pop the last element which will be the file extension

    // generate unique file name
    const fileName = `${meal.slug}.${extension}`


    // write that file to public/images folder (fs from node)
    const stream = fs.createWriteStream(`public/images/${fileName}`)
    // "chunk" for write() => we should convert the image to a so-called buffer
    const bufferedImage = await meal.image.arrayBuffer(); // await because of Promise
                                                        // this is array buffer, but write() needs a regular buffer => Buffer.from()
    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('Saving image failed!');
        }
    }); // 2nd argument - a func that will be executed once it's done writing


    // override the image with path to the image
    meal.image = `/images/${fileName}` // remove 'public' because all requests for images will be sent automatically to the public folder


    // save ready object to db
    db.prepare(`
        INSERT INTO meals
            (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
    `).run(meal);

}