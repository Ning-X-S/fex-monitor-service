const client = require('../utils/client-es')
const { log } = require('../utils/log')
const { JarvisError } = require('../model')
const ServiceError = require('../utils/error')
const { createLogError, searchEsError, searchParamsError, sqlFindOtherError } = require('../utils/error-list')
const { getMapLocation, getFileInfo } = require('../schedule/sync-info')
const { sendMobGroup, sendMobWeb } = require('../utils/webhook')
const redis = require('../utils/redis')

// 打印前端日志
async function createRecord (ctx, next) {
  try {
    let activityList = ctx.params.activityList || ctx.params.reportList
    if (typeof activityList === 'string') {
      activityList = JSON.parse(activityList)
    }
    activityList.forEach(item => {
      if (item._kind === 'error') {
        log.error(item)
        getNumRedis(item)
      } else {
        log.info(item)
      }
    })
    return {}
  } catch (err) {
    throw new ServiceError(createLogError)
  }
}

// 打印客户端日志
async function createAPPRecord (ctx, next) {
  try {
    let logctx = ''
    if (ctx.params.via === 'android') {
      if (ctx.params.type === 'crash' || ctx.params.type === 'behavior') {
        // 处理一下数组左右两侧的引号
        // ctx.params.ctx = JSON.stringify(ctx.params.ctx)
        ctx.params.ctx = JSON.parse(ctx.params.ctx.replace(/"\[/g, '[').replace(/\]"/g, ']'))
      } else {
        ctx.params.ctx = JSON.parse(ctx.params.ctx)
      }
      logctx = ctx.params
    } else {
      if (typeof ctx.params.__crash === 'string') {
        logctx = JSON.parse(ctx.params.__crash)
      } else {
        logctx = ctx.params
      }
      if (logctx.action === 'start_app') {
        logctx.ctx.start_time = Number(logctx.ctx.start_time)
      }
      if (logctx.cver === '0.9.2') {
        logctx.ctx.start_time = logctx.ctx.start_time * 1000
      }
      logctx.channel_id = Number(logctx.channel_id)
      logctx.client_id = Number(logctx.client_id)
      logctx.ctime = Number(logctx.ctime)
      logctx.package_type = Number(logctx.package_type)
    }
    logctx.__type = 'mob'
    if (logctx.type === 'crash') {
      log.error(logctx)
      // 发送错误报警
      sendMobGroup(logctx)
    } else {
      log.info(logctx)
    }
    return {}
  } catch (err) {
    console.log(err)
    throw new ServiceError(createLogError)
  }
}

// 获取ES某一条记录详情
async function getEsDetail (ctx, next) {
  const { id = '', pid = '' } = ctx.params
  console.log(id, pid)
  if (!id || !pid) {
    throw new ServiceError(searchParamsError)
  }
  try {
    const resultEs = await client.search({
      index: 'fex_jarvis_*',
      body: {
        size: 1,
        query: {
          bool: {
            filter: [
              {
                match: {
                  _id: id
                }
              },
              {
                match: {
                  'content._pid.keyword': pid
                }
              }
            ]
          }
        }
      }
    })
    const result = resultEs.body.hits.hits[0]._source
    let stack = result.content.stack || []
    if (typeof stack === 'string') {
      const { fileName, line, column } = getFileInfo(stack)
      if (fileName && line && column) {
        const res = await getMapLocation(fileName, line, column)
        stack = [res]
      } else {
        stack = [{ message: stack, error_line: [] }]
      }
    } else if (typeof stack === 'object') {
      for (const j in stack) {
        const { fileName, line, column } = getFileInfo(stack[j])
        if (fileName && line && column) {
          stack[j] = { ...await getMapLocation(fileName, line, column), ...{ message: stack[j] } }
        } else {
          stack[j] = { message: stack[j], error_line: [] }
        }
      }
    }
    result.content.stack = stack
    return { ...result }
  } catch (err) {
    console.log(err)
    throw new ServiceError(searchEsError)
  }
}

// 获取某条记录详情
async function getDetail (ctx, next) {
  const { id = '', pid = '' } = ctx.params
  console.log(id, pid)
  if (!id || !pid) {
    throw new ServiceError(searchParamsError)
  }
  try {
    const res = await JarvisError.findOne({
      attributes: {
        exclude: ['created_at', 'updated_at']
      },
      where: {
        es_id: id
      }
    })
    if (res !== null) {
      return { ...await res.get() }
    } else {
      return null
    }
  } catch (err) {
    throw new ServiceError(sqlFindOtherError)
  }
}

async function getNumRedis (item) {
  try {
    const str = `${item.filename}$*$${item.message}`
    const res = await redis.incr(str)
    if (res === 1) {
      await redis.expire(str, 60)
    } else if (res > 5) {
      await redis.del(str)
      sendMobWeb(item)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createRecord,
  createAPPRecord,
  getDetail,
  getEsDetail
}
