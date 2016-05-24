'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
// ObjectId是mongoose中重要的引用字段类型，在Schema中默认配置了该属性，索引也是利用组件进行
var ObjectId = Schema.Types.ObjectId;
var CommentSchema = new mongoose.Schema({
  name:{ type:String},
  paper:{type:ObjectId,ref:'Paper'},
  from:{type:ObjectId,ref:'User'},
  reply:[{
    from:{type:ObjectId,ref:'User'},
    to:{type:ObjectId,ref:'User'},
    content:String,
    meta:{createAt:{type:Date,default:Date.now()}}
  }],
  title:String,//评论文章标题
  content:String,//评论内容
  time:String,//评论时间
  meta: {
    createAt: {type: Date,default: Date.now()},
    updateAt: {type: Date,default: Date.now()}
  }
});
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    // console.log(this.isNew)
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
CommentSchema.statics = {
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

module.exports = CommentSchema;