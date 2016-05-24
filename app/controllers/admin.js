var mongoose  = require('mongoose'),
    Comment   = mongoose.model('Comment'),
	  Paper     = mongoose.model('Paper'),
	  User      = mongoose.model('User'),
	  Notice    = mongoose.model('Notice'),
    moment    = require('moment');

// 首页控制器
exports.adminIndex = function (req,res) {
	res.render('./combine/admin_index',{
		title:'管理员后台'
	});
}

//用户列表页面渲染控制器
exports.list = function(req, res) {
  var user = req.session.user;
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
    return res.redirect('/');
  }
  next();
};

// 删除用户控制器
exports.del = function(req, res) {
  // 获取客户端ajax发送的url值中的id
  var id = req.query.id
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

exports.noticeList = function (req,res) {
  var notice = req.session.user;
  Notice.fetch(function (err,notices) {
    if (err) {
      console.log(err);
    }
    var time = moment(notices.date).format('YYYY-MM-DD');
    res.render('./combine/admin_notice',{
      title:'公告管理',
      notices:notices,
      time:time
    })
  })
}

// 删除公告
exports.deleteNotice=function(req,res){
  Notice.findOneAndRemove({
    title:req.query.title,
  },function(err,notice){
    if(err){
      return;
    }
    if(notice){
      res.redirect('/admin')
    }
  })
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
		res.json({success:1})
	})
}

// 公告列表渲染控制器
exports.showNotice = function (req,res) {
  var notice = req.session.user;
  Notice.fetch(function (err,notices) {
    if (err) {
      console.log(err);
    }
    var time = moment(notices.date).format('YYYY-MM-DD');
    res.render('./combine/admin_notice',{
      title:'公告管理',
      notices:notices,
      time:time
    })
  })
}

// 添加公告
exports.notice = function (req,res) {
	var date = new Date();
  var _notice = {
    title:req.body.title,
    content:req.body.content,
    time:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+ "-"+
         date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  Notice.findOne({
    title:_notice.title,
  },function (err,notice) {
    if (err) {
      return;
    }
    if (!notice) {
      var notice = new Notice(_notice);
      notice.save(function (err) {
        if (err) {
          res.redirect('/admin/notice');
        }
        res.redirect('/admin')
      })
    }
  })
}


