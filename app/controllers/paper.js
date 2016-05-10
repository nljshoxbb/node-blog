var Paper = require('../models/paper'),
	Comment = require('../models/comment');

// 发表文章
exports.post=function(req,res){
	var date = new Date();
	var _paper={
		title:req.body.title,
		author:req.session.user.name,
		content:req.body.content,
		time:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-"+
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	Paper.findOne({
		title:_paper.title,
		author:_paper.author
	},function(err,paper){
		if(err){
			return;
		}
		if(!paper){
			var paper=new Paper(_paper);
			paper.save(function(err){
				if(err){
					res.redirect('/post');
				}
				// paper.update({$push:{paper:paper}},function(err,paper){})
				res.redirect('/')
			})
		}
	})
}
// 展示文章
exports.showPost=function(req,res){
	res.render('combine/post',{
	  	title:'发表页面',
  		user:req.session.user,
	 })
}
// 修改文章
exports.edit=function(req,res){
	Paper.findOne({
		author:req.query.author,
		title:req.query.title
	},function(err,paper){
		if(err){
			paper=[];
			return;
		}
		res.render('combine/edit', { 
			title: '编辑页面',
			user:req.session.user,
			paper:paper,
		});
	});
}
// 保存修改文章
exports.saveEdit=function(req,res){
	// console.log(req.body.title,req.session.user.name)
	Paper.findOneAndUpdate({
		title:req.body.title,
		author:req.session.user.name
	},{content:req.body.content},{new:true},function(err,paper){
		if(err){
			return;
		}
		if(paper){
			res.redirect('/')
		}
	})
}

// 删除文章
exports.delete=function(req,res){
	Paper.findOneAndRemove({
		title:req.query.title,
		author:req.query.author
	},function(err,paper){
		if(err){
			return;
		}
		if(paper){
			res.redirect('/')
		}
	})
}

// 删除留言 待完善
// exports.deleteComment = function (req,res) {
// 	Comment.findOneAndRemove({
// 		content:req.query.content,
// 		name:req.query.name
// 	},function (err,comment) {
// 		if (err) {
// 			return;
// 		}
// 		if (comment) {
// 			console.log('删除评论成功')
// 			res.redirect('/_paper_detail')
// 		}
// 	})
// }

// 获取文章详细页
exports.getPaper=function(req,res){
	var user=req.session.user;
	var date=new Date();
	Paper.findOne({
		author:req.query.author,
		title:req.query.title,
	},function(err,paper){
		if(err){
			console.log(err)
			return;
		}
		paper.update({$inc:{pv:1}}).exec(function(err){
			if(err)
				console.log(err);
		})
		//解析 markdown 为 html
		// paper.content = markdown.toHTML(paper.content);
		// console.log(req.session.user)
		res.render('combine/paper_detail',{ 
			title: '文章页面',
			user: user,
			paper:paper,
		});
	});
}

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

// 文章转载功能
exports.reprint=function(req,res){
	var title=req.query.title,
	      author=req.query.author,
	      currentUser=req.session.user;
	var reprint_to={
		name:currentUser.name
	}
	Paper.findOne({
		title:title,
		author:author
	},function(err,paper){
		if(err)
			return;
		paper.update({$push:{reprint_to:reprint_to}},function(err,paper){});
		var _paper={
			title:paper.title,
			type:'',
			content:paper.content,
			time:paper.time,
			type:false,
			author:currentUser.name,
			comments:[],
			pv:0,
			reprint_to:[],
			reprint_from:[{name:author}]
		};
		Paper.findOne({
			title:_paper.title,
			author:_paper.author
		},function(err,paper){
			if(err){
				console.log(err)
				return;
			}

			if(!paper){
				var re_paper=new Paper(_paper);
				re_paper.save(function(err){
					if (err) {
						console.log(err)
						return;
					}
					res.redirect('/')
				})
			}
			else{
				res.redirect('back')
			}
		})
	})
}

// 搜索功能
exports.search = function (req,res) {
	var date = new Date();
	var keyword = req.query.keyword;
	var pattern = new RegExp(keyword,'i');
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-"+
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	Paper.find({'title':pattern},{'name':1,'title':1,'time':1},function (err,paper) {
		if (err) {
			return;
		}
		res.render('./combine/search',{
			title:'搜索：'+ req.query.keyword,
			time:time,
			paper:paper,
			author:paper.author
		})
	})
}