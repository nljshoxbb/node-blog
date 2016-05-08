module.exports = function (options) {
	var nodemailer = require('nodemailer'),
		smtpTransport = nodemailer.createTransport("SMTP",{
		host:'smtp.qq.com',
		auth:{
			user:"382895635@qq.com",
			pass:"bzgpfxqxgfnkbjhe"
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