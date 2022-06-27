import icons from 'url:../../img/icons.svg';
export default class View {
    data;
    render(result, render = true) {
        if (!result || (Array.isArray(result) && result.length === 0))
            return this.renderError();

        this.data = result;
        const markup = this.generateMarkup();
        if (!render) return markup;
        this.clear();
        this.parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this.data = data;
        const newMarkup = this.generateMarkup();
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this.parentEl.querySelectorAll('*'));

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // update text
            if (!newEl.isEqualNode(curEl) &&
                newEl.firstChild ? .nodeValue.trim() !== ''
            ) {
                curEl.textContent = newEl.textContent;
            }
            // update attributes
            if (!newEl.isEqualNode(curEl))
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
        });
    }

    renderLoadingSpinner = function() {
        const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
        this.clear;
        this.parentEl.insertAdjacentHTML('afterbegin', markup);
    };

    clear() {
        this.parentEl.innerHTML = '';
    }

    renderError(message = this.errorMessage) {
        const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
        this.clear();
        this.parentEl.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this.message) {
        const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
        this.clear();
        this.parentEl.insertAdjacentHTML('afterbegin', markup);
    }
}