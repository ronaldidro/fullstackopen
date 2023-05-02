export const setNotification = (dispatch, content) => {
  dispatch({ type: "SET", content });
  setTimeout(() => {
    dispatch({ type: "SET", content: null });
  }, 5000);
};
