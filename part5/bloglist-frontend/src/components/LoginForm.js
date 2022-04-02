import { useState } from 'react'
import PropTypes from 'prop-types'
import Notification from './Notification'

const LoginForm = ({ loginUser, messageContent }) => {
  const [usernameValue, setUsernameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    loginUser({
      username: usernameValue,
      password: passwordValue
    })

    setUsernameValue('')
    setPasswordValue('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={messageContent} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            value={usernameValue}
            onChange={({ target }) => setUsernameValue(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={passwordValue}
            onChange={({ target }) => setPasswordValue(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  messageContent: PropTypes.object.isRequired
}

export default LoginForm