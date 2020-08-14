{
    body: {
        from: (p - 1) * size,
        size: size,
        track_total_hits: true,
        query: {
          bool: {
            // filter: [
            //   {
            //     // 模糊查询
            //     // multi_match: {
            //     //   query: 'timin',
            //     //   fields: ['content._type'],
            //     //   fuzziness: 'AUTO'
            //     // }
            //     match: {
            //       'content._type': 'timing'
            //     }
            //   },
            //   {
            //     match: {
            //       'content._pid': pid
            //     }
            //   },
            //   {
            //     range: {
            //       'content.SSLTime': {
            //         gte: 10000
            //       }
            //     }
            //   },
            //   {
            //     range: {
            //       '@timestamp': {
            //         format: 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
            //         gte: '2020-07-01 00:00:00',
            //         lte: '2020-07-01 23:59:59'
            //       }
            //     }
            //   }
            // ],
            must_not: {
              match: {
                level: 'error'
              }
            }
          }
        }
      }
}