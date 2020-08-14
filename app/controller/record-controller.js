const recordService = require('../service/record-service')
const ServiceError = require('../utils/error')
const { sqlFindNull, syncRecordError } = require('../utils/error-list')
const { start } = require('../schedule/sync-info')

async function createRecord (ctx, next) {
  const res = await recordService.createRecord(ctx, next)
  ctx.body = {
    error_code: 0,
    message: 'success',
    data: res
  }
}

async function createAPPRecord (ctx, next) {
  const res = await recordService.createAPPRecord(ctx, next)
  ctx.body = {
    error_code: 0,
    message: 'success',
    data: res
  }
}

async function getDetail (ctx, next) {
  const res = await recordService.getEsDetail(ctx, next)
  if (res !== null) {
    ctx.body = {
      error_code: 0,
      message: '获取数据成功',
      data: res
    }
  } else {
    throw new ServiceError(sqlFindNull)
  }
}

async function syncRecord (ctx, next) {
  try {
    await start()
    ctx.body = {
      error_code: 0,
      message: '同步数据成功',
      data: {}
    }
  } catch (err) {
    throw new ServiceError(syncRecordError)
  }
}

module.exports = {
  createRecord,
  createAPPRecord,
  getDetail,
  syncRecord
}
