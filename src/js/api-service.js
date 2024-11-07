export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  searchPerRequest() {
    const API_KEY = '46928104-60edbd0ee49e3ce36068a60a9';
    const BASE_URL = 'https://pixabay.com/api/';

    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    )
      .then(res => res.json())
      .then(data => {
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
