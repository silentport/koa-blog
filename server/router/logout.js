module.exports = async (ctx, next) => {
  let res = null;
  try {
    const res = await ctx
      .models
      .Session
      .remove({
        session: ctx.request.body.username
      });
      ctx.session.user = null;
      console.log(res);
      ctx.state.msg = "退出成功";
      ctx.state.status = true;
      ctx.body = {};

    
  } catch (err) {
    ctx.throw(500, err)
  }


  next()
}
