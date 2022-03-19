const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'blog test title I',
    author: 'blog test author I',
    url: 'blog test url I',
    likes: 10
  },
  {
    title: 'blog test title II',
    author: 'blog test author II',
    url: 'blog test url II',
    likes: 20
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'willremovethissoon', url: 'willremovethissoon', likes: 1 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}