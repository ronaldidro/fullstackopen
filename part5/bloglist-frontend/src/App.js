import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({ content: null })
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((firstBlog, secondBLog) => secondBLog.likes - firstBlog.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const showMessage = (content, type) => {
    setMessage({ content, type })
    setTimeout(() => {
      setMessage({ content: null })
    }, 5000)
  }

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      showMessage(exception.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog).sort((firstBlog, secondBLog) => secondBLog.likes - firstBlog.likes))
        showMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
      })
      .catch(exception => {
        showMessage(`${exception.response.data.error}`, 'error')
      })

    blogFormRef.current.toggleVisibility()
  }

  const putBlog = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(exception => {
        showMessage(`${exception.response.data.error}`, 'error')
        setBlogs(blogs.filter(blog => blog.id !== id))
      })
  }

  const deleteBlog = (blogObject) => {
    if(window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author} ?`)){
      blogService
        .remove(blogObject.id)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        )
        .catch(exception => {
          showMessage(`${exception.response.data.error}`, 'error')
        })
    }
  }

  if(user === null) {
    return <LoginForm loginUser={handleLogin} messageContent={message} />
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <span>{user.name} logged in</span>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br/>
      <div className='blogList'>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={putBlog} removeBlog={deleteBlog} loggedUser={user.username} />
        )}
      </div>
    </div>
  )
}

export default App
