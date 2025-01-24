import React, { useState} from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch, FaVolumeUp, FaExclamationTriangle } from "react-icons/fa";

function App() {
  const [data, setData] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function getMeaning() {
    if (!searchWord.trim()) return;

    setLoading(true);
    setError(null);

    Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`)
      .then((response) => {
        setData(response.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Word not found. Try another search.");
        setData(null);
        setLoading(false);
      });
  }

  function playAudio() {
    const audioSources = data.phonetics.filter(p => p.audio);
    if (audioSources.length > 0) {
      let audio = new Audio(audioSources[0].audio);
      audio.play().catch(err => console.log("Audio playback failed"));
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      getMeaning();
    }
  }

  return (
    <div className="App">
      <h1>Advanced Dictionary</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Enter a word..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={getMeaning} disabled={loading}>
          <FaSearch size="20px" />
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="errorBox">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {data && (
        <div className="showResults">
          <h2>
            {data.word}{" "}
            {data.phonetics?.length > 0 && (
              <button onClick={playAudio}>
                <FaVolumeUp size="26px" />
              </button>
            )}
          </h2>

          {data.phonetic && (
            <p><em>Pronunciation: {data.phonetic}</em></p>
          )}

          {data.meanings.map((meaning, index) => (
            <div key={index}>
              <h4>Type: {meaning.partOfSpeech}</h4>
              {meaning.definitions.map((def, defIndex) => (
                <div key={defIndex}>
                  <p><strong>Definition:</strong> {def.definition}</p>
                  {def.example && (
                    <p><em>Example: {def.example}</em></p>
                  )}
                </div>
              ))}
            </div>
          ))}

          {data.sourceUrls && (
            <div className="sourceLinks">
              <h4>More Information:</h4>
              {data.sourceUrls.map((url, index) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Source {index + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;