const searchBox = document.querySelector(".search-input")
const grid = document.querySelector(".movie-grid")
API_KEY = "38206dc3"

let wait;

searchBox.addEventListener('input', (e) => {
    clearTimeout(wait)
    let value = e.target.value

    wait = setTimeout(() => {
        if (value) {
            api(value)
            grid.innerHTML = ""
        }
    }, 900)
})

function api(movie) {
    fetch(`https://omdbapi.com/?s=${movie}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => { render(res, movie) })
}

function render(data, value) {
    const movieList = data.Search?.map((movie) => (
        `<div class="movie ${movie.Title}" >
        <a href="movie.html" target="_blank" rel="noopener noreferrer">
                <div class="movie-card">
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

            </a>
            </div>`
    )).join("")
    if (movieList) {
        grid.innerHTML = movieList
    } else {
        grid.innerHTML = `<div class="not-found">${value} not exist</div>`
    }

    searchBox.value = ""
}

grid.addEventListener("click", (e) => {
    console.log(e.target.closest('div'))
})