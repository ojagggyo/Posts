const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
app.use(serve('./public'));

app.listen(3000,"127.0.0.1");

console.log('listening on port 3000');
