import CloseIcon from "./closeIcon";

interface Props {
  synonym: string;
  handleDelete: (word: string) => void;
  isMain?: boolean;
}

export default function SynonymTag({ synonym, handleDelete, isMain }: Props) {
  return (
    <span className={`tag ${isMain ? "main-tag" : "synonym-tag"}`}>
      <span>{synonym}</span>
      <button className="round-button w-5 h-5 text-xs" onClick={() => handleDelete(synonym)}>
        <CloseIcon />
      </button>
    </span>
  );
}
