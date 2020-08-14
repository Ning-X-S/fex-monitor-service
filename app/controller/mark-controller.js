const markService = require('../service/mark-service')

async function createMark (ctx, next) {
  const res = await markService.createMark(ctx, next)
  ctx.body = {
    error_code: 0,
    message: 'success',
    data: res
  }
}

module.exports = {
  createMark
}
