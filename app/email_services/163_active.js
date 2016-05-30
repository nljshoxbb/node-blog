module.exports = function (options) {

	var config 		  = require('config')
	var nodemailer 	  = require('nodemailer'),
		smtpTransport = nodemailer.createTransport("SMTP",{
		host:config.mail_opt.mail163.host,
		auth:{
			user:config.mail_opt.mail163.auth.user,
			pass:config.mail_opt.mail163.auth.pass
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