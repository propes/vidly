function demoMiddleware(res, req, next) {
    console.log("Hi, from demo middleware");
    next();
}

module.exports = demoMiddleware;