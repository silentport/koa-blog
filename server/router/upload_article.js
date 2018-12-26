module.exports = async(ctx, next) => {
    ctx.state.status = true;
    if (ctx.uploadpath && ctx.uploadpath.article) {
        try {
            ctx.body = {
                article
            } = ctx.uploadpath;
        } catch (err) {
            ctx.throw(500, err)
        }
    }
    next();
}
