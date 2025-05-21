const API_URL = 'https://ghibliapi.vercel.app/films';

const favList = document.getElementById('favList');

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

async function fetchFilms() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    favList.innerHTML = '<p>Failed to load favorites.</p>';
    return [];
  }
}

function createMovieCard(film) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="movie-title">${film.title}</div>
    <div class="movie-subtitle">${film.release_date} — Directed by ${film.director}</div>
    <button class="fav-btn" data-id="${film.id}">Remove Favorite</button>
  `;

  card.querySelector('.movie-title').addEventListener('click', () => {
    window.location.href = `details.html?id=${film.id}`;
  });

  card.querySelector('.fav-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(film.id);
  });

  return card;
}

function toggleFavorite(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(favId => favId !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

async function renderFavorites() {
  const favorites = getFavorites();
  const films = await fetchFilms();

  const favFilms = films.filter(film => favorites.includes(film.id));
  favList.innerHTML = '';

  if (favFilms.length === 0) {
    favList.innerHTML = '<p>You have no favorite movies yet.</p>';
    return;
  }

  favFilms.forEach(film => {
    const card = createMovieCard(film);
    favList.appendChild(card);
  });
}

renderFavorites();
