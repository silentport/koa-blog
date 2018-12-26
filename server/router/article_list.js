module.exports = async(ctx, next) => {
    try {
        let res = null;
        const id = ctx.query.id;
        const page = ctx.query.page;
        const tag = ctx.query.tag;
        const keyWord = ctx.query.keyWord;
        // 模糊查询
        if (keyWord) {
            const reg = new RegExp(keyWord)
            res = await ctx
                .models
                .Article
                .find({title: reg});
            ctx.state.msg = "获取成功";
            ctx.state.status = true;
            ctx.body = {
                data: res
            };
        } else {
            if (id) {
                // 查询一条
                res = await ctx
                    .models
                    .Article
                    .find({_id: id});
                ctx.state.msg = "获取成功";
                ctx.state.status = true;
                ctx.body = res[0];

            } else {

                if (page && tag) {
                    // 分页查找
                    const pageNum = 5;
                    let query = tag === 'Latest'
                        ? {}
                        : {
                            tag: tag
                        };
                    res = await ctx
                        .models
                        .Article
                        .find(query, {
                            limit: pageNum,
                            skip: pageNum * (Number(page) - 1)
                        })
                    if (res.length > 0) {

                        const count = await ctx
                            .models
                            .Article
                            .countDocuments(query);
                        ctx.state.msg = "获取成功";
                        ctx.state.status = true;
                        ctx.body = {
                            data: res,
                            count: Math.ceil((count / pageNum))
                        }

                    } else {

                        ctx.state.status = false;
                        ctx.state.msg = "没有文章了";

                    }

                } else {
                    // 查询所有
                    res = await ctx
                        .models
                        .Article
                        .find({});
                    if (res.length > 0) {
                        ctx.state.msg = "获取成功";
                        ctx.state.status = true;
                        ctx.body = res;
                    } else {

                        ctx.state.status = false;
                        ctx.state.msg = "暂时没有文章";

                    }
                }

            }
        }

    } catch (err) {
        ctx.throw(500, err)
    }

    next();
}
