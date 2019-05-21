const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");

// 注册
router.post("/register", (req, res) => {
  const { username, password } = req.body;
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

// 修改密码
router.post("/changePwd", async (req, res) => {
  const User = mongoose.model("User");
  let { username, oldPassword, confirmPassword } = req.body;
  await User.findOne({ username })
    .exec()
    .then(async result => {
      const newUser = new User();
      await newUser
        .comparePassword(oldPassword, result.password)
        .then(isMatch => {
          // 如果匹配失败
          if (!isMatch) {
            res.json({
              code: 1,
              msg: "旧密码不正确，请重新输入"
            });
          } else {
            // 新密码加密
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
              bcrypt.hash(confirmPassword, salt, async (err, hash) => {
                if (err) throw err;
                confirmPassword = hash;
                // 如果匹配成功，进行修改
                await User.updateOne(
                  { username },
                  { $set: { password: confirmPassword } }
                )
                  .then(() => {
                    res.json({
                      code: 0,
                      msg: "修改密码成功"
                    });
                  })
                  .catch(err => {
                    res.json({
                      code: 1,
                      msg: "修改密码失败",
                      err
                    });
                  });
              });
            });
          }
        });
    });
});

// 获取普通用户信息
router.get("/info", async (req, res) => {
  const User = mongoose.model("User");
  await User.find({}, { password: false })
    .exec()
    .then(result => {
      res.json({
        code: 0,
        msg: "获取普通信息成功",
        result
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "获取普通信息失败",
        err
      });
    });
});

// 删除普通用户
router.post("/delete", async (req, res) => {
  const User = mongoose.model("User");
  await User.deleteOne({ _id: req.body.id })
    .exec()
    .then(() => {
      res.json({
        code: 0,
        msg: "删除成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "删除失败",
        err
      });
    });
});

// 完善用户资料
router.post("/complete", async (req, res) => {
  const User = mongoose.model("User");
  await User.updateOne(
    { username: req.body.username },
    {
      $set: {
        ...req.body
      }
    }
  )
    .exec()
    .then(() => {
      res.json({
        code: 0,
        msg: "更新成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "更新失败",
        err
      });
    });
});
module.exports = router;
