const glob = require("glob");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser"); // post请求中间件
const morgan = require("morgan"); // 打印日志的中间件
const app = express(); // 实例化express

require("./utils/db")(); // 连接数据库
glob.sync(path.resolve(__dirname, "./models", "*.js")).forEach(require); // 导入Schema实例
const { NETWORK } = require("./utils/config"); // 导入配置参数
const jwtAuth = require("./utils/jwtAuth"); // 导入token中间件
// 导入路由
const userRouter = require("./routes/user"); 
const housingRouter = require("./routes/housing"); 
const entrustRouter = require("./routes/entrust"); 
const adminRouter = require("./routes/admin"); 
const attentionRouter = require("./routes/attention"); 

// cors跨域解决
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (req.method == "OPTIONS") {
    // 让options请快速返回
    return res.send(200);
  }
  next();
});

// 直接获取post请求中的body部分
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

// 使用morgan中间件打印请求日志
app.use(morgan("dev"));

// 添加token认证
app.use(jwtAuth);

// 无token认证的中间件处理
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name == "UnauthorizedError") {
    res.status(401).send({
      code: 0,
      msg: "No token provided, please authorized"
    });
  }
  next();
});

// 使用路由
app.use("/user", userRouter);
app.use("/housing", housingRouter);
app.use("/entrust", entrustRouter);
app.use("/admin", adminRouter);
app.use("/attention", attentionRouter);

// 开启服务
app.listen(NETWORK.PORT, () => {
  console.log(
    `server is runing at port ${NETWORK.PORT}, url：http://localhost:${
      NETWORK.PORT
    }`
  );
});
