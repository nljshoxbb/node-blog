var User = require('../models/user.js');
exports.active = function (req,res) {
	var username = req.query.username;
	User.findOneAndUpdate({
		name:username
	},{active:true},{new:true},function (err,user) {
		if (err) {
			return;
		}
		if (user) {
			res.render('./combine/active',{
				title:'激活成功',
				user:req.session.user,

			})
		}
	})
}