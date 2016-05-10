var User = require('../models/user'),
	Paper = require('../models/paper');
	Notice = require('../models/notice.js')
	
// 首页控制器
exports.showIndex = function (req,res) {
	var totalpaper = 0;

	// 获取所有文章数
	Paper.find({},function (err,papers) {
		if (papers.length % 2 !=0 ) {
			totalpaper = parseInt(papers.length / 2)+1;
		}else{
			totalpaper = parseInt(papers.length / 2);
		}
	})
	var page = 1;
	if (req.query.page) {
		page = req.query.page;
	}
	page = parseInt(page);
	var papers;
	// 每一页显示的文章数
	Paper.find({},null,{skip:(page-1)*2,limit:2},function (err,papers) {
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
			title:'主页',
			user:req.session.user,
			papers:papers,
			total:totalpaper,
			isFirst:(page-1) == 0,
			isLast:page == totalpaper,
			pagenow:page,
			notices:notices
			})
			console.log(papers)
		})
	})
}


