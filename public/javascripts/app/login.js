define(['jquery','validate'],function (jquery,validate) {
	$.support.cors = true;
	// 表单验证
	validator = $(function () {
	jQuery.prototype.serializeObject=function(){  
	    var a,o,h,i,e;  
	    a=this.serializeArray();  
	    o={};  
	    h=o.hasOwnProperty;  
	    for(i=0;i<a.length;i++){  
	        e=a[i];  
	        if(!h.call(o,e.name)){  
	            o[e.name]=e.value;  
	        }  
	    }  
	    return o;  
	}; 
	// 用户登录及对象注册方法
	var signObject = {

		// 用户登录方法
		signIn:function (obj) {
			$(obj).validate({
				rules:{
					'name':{
						required:true,
						minlength:2,
						maxlength:15
					},
					'password':{
						required:true,
						minlength:2,
						maxlength:15
					}
				},
				messages:{
					'name':{
						required:'必须填写用户名',
						minlength:'用户名最小2位',
						maxlength:'用户名最大15位'
					},
					'password':{
						required:'必须填写密码',
						minlength:'密码最小2位',
						maxlength:'密码最大15位'
					}
				},
				submitHandler:function () {
					$.ajax({
						url:'signin',
						method:'POST',
						data:{
							'user':$(obj).serializeObject()    //将发送的数据进行序列号
						}
					})
					.done(function (results) {
						console.log(results)
						switch(results.data){
							//用户不存在
						case 0:
							if ($(obj).find('input:eq(0)').val().length>1) {
								$(obj).find('.error:eq(0)').html('用户不存在！').show();
							}
							break;
							// 密码填写错误
						case 1:
							if ($(obj).find('input:eq(1)').val().length>1) {
								$(obj).find('.error:eq(1)').html('密码错误！').show();
							}
							break;
							// 没有验证邮箱
						case 2:
							$('.signin-msg').html("请到注册邮箱激活").show();
							break;
						default:
							//跳转首页
							$('.signin-msg').html('登录成功').show();
							$('a')[0].click();
						}
					});
				}		
			})
		},
		// 用户注册方法
		signUp:function (obj) {
			$(obj).validate({
				rules:{
					'name':{
						required:true,
						minlength:2,
						maxlength:15
					},
					'password':{
						required:true,
						minlength:2,
						maxlength:15
					},
					'confirm-password':{
						equalTo:$(obj).find('input:eq(1)')
					},
					'email':true
				},
				messages:{
					'name':{
						required:'必须填写用户名',
						minlength:'用户名最小2位',
						maxlength:'用户名最大15位'
					},
					'password':{
						required:'必须填写密码',
						minlength:'密码最小2位',
						maxlength:'密码最大15位'
					},
					'confirm-password':'两次输入的密码不相同',
					'email':'请输入正确格式的电子邮件'
				},
				submitHandler:function () {
					$.ajax({
						url:'signup',
						method:'POST',
						data:{
							'user':$(obj).serializeObject()
						}
					})
					.done(function (results) {
						console.log(results);
						switch(results.data){
							case 0:
								// 用户名已存在
								// if ($(obj).find('input:eq(0)').val().length>1) {
									$('.signup-msg').html('用户已存在').show();
								// }
								break;
								
							default:
								$('.signup-msg').html('注册成功,请到注册邮箱完成账号激活').show();

						}
					});
				}
			});
		}
	}
	signObject.signIn('#signinForm');

	signObject.signUp('#signupForm');

	});

})
	