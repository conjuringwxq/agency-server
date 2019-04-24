const mongoose = require("mongoose");
const { DATABASE } = require("./config");

module.exports = () => {
  mongoose.connect(DATABASE, {
    useNewUrlParser: true
  });
  mongoose.connection.on("connected", () => {
    console.log("数据库连接成功");
  });
};
