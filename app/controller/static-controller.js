/* eslint-disable no-prototype-builtins */
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const ServiceError = require('../utils/error')

const { staticError, downloadError } = require('../utils/error-list')

const ejs = require('ejs')
const TEMPLATE_URL = path.resolve(__dirname, '../../templates/video.ejs')

async function downloadStatic (ctx, next) {
  try {
    // 以流的方式返回下载文件
    const filePath = path.join(__dirname, '../../static/', ctx.params[0])
    const data = await readerStreamPublic(filePath)
    ctx.set({
      'Content-Type': 'application/octet-stream', // 告诉浏览器这是一个二进制文件
      'Content-Disposition': 'attachment; filename=' + ctx.params[0].split('/').pop() // 告诉浏览器这是一个需要下载的文件
    })
    ctx.body = data
    // 使用koa-send下载文件
    // ctx.attachment(`static/${ctx.params[0]}`)
    // await send(ctx, `static/${ctx.params[0]}`)
    // ctx.body = {
    //   message: '下载资源成功',
    //   error_code: 0,
    //   data: {}
    // }
  } catch (err) {
    console(err)
    throw new ServiceError(downloadError)
  }
}

async function accessStatic (ctx, next) {
  try {
    // 路由* ctx.params[0] 就等于后面所有的路径
    if (ctx.params[0] === 'video') {
      const data = await readerStreamPublic(path.join(__dirname, '../../static/', ctx.params.id))
      ctx.body = data
    } else if (ctx.params[0] === 'play') {
      // const data = `<!DOCTYPE html>
      // <html>
      //   <head>
      //     <meta charset="utf-8" />
      //     <meta
      //       name="viewport"
      //       content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
      //     <link rel="icon" href="./favicon.ico" type="image/x-icon">
      //     <title>${ctx.params.id}</title>
      //   </head>
      //   <body>
      //   <video style="width: 300px;margin-top: 100px;position: absolute; left: 50%;margin-left: -150px;" controls src="./video?id=${ctx.params.id}"></video>
      //   </body>
      // </html>`
      const data = await ejs.renderFile(TEMPLATE_URL, {
        title: '视频播放',
        isShow: true,
        video_list: [
          {
            id: ctx.params.id
          }
        ]
      })
      ctx.body = data
    } else {
      await send(ctx, path.join('/static', ctx.params[0]), { root: path.resolve('.'), maxage: 60 * 60 * 1000, defer: false })
    }
  } catch (error) {
    console.log(error)
    throw new ServiceError(staticError)
  }
}

function readerStreamPublic (filePath) {
  // 创建可读流
  const data = []
  return new Promise((resolve, reject) => {
    const readerStream = fs.createReadStream(filePath)
    readerStream.on('data', function (chunk) {
      data.push(chunk)
    })
    readerStream.on('end', function () {
      const finalData = Buffer.concat(data) // 合并Buffer
      resolve(finalData)
    })
    readerStream.on('error', (err) => {
      reject(err)
    })
  })
}

module.exports = {
  downloadStatic,
  accessStatic
}
