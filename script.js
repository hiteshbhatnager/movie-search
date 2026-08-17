
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
        .then((res) => { console.log(res.Search) })
}

function render() {
    movieList.innerHtml = [].map((movie) => {
        `<a href="movie.html" target="_blank" rel="noopener noreferrer">
                    <div class="movie-card">
                        <img src="${movie.poster}"
                            alt="${movie.name}">

                        <div class="movie-info">
                            <h3 class="movie-title">${movie.name}</h3>

                            <div class="movie-meta">
                                <span>${movie.year}</span>
                                <span>⭐ ${movie.imbd}</span>
                            </div>

                            <p class="movie-genre">
                                ${movie.genre}
                            </p>
                        </div>
                    </div>

                </a>`.join("")
    })
}