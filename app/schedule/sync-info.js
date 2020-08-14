const client = require('../utils/client-es')
const { JarvisError } = require('../model')
const path = require('path')
const { readFileSync } = require('fs')
const SourceMap = require('source-map')
const { SourceMapConsumer } = SourceMap
const { sequelize } = require('../model/init')
const size = 1000

async function start (type = 'error') {
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
    // sequelize --- API查询
    // const res = await JarvisError.findOne({
    //   attributes: ['id', 'es_id', 'timestamp'],
    //   order: [['timestamp', 'DESC']]
    // })
    // if (res !== null) {
    //   recent = await res.get()
    // } else {
    //   recent = {
    //     timestamp: 0
    //   }
    // }
    const result = await client.search({
      index: 'fex_jarvis_*',
      body: {
        size: size,
        query: {
          bool: {
            filter: [
              {
                match: {
                  'content._kind.keyword': type
                }
              },
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
            ]
          }
        },
        sort: [{ timestamp: { order: 'asc', unmapped_type: 'boolean' } }]
      }
    })
    if (result.body.hits.hits.length) {
      const list = []
      const temp = result.body.hits.hits
      for (const i in temp) {
        const content = temp[i]._source
        // test数据
        // content.content.stack = [
        //   "TypeError: Failed to execute 'observe' on 'PerformanceObserver': A Performance Observer MUST have at least one valid entryType in its entryTypes attribute.",
        //   'http://b.lehe.com/new/jarvis-sdk.1.2.7.min.js:1:51793',
        //   'new Promise (<anonymous>)',
        //   'd (http://b.lehe.com/new/jarvis-sdk.1.2.7.min.js:1:51148)'
        // ]
        // console.log(content.content.stack)
        let stack = content.content.stack || []
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
        content.content.stack = stack
        list.push({
          es_id: temp[i]._id,
          log_date_time: temp[i]._source.dateTime,
          timestamp: temp[i]._source.timestamp,
          content: JSON.stringify(content)
        })
      }
      await JarvisError.bulkCreate(list)
      if (result.body.hits.total.value > size) {
        start(type)
      }
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
        resolve({ ...{ error_line: [] }, ...response })
      })
    } catch (error) {
      resolve({ status: -1, error, error_line: [] })
    }
  })
}

function getFileInfo (str) {
  if (str.indexOf('min.js') > -1 || str.indexOf('.js') > -1) {
    const fileArr = str.split('/').pop().split(':')
    const fileName = `${fileArr[0]}.map`
    const line = parseInt(fileArr[1])
    const column = parseInt(fileArr[2])
    return { fileName, line, column }
  } else {
    return { fileName: null, line: null, column: null }
  }
}

module.exports = {
  start,
  getMapLocation,
  getFileInfo
}
