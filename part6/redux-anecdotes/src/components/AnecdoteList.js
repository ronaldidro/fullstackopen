import { connect } from 'react-redux'
import { toggleVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.toggleVote({ ...anecdote, votes: anecdote.votes + 1 })
    props.setNotification(`you voted '${anecdote.content}'`, 5000)
  }

  return (
    props.anecdotes.map(anecdote =>
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

const mapStateToProps = (state) => {
  if(state.filter !== '') {
    return {
      anecdotes: state.anecdotes.filter(anecdote => anecdote.content.toLocaleLowerCase().includes(state.filter.toLocaleLowerCase()))
    }
  }

  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
  }
}

const mapDispatchToProps = {
  toggleVote,
  setNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)