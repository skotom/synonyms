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

  const handleSubmit = (word: string, synonyms: string[]) => {
    if (!synonyms.length) {
      return;
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

  const toggleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleDelete = (e) => {};

  return (
    <main className="p-4">
      <Search
        showForm={showForm}
        search={search}
        toggleShowForm={toggleShowForm}
      />
      {showForm && <SynonymForm handleSubmit={handleSubmit} />}
      <div className="p-4">
        {synonyms.map(({ word, synonyms }) => (
          <div key={word} className="flex justify-normal pl-12 p-4 gap-2">
            <div>{word}</div>
            <div className="flex justify-around gap-2">
              {synonyms.map((synonym) => (
                <SynonymTag
                  key={synonym + "tag_result"}
                  handleDelete={handleDelete}
                  synonym={synonym}
                />
              ))}
            </div>
          </div>
        ))}

        {!Object.keys(synonyms).length && (
          <div className="pl-12">No synonyms</div>
        )}
      </div>
    </main>
  );
}
