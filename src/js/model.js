import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function(data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        // let { recipe } = data.data;
        state.recipe = createRecipeObject(data);
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
    } catch (err) {
        throw err;
    }
};

export const loadSearchResult = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            };
        });
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
};

export const getSearchResultPage = function(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPage;
    const end = page * state.search.resultsPage;

    return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(
        ing => (ing.quantity *= newServings / state.recipe.servings)
    );
    state.recipe.servings = newServings;
};

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe) {
    // add a bookmark
    state.bookmarks.push(recipe);

    // mark current page as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3)
                    throw new Error(
                        'Wrong ingredients format! Please use the correct Format!'
                    );
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        const recipe = {
            title: newRecipe.title,
            cooking_time: +newRecipe.cookingTime,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            servings: +newRecipe.servings,
            ingredients,
        };
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
        console.log(state.recipe);
    } catch (err) {
        throw err;
    }
};