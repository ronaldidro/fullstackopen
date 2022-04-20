import { Button, Form } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { addComment } from "../reducers/blogReducer"

const CommentForm = ({ id }) => {
  const dispatch = useDispatch()

  const handleComment = (event) => {
    event.preventDefault()

    const comment = event.target.comment.value
    event.target.comment.value = ''

    dispatch(addComment({ id, comment }))
  }

  return (
    <Form onSubmit={handleComment}>
      <Form.Group>
        <Form.Control name='comment' />
        <Button variant="primary" type="submit">add comment</Button>
      </Form.Group>
    </Form>
  )
}

export default CommentForm