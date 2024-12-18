import { useState } from "react";
import Search from "./components/search";
import SynonymForm from "./components/synonymForm";
import SearchResultRow from "./components/searchResultRow";
import SynonymGroup from "./types/synoynmGroup";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [synonyms, setSynonyms] = useState<SynonymGroup[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleSearch = (data: SynonymGroup[]) => {
    setSynonyms(data);
  };

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const removeSynonym = (synonymToRemove: string) => {
    const clearedSynonyms = [
      ...synonyms.map((synonymGroup) => ({
        word: synonymGroup.word,
        synonyms: synonymGroup.synonyms.filter((synonym) => synonym != synonymToRemove),
      })),
    ];

    setSynonyms(clearedSynonyms.filter((synonymGroup) => synonymGroup.word != synonymToRemove));
  };

  return (
    <main className="p-4">
      <Search
        handleSearch={handleSearch}
        toggleShowForm={toggleShowForm}
        showForm={showForm}
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
      />
      {showForm && <SynonymForm toggleShowForm={toggleShowForm} />}
      <div className="p-4">
        {synonyms.map(({ word, synonyms }) => (
          <SearchResultRow key={`${word}_row`} word={word} synonyms={synonyms} removeSynonym={removeSynonym} />
        ))}

        {searchTerm !== "" && !synonyms.length && <div className="pl-12">No synonyms for {searchTerm}</div>}
      </div>

      <ToastContainer
        autoClose={1000}
        theme="dark"
        draggable={true}
        position="top-right"
        transition={Slide}
        hideProgressBar={true}
      />
    </main>
  );
}
