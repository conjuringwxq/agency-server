const expressJwt = require("express-jwt");
const {
  SECRET
} = require("./config");

/* 
 * express-jwt中间件帮我们自动做了token的验证以及错误处理，
 * unless为不需要token认证的api
 **/
const jwtAuth = expressJwt({
  secret: SECRET,
  getToken: req => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] == "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.body && req.body.token) {
      return req.body.token;
    }
    return null;
  }
}).unless({
  path: [
    "/user/login",
    "/user/register",
    "/housing/uploadImg",
    "/housing/rental",
    "/housing/message",
    '/housing/serial',
    '/housing/recommend'
  ]
});

module.exports = jwtAuth;