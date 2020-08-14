const Koa = require('koa')
const path = require('path')

const router = require('./router')
const bodyParser = require('koa-body')
const cors = require('./middleware/cors')
const params = require('./middleware/params')
const errorHandle = require('./middleware/error-handle')

const xprofiler = require('xprofiler')
if (process.env.NODE_ENV === 'prod') {
  xprofiler.start({
    log_dir: path.resolve(__dirname, '../node-log')
  })
}

const app = new Koa()
const port = 7043

app.use(cors())
app.use(errorHandle())
app.use(bodyParser({ multipart: true }))
app.use(params())
app.use(router.routes())

// methods不匹配时throw new error
app.use(router.allowedMethods({ throw: true }))

app.use(async (ctx, next) => {
  if (ctx.status === 404) {
    // 设置status为404或者为空，才会走进allowedMethods，然后抛出throw new error，同时allowedMethods方法进过一些处理后重新设置了status为405，然后errorHandle拦截了错误，统一处理返回。
    ctx.status = 404
    ctx.body = 404
  }
})

app.listen(port, () => {
  console.log(`Server Stared on http://localhost:${port}`)
})

app.on('error', (err) => {
  console.log(err)
})
