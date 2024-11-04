import { useEffect, useRef, useState } from "react";
import SynonymTag from "./synonymTag";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import CloudIcon from "./icons/cloudIcon";
import MinusIcon from "./icons/minusIcon";
import PlusIcon from "./icons/plusIcon";
import PlusCircleIcon from "./icons/plusCircleIcon";
const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  toggleShowForm: () => void;
}

export default function SynonymForm({ toggleShowForm }: Props) {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [newSynonym, setNewSynonym] = useState("");
  const [word, setWord] = useState("");
  const wordInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    wordInputRef.current?.focus();
  }, []);

  const save = () => {
    if (!synonyms.length) {
      return;
    }

    fetch(`${apiUrl}/synonym/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ synonyms: [...synonyms, word] }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status === StatusCodes.OK) {
          toggleShowForm();
          toast.success("Saved!");
          setSynonyms([]);
          setWord("");
        } else {
          toast.error("Server error!");
        }
      })
      .catch((err) => {
        if (err instanceof Error) {
          toast.error("Network error!");
        }
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

    save();
  };

  const handleDelete = (word: string) => {
    setSynonyms(synonyms.filter((synonym) => synonym != word));
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

      <div className="tag-holder word-input relative" onClick={() => tagInputRef.current?.focus()}>
        <label className="input-label">Synoynms</label>
        {synonyms.map((tag) => {
          return <SynonymTag handleDelete={handleDelete} key={tag + "_tag"} synonym={tag} />;
        })}

        <input
          ref={tagInputRef}
          className="inner-input"
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
            <PlusCircleIcon />
          </button>
        )}
        {newSynonym == "" && word != "" && !!synonyms.length && (
          <button title="Save" className="round-button h-10 w-10 absolute right-2" onClick={handleSave}>
            <CloudIcon />
          </button>
        )}
      </div>
    </div>
  );
}
