import axios from 'axios'

export default() => {
  return axios.create({
    baseURL: 'http://cityschedulertest2-env.asdeggzmxd.us-east-2.elasticbeanstalk.com/'
    // baseURL: `http://localhost:8081`
  })
}
