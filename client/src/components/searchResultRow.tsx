import { toast } from "react-toastify";
import SynonymTag from "./synonymTag";

const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  word: string;
  synonyms: string[];
  removeWord: (word: string) => void;
  removeSynonym: (word: string, syonym: string) => void;
}

export default function SearchResultRow({ word, synonyms, removeWord, removeSynonym }: Props) {
  const handleDelete = (synonym: string) => {
    fetch(`${apiUrl}/synonym/delete?${new URLSearchParams({ synonym: synonym }).toString()}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        if (synonym === word) {
          removeWord(synonym);
        } else {
          removeSynonym(word, synonym);
        }

        toast.success("Deleted");
      })
      .catch(() => {
        toast.error("Server error!");
      });
  };

  return (
    <div key={word} className="flex flex-wrap justify-normal pl-12 p-4 gap-2">
      <SynonymTag key={word + "tag_result"} handleDelete={handleDelete} synonym={word} isMain={true} />
      <div className="flex flex-wrap justify-start gap-2">
        {synonyms.map((synonym) => (
          <SynonymTag key={synonym + "tag_result"} handleDelete={handleDelete} synonym={synonym} />
        ))}
      </div>
    </div>
  );
}
