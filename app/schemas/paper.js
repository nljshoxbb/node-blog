'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var PaperSchema = new mongoose.Schema({
  title:String,
  author:String,//作者
  type:{//默认是原创，false表转载
    type:Boolean,
    default:true
  },
  image:String,
  content:String,//内容
  time:String,//发表时间
  comments:[{
    type:ObjectId,
    ref:'Comment'
  }],
  pv:0,//浏览次数
  reprint_from:[], //转载统计
  reprint_to:[],//转载统计
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});
// 模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
PaperSchema.pre('save',function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

PaperSchema.statics = {
  fetch: function(cb) {
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

module.exports = PaperSchema;