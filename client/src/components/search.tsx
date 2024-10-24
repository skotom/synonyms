interface Props {
  search: (word: string) => void;
  toggleShowForm: () => void;
  showForm: boolean;
}

export default function Search({ search, toggleShowForm, showForm }: Props) {
  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    search(e.currentTarget.value);
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
          className="blackInput"
          type="text"
          placeholder="Find word"
          onChange={handleSearch}
        />

        <button
          title="Add new word"
          className="text-2xl text-white border-rose hover:border-green-500 absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-dotted border-rose-500 bg-black"
          onClick={toggleShowForm}
        >
          {showForm ? "-" : "+"}
        </button>
      </div>
    </nav>
  );
}
