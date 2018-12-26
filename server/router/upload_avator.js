module.exports = async(ctx, next) => {
    ctx.state.status = true;
    if (ctx.uploadpath && ctx.uploadpath.avator) {
        try {
            const res = await ctx
                .models
                .User
                .update({
                    username: ctx.request.body.username
                }, {avator: ctx.uploadpath.avator})
            ctx.body = {
                avator
            } = ctx.uploadpath;

        } catch (err) {
            ctx.throw(500, err)
        }
    }
    next();
}
