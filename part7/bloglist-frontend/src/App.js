import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, useMatch } from "react-router-dom"
import styled from 'styled-components'
import Blog from './components/Blog'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import User from './components/User'
import Users from './components/Users'
import { useResource } from './hooks'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const App = () => {
  const { blogs, user } = useSelector(state => state)
  const dispatch = useDispatch()
  const [users] = useResource('/api/users')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const matchUser = useMatch('/users/:id')
  const foundUser = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const foundBlog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  return (
    <Page>
      {user && <Navigation user={user} />}
      <h2>Blog App</h2>
      <Routes>
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User user={foundUser} />} />
        <Route path="/blogs/:id" element={<Blog blog={foundBlog} />} />
        <Route path="/login" element={!user ? <LoginForm /> : <Navigate replace to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
      </Routes>
    </Page>
  )
}

export default App