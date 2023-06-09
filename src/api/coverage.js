import request from '@/utils/coverage-request'

export function getReportList(params) {
  return request({
    url: '/coverage-api/report/list',
    method: 'get',
    params
  })
}

export function getLogList(params) {
  //   return request.get('/api/log/list', { params })
  return request({
    url: '/coverage-api/log/list',
    method: 'get',
    params
  })
}

export function getLogBuildList(params) {
  //   return request.get('/api/log/list', { params })
  return request({
    url: '/coverage-api/log/build/list',
    method: 'get',
    params
  })
}

export function createReport(data) {
  //   console.log(`createReport:${JSON.stringify(data)}`)
  //   return request.post('/api/report/create', { appName: 'fxj', buildNum: 200 })
  return request({
    // baseURL: 'http://localhost:3000',
    url: '/coverage-api/report/create',
    method: 'post',
    data
    // data: { appName: 'fxj', buildNum: 200 }
  })
}
