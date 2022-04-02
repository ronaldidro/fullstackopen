import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog/> varied tests', () => {

  let component

  const blog = {
    title: 'Title test',
    author: 'Author test',
    url: 'Url test',
    likes: 10,
    user: {
      name: 'User test'
    }
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} updateBlog={mockHandler} />
    )
  })

  test('at start only title and author are render', () => {
    const element = component.getByText(
      'Title test Author test'
    )
    expect(element).toBeDefined()
  })

  test('at start dont show url and likes', () => {
    const div = component.container.querySelector('.blogDetail')
    expect(div).toBeNull()
  })

  test('url and likes shows when view button is clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.blogDetail')
    expect(div).toHaveTextContent(
      `Url testlikes ${blog.likes}`
    )
  })

  test('two clicks on like button', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})