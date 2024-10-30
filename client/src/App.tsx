import { useState } from "react";
import Search from "./components/search";
import SynonymForm from "./components/synonymForm";
import SearchResultRow from "./components/searchResultRow";
import SynonymGroup from "./types/synoynmGroup";

export default function App() {
  const [synonyms, setSynonyms] = useState<SynonymGroup[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSearch = (data: SynonymGroup[]) => {
    setSynonyms(data);
  };

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const removeWord = (word: string) => {
    setSynonyms([...synonyms.filter((synonymGroup) => synonymGroup.word != word)]);
  };

  const removeSynonym = (word: string, synonymToRemove: string) => {
    const synonymGroup = synonyms.find((synonymGroup) => synonymGroup.word == word);

    if (synonymGroup) {
      setSynonyms([
        ...synonyms.filter((synonymGroup) => synonymGroup.word != word),
        { word: word, synonyms: [...synonymGroup.synonyms.filter((synonym) => synonym != synonymToRemove)] },
      ]);
    }
  };

  return (
    <main className="p-4">
      <Search showForm={showForm} handleSearch={handleSearch} toggleShowForm={toggleShowForm} />
      {showForm && <SynonymForm toggleShowForm={toggleShowForm} />}
      <div className="p-4">
        {synonyms.map(({ word, synonyms }) => (
          <SearchResultRow
            key={`${word}_row`}
            word={word}
            synonyms={synonyms}
            removeWord={removeWord}
            removeSynonym={removeSynonym}
          />
        ))}

        {!Object.keys(synonyms).length && <div className="pl-12">No synonyms</div>}
      </div>
    </main>
  );
}
