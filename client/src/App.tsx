import { useEffect, useState } from "react";

function Synonym({ name }) {
  return (
    <span className="tag">
      <span>{name}</span>
      <button className="tagReset">x</button>
    </span>
  );
}

function SynonymForm({ updateSynonyms }) {
  const [synonyms, setSynonyms] = useState([]);
  const [word, setWord] = useState("");

  const handleNewWord = (e) => {
    setWord(e.target.value);
  };

  const handleNewTag = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (e.target.value == "") {
        return;
      }

      setSynonyms([...new Set([...synonyms, e.target.value])]);

      e.target.value = "";
    }
  };

  const handleSave = (e) => {
    updateSynonyms(word, synonyms);
    setSynonyms([]);
    setWord("");
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
            return <Synonym key={tag} name={tag} />;
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

function SearchBar({ search, updateShowForm, showForm }) {
  const handleSearch = (e) => {
    search(e.target.value);
  };

  return (
    <nav className="p-4 font-semibold">
      <div className="relative w-full">
        <div className="absolute left-2 top-1/2 flex -translate-y-1/2 transform items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <input
          className="blackInput"
          type="text"
          placeholder="Find word"
          onChange={handleSearch}
        />

        <div
          title="Add new word"
          className="text-2xl text-white border-rose hover:border-green-500 absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-dotted border-rose-500 bg-black cursor-pointer"
          onClick={updateShowForm}
        >
          {showForm ? "-" : "+"}
          {/* <button
            title="Add new word"
            className="text-2xl text-white"
            onClick={updateShowForm}
          >
          </button> */}
        </div>
      </div>
    </nav>
  );
}

interface Word {
  word: string;
  synonyms: string[];
}

export default function App() {
  const [synonyms, setSynonyms] = useState<Word[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    // fetch("http://localhost:3000/word/all", { credentials: "include" })
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setSynonyms(data);
    //   });
  };

  const addNewSynonym = (word: string, synonyms: string[]) => {
    if (!synonyms.length) {
      alert("no synonyms!");
    }
    fetch("http://localhost:3000/word/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: word, synonyms: synonyms }),
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        getAll();
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

  return (
    <main className="p-4">
      <SearchBar
        showForm={showForm}
        search={search}
        updateShowForm={updateShowForm}
      />
      {showForm && <SynonymForm updateSynonyms={addNewSynonym} />}
      <div>
        {synonyms.map(({ word, synonyms }) => (
          <div key={word} className="flex justify-between">
            <div>{word}</div>
            <div>{synonyms.join(",")}</div>
          </div>
        ))}

        {!Object.keys(synonyms).length && <div>No data</div>}
      </div>
    </main>
  );
}
