import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { stable } from 'core-js/stable';

// https://forkify-api.herokuapp.com/v2

// controller to get a unique recipe from id
const controlRecipes = async function() {
    try {
        //get recipe code
        const id = window.location.hash.slice(1);
        if (!id) return;
        //loading spinner
        recipeView.renderLoadingSpinner();
        resultsView.update(model.getSearchResultPage());

        bookmarkView.update(model.state.bookmarks);

        //fetching data
        await model.loadRecipe(id);

        //rendering data
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

//get multiple recipes from a search term
const controlSearchResults = async function() {
    try {
        resultsView.renderLoadingSpinner();

        const query = searchView.getQuery();

        if (!query) return;

        await model.loadSearchResult(query);

        resultsView.render(model.getSearchResultPage());

        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};

// control the pagination
const controlPagination = function(goToPage) {
    resultsView.render(model.getSearchResultPage(goToPage));

    paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
    // update the recipe servings in state
    model.updateServings(newServings);
    //render the view of the updated recipe
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
    // add or remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else if (model.state.recipe.bookmarked)
        model.deleteBookmark(model.state.recipe.id);
    // update recipe view
    recipeView.update(model.state.recipe);
    //render bookmarks
    bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
    bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
    try {
        //render loading spinner
        addRecipeView.renderLoadingSpinner();
        //upload the new recipe
        await model.uploadRecipe(newRecipe);
        //render success message
        addRecipeView.renderMessage();
        //render uploded recipe
        recipeView.render(model.state.recipe);
        //render bookmarks
        bookmarkView.render(model.state.bookmarks);
        //change URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        //close form
        setTimeout(function() {
            addRecipeView.toggleHidden();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
        addRecipeView.renderError(err.message);
        console.log(err.message);
    }
};

const init = function() {
    bookmarkView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);

    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    recipeView.addHndlerAddBookmark(controlAddBookmark);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

///////////////////////////////////////