const mongoose = require("mongoose");
const { DATABASE } = require("./config");

module.exports = () => {
  // 用户连接数据库
  mongoose.connect(DATABASE, {
    useNewUrlParser: true
  });
  mongoose.connection.on("connected", () => {
    console.log("数据库连接成功");
  });
  // 监听数据库断开连接
  mongoose.connection.on("disconnected", () => {
    mongoose.connect(DATABASE);
  });
  // 数据库出错
  mongoose.connection.on("error", error => {
    console.log(error);
    mongoose.connect(DATABASE);
  });
  mongoose.connection.once("open", () => {
    console.log("mongoodb connected success");
  });
};
