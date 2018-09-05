import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: 'https://sheltered-earth-60660.herokuapp.com/'
    // baseURL: `http://localhost:8081`
  })
}
