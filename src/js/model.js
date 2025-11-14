import { API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: { query: '', results: [], page: 1, resultsPerPage: RESULTS_PER_PAGE },
  bookmarks: [],
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

    // Check if the currently loaded recipe is in the bookmarks array
    // If it is, mark the recipe as bookmarked for UI rendering;
    // otherwise, ensure the isBookmarked flag is false
    if (state.bookmarks.some((bookmark) => bookmark.id === recipeId)) {
      state.recipe.isBookmarked = true;
    } else {
      state.recipe.isBookmarked = false;
    }
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
      publisher: recipe.publisher,
    }));

    // Reset page number to 1 whenever a new search is performed
    // so that results always start from the first page for a new query
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ing) => {
    // newQty = oldQty * (newServings / oldServings)
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
};

// Save bookmarks array to localStorage
// This ensures bookmarks persist across page reloads and browser sessions
const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
  // Skip if this recipe is already bookmarked to prevent duplicates
  if (state.bookmarks.some((bookmark) => bookmark.id === recipe.id)) {
    return;
  }

  // Add the given recipe object to the bookmarks array
  state.bookmarks.push(recipe);

  // If the added bookmark is the currently loaded recipe,
  // set the 'isBookmarked' flag to true in the recipe state
  if (recipe.id === state.recipe.id) {
    state.recipe.isBookmarked = true;
  }

  // Persist updated bookmarks to localStorage so the new bookmark is not lost on refresh
  persistBookmarks();
};

export const removeBookmark = (id) => {
  // Remove the bookmark with the matching id from the bookmarks array
  // Using filter creates a new array excluding the one to remove
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);

  // If the removed bookmark is the currently loaded recipe,
  // update the recipe state to reflect it is no longer bookmarked
  // This ensures the UI (bookmark icon) updates correctly
  if (id === state.recipe.id) {
    state.recipe.isBookmarked = false;
  }

  // Persist updated bookmarks after removal to keep localStorage in sync with state
  persistBookmarks();
};
