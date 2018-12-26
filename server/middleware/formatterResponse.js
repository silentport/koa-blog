module.exports = formatResponse = (app) => {
    return (ctx, next) => {
        ctx.body = {
            info: {
                msg: ctx.state.msg,
                status: ctx.state.status
            },
            head: {
                msg: ctx.message,
                code: ctx.status
            },
            data: ctx.body || {}
        }
    }
}