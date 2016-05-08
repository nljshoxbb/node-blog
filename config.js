var config = {
	dbUrl:'mongodb://localhost/blog',
	secret:'nljshoxbb',
	port: process.env.PORT || 3000,
	mail_opt:{
		host:'smtp.163.com',
		auth:{
			user:'nongluojian@163.com',
			pass:'8761011nlj'
		},
	},

};

module.exports = config;