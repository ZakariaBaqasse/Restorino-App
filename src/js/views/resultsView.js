import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
    parentEl = document.querySelector('.results');
    errorMessage = 'No results found for your search. Please try again!';
    generateMarkup() {
        return this.data
            .map(bookmark => previewView.render(bookmark, false))
            .join('');
    }
}

export default new ResultsView();