var Comment = require('../models/comment');
var Paper = require('../models/paper')

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