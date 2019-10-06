const appid = 'wx73015f66bbddc175'
const secret = '8a291add2143cf870eb2c3ecef6fc952'
const axios = require('axios')
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()

var router = new Router();
 
router.get('/', async (ctx, next) => {
    const code = ctx.query.code
    const endPoint = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    const userInfo  = await axios.get(endPoint)
    ctx.body = userInfo.data
});
 
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000)