import { API_URL } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: { query: '', results: [] },
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

export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;

    const resData = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = resData.data.recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      pubblisher: recipe.pubblisher,
    }));
  } catch (err) {
    throw err;
  }
};

loadSearchResults('pizza');
