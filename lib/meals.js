import fs from 'node:fs'; // this allows us to work with the file system
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: 'us-east-2'
});

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

    const bufferedImage = await meal.image.arrayBuffer(); // await because of Promise
                                                        
   s3.putObject({
    Bucket: 'mirvikh-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });
 
    meal.image = fileName;


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