const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  // 用户id
  userId: Schema.Types.ObjectId,
  // 用户名
  username: {
    type: String,
    required: true,
  },
  // 密码
  password: {
    type: String,
    required: true
  },
  real_name: { type: String },
  sex: { type: String },
  phone_number: { type: String },
  email: { type: String },
  id_number: { type: String },
  company: { type: String },
  branch: { type: String },
  time: { type: Date }
});
// 密码加盐
adminSchema.pre("save", function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});
// 比较密码
adminSchema.methods = {
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) {
          resolve(isMatch);
        } else {
          reject(err);
        }
      });
    });
  }
};

mongoose.model("Admin", adminSchema);
