const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const multer = require('multer');
// const fs = require('fs');
// const upload = multer({
//     dest: 'uploads/'
// });

// 图片上传
// router.post('/uploadImg', upload.any(), (req, res) => {
//     console.log(req.files);
//     let newFile = `../uploads/${req.files[0].originalname}`;
//     fs.readFile(req.files[0].path, (err, data) => {
//         if (err) {
//             res.json({
//                 code: 1,
//                 msg: '上传图片失败',
//                 err
//             })
//         }
//         fs.writeFile(newFile, data, err => {
//             if (err) {
//                 res.json({
//                     code: 1,
//                     msg: '上传图片失败',
//                     err
//                 })
//             } else {
//                 res.json({
//                     code: 0,
//                     msg: '上传文件成功',
//                     filename: req.files.originalname
//                 })
//             }
//         })
//     })

// })
// 发布房源信息
router.post("/rental", async (req, res) => {
  console.log(req.body);
  const Housing = mongoose.model("Housing");
  const newHousing = new Housing(req.body);
  try {
    await newHousing.save(req.body);
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
  console.log(price, fitment, area);

  // 如果参数不是undefined
  if (req.query.price || req.query.fitment || req.query.area) {
    // 判断是否进行了搜索
    if (req.query.s) {
      Housing.find()
        .and([{
            houseType: req.query.type
          },
          {
            $or: [{
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
    } else {
      Housing.find()
        .and([{
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
    // 如果没传递这三个参数，直接查询所有数据
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
// 获取非当前id的四个房源信息，限制返回4条
router.get("/recommend", async (req, res) => {
  const Housing = mongoose.model("Housing");
  try {
    await Housing.find({
        _id: {
          $ne: req.query.id
        }
      })
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

module.exports = router;