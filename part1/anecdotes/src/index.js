import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Title = ({ name }) => <h1>{name}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Anecdote = ({ description, votes }) => {
  return(
    <div>
      <div>
        {description}
      </div>
      <div>
        has {votes} votes
      </div>
    </div> 
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(6).fill(0))

  const handleNextClick = () => setSelected(Math.floor(Math.random() * 6))
  const handleVoteClick = () => {
    const copyPoints = [...points]
    copyPoints[selected] += 1
    setPoints(copyPoints)
  }

  return (
    <div>
      <Title name="Anecdote of the day" />
      <Anecdote description={props.anecdotes[selected]} votes={points[selected]} />
      <Button onClick={handleVoteClick} text="vote" />
      <Button onClick={handleNextClick} text="next anecdote" />
      <Title name="Anecdote with most votes" />
      <Anecdote description={props.anecdotes[points.indexOf(Math.max(...points))]} votes={points[points.indexOf(Math.max(...points))]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)