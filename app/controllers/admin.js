var Comment = require('../models/comment'),
	Paper = require('../models/paper'),
	User = require('../models/user'),
	Notice = require('../models/notice');

// 首页控制器
exports.adminIndex = function (req,res) {
	res.render('./combine/admin_index',{
		title:'管理员后台'
	});
}

//用户列表页面渲染控制器
exports.list = function(req, res) {
  User.fetch(function(err, users) {
    if (err) {
      console.log(err);
    }
    var time = moment(users.date).format('YYYY-MM-DD');
    res.render('./combine/admin_user_list', {
      title: '用户列表页',
      users: users,
      time: time
    });
  })
};


// 用户权限控制器
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;
  if (user.role <= 10) {
    return res.redirect('/signin');
  }
  next();
};

// 删除用户控制器
exports.del = function(req, res) {
  // 获取客户端ajax发送的url值中的id
  var id = req.query.id;
  if (id) {
    // 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
    User.remove({
      _id: id
    }, function(err) {
      if (err) {
        console.log(err);
      }
      res.json({
        success: 1
      }); //删除成功
    })
  }
}

// 删除全部文章
exports.deleteAllPaper = function (req,res) {
	var totalpaper ;
	Paper.find({},function (err,papers) {
		totalpaper = papers;
	})
	Paper.remove({_id:id},function (err) {
		if (err) {
			return;
		}
		res.json({
			success:1
		})
	})
}

// // 添加公告
// exports.notice = function (req,res) {
// 	var date = new Date();
// }