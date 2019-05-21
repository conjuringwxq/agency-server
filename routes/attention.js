const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post('/add', async (req, res) => {
    let {
        appellation,
        floor,
        houseTitle,
        houseType,
        images,
        phone,
        price,
        region,
        time,
        username
    } = req.body;

    const Attention = mongoose.model('Attention');
    const newAttention = new Attention({
        appellation,
        floor,
        houseTitle,
        houseType,
        images,
        phone,
        price,
        region,
        time,
        username,
        productId: req.body._id
    });
    try {
        await newAttention.save();
        res.json({
            code: 0,
            msg: '添加成功'
        })
    } catch (err) {
        res.json({
            code: 1,
            msg: '添加失败',
            err
        })
    }
})

router.post('/rm', async (req, res) => {
    const Attention = mongoose.model('Attention');
    await Attention.remove({
        username: req.body.username,
        productId: req.body.id
    }).then(() => {
        res.json({
            code: 0,
            msg: '删除成功'
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: '删除失败',
            err
        })
    })
})

router.get('/content', async (req, res) => {
    const Attention = mongoose.model('Attention');
    await Attention.find({
        username: req.query.username
    }).exec().then(result => {
        res.json({
            code: 0,
            msg: '获取信息成功',
            result
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: '获取信息失败',
            err
        })
    })

})
// 根据用户名和用户id获取数据
router.get('/item', async (req, res) => {
    console.log(req.query)
    const Attention = mongoose.model('Attention');
    await Attention.find({
        username: req.query.username,
        productId: req.query.id
    }).exec().then(result => {
        res.json({
            code: 0,
            msg: '获取信息成功',
            result
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: '获取信息失败',
            err
        })
    })
})

// 查询关注数量
router.get('/count', async (req, res) => {
    const Attention = mongoose.model('Attention');
    await Attention.find({
        productId: req.query.id
    }).exec().then(result => {
        res.json({
            code: 0,
            msg: '获取信息成功',
            count: result.length
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: '获取信息失败',
            err
        })
    })
})
module.exports = router;