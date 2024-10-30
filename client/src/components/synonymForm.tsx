import { useEffect, useRef, useState } from "react";
import SynonymTag from "./synonymTag";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  toggleShowForm: () => void;
}

export default function SynonymForm({ toggleShowForm }: Props) {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [newSynonym, setNewSynonym] = useState("");
  const [word, setWord] = useState("");
  const wordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wordInputRef?.current) {
      wordInputRef.current.focus();
    }
  }, []);

  const save = (word: string, synonyms: string[]) => {
    if (!synonyms.length) {
      return;
    }

    fetch(`${apiUrl}/synonym/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ synonyms: [...synonyms, word] }),
      credentials: "include",
    })
      .then(() => {
        toggleShowForm();
        toast.success("Saved!");
        setSynonyms([]);
        setWord("");
      })
      .catch(() => {
        toast.error("Server error!");
      });
  };

  const handleNewWord = (e: React.FormEvent<HTMLInputElement>) => {
    setWord(e.currentTarget.value);
  };

  const handleNewSynonym = (e: React.FormEvent<HTMLInputElement>) => {
    setNewSynonym(e.currentTarget.value);
  };

  const handleWordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSave();
    }
  };

  const handleSynonymKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleSave();
    }

    if (e.key === " ") {
      e.preventDefault();
      addNewSynonym();
      e.currentTarget.value = "";
      return;
    }

    if (e.key === "Backspace" && e.currentTarget.value === "" && synonyms.length > 0) {
      e.preventDefault();
      setSynonyms([...synonyms].slice(0, -1));
    }
  };

  const addNewSynonym = () => {
    if (!synonyms.includes(newSynonym) && newSynonym.trim() !== "") {
      setSynonyms([...new Set([...synonyms, newSynonym])]);
      setNewSynonym("");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const newTags = pastedText.split(" ");

    setSynonyms([...new Set([...synonyms, ...newTags])]);
  };

  const handleSave = () => {
    if (word == "") {
      toast.warning("Word can't be empty");
      return;
    }

    if (!synonyms.length) {
      toast.warning("No synonyms!");
      return;
    }

    save(word, synonyms);
  };

  const handleDelete = (word: string) => {
    setSynonyms(synonyms.filter((synonym) => synonym != word));
  };

  const focusOnInput = (e: React.MouseEvent<HTMLDivElement>) => {
    const input: HTMLInputElement | null = e.currentTarget.querySelector(".tags-input");
    input?.focus();
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="relative">
        <label className="input-label">Word</label>
        <input
          ref={wordInputRef}
          className="word-input"
          type="text"
          value={word}
          onChange={handleNewWord}
          onKeyDown={handleWordKeyDown}
          autoComplete="off"
        />
      </div>

      <div className="tag-holder word-input relative cursor-text" onClick={focusOnInput}>
        <label className="input-label">Synoynms</label>
        {synonyms.map((tag) => {
          return <SynonymTag handleDelete={handleDelete} key={tag + "_tag"} synonym={tag} />;
        })}

        <input
          className="tags-input"
          type="text"
          placeholder=""
          value={newSynonym}
          onChange={handleNewSynonym}
          onKeyDown={handleSynonymKeyDown}
          onPaste={handlePaste}
          autoComplete="off"
        />
        {newSynonym != "" && (
          <button
            title="Convert to tag"
            className="round-button h-10 w-10 right-2 absolute text-2xl"
            onClick={addNewSynonym}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        )}
        {newSynonym == "" && word != "" && !!synonyms.length && (
          <button title="Save" className="round-button h-10 w-10 absolute right-2" onClick={handleSave}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
