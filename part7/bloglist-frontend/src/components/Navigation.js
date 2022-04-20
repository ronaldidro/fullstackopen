import { Button, Nav, Navbar } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from '../reducers/userReducer'

const padding = {
  paddingRight: 5
}

const Navigation = ({ user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if(!user) return null
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(setUser(null))
    navigate('/login')
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">users</Link>      
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <em>{user.name} logged in</em>
            <Button onClick={handleLogout} variant="warning">logout</Button>
        </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation