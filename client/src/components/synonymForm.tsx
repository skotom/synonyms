import { useState } from "react";
import SynonymTag from "./synonymTag";

export default function SynonymForm({ updateSynonyms }) {
  const [synonyms, setSynonyms] = useState([]);
  const [word, setWord] = useState("");

  const handleNewWord = (e) => {
    setWord(e.target.value);
  };

  const handleNewTag = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      setSynonyms([...new Set([...synonyms, e.target.value])]);

      e.target.value = "";
    }
  };

  const handleSave = (e) => {
    if (word != "") {
      updateSynonyms(word, synonyms);
      setSynonyms([]);
      setWord("");
    }
  };

  const handleDelete = (name) => {
    setSynonyms(synonyms.filter((synonym) => synonym != name));
  };

  return (
    <div className="p-4">
      <input
        className="blackInput"
        type="text"
        placeholder="new word"
        value={word}
        onChange={handleNewWord}
      />
      <div className="mainHolder blackInput">
        <div className="tagHolder">
          {synonyms.map((tag) => {
            return (
              <SynonymTag handleDelete={handleDelete} key={tag} name={tag} />
            );
          })}
          <input
            id="synonymInput"
            className="tagsInput"
            type="text"
            onKeyUp={handleNewTag}
          />
          <button className="tagAdd" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
