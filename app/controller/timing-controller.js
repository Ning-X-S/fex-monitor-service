const timingService = require('../service/timing-service')

async function getLogList (ctx, next) {
  const res = await timingService.getLogList(ctx, next)
  ctx.body = {
    error_code: 0,
    message: '获取数据成功',
    data: res
  }
}

module.exports = {
  getLogList
}
