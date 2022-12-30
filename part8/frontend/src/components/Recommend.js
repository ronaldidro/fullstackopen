import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Recommend = ({ user }) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks({
      variables: {
        genreToSearch: user.favoriteGenre,
      },
      fetchPolicy: "cache-and-network",
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (result.data) setBooks(result.data.allBooks);
  }, [result]);

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre{" "}
      <span style={{ fontWeight: 700 }}>{user.favoriteGenre}</span>
      {result.loading ? (
        <div>loading books...</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Recommend;
