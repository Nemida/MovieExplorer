const API_URL = 'https://ghibliapi.vercel.app/films';

const movieDetails = document.getElementById('movieDetails');

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
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

async function fetchFilmById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Film not found');
    return await res.json();
  } catch (e) {
    movieDetails.innerHTML = `<p>Failed to load movie details.</p>`;
    return null;
  }
}

async function renderFilm() {
  const id = getQueryParam('id');
  if (!id) {
    movieDetails.innerHTML = '<p>No movie selected.</p>';
    return;
  }

  const film = await fetchFilmById(id);
  if (!film) return;

  movieDetails.innerHTML = `
    <h2>${film.title} (${film.release_date})</h2>
    <p><strong>Director:</strong> ${film.director}</p>
    <p><strong>Producer:</strong> ${film.producer}</p>
    <p>${film.description}</p>
    <button id="favBtn">Add to Favorites</button>
  `;

  const favBtn = document.getElementById('favBtn');
  updateFavButton(film.id, favBtn);

  favBtn.addEventListener('click', () => {
    toggleFavorite(film.id, favBtn);
  });
}

renderFilm();
