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
		validate:{
			deps:['jquery'],
			exports:'validate'
		}
	}
})

require(['jquery','bootstrap','validate','moment','utils','app/comment','app/slider','app/login','kindeditor/kindeditor-all-min'],
	function ($,bootstrap,moment,utils,comment,Slider,kindeditor) {
		var editor;
		window.editor = KindEditor.create('textarea', {
			themeType:'simple',
			allowImageUpload : false,
			resizeType:1,
			width:'100%',
			afterBlur: function(){this.sync();},
			items : [
			'source', '|', 'undo', 'redo', '|', 'preview', 'code', 'cut', 'copy', 'paste','plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright','justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        	'superscript', 'clearhtml', 'selectall', '|', 'fullscreen', '/',
        	'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        	'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 
        	'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        	'anchor', 'link']
		});
		
		var slideWrap = document.getElementById('slide');
		var slide = new Slider({
		    dom: slideWrap,
		    duration: 5000,
		    speed: 600,
		    effect: 'fade',
		    isAutoPlay: true,
		    trigger: 'click',
		    pagination: false,
		    navigation: false,
		    pauseOnHover: true
		});
	})