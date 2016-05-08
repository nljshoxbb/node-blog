var User = require('../models/user'),
	Paper = require('../models/paper');
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
	Paper.find({},null,{skip:(page-1)*2,limit:2},function (err,papers) {
		if (err) {
			papers = [];
			return;
		}
		console.log('totalpaper='+totalpaper);
		
		res.render('./combine/index',{
			title:'主页',
			user:req.session.user,
			papers:papers,
			total:totalpaper,
			isFirst:(page-1) == 0,
			isLast:page == totalpaper,
			pagenow:page,
		});
	})
}