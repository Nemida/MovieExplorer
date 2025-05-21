const API_URL = 'https://ghibliapi.vercel.app/films';

const movieList = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');

async function fetchFilms() {
  try {
    const res = await fetch(API_URL);
    const films = await res.json();
    return films;
  } catch (e) {
    console.error("Error fetching films", e);
    return [];
  }
}

function createMovieCard(film) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <div class="movie-title">${film.title}</div>
    <div class="movie-subtitle">${film.release_date} — Directed by ${film.director}</div>
    <p class="movie-description">${film.description.substring(0, 140)}...</p>
    <button class="fav-btn" data-id="${film.id}">Add to Favorites</button>
  `;

  card.querySelector('.movie-title').addEventListener('click', () => {
    window.location.href = `details.html?id=${film.id}`;
  });

  card.querySelector('.fav-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(film.id, e.target);
  });

  updateFavButton(film.id, card.querySelector('.fav-btn'));

  return card;
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

function toggleFavorite(id, btn) {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavButton(id, btn);
}

function updateFavButton(id, btn) {
  const favorites = getFavorites();
  if (favorites.includes(id)) {
    btn.textContent = 'Remove Favorite';
    btn.style.backgroundColor = '#b0070f';
  } else {
    btn.textContent = 'Add to Favorites';
    btn.style.backgroundColor = '#e50914';
  }
}

async function renderFilms() {
  const films = await fetchFilms();
  const searchTerm = searchInput.value.toLowerCase();

  movieList.innerHTML = '';

  const filtered = films.filter(film =>
    film.title.toLowerCase().includes(searchTerm)
  );

  if (!filtered.length) {
    movieList.innerHTML = '<p>No movies found.</p>';
    return;
  }

  filtered.forEach(film => {
    const card = createMovieCard(film);
    movieList.appendChild(card);
  });
}

searchInput.addEventListener('input', renderFilms);

renderFilms();
