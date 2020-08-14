module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      let { message, code, status } = err
      ctx.status = status || 400
      if (status === 405) {
        code = 0
        message = '请求方法不被允许'
      }
      ctx.body = {
        error_code: code,
        message: message || '请求出错',
        data: {}
      }
    }
  }
}
