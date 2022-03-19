const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.map(item => item.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs = []) => {
  const mostLikes = Math.max.apply(null, blogs.map(item => item.likes))
  const { title, author, likes } = blogs.find(item => item.likes === mostLikes)
  return favorite = { title, author, likes }
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.reduce(blogs, (result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + 1;
    return result
  }, {});

  const maxValue = _.max(Object.values(blogsByAuthor))
  const authorMaxValue = Object.keys(blogsByAuthor).filter(author => blogsByAuthor[author] === maxValue)

  return { author: authorMaxValue[0], blogs: maxValue }
}

const mostLikes = (blogs) => {
  const likesByAuthor = _.reduce(blogs, (result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes;
    return result
  }, {});

  const maxValue = _.max(Object.values(likesByAuthor))
  const authorMaxValue = Object.keys(likesByAuthor).filter(author => likesByAuthor[author] === maxValue)

  return { author: authorMaxValue[0], likes: maxValue }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}