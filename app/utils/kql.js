const { esQuery } = require('@mbears/kql')

function kql (query, gte, lte) {
  return esQuery(
    'http://fex.lehe.com/api/es/_mget',
    'index-pattern:35263c90-bb44-11ea-9986-e757f47a9416',
    query,
    {
      '@timestamp': {
        format: 'strict_date_optional_time',
        time_zone: '+08:00',
        gte,
        lte
      }
    }
  )
}

module.exports = {
  kql
}
