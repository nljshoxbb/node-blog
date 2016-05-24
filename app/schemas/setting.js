'use strict';

var mongoose      = require('mongoose');
var Schema        = mongoose.Schema;
var ObjectId      = Schema.Types.ObjectId;
var SettingSchema = new mongoose.Schema({

  name:{ //评论人
    // unique:true,
    type:String
  },
  user:{
    type:ObjectId,
    ref:'User'
  },
  content:String,//评论内容
  time:String,//评论时间
  meta: {
    createAt: {type: Date,default: Date.now()},
    updateAt: {type: Date,default: Date.now()}
  }
});
SettingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
SettingSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id,cb) {
    return this
      .findOne({_id: id})
      .exec(cb);
  }
};

module.exports = SettingSchema;