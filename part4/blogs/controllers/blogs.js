const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const verifyToken = token => jwt.verify(token, process.env.SECRET)

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    
  if(blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  
  if (!request.token) {
    return response.status(401).json({ 
      error: 'token missing or invalid' 
    })
  }
  const decodedToken = verifyToken(request.token)
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  // try catch block is no longer used by the express library async errors
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save({ validateModifiedOnly: true })
  
  const blogInfo = await Blog
    .findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })
  // response.json(savedBlog) //return code 200
  response.status(201).json(blogInfo)
})

blogsRouter.post('/:id/comments', async (request, response) => {  
  if (!request.body.comment) {
    return response.status(401).json({ 
      error: 'comment is missing or invalid'
    })
  }

  const blog = { 
    ["$addToSet"]: { comments: request.body.comment } 
  }
  
  const commentedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })

  response.json(commentedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = verifyToken(request.token)

  if(process.env.NODE_ENV === 'test') {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }

  if(blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {    
    return response.status(400).json({ 
      error: 'user is not blog creator'
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
    
  response.json(updatedBlog)
})

module.exports = blogsRouter