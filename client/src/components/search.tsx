const apiUrl = import.meta.env.VITE_API_URL;

import { useState } from "react";
import SynonymGroup from "../types/synoynmGroup";
import CloseIcon from "./closeIcon";
import PlusIcon from "./plusIcon";

interface Props {
  handleSearch: (data: SynonymGroup[]) => void;
  toggleShowForm: () => void;
  showForm: boolean;
}

export default function Search({ handleSearch, toggleShowForm, showForm }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    search();
  };

  const search = () => {
    if (searchTerm === "") {
      handleSearch([]);
    } else {
      fetch(`${apiUrl}/synonym/search?${new URLSearchParams({ searchTerm: searchTerm }).toString()}`, {
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          handleSearch(data.responseObject);
          clearSearch();
        });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <nav className="p-4 font-semibold">
      <div className="relative w-full">
        <form onSubmit={handleSubmit} action="">
          <button
            title="Search"
            type="submit"
            className="absolute left-2 top-1/2 flex -translate-y-1/2 transform items-center justify-center find-button"
          >
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
          </button>

          <input
            className="word-input"
            type="text"
            placeholder="Find word"
            onChange={handleInputChange}
            value={searchTerm}
          />
        </form>

        <button
          title="Clear"
          className="round-button h-10 w-10 -translate-y-1/2 transform top-1/2 right-14 absolute text-2xl"
          type="button"
          onClick={clearSearch}
        >
          <CloseIcon />
        </button>
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
              className="size-6"
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
