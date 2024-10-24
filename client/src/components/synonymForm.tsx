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

  const handleNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSynonyms([...new Set([...synonyms, e.currentTarget.value])]);
      e.currentTarget.value = "";
    }
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
              <SynonymTag
                handleDelete={handleDelete}
                key={tag + "_tag"}
                synonym={tag}
              />
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
