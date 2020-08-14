module.exports = {
  mysql: {
    host: '172.18.4.181',
    user: 'higo_test',
    password: 'higo9ijnmko0test',
    database: 'higo_front',
    port: 3701
  },
  redis: [{
    port: 7141,
    host: '10.20.252.1'
  }],
  webhook: {
    online: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7b0c3278-1dec-45c0-b84e-1a6aaa77dd38',
    dev: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7b0c3278-1dec-45c0-b84e-1a6aaa77dd38'
  },
  mobhook: {
    online: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e3e29c4d-a1bd-4175-8ec2-9807067f701a',
    dev: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=31ea64ac-48ae-4d1d-9ff5-fb7b23e7af9a'
  }
}
