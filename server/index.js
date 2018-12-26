const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const router = require('./router');
const Static = require('koa-static');
const mongoose = require('mongoose');
const session = require('koa-session2');
const compress = require('koa-compress')
const fileUpload = require('./middleware/fileUpload');
const preHandler = require('./middleware/preHandler');
const formatterResponse = require('./middleware/formatterResponse');

const app = new Koa();
const db = require('./config').db;
mongoose.connect(db, {useNewUrlParser: true});
const con = mongoose.connection;
con.once('open', () => {

    console.log("数据库已成功连接");
    const models = require('./models')(mongoose);
    app.context.models = models;
    // 请求预处理
    app.use(preHandler())
    // 开启gzip
    app.use(compress({
        filter: function (content_type) {
            return /text/i.test(content_type)
        },
        threshold: 2048,
        flush: require('zlib').Z_SYNC_FLUSH
      }))
    // 支持跨域
    app.use(cors());
    // 保持登录
    app.use(session({key: 'SESSION'}));
    // 支持二进制文件上传
    app.use(fileUpload(app))
    // 支持处理静态文件
    app.use(Static(path.join(__dirname, 'public')));
    // 支持路由
    app.use(router.routes());
    app.use(router.allowedMethods());
    // 响应格式化
    app.use(formatterResponse())
})

con.on('error', console.error.bind(console, '连接数据库失败'));

app.listen(3000, '0.0.0.0', () => {
    console.log("服务器已启动");
});
