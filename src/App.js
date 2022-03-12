import { useEffect, useState, useRef } from 'react';
import { getPeople, getCharacter, searchCharacter } from './api/people';
import './App.css';

function App() {
  const inputSearch = useRef(null);
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [textSearch, setTextSearch] = useState('');
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [details, setDetails] = useState({})
  const [errorState, setErrorState] = useState({ hasError: false });

  useEffect(() => {
    getPeople(page).then(setPeople).catch(handleError);
  }, [page]);

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetails).catch(handleError)
  })

  const handleError = (error) => {
    setErrorState({ hasError: true, message: error.message });
  }

  const showDetails = (character) => {
    const id = Number(character.url.split('/').slice(-2)[0]);
    setCurrentCharacter(id);
  }

  const onChangeTextSearch = (event) => {
    event.preventDefault();
    const text = inputSearch.current.value
    setTextSearch(text);
  }

  const onSearchSubmit = (event) => {
    if (event.key !== 'Enter') return;

    inputSearch.current.value = '';
    setDetails({});
    searchCharacter(textSearch).then(setPeople).catch(handleError);
  }

  const onChangePage = (next) => {
    if (!people.previus && page + next <= 0) return;
    if (!people.next && page + next >= 9) return;

    setPage(page + next);
  }

  return (
    <div>
      <input 
        ref={inputSearch} 
        onChange={onChangeTextSearch} 
        onKeyDown={onSearchSubmit}
        type="text" 
        placeholder="Enter character" 
      />
      <ul>
      {errorState.hasError && <div>{errorState.message}</div>}
      {people?.results?.map((character)=> (
        <li key={character.name} onClick={() => showDetails(character)}>
          {character.name}
          </li>
      ))}
    </ul>

      <section>
        <button onClick={() => onChangePage(-1)}>Prev</button>
        | {page} |
        <button onClick={() => onChangePage(1)}>Next</button>
      </section>

    {details && (
      <aside>
      <h1>{details.name}</h1>
      <ul>
        <li>Height: {details.height}</li>
        <li>Mass: {details.mass}</li>
        <li>Year of birth: {details.birth_year}</li>
      </ul>
    </aside>
    )}
    </div>
  );
}

export default App;
