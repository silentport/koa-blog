module.exports = async(ctx, next) => {

    const name = ctx
        .request
        .path
        .split('/')
        .pop();
    try {
        const res = await ctx
            .models
            .Catagory
            .remove({name: name});
        ctx.state.msg = res;
        ctx.state.status = true;
        ctx.body = {
            name: name
        };
    } catch (err) {
        ctx.throw(500, err)
    }

    next()

}
