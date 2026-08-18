const searchBox = document.querySelector(".search-input")
const grid = document.querySelector(".movie-grid")
const home = document.querySelector(".home-link")
const searchBtn = document.querySelector("#searchBtn")
const API_KEY = "38206dc3"

let wait;

searchBox.addEventListener('input', (e) => {
    clearTimeout(wait)
    let value = e.target.value

    wait = setTimeout(() => {
        if (!value.trim()) {
            grid.innerHTML = ""
            return
        }
        api(value)
        grid.innerHTML = `<div class="loading">Searching movies...</div>`;
    }, 600)
})

function api(movie) {
    fetch(`https://omdbapi.com/?s=${encodeURIComponent(movie)}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.Response === "False") {
                grid.innerHTML = `<div class="not-found">${res.Error}</div>`;
                return;
            } else {
                const movieList = res.Search?.map((movie) => (
                    `
                    <div class="movie-card" data-id="${movie.imdbID}" >
                        <img src="${movie.Poster}"
                            alt="${movie.Title}">
    
                        <div class="movie-info">
                            <h3 class="movie-title">${movie.Title}</h3>
    
                            <div class="movie-meta">
                                <span>${movie.Year}</span>
                                <span>⭐ ${movie.imdbID}</span>
                            </div>
    
                            <p class="movie-genre">
                                ${movie.Type}
                            </p>
                        </div>
                    </div>
                `
                )).join("")
                if (movieList) {
                    grid.innerHTML = movieList
                } else {
                    grid.innerHTML = `<div class="not-found">${movie} not exist</div>`
                }
            }

            searchBox.value = ""
        })
}

home.addEventListener('click', () => {
    grid.innerHTML = ""
    searchBox.focus()
})

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchBox.focus();
});

grid.addEventListener("click", (e) => {
    let element = e.target.closest('.movie-card')
    if (!element) return;
    renderMovie(element)
})

function renderMovie(element) {
    fetch(`https://omdbapi.com/?i=${element.dataset.id}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            const detial = `<main class="movie-details">
        <section class="movie-container" id="movieContainer">
            <div class="movie-poster">
                <img id="${data.Poster}" src="${data.Poster}" alt="${data.Poster}">
            </div>
            <div class="movie-content">
                <h1 id="movieTitle">
                    ${data.Title}
                </h1>
                <div class="movie-meta">
                    <span id="movieYear">
                        ${data.Year}
                    </span>
                    <span id="movieRating">
                        ⭐ ${data.imdbRating}
                    </span>
                    <span id="movieRuntime">
                        ${data.Runtime}
                    </span>
                </div>
                <p class="movie-genre" id="movieGenre">
                    ${data.Genre}
                </p>
                <p class="movie-plot" id="moviePlot">
                    ${data.Plot}
                </p>
                <div class="movie-info-list">
                    <p>
                        <strong>Director:${data.Director}</strong>
                        <span id="movieDirector">-</span>
                    </p>
                    <p>
                        <strong>Actors:${data.Actors}</strong>
                        <span id="movieActors">-</span>
                    </p>
                    <p>
                        <strong>Language:${data.Language}</strong>
                        <span id="movieLanguage">-</span>
                    </p>
                    <p>
                        <strong>Country:${data.Country}</strong>
                        <span id="movieCountry">-</span>
                    </p>
                </div>
            </div>
        </section>`

            grid.innerHTML = detial
        })
}