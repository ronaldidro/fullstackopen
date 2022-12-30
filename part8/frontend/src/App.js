import { useState } from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import Recommend from "./components/Recommend";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from "./queries";
import { updateAuthorsCache, updateBooksCache } from "./utils";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();
  const result = useQuery(
    page === "books"
      ? ALL_BOOKS
      : page === "recommend"
      ? CURRENT_USER
      : ALL_AUTHORS
  );

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      alert(`Book ${addedBook.title} was added`);
      updateBooksCache(client.cache, ALL_BOOKS, addedBook);
      updateAuthorsCache(client.cache, ALL_AUTHORS, addedBook.author);
    },
  });

  const setNotification = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleAuthButton = () => {
    if (token) {
      setToken(null);
      localStorage.clear();
      client.resetStore();
      setPage("authors");
    } else {
      setPage("auth");
    }
  };

  if (result.loading) return <div>loading...</div>;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
          </>
        )}
        <button onClick={handleAuthButton}>{token ? "logout" : "login"}</button>
      </div>
      <Notify errorMessage={errorMessage} />
      {page === "authors" && (
        <Authors authors={result.data.allAuthors} setError={setNotification} />
      )}
      {page === "books" && <Books books={result.data.allBooks} />}
      {page === "add" && <NewBook setError={setNotification} />}
      {page === "recommend" && <Recommend user={result.data.me} />}
      {page === "auth" && (
        <LoginForm setToken={setToken} setError={setNotification} />
      )}
    </div>
  );
};

export default App;
