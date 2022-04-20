import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useField } from '../hooks'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import Notification from './Notification'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      dispatch(setUser(user))
      dispatch(setNotification(`Welcome ${user.username}`, 'success', 5))
      navigate('/')
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'danger', 5))
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control {...username} />
          <Form.Label>password</Form.Label>
          <Form.Control {...password} />
          <Button variant="primary" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm