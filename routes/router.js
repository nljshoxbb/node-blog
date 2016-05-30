var Admin 	= require('../app/controllers/admin'),
	User 	= require('../app/controllers/user'),
	Index 	= require('../app/controllers/index'),
	Active 	= require('../app/controllers/active'),
	Paper 	= require('../app/controllers/paper'),
	Comment = require('../app/controllers/comment')

var multipart = require('connect-multiparty'),											  // 处理文件上传中间件
	multipartMiddleware = multipart();	

module.exports = function (app) {
	app.use(function (req,res,next) {
		app.locals.user=req.session.user;
		next();
	});

	//首页
	app.get('/index',Index.showIndex);

//**********************用户操作********************
	// 用户注册
	app.get('/',User.showSignup);
	app.post('/signup',User.signup);

	// 用户登录
	app.get('/',User.showSignin);
	app.post('/signin',User.signin);

	// 用户登出
	app.get('/logout',User.logout);

	// 用户激活
	app.get('/active',Active.active);

	// 发表文章
	app.get('/post',User.signinRequired,Paper.showPost);
	app.post('/post',multipartMiddleware,User.signinRequired,Paper.saveImage,Paper.post);

	// 修改功能
	app.get('/edit',User.signinRequired,Paper.edit);
	app.post('/edit',User.signinRequired,Paper.saveEdit);

	// //删除
	app.get('/user/paper/delete',User.signinRequired,Paper.delete);

	app.delete('/comment/:id',User.signinRequired,Comment.deleteComment);

	// 在用户列表中删除文章
	app.delete('/user/paper/list',User.signinRequired,Paper.userDelete);

	// // 提交评论
	app.post('/comment',User.signinRequired,Comment.saveComment);

	// //转载文章
	app.get('/reprint',User.signinRequired,Paper.reprint);
	//
	 // 获取个人主页
	app.get('/user',User.signinRequired,User.getUser);

	// 用户设置页面
	app.get('/user/setting',User.signinRequired,User.showSetting);
	app.post('/user/setting',multipartMiddleware,User.signinRequired,User.saveAvatar,User.setting);

	// // 获取文章具体内容
	app.get('/paper/:id',User.signinRequired,Paper.getPaper);

	// 搜索
	app.get('/search',Paper.search);

//**********************管理操作********************
	//管理页面路由
	app.get('/admin',User.signinRequired,Admin.adminRequired,Admin.adminIndex);

	// 用户管理路由
	app.get('/admin/user/list',User.signinRequired,Admin.adminRequired,Admin.list);

	// 删除用户账号路由
	app.delete('/admin/user/list',User.signinRequired,Admin.adminRequired,Admin.del);

	// 删除全部用户文章
	app.delete('/admin/Paper/deleteAll',User.signinRequired,Admin.adminRequired,Admin.deleteAllPaper);

	// 公告编辑
	app.get('/admin/notice',User.signinRequired,Admin.adminRequired,Admin.showNotice);
	app.post('/admin/notice',User.signinRequired,Admin.adminRequired,Admin.notice);
}