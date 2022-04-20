import { Table } from "react-bootstrap"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blogs = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <Table striped>
      <tbody>
        {blogs.map(blog =>
          <tr key={blog.id}>
            <td style={blogStyle}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}

export default Blogs