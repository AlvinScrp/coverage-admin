import axios from 'axios'
import { Message, Notification } from 'element-ui'

// create an axios instance
const service = axios.create({
//   baseURL: process.env.VUE_APP_REPORT_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data

    // if the custom code is not 0, it is judged as an error.
    if (res.responseCode !== 0) {
      Message({
        showClose: true,
        message: res.message || 'Error',
        type: 'error',
        duration: 10 * 1000
      })
      return res
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

