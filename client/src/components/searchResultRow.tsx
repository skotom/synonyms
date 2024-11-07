import { toast } from "react-toastify";
import SynonymTag from "./synonymTag";
import { StatusCodes } from "http-status-codes";

const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  word: string;
  synonyms: string[];
  removeSynonym: (syonym: string) => void;
}

export default function SearchResultRow({ word, synonyms, removeSynonym }: Props) {
  const handleDelete = (synonym: string) => {
    fetch(`${apiUrl}/synonym/delete?${new URLSearchParams({ synonym: synonym }).toString()}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === StatusCodes.OK) {
          removeSynonym(synonym);

          toast.success("Deleted");
        } else {
          toast.error("Server error!");
        }
      })
      .catch(() => {
        toast.error("Network error!");
      });
  };

  return (
    <div key={word} className="flex flex-wrap justify-normal pl-12 p-4 gap-2">
      <SynonymTag key={`${word}_main`} handleDelete={handleDelete} synonym={word} isMain={true} />
      <div className="flex flex-wrap justify-start gap-2">
        {synonyms.map((synonym) => (
          <SynonymTag key={`${word}_${synonym}_tag`} handleDelete={handleDelete} synonym={synonym} />
        ))}
      </div>
    </div>
  );
}
