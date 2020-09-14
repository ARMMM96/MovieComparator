const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      <h5>${movie.Title} (${movie.Year}) </h5>
  
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
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
  },
};
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('.left-summary'), 'left');
  },
});
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('.right-summary'), 'right');
  },
});

let leftMovie, rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'fec063bf',
      i: movie.imdbID,
    },
  });
  summaryElement.innerHTML = movieTemplate(response.data);
  side === 'left' ? (leftMovie = response.data) : (rightMovie = response.data);

  if (leftMovie && rightMovie) {
    runCompersion();
  }
};

const runCompersion = () => {
  console.log('Time for compoersion');
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  console.log(awards);
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
    <article class="notification is-primary">
      <p class="title"> ${movieDetail.Awards} </p>
      <p class="subtitle">Awards </p>
    </article> 
    <article class="notification is-primary">
      <p class="title"> ${movieDetail.BoxOffice} </p>
      <p class="subtitle">Box Office </p>
    </article> 
    <article class="notification is-primary">
      <p class="title"> ${movieDetail.Metascore} </p>
      <p class="subtitle">Metascore</p>
    </article> 
    <article class="notification is-primary">
      <p class="title"> ${movieDetail.imdbRating} </p>
      <p class="subtitle">IMDB Rating </p>
    </article> 
    <article class="notification is-primary">
      <p class="title"> ${movieDetail.imdbVotes} </p>
      <p class="subtitle">IMDB Votes </p>
    </article> 

  `;
};
