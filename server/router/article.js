module.exports = async(ctx, next) => {
    try {
        let article = null;
        if (ctx.request.body._id) {
            const res = await ctx
                .models
                .Article
                .find({_id: ctx.request.body._id});

            if (res.length > 0) {
                await ctx
                    .models
                    .Article
                    .update({
                        _id: ctx.request.body._id
                    }, {
                        ...ctx.request.body
                    })
                ctx.state.msg = "更新成功";
                ctx.body = {
                    _id: ctx.request.body._id
                };
            }
        } else {
            delete(ctx.request.body._id);
            article = new ctx
                .models
                .Article(ctx.request.body);
            await article.mySave();
            ctx.state.msg = "新增成功";
            const res = await ctx
                .models
                .Catagory
                .update({
                    name: ctx.request.body.tag
                }, {
                    $inc: {
                        count: 1
                    }
                })
            console.log(res)
            ctx.body = {
                _id: article._id
            };
        }
        ctx.state.status = true;

    } catch (err) {
        ctx.throw(500, err)
    }

    next();
}
