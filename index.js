const fetchData = async (searchTerm) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'fec063bf',
      s: searchTerm,
    },
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
<label> <b> Search For a Movie</b></label>
<input class="input" type="text" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results">
 
    </div>
  </div>
</div>
<div id="target"></div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async (e) => {
  const movies = await fetchData(e.target.value);

  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  for (let movie of movies) {
    const movieItem = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    movieItem.classList.add('dropdown-item');

    movieItem.innerHTML = `
      <img src="${imgSrc}" />
      <h5>${movie.Title} </h5>
    `;
    movieItem.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;

      onMovieSelect(movie);
    });
    resultsWrapper.appendChild(movieItem);
  }
};
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (e) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active');
  }
});

const onMovieSelect = async (movie) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'fec063bf',
      i: movie.imdbID,
    },
  });
  console.log(response.data);
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
    <article class='media'>
      <figure class='media-left'>
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1> ${movieDetail.Title} </h1>
          <h4> ${movieDetail.Genre} </h4>
          <p> ${movieDetail.Plot} </p>
        </div>
      </div>
    </article>
  `;
};
