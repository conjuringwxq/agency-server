const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/issure', async (req, res) => {
    const Entrust = mongoose.model('Entrust');
    const newEntrust = new Entrust(req.body);
    try {
        await newEntrust.save(req.body);
        res.json({
            code: 0,
            msg: '委托房源信息成功'
        })
    } catch (err) {
        res.json({
            code: 1,
            msg: '委托房源信息失败',
            err
        })
    }
})
router.get("/info", async (req, res) => {
    console.log(req.query)
    const Entrust = mongoose.model("Entrust");
    if (Object.keys(req.query).length !== 0) {
        const status = req.query.selectStatus === '未接单' ? false : true
        if (req.query.appellation === '') {
            await Entrust.find({
                "accept.status": status
            }).exec().then(result => {
                res.json({
                    code: 0,
                    result,
                    count: result.length
                });
            }).catch(err => {
                res.json({
                    code: 1,
                    msg: "获取信息失败",
                    err
                });
            });
        } else {
            await Entrust.find({
                "accept.name": req.query.appellation,
                "accept.status": status
            }).exec().then(result => {
                res.json({
                    code: 0,
                    result,
                    count: result.length
                });
            }).catch(err => {
                res.json({
                    code: 1,
                    msg: "获取信息失败",
                    err
                });
            });
        }
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
router.post('/updateStatus', async (req, res) => {
    console.log(req.body);
    const Entrust = mongoose.model("Entrust");
    await Entrust.updateOne({
        _id: req.body.id
    }, {
        $set: {
            "accept.status": req.body.status,
            "accept.name": req.body.name
        }
    }).then(result => {
        res.json({
            code: 0,
            msg: '修改成功'
        });
    }).catch(err => {
        res.json({
            code: 1,
            msg: '修改失败',
            err
        });
    });
})
module.exports = router;