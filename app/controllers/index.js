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
			notices:notices

			})
		})
	})
}


