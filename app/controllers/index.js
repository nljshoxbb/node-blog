var mongoose = require('mongoose'),
	config   = require('../../config'),
	User 	 = mongoose.model('User'),
	Paper 	 = mongoose.model('Paper'),
	Notice 	 = mongoose.model('Notice');	
/**
 * 首页控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.showIndex = function (req,res) {
	var totalpaper = 0;
	// 获取所有文章数
	Paper.find({}).sort('-meta.createAt').exec(function (err,papers) {
		if (papers.length % config.index_paper_count !=0 ) {
			totalpaper = parseInt(papers.length / config.index_paper_count)+1;
		}else{
			totalpaper = parseInt(papers.length / config.index_paper_count);
		}
	})
	var userTotopaper = 0;
	var paperCount = 0;
	// 获取个人文章数
	if (req.session.user) {
		Paper.find({author:req.session.user.name},function (err,papers) {
		  if (papers.length % config.user_paper_count != 0) {
		    userTotopaper = parseInt(papers.length / config.user_paper_count)+1;
		  }else{
		    userTotopaper = parseInt(papers.length / config.user_paper_count);
		  }
		  paperCount = parseInt(papers.length)
		})
	}
	
	var page = 1;
	if (req.query.page) {
		page = req.query.page;
	}
	page = parseInt(page);
	var papers;
	// 每一页显示的文章数
	Paper.find({},null,{skip:(page-1)*config.index_paper_count,limit:config.index_paper_count}).sort('-meta.createAt').exec(function (err,papers) {
		if (err) {
			papers = [];
			return;
		}
		var notices;
		Notice.find({},function (err,notices) {
			if (err) {
				notices = [];
			}
			res.render('./combine/index',{
			title:config.index_title,
			description:config.description,
			keywords:config.keywords,
			user:req.session.user,
			papers:papers,
			total:totalpaper,
			isFirst:(page-1) == 0,
			isLast:page == totalpaper,
			pagenow:page,
			notices:notices,
			paper:{},
			paperCount:paperCount

			})
		})
	})
}

/**
 * 获取用户详细文章控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getPaper = function (req,res) {
	var _id = req.params.id;
	var user = req.session.user;
	// 用户访问统计，每次访问文章详情页，pv增加1
	Paper.update({_id:_id},{$inc:{pv:1}},function (err) {
		if (err) {
			console.log(err);
		}
	});
	//Comment存储到数据库中的paper属性值与相应的paper _id值相同
	Paper.findById(_id,function (err,paper) {

		if (err) {
			console.log(err);
		}
		// 查找该_id值所对应的评论信息
		Comment.find({paper:_id})
			   .populate('from','name')
			   .populate('reply.from reply.to','name') //查找评论人和回复人的名字
			   .exec(function (err,comments) {
			   		// var time  = moment(comments.reply.meta.createAt).format('YYYY-MM-DD');
			   		if (err) {
			   			console.log(err);
			   			return;
			   		}
			   		res.render('combine/paper_detail',{
			   			title:'文章页面',
			   			paper:paper,
			   			user:user,
			   			comments:comments
			   			// time:meta.updateAt
			   		})
			   })
	})	
}
