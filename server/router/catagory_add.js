module.exports = async(ctx, next) => {

    try {
        const res = await ctx
            .models
            .Catagory
            .find({name: ctx.request.body.name});
        if (res.length === 0) {
            const catagory = new ctx
                .models
                .Catagory(ctx.request.body);
            const msg = await catagory.mySave();
            console.log(msg)
        }
        ctx.state.msg = res.length > 0
            ? '该类别已经存在'
            : '新增成功';
        ctx.state.status = res.length === 0;
        ctx.body = ctx.request.body;

    } catch (err) {
        ctx.throw(500, err)
    }

    next()

}
