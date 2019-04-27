const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");

// 注册
router.post("/register", (req, res) => {
  const { username, password, time } = req.body;
  console.log(username, password, time);
  // 导入User模型
  const Admin = mongoose.model("Admin");
  Admin.findOne({ username }, async (err, doc) => {
    if (err) {
      throw err;
    }
    // 如果存在与表中
    if (doc) {
      return res.json({ code: 1, msg: "用户名重复，请重新注册" });
    }
    let newAdmin = new Admin({ username, password, time });
    // 插入数据库
    try {
      const doc = await newAdmin.save();
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
  const Admin = mongoose.model("Admin");
  await Admin.findOne({ username })
    .exec()
    .then(async result => {
      if (!result) {
        res.json({
          code: 1,
          msg: "该用户不存在"
        });
      } else {
        const newAdmin = new Admin();
        await newAdmin
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
              let admin_token = jwt.sign(result.toJSON(), SECRET, {
                expiresIn: 60 * 60 * 24
              });
              res.json({
                code: 0,
                msg: "登陆成功",
                userInfo: result,
                admin_token
              });
            }
          });
      }
    });
});

// 更新用户信息
router.post("/updateMsg", async (req, res) => {
  const Admin = mongoose.model("Admin");
  let pwd = req.body.password;
  // 加密
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(pwd, salt, async (err, hash) => {
      if (err) throw err;
      pwd = hash;
      await Admin.updateOne(
        { _id: req.body.uid },
        {
          $set: {
            username: req.body.username,
            password: pwd,
            real_name: req.body.real_name,
            sex: req.body.sex,
            phone_number: req.body.phone_number,
            email: req.body.email,
            id_number: req.body.id_number,
            company: req.body.company,
            branch: req.body.branch
          }
        }
      )
        .then(result => {
          res.json({
            code: 0,
            msg: "更新成功",
            result
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
  });
});

// 获取管理员用户信息
router.get("/adminInfo", async (req, res) => {
  const Admin = mongoose.model("Admin");
  await Admin.find({}, { password: false })
    .exec()
    .then(result => {
      res.json({
        code: 0,
        msg: "获取管理员信息成功",
        result
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "获取管理员信息失败",
        err
      });
    });
});
// 删除用户
router.post("/del", async (req, res) => {
  const Admin = mongoose.model("Admin");
  await Admin.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
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
module.exports = router;
