const fs = require('fs')
const ServiceError = require('../utils/error')
const { streamError } = require('../utils/error-list')

async function upload (ctx, next) {
  try {
    // 获取上传文件
    const file = ctx.request.files.file
    console.log(file.name)
    // 创建可读流
    const readStream = fs.createReadStream(file.path)
    // 创建可写流
    const writeStream = fs.createWriteStream(`./static/${file.name}`)
    // 可读流通过管道写入可写流
    readStream.pipe(writeStream)
    ctx.body = {
      error_code: 0,
      message: '上传成功',
      data: {}
    }
  } catch (error) {
    console.log(error)
    throw new ServiceError(streamError)
  }
}

module.exports = {
  upload
}
