import { useState } from "react";
import SynonymTag from "./synonymTag";
const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  word: string;
  synonyms: string[];
  removeWord: (word: string) => void;
}

export default function SearchResultRow({ word, synonyms, removeWord }: Props) {
  const [rowSynonyms, setRowSynonyms] = useState(synonyms);

  const handleDelete = (word: string) => {
    fetch(
      `${apiUrl}/synonym/delete?` +
        new URLSearchParams({ synonym: word }).toString(),
      {
        method: "DELETE",
        credentials: "include",
      }
    ).then((res) => {
      if (res.status !== 200) {
        alert("cops!");
      } else {
        if (!rowSynonyms.includes(word)) {
          removeWord(word);
        } else {
          setRowSynonyms([...rowSynonyms].filter((synonym) => synonym != word));
        }
      }
    });
  };

  return (
    <div key={word} className="flex flex-wrap justify-normal pl-12 p-4 gap-2">
      <SynonymTag
        key={word + "tag_result"}
        handleDelete={handleDelete}
        synonym={word}
        isMain={true}
      />
      <div className="flex justify-around gap-2">
        {rowSynonyms.map((synonym) => (
          <SynonymTag
            key={synonym + "tag_result"}
            handleDelete={handleDelete}
            synonym={synonym}
          />
        ))}
      </div>
    </div>
  );
}
