export default function SynonymTag({ name, handleDelete }) {
  return (
    <span className="tag">
      <span>{name}</span>
      <button onClick={() => handleDelete(name)} className="tagReset">
        x
      </button>
    </span>
  );
}
