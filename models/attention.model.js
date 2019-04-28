const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attentionSchema = new Schema({
  // 房源id
  houseId: Schema.Types.ObjectId,
  // 产品id
  productId: {
    type: String,
    required: true
  },
  // 用户名
  username: {
    type: String,
    required: true
  },
  // 房源类型
  houseType: {
    type: String,
    required: true
  },
  //   房源图片
  images: {
    type: Array,
    required: true
  },
  houseTitle: {
    type: String,
    required: true
  },
  // 地区相关
  region: {
    // 名称
    name: {
      type: String,
      required: true
    },
    // 格局
    pattern: {
      //   室
      room: Number,
      //   厅
      hail: Number,
      //   卫
      toilet: Number
    },
    // 面积
    area: {
      type: Number,
      required: true
    },
    // 方向
    direction: {
      type: String,
      required: true
    },
    // 装修情况
    fitment: {
      type: String,
      required: true
    },
    // 是否有电梯
    elevator: {
      type: Boolean,
      required: true
    }
  },
  // 楼层数
  floor: {
    all: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  // 关注人数
  attention_number: {
    type: Number
  },
  // 发布时间
  time: {
    type: Date,
    required: true
  },
  // 价格
  price: {
    type: String,
    required: true
  }
});

mongoose.model("Attention", attentionSchema);