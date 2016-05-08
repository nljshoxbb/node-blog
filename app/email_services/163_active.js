module.exports = function (options) {
	var config = require('config')
	var nodemailer = require('nodemailer'),
		smtpTransport = nodemailer.createTransport("SMTP",{
		host:config.mail_opt.host,
		auth:{
			user:config.mail_opt.auth.user,
			pass:config.mail_opt.auth.pass
		}
	});
	smtpTransport.sendMail(options,function (error,response) {
		if (error) {
			console.log(error);
		}else{
			console.log('Message sent:'+response.message)
		}
		smtpTransport.close();
	});
}