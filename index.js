"use strict";

const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
app.use(serve('./public'));
app.listen(3000, "0.0.0.0");
console.log('listening on port 3000');
