class ServiceError extends Error {
  constructor (options) {
    super(options)
    const { message = '请求失败', response = {}, status = 200, code = -1 } = options
    this.message = message
    this.status = status
    this.code = code
    this.response = response
  }
}

module.exports = ServiceError
