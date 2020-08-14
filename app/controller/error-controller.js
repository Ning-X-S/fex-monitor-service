const errorService = require('../service/error-service')

async function getErrorList (ctx, next) {
  const res = await errorService.getErrorList(ctx, next)
  ctx.body = {
    error_code: 0,
    message: '获取数据成功',
    data: res
  }
}

module.exports = {
  getErrorList
}
