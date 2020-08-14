// 日志错误4000+0开头
const createLogError = {
  code: 4000001,
  message: '写入数据失败',
  response: {}
}

// Elasticsearch错误4000+1开头
const searchEsError = {
  code: 4000101,
  message: '查询失败',
  response: {}
}

const searchParamsError = {
  code: 4000102,
  message: '缺少参数',
  response: {}
}

// 文件操作错误4000+4开头
const staticError = {
  status: 404,
  code: 404,
  message: '资源不存在',
  response: {}
}

const streamError = {
  code: 4000401,
  message: '写入文件失败',
  response: {}
}

const downloadError = {
  code: 4000402,
  message: '下载资源错误',
  response: {}
}

// 数据库错误4000+5开头
const sqlFindNull = {
  code: 4000501,
  message: '信息暂未同步，请稍后重试',
  response: {}
}

const sqlFindOtherError = {
  code: 4000502,
  message: 'sql未知错误',
  response: {}
}

const syncRecordError = {
  code: 4000503,
  message: '数据同步失败，请稍后重试',
  response: {}
}

// redis错误
const redisClientError = {
  code: 4000601,
  message: 'redis连接错误',
  response: {}
}

module.exports = {
  createLogError,
  searchEsError,
  searchParamsError,
  streamError,
  staticError,
  downloadError,
  sqlFindNull,
  sqlFindOtherError,
  syncRecordError,
  redisClientError
}
