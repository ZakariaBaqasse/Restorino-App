import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    parentEl = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this.parentEl.addEventListener('click', function(event) {
            const btn = event.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    generateMarkup() {
        const currentPage = this.data.page;
        const numPages = Math.ceil(
            this.data.results.length / this.data.resultsPage
        );
        console.log(numPages);

        //page 1 and there is more pages
        if (currentPage === 1 && numPages > 1) {
            return `
            <button data-goto = "${
              currentPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `;
        }

        //last page
        if (currentPage === numPages && numPages > 1) {
            return `
            <button data-goto = "${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
            `;
        }
        //other page
        if (currentPage < numPages) {
            return `
            <button data-goto = "${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto = "${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `;
        }
        //page 1 and there is no other pages
    }
}

export default new PaginationView();