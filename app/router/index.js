const Router = require('koa-router')

const router = new Router()
const recordController = require('../controller/record-controller')
const timingController = require('../controller/timing-controller')
const errorController = require('../controller/error-controller')
const uploadController = require('../controller/upload-controller')
const staticController = require('../controller/static-controller')
const markController = require('../controller/mark-controller')

const testController = require('../controller/test-kql-controller')

// test
router.get('/test', testController.test)
router.get('/test1', testController.test1)
router.get('/test2', testController.test2)
router.get('/test3', testController.test3)

// 打印日志
router.post('/record/create', recordController.createRecord)
// 打印客户端日志
router.post('/record/logger', recordController.createAPPRecord)
// 获取日志详情
router.get('/record/detail', recordController.getDetail)
// 数据同步至mysql
router.get('/record/sync', recordController.syncRecord)
// 性能数据查询
router.get('/search/timing', timingController.getLogList)
// 错误日志数据查询
router.get('/search/error', errorController.getErrorList)
// 创建一条已标记记录
router.post('/mark/create', markController.createMark)

// 上传文件
router.post('/upload', uploadController.upload)
// 静态资源服务
router.get('/static/(.*)', staticController.accessStatic)
// 下载文件
router.get('/download/(.*)', staticController.downloadStatic)

module.exports = router
