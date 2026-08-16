const searchBox = document.querySelector(".search-input")
const movieList = document.querySelector(".movie-grid")

searchBox.addEventListener('change', (e) => {
    console.log(e.target.value)
})

function api() {
    fetch(``)
        .then((res) => res.json())
        .then((res) => { render(res) })
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