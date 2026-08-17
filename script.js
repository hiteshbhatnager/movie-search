
const searchBox = document.querySelector(".search-input")
const movieList = document.querySelector(".movie-grid")
API_KEY = "38206dc3"

let wait;

searchBox.addEventListener('input', (e) => {
    clearTimeout(wait)
    let value = e.target.value

    wait = setTimeout(() => {
        if (value) {
            api(value)
        }
    }, 900)
})

function api(movie) {
    fetch(`https://omdbapi.com/?s=${movie}&apikey=${API_KEY}`)
        .then((res) => res.json())
        .then((res) => { render(res.Search) })
}

function render(data) {
    movieList.innerHtml = data.map((movie) => {
        `<a href="movie.html" target="_blank" rel="noopener noreferrer">
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

                </a>`.join("")
    })
}