const movieList = document.getElementById("movieList");
const searchInput = document.getElementById("searchInput");
let films = [];

async function fetchFilms() {
  const res = await fetch("https://ghibliapi.vercel.app/films");
  films = await res.json();
  renderFilms();
}

function renderFilms() {
  const searchTerm = searchInput.value.toLowerCase();
  movieList.innerHTML = "";

  films
    .filter(film => film.title.toLowerCase().includes(searchTerm))
    .forEach(film => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <h3>${film.title} (${film.release_date})</h3>
        <p><strong>Director:</strong> ${film.director}</p>
        <p>${film.description.substring(0, 150)}...</p>
      `;
      movieList.appendChild(card);
    });
}

searchInput.addEventListener("input", renderFilms);
fetchFilms();
