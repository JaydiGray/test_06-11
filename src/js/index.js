import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './api-service';
import LoadMoreBtn from './load-more-btn';
import LoadMoreBtn from './load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};
let gallery;
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const apsService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  apsService.query = e.currentTarget.elements.searchQuery.value;
  apsService.resetPage();
  clearGalleryContainer();

  apsService
    .searchPerRequest()
    .then(data => {
      if (!data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      loadMoreBtn.show();
      refs.searchForm.elements.searchQuery.value = '';
      console.log(refs.searchForm.elements.searchQuery.value);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images!`);
      createTemplate(data.hits);

      gallery = new SimpleLightbox('.gallery a');
      gallery.on('show.simplelightbox', function () {});
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error(error);
    });
}

function onLoadMore() {
  loadMoreBtn.disable();

  apsService
    .searchPerRequest()
    .then(data => {
      if ((apsService.page - 2) * 40 >= data.total) {
        loadMoreBtn.hide();
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }

      if (!data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      loadMoreBtn.enable();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images!`);
      createTemplate(data.hits);

      gallery.refresh();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error(error);
    });
}

function createTemplate(articles) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    articles
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<a href="${largeImageURL}" class="link"><div class='photo-card'>
    <img src='${webformatURL}' alt='${tags}' loading='lazy' height='260' />
    <div class='info'>
      <p class='info-item'>
        <b>Likes:</b>
        <span>${likes}</span>
      </p>
      <p class='info-item'>
        <b>Views:</b>
        <span>${views}</span>
      </p>
      <p class='info-item'>
        <b>Comments:</b>
        <span>${comments}</span>
      </p>
      <p class='info-item'>
        <b>Downloads:</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div></a>`
      )
      .join('')
  );
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}
