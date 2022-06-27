class SearchView {
    parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.parentEl.querySelector('.search__field').value;
        this.clear();
        return query;
    }

    clear() {
        this.parentEl.querySelector('.search__field').value = '';
    }

    addHandlerSearch(handler) {
        this.parentEl.addEventListener('submit', function(event) {
            event.preventDefault();
            handler();
        });
    }
}

export default new SearchView();