const serve = require('koa-static');
const Koa = require('koa');
const path = require('path')
const app = new Koa();

console.log('/client/')
app.use(serve('/src/OAuth/client/'));


app.listen(8080);

console.log('listening on port 8080');