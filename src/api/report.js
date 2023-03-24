import request from '@/utils/report-request'

export function getReportList(params) {
  return request({
    url: '/api/report/list',
    method: 'get',
    params
  })
}

export function getLogList(params) {
//   return request.get('/api/log/list', { params })
  return request({
    url: '/api/log/list',
    method: 'get',
    params
  })
}

export function createReport(data) {
//   console.log(`createReport:${JSON.stringify(data)}`)
//   return request.post('/api/report/create', { appName: 'fxj', buildNum: 200 })
  return request({
    // baseURL: 'http://localhost:3000',
    url: '/api/report/create',
    method: 'post',
    data
    // data: { appName: 'fxj', buildNum: 200 }
  })
}
