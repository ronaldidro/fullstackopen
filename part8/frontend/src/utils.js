const includedIn = (set, object) => set.map((p) => p.id).includes(object.id);

export const updateBooksCache = (store, query, addedBook) => {
  const dataInStore = store.readQuery({ query });

  if (dataInStore && !includedIn(dataInStore.allBooks, addedBook)) {
    store.writeQuery({
      query,
      data: { allBooks: dataInStore.allBooks.concat(addedBook) },
    });
  }
};

export const updateAuthorsCache = (store, query, addedAuthor) => {
  const dataInStore = store.readQuery({ query });

  if (!dataInStore) return;

  if (!includedIn(dataInStore.allAuthors, addedAuthor)) {
    store.writeQuery({
      query,
      data: { allAuthors: dataInStore.allAuthors.concat(addedAuthor) },
    });
  } else {
    store.writeQuery({
      query,
      data: {
        allAuthors: dataInStore.allAuthors.map((data) =>
          data.id === addedAuthor.id ? addedAuthor : data
        ),
      },
    });
  }
};
