module.exports = function (options) {

	var nodemailer    = require('nodemailer'),
		config     	  = require('../../config'),
		smtpTransport = nodemailer.createTransport("SMTP",{
		host:config.mail_opt.mailqq.host,
		auth:{
			user:config.mail_opt.mailqq.auth.user,
			pass:config.mail_opt.mailqq.auth.pass
		}
	});
	// 发送邮件
	smtpTransport.sendMail(options,function (error,response) {
		if (error) {
			console.log(error);
		}else{
			console.log("Message sent:"+ response.message);
		}
		smtpTransport.close(); //如果没有，关闭连接池
	});
}