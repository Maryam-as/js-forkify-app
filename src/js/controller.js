// Polyfilling modern JavaScript features (e.g., promises, array methods, etc.)
import 'core-js/stable';
// Polyfilling async/await and generator functions for older browsers
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// Enable Hot Module Replacement (HMR) during development.
// This allows modules to be updated without a full page reload.
if (module.hot) {
  module.hot.accept();
}

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
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    // Guard clause
    if (!query) {
      return;
    }

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const controlPagination = (targetPage) => {
  resultsView.render(model.getSearchResultsPage(targetPage));
  paginationView.render(model.state.search);
};

// Pubblisher-subscriber pattern
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
