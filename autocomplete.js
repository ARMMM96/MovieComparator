const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
}) => {
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

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

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

      movieItem.classList.add('dropdown-item');

      movieItem.innerHTML = renderOption(movie);
      movieItem.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(movie);

        onOptionSelect(movie);
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
};
