var mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    Paper       = mongoose.model('Paper'),
    moment      = require('moment'),
    fs          = require('fs'),
    path        = require('path'),
    _           = require('underscore'),
    config      = require('../../config'),
    service_qq  = require('../email_services/qq_active'),
    service_163 = require('../email_services/163_active');


/**
 * 获取用户文章列表控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUser = function function_name(req,res) {
    var totalpaper = 0;
    Paper.find({author:req.session.user.name},function (err,papers) {
      if (papers.length % config.user_paper_count != 0) {
        totalpaper = parseInt(papers.length / config.user_paper_count)+1;
      }else{
        totalpaper = parseInt(papers.length / config.user_paper_count);
      }
    })
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    page = parseInt(page);
    var papers;
    Paper.find({author:req.session.user.name},null,{skip:(page-1)*config.user_paper_count,limit:config.user_paper_count},function (err,papers) {
      if (err) {
        papers = [];
        return;
      }
      res.render('./combine/user',{
        title:req.session.user.name + '|Nljshoxbb',
        user:req.session.user,
        papers:papers,
        total:totalpaper,
        isFirst:(page-1) == 0,
        isLast:page == totalpaper,
        pagenow:page
      })
    })

}

/**
 * 用户注册页面渲染控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.showSignup = function(req, res) {
  res.render('./combine/signin', {
    title: '注册页面'
  });
};

/**
 * 用户注册控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
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

/**
 * 用户登录页面渲染控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.showSignin = function(req, res) {
  res.render('./combine/signin', {
    title: 'nljshoxbb | 登录'
  });
};

/**
 * 用户登录控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
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
        // 没有邮箱激活
        return res.json({data: 2})
      }

    }

  });
};

/**
 * 用户登出控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.logout = function(req, res) {
  delete req.session.user;
  res.redirect('/login')
};


/**
 * 判断用户是否登录中间件
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/login');
  }
  next();
};


/**
 * 用户设置页面渲染控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.showSetting = function (req,res) {
  console.log(req.session.user._id);
    User.find({},function (err,avatar) {
    if (err) {
      console.log(err);
    }
    res.render('combine/user_setting',{
      title:'设置',
      user:req.session.user,
      avatar:{}
    })
  })
}


/**
 * 保存用户头像控制器
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.saveAvatar = function(req, res, next) {
  // 如果有文件上传通过connect-multiparty中间件生成临时文件并通过req.files进行访问
  // 并且当提交表单中有文件上传请求时表单要使用enctype="multipart/form-data"编码格式
  var avatarData        = req.files.uploadAvatar,                    // 上传文件
      filePath         = avatarData.path,                             // 文件路径
      originalFilename = avatarData.originalFilename;         // 原始名字
  
  // 如果有自定义上传图片，则存在文件名
  if(originalFilename) {
    fs.readFile(filePath, function(err,data) {
      if(err) {
        console.log(err);
        return;
      }
      var timestamp = Date.now(),                             // 获取时间
          type      = avatarData.type.split('/')[1],               // 获取图片类型 如jpg png
          avatar     = timestamp + '.' + type,                    // 上传海报新名字
          // 将新创建的图片存储到/public/upload 文件夹下
          newPath = path.join(__dirname,'../../','/public/upload/avatar/' + avatar);
      // 写入文件
      fs.writeFile(newPath,data,function(err) {
        if(err) {
          console.log(err);
          return;
        }
        req.avatar = avatar;
        next();
      });
    });
  }else {
    // 没有自定义上传海报
    next();
  }
};


/**
 * 用户信息设置控制器
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.setting = function (req,res) {
  var settingObj = req.body.user;
  if (req.avatar) {
    settingObj.avatar = req.avatar;

    User.findOne({avatar:settingObj.avatar},function (err,_user) {
      if (err) {
        console.log(err);
      }
      if (_user) {
        console.log('头像已存在')        
        res.redirect('/user/setting');

      }else{
        var newAvatar = new User(settingObj);
        newAvatar.save(function (err,_newAvatar) {
          if (err) {
            console.log(err);
          }
          res.redirect('/user/setting');
        })
      }
    })
  }else{
    res.redirect('/user/setting');
  }
}
