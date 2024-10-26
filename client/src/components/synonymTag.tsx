interface Props {
  synonym: string;
  handleDelete: (word: string) => void;
}

export default function SynonymTag({ synonym, handleDelete }: Props) {
  return (
    <span className="tag">
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
