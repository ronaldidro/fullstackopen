const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })

  response.json(users)
})

const requestValidation = async request => {
  const { username, password } = request.body

  if (!username || !password) return 'username or password are missing'

  if (password.length < 3) return 'minimum password length must be 3'
  
  const existingUser = await User.findOne({ username })
  if (existingUser) return 'username must be unique'
}

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const message = await requestValidation(request)

  if(message) {
    return response.status(400).json({
      error: message
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter