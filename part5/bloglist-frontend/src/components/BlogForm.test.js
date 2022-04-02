import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'blog form title test' }
  })

  fireEvent.change(authorInput, {
    target: { value: 'blog form author test' }
  })

  fireEvent.change(urlInput, {
    target: { value: 'blog form url test' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blog form title test')
  expect(createBlog.mock.calls[0][0].author).toBe('blog form author test')
  expect(createBlog.mock.calls[0][0].url).toBe('blog form url test')
})