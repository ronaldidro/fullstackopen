import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const getGenres = (books) => {
  const unrepeteatGenres = [];

  books.forEach((book) =>
    book.genres.forEach(
      (genre) =>
        !unrepeteatGenres.includes(genre) && unrepeteatGenres.push(genre)
    )
  );

  return [...unrepeteatGenres, "all genres"];
};

const Books = ({ books }) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS);
  const [pageData, setPageData] = useState({
    books: [],
    genreSelected: "all genres",
    genresList: getGenres(books),
  });

  const searchBooks = (genre) => {
    getBooks({
      variables: { genreToSearch: !genre.includes("all") ? genre : "" },
      fetchPolicy: "cache-and-network",
    });
    setPageData({ ...pageData, genreSelected: genre });
  };

  useEffect(() => {
    if (result.data) setPageData({ ...pageData, books: result.data.allBooks });
  }, [result]); // eslint-disable-line

  useEffect(() => setPageData({ ...pageData, books }), [books]); // eslint-disable-line

  return (
    <div>
      <h2>books</h2>
      in genre <span style={{ fontWeight: 700 }}>{pageData.genreSelected}</span>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {pageData.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageData.genresList.map((genre) => (
        <button key={genre} onClick={() => searchBooks(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
