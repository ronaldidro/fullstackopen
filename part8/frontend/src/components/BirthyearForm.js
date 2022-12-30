import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { SET_BIRTHYEAR } from "../queries";

const BirthyearForm = ({ authors, setError }) => {
  const [born, setBorn] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const options = authors.map(({ name }) => ({ value: name, label: name }));
  const [setBirthYear, result] = useMutation(SET_BIRTHYEAR, {
    onError: ({ networkError, graphQLErrors }) => {
      if (networkError) setError(networkError.result.errors[0].message);
      if (graphQLErrors) setError(graphQLErrors[0].message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    setBirthYear({
      variables: { name: selectedOption.value, setBornTo: parseInt(born) },
    });

    setSelectedOption(null);
    setBorn("");
  };

  useEffect(() => {
    if (result.data?.editAuthor === null) setError("author not found");
  }, [result.data]); // eslint-disable-line

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            required
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BirthyearForm;
