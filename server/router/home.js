module.exports = async(ctx, next) => {

    const res = await ctx
        .models
        .User
        .find({
            username: ctx.session.user || ''
        });

    if (res.length > 0) {
        ctx.body = {
            hasUser: Boolean(ctx.session.user),
            username: ctx.session.user,
            avator: res[0].avator,
            admin: res[0].admin,
        };
        ctx.state.msg = "用户已登录";
    } else {
        ctx.body = {
            hasUser: false
        };
        ctx.state.msg = "^_^";
    }
    ctx.state.status = true;
    next();
}
