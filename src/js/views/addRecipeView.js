import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    parentEl = document.querySelector('.upload');
    recipeWindow = document.querySelector('.add-recipe-window');
    overlay = document.querySelector('.overlay');
    btnOpen = document.querySelector('.nav__btn--add-recipe');
    btnClose = document.querySelector('.btn--close-modal');
    message = 'The recipe was added successfully!';
    constructor() {
        super();
        this.addHandlerShowWindow();
        this.addHandlerHideWindow();
    }
    toggleHidden() {
        this.recipeWindow.classList.toggle('hidden');
        this.overlay.classList.toggle('hidden');
    }
    addHandlerShowWindow() {
        this.btnOpen.addEventListener('click', this.toggleHidden.bind(this));
    }

    addHandlerHideWindow() {
        this.btnClose.addEventListener('click', this.toggleHidden.bind(this));
        this.overlay.addEventListener('click', this.toggleHidden.bind(this));
    }

    addHandlerUpload(handler) {
        this.parentEl.addEventListener('submit', function(event) {
            event.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    generateMarkup() {}
}

export default new AddRecipeView();