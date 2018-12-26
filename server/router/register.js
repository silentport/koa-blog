module.exports = async(ctx, next) => {

    try {
        const res = await ctx
            .models
            .User
            .find({username: ctx.request.body.username});
        if (res.length === 0) {
            const user = new ctx
                .models
                .User({
                    ...ctx.request.body,
                    avator: ''
                });
            const msg = await user.mySave();
            console.log(msg)
        }
        ctx.state.msg = res.length > 0
            ? '用户名已经存在'
            : '注册成功';
        ctx.state.status = res.length === 0;
        ctx.body = {
            username: ctx.request.body.username
        };

    } catch (err) {
        ctx.throw(500, err)
    }
    next()
}
