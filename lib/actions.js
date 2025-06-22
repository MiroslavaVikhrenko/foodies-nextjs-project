'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from "./meals";
import { revalidatePath } from 'next/cache';

function isInvalidText(text){
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {  
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
      creator_email: formData.get('email')
    };

    if (
      isInvalidText(meal.title) ||
      isInvalidText(meal.summary) ||
      isInvalidText(meal.instructions) ||
      isInvalidText(meal.creator) ||
      isInvalidText(meal.creator_email) ||
      !meal.creator_email.includes('@') ||
      !meal.image || 
      meal.image.size === 0 // size 0 - invalid file
    ) {
        return {
          message: 'Invalid input'
        };
    }

    await saveMeal(meal);

    revalidatePath('/meals'); // trigger cache re-validation, 'layout' for 2nd parameter would also include nested pages revalidation

    // redirect to a new meal after form submission
    redirect('/meals');
  }