const axios = require('axios')
const mobhook = require('../../config').mobhook
const webhook = require('../../config').webhook.online

module.exports = {
  sendMobGroup: (data) => {
    let message = ''
    if (data.via === 'android') {
      message = `>message:<font color=\"comment\"> ${data.ctx.message}</font> \n
        >stack:<font color=\"comment\"> ${data.ctx.stack}</font> \n
        >device_model :<font color=\"comment\"> ${data.device_merchant} ${data.device_model}</font> \n
        >device_version:<font color=\"comment\"> android ${data.device_version}</font>`
    } else {
      message = `>reason:<font color=\"comment\"> ${data.ctx.reason}</font> \n
        >call_stack:<font color=\"comment\"> ${data.ctx.call_stack}</font> \n
        >device_model:<font color=\"comment\"> ${data.device_model}</font> \n
        >device_version:<font color=\"comment\"> ${data.device_version}</font>`
    }
    let url = mobhook.dev
    if (data.environment === 'release') {
      url = mobhook.online
    }
    axios.post(
      url,
      {
        msgtype: 'markdown',
        markdown: {
          content: `实时新增crash<font color=\"warning\">  ${data.via}</font>，请相关同事注意，具体原因。\n
          ${message}`
        }
      })
  },
  sendMobWeb: (data) => {
    let stack = ''
    if (typeof data.stack === 'string') {
      stack = `>stack:<font color=\"comment\"> ${data.stack}</font> \n`
    } else if (data.stack) {
      stack.forEach(item => {
        stack += `>stack:<font color=\"comment\"> ${item}</font> \n`
      })
    }
    const message = `>message:<font color=\"comment\"> ${data.message}</font> \n
    ${stack}
    >filename:<font color=\"comment\"> ${data.filename}</font> \n
    >_url:<font color=\"comment\"> ${data._url}</font>`
    axios.post(
      webhook,
      {
        msgtype: 'markdown',
        markdown: {
          content: `实时新增错误<font color=\"warning\">  ${data._pid}</font>，具体原因。\n
            ${message}`
        }
      })
  }
}
