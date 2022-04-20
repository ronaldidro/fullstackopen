import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteBlog, giveLike } from "../reducers/blogReducer"
import CommentForm from "./CommentForm"

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
        <Button onClick={handleLikes} variant="info">like</Button>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <CommentForm id={blog.id} />
      <ul>
        {blog.comments && blog.comments.map((comment, id) => <li key={id}>{comment}</li>)}
      </ul>
      {blog.user.username === loggedUser.username && (
        <Button onClick={handleDelete} variant="danger">remove</Button>
      )}
    </div>
  )
}

export default Blog