import { useEffect, useRef } from "react";
import SynonymGroup from "../types/synoynmGroup";
import CloseIcon from "./closeIcon";
import PlusIcon from "./plusIcon";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_API_URL;

interface Props {
  handleSearch: (data: SynonymGroup[]) => void;
  toggleShowForm: () => void;
  showForm: boolean;
  searchTerm: string;
  handleSearchTermChange: (newSearchTerm: string) => void;
}

export default function Search({ handleSearch, toggleShowForm, showForm, searchTerm, handleSearchTermChange }: Props) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort("Abort");
      }
    };
  }, []);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;
    handleSearchTermChange(searchTerm);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Abort");
    }
    const newAbortController = new AbortController();
    const { signal } = newAbortController;

    abortControllerRef.current = newAbortController;

    if (searchTerm === "") {
      handleSearch([]);
    } else {
      fetch(`${apiUrl}/synonym/search?${new URLSearchParams({ searchTerm: searchTerm }).toString()}`, {
        credentials: "include",
        signal,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          handleSearch(data.responseObject);
        })
        .catch((err) => {
          if (err instanceof Error) {
            toast.error("Server error!");
          }
        });
    }
  };

  const clearSearch = () => {
    handleSearchTermChange("");
    handleSearch([]);
  };

  return (
    <nav className="p-4 font-semibold">
      <div className="relative word-input group" onClick={() => searchInputRef.current?.focus()}>
        <div className="absolute left-2 top-1/2 flex -translate-y-1/2 transform items-center justify-center group-hover:text-white group-focus-within:text-white text-[#b3b3b3]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <input
          ref={searchInputRef}
          className="inner-input"
          type="text"
          placeholder="Find word"
          onChange={handleInputChange}
          value={searchTerm}
        />
        {searchTerm !== "" && (
          <button
            title="Clear"
            className="round-button h-10 w-10 -translate-y-1/2 transform top-1/2 right-14 absolute text-2xl"
            type="button"
            onClick={clearSearch}
          >
            <CloseIcon />
          </button>
        )}
        <button
          title="Add new word"
          className="round-button h-10 w-10 -translate-y-1/2 transform top-1/2 right-2 absolute text-2xl"
          type="button"
          onClick={toggleShowForm}
        >
          {showForm ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          ) : (
            <PlusIcon />
          )}
        </button>
      </div>
    </nav>
  );
}
