# nodeJs+MongoDB+boostrap搭建的网站

##介绍
本项目的登录和注册页面的交互代码由jQuery完成，其他页面交互代码由原生js来完成。

###1.后台
* 由nodeJs的express 4.13.x 来搭建后台
* mongoDB存储数据，mongoose模块操作mongoDB数据
* ejs模板创建、渲染页面

###2.前台
* 使用requireJS组织各模块
* sass对样式预编译和模块化划分
* boostrap进行布局
* 前后数据请求通过ajax完成

###3.开发环境
* 使用gulp进行构建，编译sass、压缩css、js
* win10、node版本为 4.4.0

##功能

* 登录利用ajax的验证
* 后台删除用户
* 后台发布公告功能
* 利用ajax实现发布、留言、删除功能
* 加入弹窗模块

##运行环境
* CentOS 7,node版本为4.4.0

##使用
打开config.js进行基本配置，默认注册账号成功后不用邮箱激活，直接登录即可。设置`user`默认`role`为0,设置`role > 50`可获得管理员权限。
```
// 设置cookie时间，为30天
cookie_maxAge:1000 * 60 * 60 * 24 * 30,
// 设置连接数据库url
dbUrl:'mongodb://localhost/blog',
session_secret:'nljshoxbb',
// 设置运行端口
port: process.env.PORT || 3000,
// 设置邮箱
mail_opt:{
	mail163:{
		host:'smtp.163.com',
		auth:{
			user:'...', //邮箱帐号
			pass:'...'          // 开启邮箱smtp设置的密码
		},
	},
	mailqq:{
		host:'smtp.qq.com',
		auth:{
			user:"...",
			pass:"..."
		}
	}
}

// 设置首页显示文章数
index_paper_count:10,
// 设置个人页显示的文章数
user_paper_count:7,
```

##继续完善
* 后台管理交互用angular构建
* 完成管理用户、文章功能
* 优化手机端



