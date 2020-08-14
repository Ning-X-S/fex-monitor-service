const client = require('../utils/client-es')
const ServiceError = require('../utils/error')
const { sequelize } = require('../model/init')
const path = require('path')
const { readFileSync } = require('fs')
const SourceMap = require('source-map')
const { SourceMapConsumer } = SourceMap
const redis = require('../utils/redis')

// init --- test
function test (ctx) {
  console.log(ctx.params)
  const test = true
  if (test) {
    throw new ServiceError({ code: 4000001, message: 'test', response: {} })
  } else {
    ctx.body = {
      error_code: 0,
      data: {
        msg: 'test'
      },
      message: 'koa test'
    }
  }
}

// kql + sql --- test
async function test1 (ctx) {
  try {
    let recent = null
    // sequelize.query 原始查询
    const res = await sequelize.query('SELECT id,es_id,timestamp FROM jarvis_error_info ORDER BY timestamp DESC LIMIT 1;', { type: sequelize.QueryTypes.SELECT })
    if (res && res[0]) {
      recent = res[0]
    } else {
      recent = {
        timestamp: 0
      }
    }
    const result = await client.search({
      index: 'fex_jarvis_*',
      body: {
        size: 1,
        track_total_hits: true,
        query: {
          bool: {
            filter: [
              {
                match: {
                  'content._kind.keyword': 'error'
                }
              },
              // kql条件语句
              {
                bool: {
                  minimum_should_match: 1,
                  should: [
                    {
                      range: {
                        timestamp: {
                          gt: recent.timestamp
                        }
                      }
                    }
                  ]
                }
              }
              // {
              //   range: {
              //     '@timestamp': {
              //       format: 'yyyy-MM-dd HH:mm:ss.SSSSSS',
              //       gt: '2020-07-24 18:32:06.000000',
              //       time_zone: '+08:00'
              //     }
              //   }
              // }
            ]
          }
        },
        sort: [{ '@timestamp': { order: 'asc', unmapped_type: 'boolean' } }]
      }
    })
    console.log(result.hits)
    ctx.body = {
      error_code: 0,
      message: 'success',
      data: result
    }
  } catch (error) {
    console.log(error)
  }
}

// source-map --- test
async function test2 (ctx) {
  try {
    const { line = 1, col = 54272, file = 'jarvis-sdk.1.2.7.min.js' } = ctx.params
    const res = await getMapLocation(file + '.map', Number(line), Number(col))
    console.log(res)
    ctx.body = {
      error_code: 0,
      message: 'success',
      data: res
    }
  } catch (error) {
    console.log(error)
  }
}

function getMapLocation (fileName, line, column) {
  return new Promise((resolve, reject) => {
    try {
      const rawSourceMap = JSON.parse(readFileSync(path.join(__dirname, '../../static', fileName), 'utf8'))
      SourceMapConsumer.with(rawSourceMap, null, consumer => {
        const response = consumer.originalPositionFor({
          line: line,
          column: column
        })
        // 拿到map源文件列表
        const sources = consumer.sources
        // 根据来源文件名找到map中对应的下标
        const sourcesIndex = sources.indexOf(response.source)
        // 取到源文件的代码
        const sourcesContent = consumer.sourcesContent[sourcesIndex]
        // 以回车符号和换行符分割为数组
        if (sourcesContent) {
          const errorLine = sourcesContent.split(/\r?\n/g)
          // 截取错误行数的前后5行代码
          if (response.line < 6) {
            // 错误位于前5行
            response.error_line = errorLine.splice(0, response.line + 5)
            response.curr_error_index = response.line
          } else if (response.line > errorLine.length - 5) {
            // 错误位于后五行
            response.error_line = errorLine.slice(response.line - 5 - 1)
            response.curr_error_index = 6
          } else {
            response.error_line = errorLine.splice(response.line - 5 - 1, 11)
            response.curr_error_index = 6
          }
        }
        consumer.destroy()
        console.log(response)
        resolve({ ...{ error_line: [] }, ...response })
      })
    } catch (error) {
      resolve({ status: -1, error, error_line: [] })
    }
  })
}

// redis -- test

async function test3 (ctx) {
  const res = await redis.incr('qiuwenjude    test')
  redis.expire('qiuwenjude    test', 5)
  ctx.body = {
    error_code: 0,
    message: 'success',
    data: res
  }
}

module.exports = {
  test,
  test1,
  test2,
  test3
}
