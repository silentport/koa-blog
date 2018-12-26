module.exports = async(ctx, next) => {

    try {
        const res = await ctx
            .models
            .Catagory
            .find({});
        if (res.length === 0) {}
        ctx.state.msg = res.length > 0
            ? '查找成功'
            : '无记录';
        ctx.state.status = res.length !== 0;
        ctx.body = {
            data: res
        };

    } catch (err) {
        ctx.throw(500, err)
    }

    next()

}
