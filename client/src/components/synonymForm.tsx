import { useState } from "react";
import SynonymTag from "./synonymTag";
interface Props {
  handleSubmit: (word: string, synonyms: string[]) => void;
}

export default function SynonymForm({ handleSubmit }: Props) {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [word, setWord] = useState("");

  const handleNewWord = (e: React.FormEvent<HTMLInputElement>) => {
    setWord(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newTag = e.currentTarget.value;

    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();

      if (!synonyms.includes(newTag) && newTag.trim() !== "") {
        setSynonyms([...new Set([...synonyms, newTag])]);
      }

      e.currentTarget.value = "";
    }

    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      synonyms.length > 0
    ) {
      e.preventDefault();
      const newArr = [...synonyms];
      newArr.pop();

      setSynonyms(newArr);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const newTags = pastedText.split(" ");

    setSynonyms([...new Set([...synonyms, ...newTags])]);
  };

  const handleSave = () => {
    if (word != "") {
      handleSubmit(word, synonyms);
      setSynonyms([]);
      setWord("");
    }
  };

  const handleDelete = (word: string) => {
    setSynonyms(synonyms.filter((synonym) => synonym != word));
  };

  const focusOnInput = (e: React.MouseEvent<HTMLDivElement>) => {
    const input: HTMLInputElement | null =
      e.currentTarget.querySelector(".tags-input");
    input?.focus();
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="relative">
        <label className="input-label">Word</label>
        <input
          className="word-input"
          type="text"
          value={word}
          onChange={handleNewWord}
          autoComplete="off"
        />
      </div>

      <div
        className="tag-holder word-input relative cursor-text"
        onClick={focusOnInput}
      >
        <label className="input-label">Synoynms</label>
        {synonyms.map((tag) => {
          return (
            <SynonymTag
              handleDelete={handleDelete}
              key={tag + "_tag"}
              synonym={tag}
            />
          );
        })}

        <input
          className="tags-input"
          type="text"
          placeholder=""
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          autoComplete="off"
        />
        <button
          className="round-button h-10 w-10 absolute right-2"
          onClick={handleSave}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
