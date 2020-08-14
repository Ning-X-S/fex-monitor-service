const ServiceError = require('../utils/error')
const { sqlFindOtherError } = require('../utils/error-list')
const { JarvisMark } = require('../model')

// 打印前端日志
async function createMark (ctx, next) {
  try {
    const list = ctx.params.list
    const res = await JarvisMark.bulkCreate(list)
    return { list: res }
  } catch (err) {
    throw new ServiceError(sqlFindOtherError)
  }
}

module.exports = {
  createMark
}
