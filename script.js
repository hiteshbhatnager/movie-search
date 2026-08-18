

const searchBox = document.querySelector(".search-input");
const grid = document.querySelector(".movie-grid");
const home = document.querySelector(".home-link");
const searchBtn = document.querySelector("#searchBtn");



const API_KEY = "38206dc3";
const API_URL = "https://www.omdbapi.com/";



let wait;
let currentSearch = "";




searchBox.addEventListener("input", (e) => {

    clearTimeout(wait);

    const value = e.target.value.trim();

    wait = setTimeout(() => {

        if (!value) {
            grid.innerHTML = "";
            return;
        }

        currentSearch = value;

        searchMovies(value);

    }, 500);
});



searchBtn.addEventListener("click", (e) => {

    e.preventDefault();

    const value = searchBox.value.trim();

    if (!value) {
        searchBox.focus();
        return;
    }

    clearTimeout(wait);

    currentSearch = value;

    searchMovies(value);
});



searchBox.addEventListener("keydown", (e) => {

    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = searchBox.value.trim();

    if (!value) return;

    clearTimeout(wait);

    currentSearch = value;

    searchMovies(value);
});




async function searchMovies(movie) {

    grid.innerHTML = `
        <div class="loading">
            Searching for "${movie}"...
        </div>
    `;

    try {

        const response = await fetch(
            `${API_URL}?s=${encodeURIComponent(movie)}&apikey=${API_KEY}`
        );

        const data = await response.json();


        // API ERROR

        if (data.Response === "False") {

            grid.innerHTML = `
                <div class="not-found">
                    <h2>No movies found</h2>
                    <p>${data.Error || "Try another movie name."}</p>
                </div>
            `;

            return;
        }


        // RESULTS

        const movieList = data.Search
            ?.map((movie) => {

                const poster =
                    movie.Poster !== "N/A"
                        ? movie.Poster
                        : "./images/no-poster.jpg";


                return `
                    <div
                        class="movie-card"
                        data-id="${movie.imdbID}"
                    >

                        <img
                            src="${poster}"
                            alt="${movie.Title}"
                            loading="lazy"
                            onerror="this.src='./images/no-poster.jpg'"
                        >

                        <div class="movie-info">

                            <h3 class="movie-title">
                                ${movie.Title}
                            </h3>

                            <div class="movie-meta">

                                <span>
                                    ${movie.Year}
                                </span>

                                <span>
                                    ${movie.Type}
                                </span>

                            </div>

                            <p class="movie-genre">
                                ${movie.Type}
                            </p>

                        </div>

                    </div>
                `;

            })
            .join("");


        if (!movieList) {

            grid.innerHTML = `
                <div class="not-found">
                    <h2>No movies found</h2>
                    <p>Try searching for another movie.</p>
                </div>
            `;

            return;
        }


        grid.innerHTML = movieList;

    } catch (error) {

        console.error("Search error:", error);

        grid.innerHTML = `
            <div class="not-found">
                <h2>Something went wrong</h2>
                <p>Please check your internet connection and try again.</p>
            </div>
        `;
    }
}



home.addEventListener("click", (e) => {

    e.preventDefault();

    clearTimeout(wait);

    currentSearch = "";

    searchBox.value = "";

    grid.innerHTML = "";

    searchBox.focus();
});


grid.addEventListener("click", (e) => {

    const movieCard = e.target.closest(".movie-card");

    if (!movieCard) return;

    const imdbID = movieCard.dataset.id;

    if (!imdbID) return;

    renderMovie(imdbID);
});



async function renderMovie(imdbID) {

    grid.innerHTML = `
        <div class="loading">
            Loading movie details...
        </div>
    `;


    try {

        const response = await fetch(
            `${API_URL}?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`
        );

        const data = await response.json();



        if (data.Response === "False") {

            grid.innerHTML = `
                <div class="not-found">

                    <h2>Movie not found</h2>

                    <p>
                        ${data.Error || "Unable to load movie."}
                    </p>

                </div>
            `;

            return;
        }


        const poster =
            data.Poster && data.Poster !== "N/A"
                ? data.Poster
                : "./images/no-poster.jpg";


        const genres =
            data.Genre && data.Genre !== "N/A"
                ? data.Genre
                    .split(",")
                    .map(
                        (genre) =>
                            `<span>${genre.trim()}</span>`
                    )
                    .join("")
                : `<span>Unknown</span>`;

        const actors =
            data.Actors && data.Actors !== "N/A"
                ? data.Actors
                    .split(",")
                    .map(
                        (actor) =>
                            `<span>${actor.trim()}</span>`
                    )
                    .join("")
                : `<span>N/A</span>`;


        const rating =
            data.imdbRating !== "N/A"
                ? data.imdbRating
                : "N/A";

        const votes =
            data.imdbVotes !== "N/A"
                ? data.imdbVotes
                : "N/A";

        const metascore =
            data.Metascore !== "N/A"
                ? data.Metascore
                : "N/A";



        grid.innerHTML = `

            <main class="movie-details">

                <!-- =========================
                     BACKGROUND
                ========================== -->

                <div class="movie-backdrop">

                    <img
                        src="${poster}"
                        alt=""
                        aria-hidden="true"
                    >

                </div>


                <div class="movie-overlay"></div>


                <!-- =========================
                     CONTENT WRAPPER
                ========================== -->

                <div class="movie-detail-wrapper">


                    <!-- =========================
                         BACK BUTTON
                    ========================== -->

                    <button
                        class="back-btn"
                        id="backBtn"
                        type="button"
                    >

                        ← Back to Movies

                    </button>


                    <!-- =========================
                         HERO
                    ========================== -->

                    <section class="movie-container">


                        <!-- POSTER -->

                        <div class="movie-poster">

                            <img
                                src="${poster}"
                                alt="Poster of ${data.Title}"
                                loading="eager"
                                onerror="this.src='./images/no-poster.jpg'"
                            >

                        </div>


                        <!-- CONTENT -->

                        <div class="movie-content">


                            <!-- TYPE -->

                            <span class="movie-type">

                                ${data.Type || "Movie"}

                            </span>


                            <!-- TITLE -->

                            <h1 class="movie-title">

                                ${data.Title || "Unknown Title"}

                            </h1>


                            <!-- META -->

                            <div class="movie-meta">

                                <span>
                                    ${data.Year || "N/A"}
                                </span>

                                <span>
                                    ⭐ ${rating}
                                </span>

                                <span>
                                    ${data.Runtime || "N/A"}
                                </span>

                                <span>
                                    ${data.Rated || "N/A"}
                                </span>

                            </div>


                            <!-- GENRES -->

                            <div class="genres">

                                ${genres}

                            </div>


                            <!-- OVERVIEW -->

                            <div class="movie-overview">

                                <h2>
                                    Overview
                                </h2>

                                <p>
                                    ${data.Plot &&
                data.Plot !== "N/A"
                ? data.Plot
                : "No plot information available."
            }
                                </p>

                            </div>


                            <!-- ACTIONS -->

                            <div class="movie-actions">


                                <button
                                    class="watch-btn"
                                    id="watchTrailerBtn"
                                    type="button"
                                >

                                    ▶ Watch Trailer

                                </button>


                                <button
                                    class="favorite-btn"
                                    id="favoriteBtn"
                                    type="button"
                                >

                                    ♡ Add to Watchlist

                                </button>


                            </div>


                        </div>

                    </section>


                    <!-- =========================
                         RATINGS
                    ========================== -->

                    <section class="rating-section">


                        <!-- IMDb -->

                        <div class="rating-card">

                            <div class="rating-icon">
                                ⭐
                            </div>

                            <div>

                                <strong>
                                    ${rating}
                                </strong>

                                <span>
                                    IMDb Rating
                                </span>

                            </div>

                        </div>


                        <!-- Votes -->

                        <div class="rating-card">

                            <div class="rating-icon">
                                👥
                            </div>

                            <div>

                                <strong>
                                    ${votes}
                                </strong>

                                <span>
                                    IMDb Votes
                                </span>

                            </div>

                        </div>


                        <!-- Metascore -->

                        <div class="rating-card">

                            <div class="rating-icon">
                                🎬
                            </div>

                            <div>

                                <strong>
                                    ${metascore}
                                </strong>

                                <span>
                                    Metascore
                                </span>

                            </div>

                        </div>


                    </section>


                    <!-- =========================
                         CAST & CREW
                    ========================== -->

                    <section class="cast-crew">


                        <!-- DIRECTOR -->

                        <div class="crew-section">

                            <h2>
                                Director
                            </h2>

                            <p>
                                ${data.Director || "N/A"}
                            </p>

                        </div>


                        <!-- WRITER -->

                        <div class="crew-section">

                            <h2>
                                Writer
                            </h2>

                            <p>
                                ${data.Writer || "N/A"}
                            </p>

                        </div>


                        <!-- CAST -->

                        <div class="crew-section">

                            <h2>
                                Cast
                            </h2>

                            <div class="cast">

                                ${actors}

                            </div>

                        </div>


                    </section>


                    <!-- =========================
                         MOVIE INFORMATION
                    ========================== -->

                    <section class="movie-information">


                        <h2>
                            Movie Information
                        </h2>


                        <div class="details-grid">


                            <!-- RELEASED -->

                            <div class="detail-item">

                                <span>
                                    Released
                                </span>

                                <strong>
                                    ${data.Released || "N/A"}
                                </strong>

                            </div>


                            <!-- RUNTIME -->

                            <div class="detail-item">

                                <span>
                                    Runtime
                                </span>

                                <strong>
                                    ${data.Runtime || "N/A"}
                                </strong>

                            </div>


                            <!-- LANGUAGE -->

                            <div class="detail-item">

                                <span>
                                    Language
                                </span>

                                <strong>
                                    ${data.Language || "N/A"}
                                </strong>

                            </div>


                            <!-- COUNTRY -->

                            <div class="detail-item">

                                <span>
                                    Country
                                </span>

                                <strong>
                                    ${data.Country || "N/A"}
                                </strong>

                            </div>


                            <!-- RATED -->

                            <div class="detail-item">

                                <span>
                                    Rated
                                </span>

                                <strong>
                                    ${data.Rated || "N/A"}
                                </strong>

                            </div>


                            <!-- BOX OFFICE -->

                            <div class="detail-item">

                                <span>
                                    Box Office
                                </span>

                                <strong>
                                    ${data.BoxOffice || "N/A"}
                                </strong>

                            </div>


                            <!-- AWARDS -->

                            <div class="detail-item">

                                <span>
                                    Awards
                                </span>

                                <strong>
                                    ${data.Awards || "N/A"}
                                </strong>

                            </div>


                            <!-- PRODUCTION -->

                            <div class="detail-item">

                                <span>
                                    Production
                                </span>

                                <strong>
                                    ${data.Production || "N/A"}
                                </strong>

                            </div>


                        </div>

                    </section>


                </div>

            </main>

        `;



        const backBtn =
            document.querySelector("#backBtn");

        backBtn.addEventListener("click", () => {

            if (currentSearch) {

                searchMovies(currentSearch);

            } else {

                grid.innerHTML = "";

                searchBox.focus();

            }

        });


        setupWatchlist(data);

        const trailerBtn =
            document.querySelector("#watchTrailerBtn");

        trailerBtn.addEventListener("click", () => {

            const searchQuery =
                encodeURIComponent(
                    `${data.Title} ${data.Year} trailer`
                );

            window.open(
                `https://www.youtube.com/results?search_query=${searchQuery}`,
                "_blank"
            );

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Movie details error:",
            error
        );

        grid.innerHTML = `

            <div class="not-found">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    Unable to load movie details.
                    Please try again.
                </p>

            </div>

        `;

    }
}


// =====================================================
// WATCHLIST
// =====================================================

function setupWatchlist(movie) {

    const favoriteBtn =
        document.querySelector("#favoriteBtn");

    if (!favoriteBtn) return;


    let watchlist =
        JSON.parse(
            localStorage.getItem("movieWatchlist")
        ) || [];


    const alreadyAdded =
        watchlist.some(
            (item) =>
                item.imdbID === movie.imdbID
        );


    updateWatchlistButton(
        favoriteBtn,
        alreadyAdded
    );


    favoriteBtn.addEventListener(
        "click",
        () => {

            let currentList =
                JSON.parse(
                    localStorage.getItem(
                        "movieWatchlist"
                    )
                ) || [];


            const index =
                currentList.findIndex(
                    (item) =>
                        item.imdbID === movie.imdbID
                );


            // REMOVE

            if (index !== -1) {

                currentList.splice(index, 1);

                localStorage.setItem(
                    "movieWatchlist",
                    JSON.stringify(currentList)
                );

                updateWatchlistButton(
                    favoriteBtn,
                    false
                );

                return;
            }


            // ADD

            currentList.push({

                imdbID: movie.imdbID,

                Title: movie.Title,

                Year: movie.Year,

                Poster: movie.Poster

            });


            localStorage.setItem(
                "movieWatchlist",
                JSON.stringify(currentList)
            );


            updateWatchlistButton(
                favoriteBtn,
                true
            );

        }
    );
}

// WATCHLIST BUTTON UI

function updateWatchlistButton(
    button,
    added
) {

    if (added) {

        button.textContent =
            "♥ Added to Watchlist";

        button.classList.add(
            "added"
        );

    } else {

        button.textContent =
            "♡ Add to Watchlist";

        button.classList.remove(
            "added"
        );

    }
}