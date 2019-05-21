const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/issure", async (req, res) => {
  const Entrust = mongoose.model("Entrust");
  const newEntrust = new Entrust(req.body);
  try {
    await newEntrust.save(req.body);
    res.json({
      code: 0,
      msg: "委托房源信息成功"
    });
  } catch (err) {
    res.json({
      code: 1,
      msg: "委托房源信息失败",
      err
    });
  }
});
router.get("/info", async (req, res) => {
  const Entrust = mongoose.model("Entrust");
  if (Object.keys(req.query).length !== 0 && !req.query.user) {
    const status = req.query.selectStatus === "未接单" ? false : true;
    //   搜索框没有数据
    if (req.query.appellation === "") {
      await Entrust.find({
        "accept.status": status,
        "audit-status": req.query.auditStatus
      })
        .exec()
        .then(result => {
          res.json({
            code: 0,
            result,
            count: result.length
          });
        })
        .catch(err => {
          res.json({
            code: 1,
            msg: "获取信息失败",
            err
          });
        });
    } else {
      await Entrust.find({
        appellation: { $regex: new RegExp(req.query.appellation, "i") },
        "accept.status": status,
        "audit-status": req.query.auditStatus
      })
        .exec()
        .then(result => {
          res.json({
            code: 0,
            result,
            count: result.length
          });
        })
        .catch(err => {
          res.json({
            code: 1,
            msg: "获取信息失败",
            err
          });
        });
    }
  } else if (req.query.user) {
    // 没有get参数查询所有数据
    await Entrust.find({uname: req.query.user})
      .exec()
      .then(result => {
        res.json({
          code: 0,
          result,
          count: result.length
        });
      })
      .catch(err => {
        res.json({
          code: 1,
          msg: "获取信息失败",
          err
        });
      });
  } else { 
    // 没有get参数查询所有数据
    await Entrust.find({})
      .exec()
      .then(result => {
        res.json({
          code: 0,
          result,
          count: result.length
        });
      })
      .catch(err => {
        res.json({
          code: 1,
          msg: "获取信息失败",
          err
        });
      });
  }
});
router.post("/updateStatus", async (req, res) => {
  const Entrust = mongoose.model("Entrust");
  await Entrust.updateOne(
    {
      _id: req.body.id
    },
    {
      $set: {
        "accept.status": req.body.status,
        "accept.name": req.body.name
      }
    }
  )
    .then(() => {
      res.json({
        code: 0,
        msg: "修改成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "修改失败",
        err
      });
    });
});
// 审核状态
router.post("/audit-status", async (req, res) => {
  const Entrust = mongoose.model("Entrust");
  await Entrust.updateOne(
    {
      _id: req.body.id
    },
    {
      $set: {
        "audit-status":
          req.body.flag === "" ? "" : req.body.flag ? "通过" : "未通过"
      }
    }
  )
    .then(() => {
      res.json({
        code: 0,
        msg: "提交成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "提交失败",
        err
      });
    });
});
// 删除
router.post('/delete', async (req, res) => { 
  const Entrust = mongoose.model("Entrust");
  await Entrust.remove({
    _id: req.body.id
  })
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
})
module.exports = router;
