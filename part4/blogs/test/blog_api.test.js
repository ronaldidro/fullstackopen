const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const loginUser = async (username, password) => await api.post('/api/login').send({ username, password })
const getToken = async () => {
  const loginResponse = await loginUser('root', 'sekret')
  const { body: { token } } = loginResponse
  return token
}

describe('users test', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('addition of a invalid users', () => {
    test('fails with status code 400 if data invalid', async () => {
      const newUser = {
        name: "Ron"
      }
    
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
  })

  describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain(newUser.username)
    })
  })
})

describe('blogs test', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)  
  })

  describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
  
    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
      expect(titles).toContain(
        'blog test title II'
      )
    })

    test('id is the unique identifier of the blogs', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      expect(blogToView.id).toBeDefined()
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  }) 

  describe('updation of a blog', () => {
    test('succeeds with data and id valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      
      const newBlogData = {
        likes: 1000
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlogData)
        .expect(200)
    })
  })
  
  describe('addition of a new blog', () => {
    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        author: 'blog test without title and url test',
        likes: 40
      }
  
      const token = await getToken()
    
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(400)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails when token is not sent', async () => {
      const newBlog = {
        title: 'blog post test title',
        author: 'blog post test author',
        url: 'blog post test url',
        likes: 30
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'blog post test title',
        author: 'blog post test author',
        url: 'blog post test url',
        likes: 30
      }
  
      const token = await getToken()
  
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(
        'blog post test title'
      )
    })

    test('if the likes property is missing, it will have 0 by default', async () => {
      const newBlog = {
        title: 'blog post test title no likes',
        author: 'blog post test author no likes',
        url: 'blog post test url no likes'
      }
  
      const token = await getToken()
  
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
    
      expect(response.body.likes).toBe(0)
    })
  })
  
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const token = await getToken()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})