// Essential Data
const APIKEY = "f531333d637d0c44abc85b3e74db2186";
let movies = [];
// Selectors
const prevBtn = document.getElementById("prev-button");
prevBtn.disabled = true;
const nextBtn = document.getElementById("next-button");
const currPage = document.getElementById("currPage");
const tPage = document.getElementById("totalPage");
const form= document.getElementById('formSubmit');
const moviesList = document.getElementById("movies-list");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const sortByDateBtn = document.getElementById("sort-by-date");
const sortByRating = document.getElementById("sort-by-rating");
const allTab = document.getElementById("all-tab");
const favTab = document.getElementById("favorits-tab");
const pagination = document.getElementById('pagination');
let currentPage = 1,
  totalPages = 1;

function getFavMoviesFromLocalStorage() {
  const favMovies = JSON.parse(localStorage.getItem("favouriteMovie"));
  return favMovies === null ? [] : favMovies;
}

function addMovieInfoInLocalStorage(mInfo) {
  const localStorageMovies = getFavMoviesFromLocalStorage();

  console.log(localStorageMovies);  

  localStorage.setItem(
    "favouriteMovie",
    JSON.stringify([...localStorageMovies, mInfo])
  );
}

function removeMovieInfoFromLocalStorage(mInfo) {
  let localStorageMovies = getFavMoviesFromLocalStorage();

  let filteredMovies = localStorageMovies.filter((eMovie) => {
    return eMovie.title != mInfo.title;
  });

  localStorage.setItem("favouriteMovie", JSON.stringify(filteredMovies));
}

function renderMovies(movies) {
  let favMovies = getFavMoviesFromLocalStorage();

  moviesList.innerHTML = "";

  // console.log(movies);

  movies.map((eMovie) => {
    const { poster_path, title, vote_average, vote_count } = eMovie;

    let listItem = document.createElement("li");
    listItem.className = "card";

    let imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/original${poster_path}`
      : "";

    let mInfo = {
      title,
      poster_path,
      vote_average,
      vote_count,
    };

    const rs = favMovies.find((eFavMovie) => eFavMovie.title == title);

    listItem.innerHTML = `
            <img class="poster" src="${imageUrl?imageUrl:'https://static.thenounproject.com/png/3674270-200.png'}" alt="${title}">
            <p class="title">${title}</p>
            <section class="vote-fav">
                <section>
                    <p>Votes: ${vote_count}</p>
                    <p>Rating: ${vote_average}</p>
                </section>
                <i id='${JSON.stringify(
                  mInfo
                )}' class="fa-regular fa-heart fa-2xl fav-icon ${
      rs && "fa-solid"
    } "></i>
            </section>
        `;

    const favIconBtn = listItem.querySelector(".fav-icon");

    favIconBtn.addEventListener("click", (event) => {
      console.log(event.target);
      const { id } = event.target;
      console.log(id , 'Akash');
      const mInfo = JSON.parse(id);
      // console.log(mInfo)
      if (favIconBtn.classList.contains("fa-solid")) {
        // unmark it
        // 1) remove the fa-solid from the facIconBtn
        favIconBtn.classList.remove("fa-solid");
        // 2) remove the info of this movie from the localstroge
        removeMovieInfoFromLocalStorage(mInfo);
      } else {
        // mark it
        // 1) add the fa-solid class to the favIconBtn button
        favIconBtn.classList.add("fa-solid");
        // 2) add the info of this movie to the localstorage
        addMovieInfoInLocalStorage(mInfo);
      }
    });

    moviesList.appendChild(listItem);
  });
}

async function fetchMovies() {
  try {
    const resp = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&page=${currentPage}`
    );
    let data = await resp.json();
    movies = data.results;
    totalPages = data.total_pages;
    tPage.innerText = totalPages;
    renderMovies(movies);
  } catch (error) {
    console.log(error);
  }
}

fetchMovies();

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  fetchMovies();
});

async function searchMovies() {
  const searchText = searchInput.value;
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${searchText}&api_key=${APIKEY}&include_adult=false&language=en-US&page=${currentPage}`
  );

  const data = await resp.json();
  totalPages = data.total_pages;
  tPage.innerText = totalPages;
  movies = data.results;
  renderMovies(movies);
}


searchBtn.addEventListener("click", searchMovies);

function getPreviousPageFunc() {
  console.log(currentPage);
  currentPage= currentPage-1;
  console.log(currentPage);
  currPage.innerText = currentPage;

  
  if (currentPage == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
  
  if (currentPage >= totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
  if(searchInput.value!='')searchMovies();
  else fetchMovies();
}

function getNextPageFunc() {
  currentPage= currentPage+1;
  console.log(currentPage);
  console.log(totalPages);
  currPage.innerText = currentPage;
  if(searchInput.value!='')searchMovies();
  else fetchMovies();

  if (currentPage == 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }

  if (currentPage >= totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
}


prevBtn.addEventListener("click", getPreviousPageFunc);
nextBtn.addEventListener("click", getNextPageFunc);

let sortByDateFlag = 0; // 0: ASC   // 1: DESC

function sortByDate() {
  if (sortByDateFlag) {
    // desc
    movies.sort((m1, m2) => {
      return new Date(m2.release_date) - new Date(m1.release_date);
    });

    renderMovies(movies);

    sortByDateFlag = !sortByDateFlag;

    sortByDateBtn.innerText = "Sort by date (oldest to latest)";
  } else {
    // asc
    movies.sort((m1, m2) => {
      return new Date(m1.release_date) - new Date(m2.release_date);
    });

    renderMovies(movies);

    sortByDateFlag = !sortByDateFlag;

    sortByDateBtn.innerText = "Sort by date (latest to oldest)";
  }
}

let sortByRatingFlag = 0; // 0: INC   1: DESC

function sortByRatingFunc() {
  if (sortByRatingFlag) {
    // DESC
    movies.sort((m1, m2) => {
      return m2.vote_average - m1.vote_average;
    });

    renderMovies(movies);

    sortByRatingFlag = !sortByRatingFlag;

    sortByRating.innerText = "Sort by rating (least to most)";
  } else {
    // INC
    movies.sort((m1, m2) => {
      return m1.vote_average - m2.vote_average;
    });

    renderMovies(movies);

    sortByRatingFlag = !sortByRatingFlag;

    sortByRating.innerText = "Sort by rating (most to least)";
  }
}



sortByDateBtn.addEventListener("click", sortByDate);

sortByRating.addEventListener("click", sortByRatingFunc);

function onSearchChange(event) {
  let val = event.target.value;

  if (val) {
    searchMovies();
  } else {
    fetchMovies();
  }
}

let timer;

function debounce(event) {
  if (timer) clearTimeout(timer);

  timer = setTimeout(() => {
    onSearchChange(event);
  }, 2000);
}

searchInput.addEventListener("input", (event) => {
  debounce(event);
});

function renderFavMovies() {
  moviesList.innerHTML = "";

  const favMovies = getFavMoviesFromLocalStorage();
  if(favMovies.length==0) {
    let html= 'Try adding some Movies First🙂'
    moviesList.append(html);
  }
  favMovies.map((eFavMovie) => {
    let listItem = document.createElement("li");
    listItem.className = "card";

    const { poster_path, title, vote_average, vote_count } = eFavMovie;

    let imageUrl = poster_path
      ? `https://image.tmdb.org/t/p/original${poster_path}`
      : "";

    let mInfo = {
      title,
      poster_path,
      vote_average,
      vote_count,
    };

    listItem.innerHTML = `
            <img class="poster" src="${imageUrl?imageUrl:'https://static.thenounproject.com/png/3674270-200.png'}" alt="${title}">
            <p class="title">${title}</p>
            <section class="vote-fav">
                <section>
                    <p>Votes: ${vote_count}</p>
                    <p>Rating: ${vote_average}</p>
                </section>
                <i id='${JSON.stringify(
                  mInfo
                )}' class="fa-regular fa-heart fa-2xl fav-icon fa-solid"></i>
            </section>
        `;

    const favIconBtn = listItem.querySelector(".fav-icon");

    favIconBtn.addEventListener("click", (event) => {
      // this will remove the card info from the local storage
      const { id } = event.target;
      console.log(id);
      console.log(event.target)
      const mInfo = JSON.parse(id);
      // console.log(mInfo);
      removeMovieInfoFromLocalStorage(mInfo);

      // this will remove the card from the ui
      event.target.parentElement.parentElement.remove();
    });

    moviesList.append(listItem);
  });
}

function displayMovies() {
  if (allTab.classList.contains("active-tab")) {
    // all button, show all general movies
    renderMovies(movies);
    pagination.style.display='block';
  } else {
    // fav button, show all fav movies
    renderFavMovies();
    pagination.style.display='none';
  }
}

function switchTab(event) {
  // remove the active tab class from both tabs
  allTab.classList.remove("active-tab");
  favTab.classList.remove("active-tab");

  event.target.classList.add("active-tab");

  displayMovies();
}


allTab.addEventListener("click", switchTab);
favTab.addEventListener("click", switchTab);
