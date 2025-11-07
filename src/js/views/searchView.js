class SearchView {
  #parentElement = document.querySelector('.search');

  getQuery() {
    return this.#parentElement.querySelector('.search__field').value;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', (event) => {
      // Prevent form submission from reloading the page
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
