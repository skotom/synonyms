import { useState } from "react";
import Search from "./components/search";
import SynonymForm from "./components/synonymForm";
import SearchResultRow from "./components/searchResultRow";
import SynonymGroup from "./types/synoynmGroup";

export default function App() {
  const [synonyms, setSynonyms] = useState<SynonymGroup[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSearch = (data: SynonymGroup[]) => {
    if (data.length) {
      setSynonyms(data);
    } else {
      setSynonyms([]);
    }
  };

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const removeWord = (word: string) => {
    setSynonyms([
      ...synonyms.filter((synonymGroup) => synonymGroup.word != word),
    ]);
  };

  return (
    <main className="p-4">
      <Search
        showForm={showForm}
        handleSearch={handleSearch}
        toggleShowForm={toggleShowForm}
      />
      {showForm && <SynonymForm />}
      <div className="p-4">
        {synonyms.map(({ word, synonyms }) => (
          <SearchResultRow
            key={`${word}_row`}
            word={word}
            synonyms={synonyms}
            removeWord={removeWord}
          />
        ))}

        {!Object.keys(synonyms).length && (
          <div className="pl-12">No synonyms</div>
        )}
      </div>
    </main>
  );
}
