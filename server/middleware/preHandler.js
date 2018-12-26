module.exports = preHandler = () => {
  return async (ctx, next) => {
    await next();
    console.log(ctx.path)
    if (!ctx.path === "/") {
      ctx.type = "application/json; charset=UTF-8";
    }
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  }
}
