describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')

      cy.get('.error').contains('invalid username or password')

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('a blog title created by cypress')
      cy.get('#author').type('a blog author created by cypress')
      cy.get('#url').type('a blog url created by cypress')
      cy.get('#create-button').click()
      cy.contains('a blog title created by cypress')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog title cypress',
          author: 'another blog author cypress',
          url: 'another blog url cypress'
        })
      })

      it('it can be liked', function () {
        cy.contains('another blog title cypress').parent().find('button').as('theButton')
        cy.get('@theButton').click()

        cy.contains('like').click()
        cy.get('.blogDetail').should('contain', 'likes 1')
      })

      it('it can be deleted', function () {
        cy.contains('another blog title cypress').parent().find('button').as('theButton')
        cy.get('@theButton').click()

        cy.contains('remove').click()
        cy.on('window:confirm',() => true)
      })
    })

    describe('When some blog exists', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog title', author: 'first blog author', url: 'first blog url', likes: 10 })
        cy.createBlog({ title: 'second blog title', author: 'second blog author', url: 'second blog url', likes: 50 })
        cy.createBlog({ title: 'third blog title', author: 'third blog author', url: 'third blog url', likes: 40 })
      })

      it('first has maximum likes', function() {
        cy.contains('view').click()
        cy.get('.likesDiv').contains(50)
      })
    })
  })
})