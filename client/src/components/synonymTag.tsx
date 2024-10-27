interface Props {
  synonym: string;
  handleDelete: (word: string) => void;
  isMain?: boolean;
}

export default function SynonymTag({ synonym, handleDelete, isMain }: Props) {
  return (
    <span className={`tag ${isMain ? "bg-yellow-400" : "bg-white"}`}>
      <span>{synonym}</span>
      <button
        className="round-button w-5 h-5 text-xs hover:bg-slate-900"
        onClick={() => handleDelete(synonym)}
      >
        x
      </button>
    </span>
  );
}
