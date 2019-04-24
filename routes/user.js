const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

// 注册
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  // 导入User模型
  const User = mongoose.model("User");
  User.findOne({ username }, async (err, doc) => {
    if (err) {
      throw err;
    }
    // 如果存在与表中
    if (doc) {
      return res.json({ code: 1, msg: "用户名重复，请重新注册" });
    }
    let newUser = new User({ username, password });
    // 插入数据库
    try {
      const doc = await newUser.save();
      res.json({ code: 0, msg: "注册成功" });
    } catch (err) {
      res.json({ code: 1, msg: err });
    }
  });
});

// 登陆
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // 导入User模型
  const User = mongoose.model("User");
  await User.findOne({ username })
    .exec()
    .then(async result => {
      if (!result) {
        res.json({
          code: 1,
          msg: "该用户不存在"
        });
      } else {
        const newUser = new User();
        await newUser
          .comparePassword(password, result.password)
          .then(isMatch => {
            // 密码匹配失败
            if (!isMatch) {
              res.json({
                code: 1,
                msg: "密码错误"
              });
            } else {
              // token设置  expiresIn:授权时效 注意："payload" to be a plain object
              let token = jwt.sign(result.toJSON(), SECRET, {
                expiresIn: 60 * 60 * 24
              });
              res.json({
                code: 0,
                msg: "登陆成功",
                userInfo: result,
                token
              });
            }
          });
      }
    });
});

// 获取用户信息
router.get("/info", (req, res, next) => {
  const User = mongoose.model("User");

  res.json({
    code: 200
  });
});

module.exports = router;
