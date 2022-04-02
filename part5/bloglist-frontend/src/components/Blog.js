import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, loggedUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = () => {
    updateBlog(blog.id, { likes: blog.likes + 1 })
  }

  const handleDelete = () => {
    removeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible) }>{ visible ? 'hide' : 'view' }</button>
      </div>
      {visible && (
        <div className='blogDetail'>
          <div>{blog.url}</div>
          <div className='likesDiv'>
            likes {blog.likes}
            <button onClick={handleLikes}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {blog.user.username === loggedUser && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func,
  removeBlog: PropTypes.func,
  loggedUser: PropTypes.string
}

export default Blog