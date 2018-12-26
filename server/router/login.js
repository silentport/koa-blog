module.exports = async(ctx, next) => {
    let res = null;
    try {
        res = await ctx
            .models
            .User
            .find({
                ...ctx.request.body
            });
        ctx.state.msg = res.length > 0
            ? '登录成功'
            : '登录失败:用户名或密码错误';
        ctx.state.status = res.length !== 0;
        ctx.body = {
            admin: res && res[0] && res[0].admin,
            avator: res && res[0] && res[0].avator,
            username: ctx.request.body.username
        };

    } catch (err) {
        ctx.throw(500, err)
    }
    // 登录成功，设置session
    if (res.length > 0) {
        ctx.session.user = ctx.request.body.username;
        try {
            const res = await ctx
                .models
                .Session
                .find({session: ctx.session.user});
            if (res.length === 0) {
                const session = new ctx
                    .models
                    .Session({session: ctx.session.user})
                const msg = await session.mySave();
                console.log(msg)
            }
        } catch (err) {
            ctx.throw(500, err)
        }
    }

    next()

}
