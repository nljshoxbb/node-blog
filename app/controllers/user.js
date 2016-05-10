var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Paper = mongoose.model('Paper'),
    moment = require('moment'),
    service_qq = require('../email_services/qq_active'),
    service_163 = require('../email_services/163_active');
    // config = require('config');

// 页面权限控制中间件
exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
      req.json({login:false});
      return res.redirect('/signin')
    }
    next();
}
exports.checkNotLogin = function (req,res,next) {
  if (req.session.user) {
    req.json({login:true})
    return res.redirect('back')
  }
  next();
}

// 用户主页
exports.getUser = function function_name(req,res) {
    var totalpaper = 0;
    Paper.find({author:req.session.user},function (err,papers) {
      if (papers.length % 5 != 0) {
        totalpaper = parseInt(papers.length / 5)+1;
      }else{
        totalpaper = parseInt(papers.length / 5);
      }
    })
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    page = parseInt(page);
    var papers;
    Paper.find({},null,{skip:(page-1)*5,limit:5},function (err,papers) {
      if (err) {
        papers = [];
        return;
      }
      res.render('./combine/user',{
        title:'用户页面',
        user:req.session.user,
        papers:papers,
        total:totalpaper,
        isFirst:(page-1) == 0,
        isLast:page == totalpaper,
        pagenow:page
      })
    })

}

// 用户注册页面渲染控制器
exports.showSignup = function(req, res) {
  res.render('./combine/signup', {
    title: '注册页面'
  });
};

// 用户注册控制器
exports.signup = function(req, res) {
  var _user = req.body.user;
  var url = 'http://localhost:3000/active?username=' + _user.name;
  var options_qq = {
    from: "@_@<382895635@qq.com>", //发件地址
    to: _user.email, //收件列表
    subject: "账号激活",
    html: "<b>欢迎注册，请点击以下链接完成注册</b><br /><a href=" + url + ">" + url + "</a>"
  }
  var options_163 = {
    from: "@_@<nongluojian@163.com>",
    to: _user.email,
    subject: "账号激活",
    html: "<b>欢迎注册，请点击以下链接完成注册</b><br /><a href=" + url + ">" + url + "</a>"
  }

  // 使用findOne对数据库中user进行查找
  User.findOne({
    name: _user.name
  }, function(err, user) {
    if (err) {
      console.log(err);
    }
    // 如果用户名已存在
    if (user) {
      return res.json({data: 0});
    }
    // 数据库中没有该用户名，将其数据生成新的用户数据并保存至数据库
    user = new User(_user); // 生成用户数据
    // 发邮件
    if (_user.email.indexOf('qq') != -1) {
      service_qq(options_qq);
    } else {
      service_163(options_163);
    }
    user.save(function(err, user) {
      if (err) {
        console.log(err);
      }
      // req.session.user = user;         // 将当前登录用户名保存到session中
      return res.json({data: 2}); // 注册成功
    });
  });
};

// 用户登录页面渲染控制器
exports.showSignin = function(req, res) {
  res.render('./combine/signin', {
    title: '登录页面'
  });
};

// 用户登录控制器
exports.signin = function(req, res) {
  var _user = req.body.user;
  User.findOne({
    name: _user.name
  }, function(err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.json({data: 0}); // 用户不存在
    } else {
      if (!user.active) {
        // 使用user实例方法对用户名密码进行比较
        user.comparePassword(_user.password, function(err, isMatch) {
          if (err) {
            console.log(err);
            return;
          }
          // 密码匹配
          if (isMatch) {
            console.log('密码匹配')
            req.session.user = user; // 将当前登录用户名保存到session中
            return res.json({data: 3}); // 登录成功  
          }else{
            // 账户名和密码不匹
            return res.json({data: 1});
          }       
        });
      } else {
        return res.json({data: 2})
      }

    }

  });
};

// 用户登出控制器
exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/')
};


// 判断用户是否登录
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
};

// 用户详细页
exports.detail = function(req, res) {
  res.render('detail', {
    title: '我的主页'
  })
  
  
}

