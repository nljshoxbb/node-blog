var mongoose = require('mongoose'),
	Comment  = mongoose.model('Comment'),
 	Paper 	 = mongoose.model('Paper');

// 文章留言功能
exports.comment=function(req,res){
	var date=new Date();
	var _comment={
		name:req.body.name,
		title:req.body.title,
		time:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-"+
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
		content:req.body.content
	}
	var comment=new Comment(_comment);
	Paper.findOne({
		title:req.body.title,
		author:req.body.author
	},function(err,paper){
		if(err){
			return;
		}
		paper.update({$push:{comments:comment}},function(err,paper){})

		if(paper){
			console.log('success')
			res.redirect('back');
		}
	    }
	)
}

// 文章留言功能改
// exports.comment = function (req,res) {
// 	var _comment = req.body.comment;	//获取post发送的数据
// 	// 如果存在cid说明是对评论人进行回复
// 	if (_comment,cid) {
// 		// 通过点击回复一条文章评论的id，找到这条评论的内容
// 		Comment.findById(_comment.cid,function (err,comment) {
// 			var reply = {
// 				from:_comment.from,				//回复人
// 				to:_comment.tid,				//被回复人
// 				content:_content.content,		//回复内容
// 				meta:{
// 					createAt:Date.now()
// 				}
// 			};
// 			comment.reply.push(reply);			//添加到评论的数组中
// 			// 保存该条评论的回复内容
// 			comment.save(function (err,comment) {
// 				if (err) {
// 					console.log(err);
// 				}
// 				// 在数据库中保存用户回复后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
// 				Comment.findOne({_id:comment._id})
// 					   .populate('from','name')
// 					   .populate('reply.from reply.to','name')  //查找评论人和回复人的名字
// 					   .exec(function (err,comments) {
// 					   		res.json({date:comments});
// 					   });
// 			});
// 		});
// 	// 简单的评论，不是对评论内容的回复
// 	}else{
// 		// 将用户评论评论创建新对象并保存
// 		var comment = new Comment(_comment);
// 		comment.save(function (err,comments) {
// 			if (err) {
// 				console.log(err);
// 			}
// 			// 在数据库中保存用户评论后会生成一条该评论的_id，服务器查找该_id对应的值返回给客户端
// 			Comment.findOne({_id:comment._id})
// 				   .populate('from','name')
// 				   .populate('reply.from reply.to','name')  //查找评论人和回复人的名字
// 				   .exec(function (err,comments) {
// 				   	res.json({data:comments});
// 				   });
// 		});
// 	}
// };


// 删除留言
exports.deleteComment = function (req,res) {
	Paper.findOneAndRemove({
		comments:req.query.comment,
		name:req.query.name
	},function (err,comment) {
		if (err) {
			return;
		}
		if (comment) {
			console.log('删除评论成功')
			res.redirect('/paper_detail')
		}
	})
}