var mongoose = require('mongoose'),
	User 	 = mongoose.model('User'),
	Paper 	 = mongoose.model('Paper'),
	Notice 	 = mongoose.model('Notice')
	
// 首页控制器
exports.showIndex = function (req,res) {
	var totalpaper = 0;

	// 获取所有文章数
	Paper.find({}).sort('-meta.createAt').exec(function (err,papers) {
		if (papers.length % 7 !=0 ) {
			totalpaper = parseInt(papers.length / 7)+1;
		}else{
			totalpaper = parseInt(papers.length / 7);
		}
	})
	var page = 1;
	if (req.query.page) {
		page = req.query.page;
	}
	page = parseInt(page);
	var papers;
	// 每一页显示的文章数
	Paper.find({},null,{skip:(page-1)*7,limit:7}).sort('-meta.createAt').exec(function (err,papers) {
		if (err) {
			papers = [];
			return;
		}
		console.log(papers)
		var notices;
		Notice.find({},function (err,notices) {
			if (err) {
				notices = [];
			}
			res.render('./combine/index',{
			title:'Nljshoxbb',
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


