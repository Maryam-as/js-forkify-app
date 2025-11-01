// Polyfilling modern JavaScript features (e.g., promises, array methods, etc.)
import 'core-js/stable';
// Polyfilling async/await and generator functions for older browsers
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Utility function to handle timeout for API calls
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

///////////////////////////////////////

// Fetch and display a recipe
const controlRecipes = async () => {
  try {
    // Get the recipe ID from the URL hash (#)
    const recipeId = window.location.hash.slice(1);

    // Guard clause
    if (!recipeId) {
      return;
    }

    // Render loading spinner before fetching data
    recipeView.renderSpinner();

    //Load recipe data from the API
    await model.loadRecipe(recipeId);

    // Generate markup and render recipe in UI
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

///////////////////////////////////////

// Listen for URL hash changes (e.g., when the user selects a different recipe)
// and for initial page load — both should trigger rendering the correct recipe
['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipes)
);
