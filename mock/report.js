const Mock = require('mockjs')

const reportListData = Mock.mock({
  'items|10': [{
    appName: 'fxj',
    buildNum: '@integer(100, 200)',
    relativebuildNum: '@integer(100, 200)',
    'increment|2': false,
    time: '20231201223350',
    formatTime: '2023年12月01日 22:33:50',
    previewUrl: 'http://file-tx.webuyops.com/download/mobile-coco',
    downloadUrl: 'http://file-tx.webuyops.com/download/mobile-coco'
  }]
})

const logListData = Mock.mock({
  'items|10': [{
    name: /fxj_[a-z]{2,6}_20230213-1402557\.ec/,
    path: /\/[a-z]{2,6}\/[a-z]{2,6}\/fxj\/fxj_[a-z]{2,6}_20230213-1402557\.ec/
  }]
})

module.exports = [
  {
    url: '/api/report/list',
    type: 'get',
    response: config => {
      return {
        data: {
          responseCode: 0,
          message: 'Success',
          status: true,
          entry: {
            pageNo: 5,
            pageSize: 10,
            count: 199,
            list: reportListData.items
          }
        }
      }
    }
  },
  {
    url: '/api/report/create',
    type: 'post',
    response: config => {
      return {
        data: {
          code: 0,
          message: 'Success',
          status: true,
          entry: 1
        }
      }
    }
  },
  {
    url: '/api/log/list',
    type: 'get',
    response: config => {
      return {
        data: {
          code: 0,
          message: 'Success',
          status: true,
          entry: {
            list: logListData.items
          }
        }
      }
    }
  }
]
