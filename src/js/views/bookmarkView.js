import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
    parentEl = document.querySelector('.bookmarks__list');
    errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
    generateMarkup() {
        return this.data
            .map(bookmark => previewView.render(bookmark, false))
            .join('');
    }
}

export default new BookmarkView();