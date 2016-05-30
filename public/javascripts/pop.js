;(function (window,document,undefined) {
	var unique;
	var Layer = function (txt, config) {
		// this.dom   	 = opts.dom;
		// this.title 	 = opts.title || 'title';
		// this.message = opts.message || 'message';
		// this.callback= opts.callback;
		this.txt = txt;
		this.config = config;
	}

	Layer.prototype = {

		init:function () {
			var _this = this;
			['wrap','fade','modal','title','content','footer'].map(function (name) {
				_this[name] = document.createElement('DIV');
				_this[name].className = 'Pop-' + name;
			})

			_this.wrap.className = 'Pop-wrap Pop-on';
			_this.confirmBtn     = document.createElement('BUTTON');
			_this.cancelBtn       = document.createElement('BUTTON');

			_this.confirmBtn.className = 'Pop-confirm';
			_this.confirmBtn.innerHTML = '确定';
			_this.cancelBtn.className  = 'Pop-close';
			_this.cancelBtn.innerHTML  = '取消';

			_this.modal.appendChild(_this.title);
			_this.modal.appendChild(_this.content);
			_this.modal.appendChild(_this.footer);
			_this.footer.appendChild(_this.cancelBtn);
			_this.footer.appendChild(_this.confirmBtn);
			_this.wrap.appendChild(_this.fade);
			_this.wrap.appendChild(_this.modal);

			// dom.innerHTML = '<div class="Pop-fade"></div><div class="Pop-wrap"><div class="Pop-model"><div class="Pop-title">'+ opts.title + '</div><div class="Pop-content">'
			// + opts.message +'</div><div class="Pop-footer"><button class="Pop-confirm">确定</button></div></div></div>'

			_this.fade.addEventListener('click',_this.onFade.bind(_this));

			setTimeout(function () {
				_this.wrap.className = 'Pop-wrap';
			})
		},
		option: function() {
			if(typeof this.config === 'string'){
				this.setTheme(this.config);
			}
			else if(typeof this.config === 'function'){
				this.setTheme();
				this.callback = this.config;
			}
			else if(typeof this.config === 'object'){
				var type = this.config.type ? this.config.type : 'default';
				this.setTheme(type);
				if(this.config.title){
					this.title.innerHTML = this.config.title;
				}
				this.callback = this.config.callback;
			}
			// else {
			// 	this.setTheme();
			// }
		},
		alert:function () {
			var _this = this;
			this.init();
			// if (document.querySelector('.Pop-wrap')) {
			// 	var 
			// 	var content = document.querySelector('.Pop-content');
			// 	var 
			// 	this.content.innerHTML = this.message;
			this.option(this.config);
			this.content.innerHTML = this.txt;
			this.footer.removeChild(this.cancelBtn);
			this.confirmBtn.addEventListener('click',_this.onClose.bind(_this));
			
		},
		close:function (param,flag) {
			if (typeof param === 'object') {param = param.value};
			var _this = this;
			document.getElementsByTagName('BODY')[0].removeChild(_this.wrap);

			this.fade.removeEventListener('click',_this.onFade,false);
			this.cancelBtn.removeEventListener('click',_this.onClose,false);
			this.confirmBtn.removeEventListener('click',_this.onClose,false);

			if (_this.callback && !flag) {
				if (param !== undefined) {
					_this.callback(param);
				}else{
					_this.callback();
				}
			}
		},
		onClose:function (param,flag) {
			flag = typeof flag !== 'boolean' ? false : flag;
			this.close(param,flag);
		},
		onFade:function () {
			this.close(undefined,true);
		}

	}

	var Pop = {
		alert: function(txt, config) {
			var layer = this.single(txt, config);
			if(layer){
				layer.alert();
			}
		},
		single: function(txt, config) {
			if (unique === undefined) {
				unique = new Layer(txt, config);
				return unique;
			}
			else {
				return false;
			}
		}
	}

	window.Pop = Pop;

})(window,document);