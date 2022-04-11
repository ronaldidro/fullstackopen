import { useField } from "../hooks"

const AnecdoteForm = (props) => {
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')

  const { reset: resetContent, ...contentInputs } = content
  const { reset: resetAuthor, ...authorInputs } = author
  const { reset: resetInfo, ...infoInputs } = info
  
  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInputs} />
        </div>
        <div>
          author
          <input {...authorInputs} />
        </div>
        <div>
          url for more info
          <input {...infoInputs} />
        </div>
        <button>create</button>
        <button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default AnecdoteForm