import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  let id = 0
  let changedBlog = {}

  switch(action.type) {
    case 'INIT_BLOGS':
      return action.data
    
    case 'NEW_BLOG':
      return [...state, action.data]
    
    case 'GIVE_LIKE':
      id = action.data.id
      changedBlog = action.data
      return state.map(blog => blog.id !== id ? blog : changedBlog)
    
    case 'ADD_COMMENT':
      id = action.data.id
      changedBlog = action.data
      return state.map(blog => blog.id !== id ? blog : changedBlog)

    case 'REMOVE_BLOG':
      id = action.data.id
      return state.filter(blog => blog.id !== id)
    
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const giveLike = (blog) => {
  const { id } = blog

  return async dispatch => {
    const returnedBlog = await blogService.update(id, blog)
    dispatch({
      type: 'GIVE_LIKE',
      data: returnedBlog
    })
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    await blogService.remove(blog.id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: blog
    })
  }
}

export const addComment = (blog) => {
  const { id, comment } = blog

  return async dispatch => {
    const returnedBlog = await blogService.comment(id, { comment })
    dispatch({
      type: 'ADD_COMMENT',
      data: returnedBlog
    })
  }
}

export default blogReducer