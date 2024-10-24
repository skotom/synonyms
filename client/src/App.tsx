import { useState } from "react";
import SynonymTag from "./components/synonymTag";
import Search from "./components/search";
import SynonymForm from "./components/synonymForm";
interface Word {
  word: string;
  synonyms: string[];
}

export default function App() {
  const [synonyms, setSynonyms] = useState<Word[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  const addNewSynonym = (word: string, synonyms: string[]) => {
    if (!synonyms.length) {
      alert("no synonyms!");
    }
    fetch("http://localhost:3000/word/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ synonyms: [...synonyms, word] }),
      credentials: "include",
    }).then((res) => {
      return res.json();
    });
  };

  const search = (word: string) => {
    fetch(
      "http://localhost:3000/word/search?" +
        new URLSearchParams({ word: word }).toString(),
      {
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.status && !!data.length) {
          setSynonyms(data);
        } else {
          setSynonyms([]);
        }
      });
  };

  const updateShowForm = () => {
    setShowForm(!showForm);
  };

  const handleDelete = (e) => {};

  return (
    <main className="p-4">
      <Search
        showForm={showForm}
        search={search}
        updateShowForm={updateShowForm}
      />
      {showForm && <SynonymForm updateSynonyms={addNewSynonym} />}
      <div>
        {synonyms.map(({ word, synonyms }) => (
          <div key={word} className="flex justify-between">
            <div>{word}</div>
            <div>
              {synonyms.map((synonym) => (
                <SynonymTag handleDelete={handleDelete} name={synonym} />
              ))}
            </div>
          </div>
        ))}

        {!Object.keys(synonyms).length && <div>No data</div>}
      </div>
    </main>
  );
}
