interface Props {
  synonym: string;
  handleDelete: (word: string) => void;
}

export default function SynonymTag({ synonym, handleDelete }: Props) {
  return (
    <span className="tag">
      <span>{synonym}</span>
      <button onClick={() => handleDelete(synonym)} className="tagReset">
        x
      </button>
    </span>
  );
}
