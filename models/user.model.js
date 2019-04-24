const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // 用户id
  userId: Schema.Types.ObjectId,
  // 用户名
  username: {
    type: String,
    require: true
  },
  // 密码
  password: {
    type: String,
    require: true
  }
});
// 密码加盐
userSchema.pre("save", function(next) {
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
userSchema.methods = {
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

mongoose.model("User", userSchema);
