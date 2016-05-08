'use strict';

var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
  name:{ //评论人
    // unique:true,
    type:String
  },
  title:String,//评论文章标题
  content:String,//评论内容
  time:String,//评论时间
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
var PaperSchema = new mongoose.Schema({
  title:{//文章标题
    // unique:true,
    type:String
  },
  author:String,//作者
  type:{//默认是原创，false表转载
    type:Boolean,
    default:true
  },
  content:String,//内容
  time:String,//发表时间
  comments:[CommentSchema],//评论
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
PaperSchema.pre('save',function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

module.exports = PaperSchema;