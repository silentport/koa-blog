const Router = require("koa-router");

const router = new Router();

router.all(/\w+/, require('./all'));

router.get("/api/home", require('./home'))

router.post("/api/register", require('./register'));

router.post("/api/login", require('./login'));

router.post("/api/logout", require('./logout'));

router.post("/api/catagory", require('./catagory_add'));

router.get("/api/catagory", require('./catagory_find'));

router.delete(/\/api\/catagory\/.+/, require('./catagory_del'));

router.post("/api/article", require('./article'));

router.get(/\/api\/article(\/.)*/, require('./article_list'));

router.post("/api/upload/avator", require('./upload_avator'));

router.post("/api/upload/article", require('./upload_article'));

router.post("/api/read", require('./read'));

router.post("/api/like", require('./like'));

module.exports = router;
