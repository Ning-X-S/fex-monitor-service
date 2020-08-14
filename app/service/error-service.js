const client = require('../utils/client-es')
const ServiceError = require('../utils/error')
const { searchEsError } = require('../utils/error-list')
const { initMapData, initItemsMapData } = require('../utils/util')
const { JarvisMark } = require('../model')

async function getErrorList (ctx, next) {
  try {
    let { p = 1, size = 20, pid = '' } = ctx.params
    p = Number(p)
    size = Number(size)
    const result = await client.search({
      index: 'fex_jarvis_*',
      body: {
        from: (p - 1) * size,
        track_total_hits: true,
        size: 0,
        // hits是否返回_source
        // stored_fields: ['*'],
        query: {
          bool: {
            filter: [
              {
                match: {
                  'content._kind': 'error'
                }
              },
              {
                match: {
                  'content._pid.keyword': pid
                }
              }
              // {
              //   range: {
              //     '@timestamp': {
              //       format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
              //       gte: '2020-07-08 19:30:00',
              //       lte: '2020-07-14 23:59:59'
              //     }
              //   }
              // }
            ]
          }
        },
        aggs: {
          message_buckets: {
            terms: {
              // field: 'content.message.keyword',
              show_term_doc_count_error: true,
              shard_size: 200,
              size: Math.pow(2, 31) - 1,
              //   script: "( _value.indexOf('(') > 0 ? _value.substring(0, _value.indexOf('(')) : _value )",
              script: {
                lang: 'painless',
                source: "doc['content.message.keyword'].value + '$*$' + doc['content._url.keyword'].value"
              }
            },
            aggs: {
              recent_items: {
                top_hits: {
                  // 排序
                  sort: [
                    {
                      'dateTime.keyword': {
                        order: 'desc'
                      }
                    }
                  ],
                  // 可以加from
                  from: 0,
                  size: 1
                }
              },
              farthest_items: {
                top_hits: {
                  // 排序
                  sort: [
                    {
                      'dateTime.keyword': {
                        order: 'asc'
                      }
                    }
                  ],
                  // 可以加from
                  from: 0,
                  size: 1
                }
              }
            }
          }
        }
      }
    })
    const data = initMapData().reverse()
    const temp = result.body.aggregations.message_buckets.buckets.sort((a, b) => new Date(b.recent_items.hits.hits[0]._source.dateTime).getTime() - new Date(a.recent_items.hits.hits[0]._source.dateTime).getTime())
    const markRes = await JarvisMark.findAll({
      attributes: ['es_id'],
      where: {
        es_id: temp.map(item => item.recent_items.hits.hits[0]._id)
      }
    })
    let tempResult = []
    // 对比数据库删除掉mysql中已有的数据
    if (markRes.length) {
      for (let i = 0; i < temp.length; i++) {
        if (markRes.findIndex((item, id) => item.es_id === temp[i].recent_items.hits.hits[0]._id) === -1) {
          tempResult.push(temp[i])
        }
      }
    } else {
      tempResult = temp
    }
    // 然后自己分页
    const buckets = tempResult.splice((p - 1) * size, size)
    for (let i = 0; i < buckets.length; i++) {
      // 如果只有一条message那么肯定只有一个user
      const bucketsAgain = await client.search({
        index: 'fex_jarvis_*',
        body: {
          track_total_hits: true,
          size: 0,
          query: {
            bool: {
              filter: [
                {
                  match: {
                    'content.message.keyword': buckets[i].key.split('$*$')[0]
                  }
                },
                {
                  match: {
                    'content._pid.keyword': pid
                  }
                },
                {
                  match: {
                    'content._url.keyword': buckets[i].key.split('$*$')[1]
                  }
                }
              ]
            }
          },
          aggs: {
            user_buckets: {
              terms: {
                field: 'content._uuid.keyword',
                size: Math.pow(2, 31) - 1
              }
            },
            time_line: {
              terms: {
                field: 'dateTime.keyword',
                size: Math.pow(2, 31) - 1,
                script: {
                  lang: 'painless',
                  inline: '_value.substring(0,13)'
                }
              }
            }
          }
        }
      })
      buckets[i].data = initItemsMapData(data, bucketsAgain.body.aggregations.time_line.buckets)
      buckets[i].users = bucketsAgain.body.aggregations.user_buckets.buckets.length
    }
    return {
      p,
      size,
      total: tempResult.length,
      list: buckets,
      doc_count_error_upper_bound: result.body.aggregations.message_buckets.doc_count_error_upper_bound,
      sum_other_doc_count: result.body.aggregations.message_buckets.sum_other_doc_count
    }
  } catch (err) {
    console.log(err)
    throw new ServiceError(searchEsError)
  }
}

module.exports = {
  getErrorList
}
