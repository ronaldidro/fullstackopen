import { useSelector, useDispatch } from 'react-redux'
import { toggleVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if(filter !== '') {
      return anecdotes.filter(anecdote => anecdote.content.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }
    return anecdotes
  })
  
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(toggleVote({ ...anecdote, votes: anecdote.votes + 1 }))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5000))
  }

  return (
    anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )
  )
}

export default AnecdoteList