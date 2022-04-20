import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteBlog, giveLike } from "../reducers/blogReducer"

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedUser = useSelector(state => state.user)

  if(!blog) return null
  
  const handleLikes = () => {
    dispatch(giveLike({ ...blog, likes: blog.likes + 1 }))
  }

  const handleDelete = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      dispatch(deleteBlog(blog))
      navigate('/')
    }
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>      
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes
        <Button onClick={handleLikes} variant="primary">like</Button>
      </div>
      <div>added by {blog.user.name}</div>
      {blog.user.username === loggedUser.username && (
        <Button onClick={handleDelete} variant="danger">remove</Button>
      )}
    </div>
  )
}

export default Blog