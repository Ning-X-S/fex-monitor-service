const { sequelize, dataTypes } = require('./init')

const JarvisMark = sequelize.define('jarvisMark', {
  id: {
    type: dataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  es_id: dataTypes.STRING,
  group_id: dataTypes.INTEGER,
  status: dataTypes.INTEGER,
  error_content: dataTypes.TEXT('long'),
  created_at: dataTypes.DATE,
  updated_at: dataTypes.DATE
}, {
  tableName: 'jarvis_error_mark',
  timestamps: false
})

module.exports = JarvisMark
