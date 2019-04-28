const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// 发布房源信息
router.post("/rental", async (req, res) => {
  const Housing = mongoose.model("Housing");
  const newHousing = new Housing(req.body);
  try {
    await newHousing.save();
    res.json({
      code: 0,
      msg: "发布房源信息成功"
    });
  } catch (err) {
    res.json({
      code: 1,
      msg: "发布房源信息失败",
      err
    });
  }
});
// 获取房源信息
router.get("/message", async (req, res) => {
  // 定义查询条件
  let price = {
      $regex: /(.*?)/
    },
    fitment = {
      $regex: /(.*?)/
    },
    area = {
      $regex: /(.*?)/
    };
  const Housing = mongoose.model("Housing");
  if (req.query.price) {
    let value = req.query.price.split("元")[0].split("-");
    // 查询大于这个数值的
    if (value.length === 1) {
      price = {
        $gt: value[0]
      };
    } else {
      // 查询两个范围之间的
      price = {
        $gt: value[0],
        $lte: value[1]
      };
    }
  }
  if (req.query.fitment) {
    let value = req.query.fitment;
    fitment = value;
  }
  if (req.query.area) {
    let value = req.query.area.split("-");
    if (value.length === 1) {
      value = req.query.area.split("以")[0];
      area = {
        $gt: value[0]
      };
    } else {
      area = {
        $gt: value[0],
        $lte: value[1]
      };
    }
  }
  console.log(req.query.type);
  console.log(price, fitment, area);

  // 1. 判断是否有type，如果没有，查询所有数据
  if (!req.query.type) {
    Housing.find({})
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
    // 2. 有type，判断是否有搜索，如果没有，进行判断
    if (!req.query.s) {
      // 3. 判断是否有筛选，如果没有, 查询含有type的数据
      if (!(req.query.price || req.query.fitment || req.query.area)) {
        Housing.find({
          houseType: req.query.type
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
        // 4. 如果有筛选，查询含有type和筛选的数据
        Housing.find()
          .and([
            {
              houseType: req.query.type
            },
            {
              price: price
            },
            {
              "region.fitment": fitment
            },
            {
              "region.area": area
            }
          ])
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
    } else {
      // 5. 有type同时有搜索，判断是否有筛选，如果没有，查询含有type和搜索的数据
      if (!(req.query.price || req.query.fitment || req.query.area)) {
        Housing.find()
          .and([
            {
              houseType: req.query.type
            },
            {
              $or: [
                {
                  houseTitle: {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.name": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.direction": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.fitment": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                }
              ]
            }
          ])
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
        // 4. 有type,有搜索，有筛选，查询含有type，搜索和筛选的数据
        Housing.find()
          .and([
            {
              houseType: req.query.type
            },
            {
              $or: [
                {
                  houseTitle: {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.name": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.direction": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                },
                {
                  "region.fitment": {
                    $regex: new RegExp(req.query.s, "i")
                  }
                }
              ]
            },
            {
              price: price
            },
            {
              "region.fitment": fitment
            },
            {
              "region.area": area
            }
          ])
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
    }
  }
});
// 根据id获取房源信息
router.get("/serial", async (req, res) => {
  console.log(req.query);
  const Housing = mongoose.model("Housing");
  try {
    await Housing.findOne({
      _id: req.query.id
    })
      .exec()
      .then(result => {
        res.json({
          code: 0,
          msg: "获取成功",
          result
        });
      });
  } catch (err) {
    res.json({
      code: 1,
      msg: "获取失败",
      err
    });
  }
});
// 根据id删除房源信息
router.post("/delserial", async (req, res) => {
  const Housing = mongoose.model("Housing");
  await Housing.remove({
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
});
// 获取非当前id的四个房源信息，限制返回4条
router.get("/recommend", async (req, res) => {
  const Housing = mongoose.model("Housing");
  console.log(req.query.type);
  try {
    await Housing.find()
      .and([
        {
          _id: {
            $ne: req.query.id
          }
        },
        {
          houseType: req.query.type
        }
      ])
      .limit(4)
      .exec()
      .then(result => {
        res.json({
          code: 0,
          result
        });
      });
  } catch (err) {
    res.json({
      code: 1,
      msg: "获取失败",
      err
    });
  }
});
// 关注房源
router.post("/attention", async (req, res) => {
  const Housing = mongoose.model("Housing");
  await Housing.updateOne(
    {
      _id: req.body.id
    },
    {
      $inc: {
        attention_number: 1
      }
    }
  )
    .then(result => {
      res.json({
        code: 0,
        msg: "关注成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "关注失败",
        err
      });
    });
});
// 取消关注
router.post("/unfollow", async (req, res) => {
  console.log(req.body);
  const Housing = mongoose.model("Housing");
  await Housing.updateOne(
    {
      _id: req.body.id
    },
    {
      $inc: {
        attention_number: -1
      }
    }
  )
    .then(result => {
      res.json({
        code: 0,
        msg: "取关成功"
      });
    })
    .catch(err => {
      res.json({
        code: 1,
        msg: "取关失败",
        err
      });
    });
});
module.exports = router;
