const { sequelize, dataTypes } = require('./init')

const JarvisError = sequelize.define('jarvisError', {
  id: {
    type: dataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  es_id: dataTypes.STRING,
  content: dataTypes.TEXT('long'),
  timestamp: dataTypes.BIGINT,
  // log_date_time, mysql 为datetime(6)类型，sequelise设置type为DATE(6)，存入库中会精度确实三位，这里设置为STRING，到mysql中，会自动转为为datetime(6)
  log_date_time: dataTypes.STRING,
  created_at: dataTypes.DATE,
  updated_at: dataTypes.DATE
}, {
  tableName: 'jarvis_error_info',
  timestamps: false
})

module.exports = JarvisError
