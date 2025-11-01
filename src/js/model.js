import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
};

export const loadRecipe = async (recipeId) => {
  try {
    // Fetch recipe data from the API
    const response = await fetch(
      `https://forkify-api.jonas.io/api/v2/recipes/${recipeId}`
    );

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData.message} (${response.status})`);
    }

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
    alert(err);
  }
};
