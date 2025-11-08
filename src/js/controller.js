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

    //Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

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

const controlServings = (newServings) => {
  // Update recipe servings in the state
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // Add the current recipe to bookmarks in the state
  // (if it isn’t already bookmarked — handled inside the model)
  model.addBookmark(model.state.recipe);

  // Update the recipe view to reflect bookmark status
  // (this re-renders the bookmark icon as filled or outlined)
  recipeView.update(model.state.recipe);
};

// Pubblisher-subscriber pattern
const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
