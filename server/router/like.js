module.exports = async (ctx, next) => {
  let res = null;
  try {
    const res = await ctx
      .models
      .Article
      .update({
        _id: ctx.request.body.id
      }, {
        $inc: {
            likeCount: 1
        }
      });
    console.log(res);
    ctx.state.msg = "^_^";
    ctx.state.status = true;
    ctx.body = {};


  } catch (err) {
    ctx.throw(500, err)
  }


  next()
}
