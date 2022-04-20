import { useRef } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Togglable from './Togglable'

const BlogForm = () => {
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const addBlog = (event) => {
    event.preventDefault()

    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value

    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''

    dispatch(createBlog({ title, author, url }))
    dispatch(setNotification(`a new blog ${title} by ${author} added`, 'success', 5))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <h2>Create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control name='title' />
          <Form.Label>author</Form.Label>
          <Form.Control name='author' />
          <Form.Label>url</Form.Label>
          <Form.Control name='url' />
          <Button variant="primary" type="submit">create</Button>
        </Form.Group>
      </Form>
    </Togglable>
  )
}

export default BlogForm