import SynonymGroup from "../types/synoynmGroup";

interface Props {
  handleSearch: (data: SynonymGroup[]) => void;
  toggleShowForm: () => void;
  showForm: boolean;
}

export default function Search({
  handleSearch,
  toggleShowForm,
  showForm,
}: Props) {
  const find = (e: React.FormEvent<HTMLInputElement>) => {
    fetch(
      "http://localhost:3000/word/search?" +
        new URLSearchParams({ searchTerm: e.currentTarget.value }).toString(),
      {
        credentials: "include",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        handleSearch(data);
      });
  };

  return (
    <nav className="p-4 font-semibold">
      <div className="relative w-full">
        <div className="absolute left-2 top-1/2 flex -translate-y-1/2 transform items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <input
          className="word-input"
          type="text"
          placeholder="Find word"
          onChange={find}
        />

        <button
          title="Add new word"
          className="round-button h-10 w-10 -translate-y-1/2 transform top-1/2 right-2 absolute text-2xl"
          onClick={toggleShowForm}
        >
          {showForm ? "-" : "+"}
        </button>
      </div>
    </nav>
  );
}
