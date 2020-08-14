const { Client } = require('@elastic/elasticsearch')

module.exports = new Client({ node: 'http://fex.lehe.com/api/es/' })
