import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';
import recipeView from './views/recipeView';

export const state = {
  recipe: {},
};

export const loadRecipe = async (recipeId) => {
  try {
    // Fetch recipe data from the API
    const url = `${API_URL}/${recipeId}`;
    const resData = await getJSON(url);

    // Format the recipe data to a simpler object
    const { recipe } = resData.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
};
