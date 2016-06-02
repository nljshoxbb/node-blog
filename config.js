/**
 * 配置启动项
 * @type {Object}
 */
var config = {

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
				user:'nongluojian@163.com',
				pass:'8761011nlj'
			},
		},
		mailqq:{
			host:'smtp.qq.com',
			auth:{
				user:"382895635@qq.com",
				pass:"bzgpfxqxgfnkbjhe"
			}
		}
	},

	// 设置首页显示文章数
	index_paper_count:4,
	// 设置个人页显示的文章数
	user_paper_count:7,

	// 设置首页标题设置
	index_title:'Nljshoxbb',
	
	//网站描述
	description:'nljshoxbb:来吐槽吧',
	// 
	keywords:'吐槽,node,前端'

};

module.exports = config;