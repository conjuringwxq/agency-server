// 配置文件
module.exports = {
  NETWORK: {
    PORT: 9093
  },
  // token 密钥
  SECRET: `myjwttoken${parseInt(Math.random()*10)}auth`,
  // 数据库链接
  DATABASE: "mongodb://localhost:27017/housing"
};
