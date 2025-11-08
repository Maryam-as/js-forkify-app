import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  _message = '';

  _generateMarkup() {
    return this._data
      .map((bookmark) => this._generateMarkupPreview(bookmark))
      .join('');
  }

  _generateMarkupPreview(bookmark) {
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${
          bookmark.id === id ? 'preview__link--active' : ''
        }" href="#${bookmark.id}">
          <figure class="preview__fig">
            <img src="${bookmark.image}" alt="${bookmark.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${bookmark.title}</h4>
            <p class="preview__publisher">${bookmark.publisher}</p>
          </div>
        </a>
      </li>   
    `;
  }
}

export default new BookmarksView();
