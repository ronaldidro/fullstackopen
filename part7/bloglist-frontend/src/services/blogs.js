import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (object) => {
  const config = {
    headers: { 
      Authorization: token 
    }
  }

  const response = await axios.post(baseUrl, object, config)
  return response.data
}

const update = (id, object) => {
  const request = axios.put(`${baseUrl}/${id}`, object)
  return request.then(response => response.data)
}

const remove = id => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

const comment = async (id, object) => {
  const response =  await axios.post(`${baseUrl}/${id}/comments`, object)
  return response.data
}

export default { getAll, create, update, remove, comment, setToken }