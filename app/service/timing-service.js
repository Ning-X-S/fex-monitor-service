const client = require('../utils/client-es')
const ServiceError = require('../utils/error')
const { searchEsError } = require('../utils/error-list')
const fs = require('fs')
const dayjs = require('dayjs')

async function getLogList (ctx, next) {
  try {
    const { p = 1, size = 20, pid = '' } = ctx.params
    const time = dayjs()
    const percentRes = await client.search({
      index: 'fex_jarvis_*',
      body: {
        query: {
          match: {
            'content._type': 'timing'
          }
        },
        aggs: {
          maxValidValue: {
            percentiles: {
              percents: [95.0],
              field: 'content.DOMParseTime'
            }
          }
        }
      }
    })
    console.log(percentRes.body.aggregations.maxValidValue.values['95.0'])
    console.log('aaaaaaaaaa' + dayjs().diff(time))
    const result = await client.search({
      index: 'fex_jarvis_*',
      body: {
        // from: (p - 1) * size,
        track_total_hits: true,
        size: size,
        // stored_fields: ['*'],
        query: {
          bool: {
            filter: [
              {
                match: {
                  'content._type': 'timing'
                }
              },
              {
                match: {
                  'content._pid': pid
                }
              },
              {
                range: {
                  '@timestamp': {
                    format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
                    gte: '2020-07-09 19:30:00',
                    lte: '2020-07-14 23:59:59'
                  }
                }
              },
              {
                range: {
                  'content.DOMParseTime': {
                    lt: percentRes.body.aggregations.maxValidValue.values['95.0']
                  }
                }
              }
            ],
            must_not: {
              match: {
                level: 'error'
              }
            }
          }
        },
        aggs: {
          DOMParseTime: {
            terms: {
              field: '_index',
              order: {
                _count: 'desc'
              }
              //   size: 20
              //   script: "( _value.indexOf('(') > 0 ? _value.substring(0, _value.indexOf('(')) : _value )",
            },
            aggs: {
              avg_DOMParseTime: {
                avg: {
                  field: 'content.DOMParseTime'
                }
              }
            //   percent_DOMParseTimes: {
            //     percentiles: {
            //       field: 'content.DOMParseTime'
            //     }
            //   }
            }
          }
        //   percent_DOMParseTimes: {
        //     percentiles: {
        //       field: 'content.DOMParseTime'
        //     }
        //   },
        //   avg_DOMParseTime: {
        //     avg: {
        //       field: 'content.DOMParseTime'
        //     }
        //   }
        }
      }
    })
    // console.log(result)
    console.log(result.body.aggregations)
    console.log(result.body.aggregations.DOMParseTime.buckets[0])
    return {
      p,
      size,
      total: result.body.hits.total.value,
      list: result.body.hits.hits,
      avg: result.body.aggregations
    }
  } catch (err) {
    console.log(err)
    throw new ServiceError(searchEsError)
  }
}

async function * scrollSearch (params) {
  var response = await client.search(params)

  while (true) {
    const sourceHits = response.body.hits.hits
    console.log(sourceHits)
    if (sourceHits.length === 0) {
      break
    }

    for (const hit of sourceHits) {
      yield hit
    }

    if (!response.body._scroll_id) {
      break
    }

    response = await client.scroll({
      scrollId: response.body._scroll_id,
      scroll: params.scroll
    })
  }
}

async function run () {
//   await client.bulk({
//     // refresh: true,
//     body: [
//       { index: { _index: 'fex_jarvis_*' } },
//       {
//         character: 'Ned Stark',
//         quote: 'Winter is coming.'
//       },

  //       { index: { _index: 'fex_jarvis_*' } },
  //       {
  //         character: 'Daenerys Targaryen',
  //         quote: 'I am the blood of the dragon.'
  //       },

  //       { index: { _index: 'fex_jarvis_*' } },
  //       {
  //         character: 'Tyrion Lannister',
  //         quote: 'A mind needs books like a sword needs a whetstone.'
  //       }
  //     ]
  //   })

  const params = {
    index: 'fex_jarvis_*',
    scroll: '86400s',
    size: 1,
    _source: ['quote'],
    body: {
      query: {
        match_all: {}
      }
    }
  }

  for await (const hit of scrollSearch(params)) {
    console.log(hit)
  }
}

module.exports = {
  getLogList
}
