import React from 'react';

const Person = ({ name, number, handleDelete }) => {
  return(
    <div>
      <span>{name} {number} </span>
      <button onClick={handleDelete}>delete</button>
    </div>
  )
};

export default Person;
