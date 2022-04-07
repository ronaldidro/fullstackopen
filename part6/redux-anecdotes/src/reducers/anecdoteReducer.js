import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    
    case 'INIT_ANECDOTES':
      return action.data
        .sort((firstAnecdote, secondAnecdote) => secondAnecdote.votes - firstAnecdote.votes)
    
    case 'TOGGLE_VOTE':
      const id = action.data.id
      const changedAnecdote = action.data
      return state
        .map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
        .sort((firstAnecdote, secondAnecdote) => secondAnecdote.votes - firstAnecdote.votes)
  
    default:
      return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes  
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const toggleVote = ({ id, content, votes }) => {
  return async dispatch => {
    const returnedAnecdote = await anecdoteService.update(id, { content, votes })
    dispatch({
      type: 'TOGGLE_VOTE',
      data: returnedAnecdote
    })
  }
}

export default anecdoteReducer