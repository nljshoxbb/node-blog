require.config({

	baseUrl:'/javascripts/lib',
	paths:{
		app:'../app',
		kindeditor:'../kindeditor',
		jquery:'//cdn.bootcss.com/jquery/1.12.4/jquery.min',
		bootstrap:'//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min',
		validate:'//cdn.bootcss.com/jquery-validate/1.14.0/jquery.validate.min'
	},
	shim:{
		bootstrap:{
			deps:['jquery'],
			exports:'bootstrap'
		},
		// 插件依赖
		validate:{
			deps:['jquery'],
			exports:'validate'
		}
	}
})

require(['jquery',
	'bootstrap',
	'validate',
	'utils',
	'kindeditor/kindeditor-all-min',
	'app/comment',
	'app/login',
	'app/poper',
	'app/confirm',
	'app/slider'
	     ],
	function ($,
		bootstrap,
		validate,
		Utils,
		kindeditor,
		comment,
		popuper,
		confirm,
		slider
		) {
		/**
		 * 配置富文本编辑器
		 */
		var editor;
		window.KindEditor.create('textarea', {
			themeType:'simple',
			allowImageUpload : false,
			resizeType:1,
			width:'100%',
			afterBlur: function(){this.sync();},
			items : [
			'undo', 'redo', '|', 'preview', 'code', 'cut', '|', 'justifyleft', 'justifycenter', 'justifyright','justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', '|', 'fullscreen', '/',
        	'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        	'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 
        	'insertfile', 'table', 'hr', 'emoticons', 'baidumap']
		});

		/**
		 * 轮播控制器
		 * @type {[type]}
		 */
		if (document.getElementById('slide')) {
			var slideWrap = document.getElementById('slide');
			var slide = Slider({
			    dom: slideWrap,
			    duration: 5000,
			    speed: 600,
			    effect: 'fade',
			    isAutoPlay: true,
			    trigger: 'click',
			    pagination: false,
			    navigation: false,
			    pauseOnHover: false
			});
		}

		if (document.getElementById('adSlide')) {
			var adSlide = document.getElementById('adSlide');
			console.log(adSlide)
			var ad = Slider({
			    dom: adSlide,
			    duration: 5000,
			    speed: 600,
			    effect: 'left',
			    isAutoPlay: true,
			    trigger: 'click',
			    pagination: false,
			    navigation: false,
			    pauseOnHover: false
			});
		}

		/**
		 * 设置首页点击文章跳转到文章详细页面
		 */
		if (document.querySelector('.middle')) {
			var middle = document.querySelector('.middle');
			Utils.addEvent(middle,'click',function (event) {
				var event  = window.event || event;
				var target = event.target || event.srcElement;
				
				if ((target.nodeType === 1) && (target.className === 'panel-heading')) {
					var panelNode = target.childNodes;
					var len       = panelNode.length;
					for(var i = 0;i < len;i++ ){
						if (panelNode[i].nodeType === 1 ) {
							panelNode[i].click();
							
						}
					}
				}else if (target.tagName.toUpperCase() === 'P'|| target.className === 'panel-body') {
					var panel = target.parentNode.parentNode;
					var pHeading = panel.firstChild.nextSibling;
					console.log(pHeading)
					for(var i = 0; i < pHeading.childNodes.length;i++){
						if (pHeading.childNodes[i].nodeType === 1) {
							pHeading.childNodes[i].click();
						}
					}
					
				}
			})
		}
		
		// 
		if (document.getElementById('postArticle')) {
			window.onscroll = function () {
				var postArticle = document.getElementById('postArticle');
				var top = document.documentElement.scrollTop || document.body.scrollTop,
					offsetTop = postArticle.offsetTop,
					height = postArticle.offsetHeight,
					left = postArticle.offsetLeft;

				if (top>offsetTop && top<offsetTop+height) {
					postArticle.style.position = 'fixed';
					postArticle.style.top='0px';
					// postArticle.style.left = left + 'px';
				}else{
					postArticle.style.position = 'relative';
				}
			}
		}
		
	})