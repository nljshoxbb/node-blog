;(function (root,factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	}else if (typeof exports === 'object') {
		module.exports = factory;
	}else{
		root.Utils = factory();
	}
})(this,function () {

	var Utils = {};

	/**
	 * 检测是否为String
	 * @param  {[type]}  s [description]
	 * @return {Boolean}   [description]
	 */
	Utils.isString = function (s) {
		return (s === '' || s) && (s.constructor === String || Object.prototype.toString.call(s) === '[object String]');
	}

	Utils.isObject = function (o) {
		return o && (o.constructor === Object || Object.prototype.toString.call(o) === '[object Object]');
	}

	// Utils.indexOf = function (arr,elem) {
	// 	// 数组或类数组对象
	// 	if (arr.length) {
	// 		return [].indexOf.call(arr,elem);
	// 	}
	// 	else if (true) {}
	// }
	
	Utils.each = function (arr,callback) {
		// 如果遍历数组
		if (arr.length) {
			return [].forEach.call(arr,callback);
		}
		// 遍历对象
		else if (this.isObject(arr)) {
			for(var i in arr){
				if (arr.hasOwnProperty(i)) {
					if (callback.call(arr[i],arr[i],i,arr) === false) {return}
				}
			}
		}
	}

	/**
	 * 设置浏览器前缀
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	Utils.getVendorPropertyName = function (name) {
		var div = document.createElement('div');
        var style = div.style;
        var _prop;
        var vendors = ['o', 'ms', 'Moz', 'webkit'];

        if (name in style) {
            return name;
        }
        _prop = name.charAt(0).toUpperCase() + name.substr(1);
        for (var i = vendors.length; i--;) {
            var v = vendors[i];
            var vendorProp = v + _prop;
            if (vendorProp in style) {
                return vendorProp;
            }
        }
	}

	/**
	 * 获取元素样式
	 * @param  {dom} el        [description]
	 * @param  {[type]} styleName [description]
	 * @return {[type]}           [description]
	 */
	Utils.getStyle = function (el,styleName) {
		if (!el) {return};
		styleName = this.getVendorPropertyName(styleName);
		if (styleName === 'float') {
			styleName = 'cssFloat';
		}
		if (el.style[styleName]) {
			return el.style[styleName];
		}else if (window.getComputedStyle) {
			return window.getComputedStyle(el,null)[styleName];
		}else if (document.defaultView && document.defaultView.getComputedStyle) {
			styleName = styleName.replace(/[/A-Z]/g,'-$1');
			styleName = styleName.toLowerCase();
			var style = document.defaultView.getComputedStyle(el,'');
			return style && style.getPropertyValue(styleName);
		}else if (el.currentStyle) {
			return el.currentStyle[styleName];
		}
	}
	/**
	 * 设置样式
	 * @param {dom} elem       [description]
	 * @param {[type]} styleName  [description]
	 * @param {[type]} styleValue [description]
	 */
	Utils.setStyle = function (elem,styleName,styleValue) {
		var _this = this;
		// 如果elem为数组
		if (elem.length) {
			// 遍历出每一个元素获取相应样式
			this.each(elem,function (e) {
				_this.setStyle(e,styleName,styleValue);
			})
		}
		// 如果styleName传入为对象
		if (this.isObject(styleName)) {
			var style = document.createElement('div').style,
				old   = '';
			for(var n in styleName){
				old = n;
				// 添加浏览器前缀
				n   = _this.getVendorPropertyName(n);
				if (n in style) {
					// 
					elem.style[n] = styleName[old];
				}
			}
			return;
		}
		if (this,isString(styleName)) {
			styleName = this.getVendorPropertyName(styleName);
			// 赋值给相应的样式
			elem.style[styleName] = styleValue;
		}
	}

	/**
	 * 添加事件
	 * @param {[type]}   elem [description]
	 * @param {[type]}   type [description]
	 * @param {Function} fn   [description]
	 */
	Utils.addEvent = function (elem,type,fn) {
		if (elem.addEventListener) {
			elem.addEventListener(type,fn,false);
			// 兼容ie
		}else if (elem.attachEvent) {
			elem.attachEvent('on' + type,fn);
		}else {
			elem['on' + type ] = fn;
		}
	}

	/**
	 * 获取事件
	 * @param  {event} e [description]
	 * @return {[type]}   [description]
	 */
	Utils.getEvent = function (e) {
		return window.event || event;
	}

	Utils.getTarget = function (e) {
		return event.target || event.srcElement;
	}

	/**
	 * 事件委托
	 * @param  {[type]}   elem      [description]
	 * @param  {[type]}   tag       [description]
	 * @param  {[type]}   eventType [description]
	 * @param  {Function} fn        [description]
	 * @return {[type]}             [description]
	 */
	Utils.delegateEvent = function (elem,tag,eventType,fn) {
		var _this = this;
		this.addEvent(elem,eventType,function (e) {
			var event  = _this.getEvent(e),
				target = _this.getTarget(e);
			if (target && target.tagName === tag.toUpperCase()) {
				fn.call(target,event);
			}
		})
	}

	Utils.parseJson = function(data) {
        try {
            if (typeof data !== "string" || !data) {
                return null;
            }
            // 移除头部和尾部的空白（否则IE无法处理）
            data = data.trim();
            // 确保是一个JSON字符串
            if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                // 尝试使用window.JSON.parse解析字符串
                // 如果浏览器不支持window.JSON.parse,则使用new Function转，但IE6/7中当字符串中含有换行（\n）时，new Function不能解析，但eval却可以。
                return window.JSON && window.JSON.parse ? window.JSON.parse(data) : (new Function("return " + data))();
            } else {
                FS.error("Invalid JSON: " + data);
            }
        } catch (msg) {
            FS.error('FS.parseJson方法出现异常：' + msg);
        }
    }
    /**
     * [ajax description]
     * @param  {Object} opts 参数对象
     * @param {String} opts.method='GET' http方法 默认为GET
     * @param {String} opts.url 请求url地址
     * @param {String} [varname] [description] 
     * @return {[type]}      [description]
     */
	Utils.ajax = function (opts) {
		var async 	   = opts.async || true,
			method 	   = opts.method != null ? opts.method.toUpperCase() : opts.method || 'GET',
			url 	   = opts.url,
			data 	   = opts.data || null,
			dataType   = opts.dataType,
			timeout    = opts.timeout || 30000,
			isTimeout  = false,
			isComplete = false,
			onTimeout  = opts.onTimeout || function () {},
			success    = opts.success || function(){},
			onError    = opts.onError || function(){};

		// 指定是否对url参数编码，默认设为编码
		var unencode = opts.unencode === true ? true : false;

		data = (function (data) {
			var arr = [];
			for(var i in data){
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
			}
			 return arr.join('&');
		})(data)
		
		//假如method是GET请求，并且data是有值
		if ((method === 'GET' || method === 'DELETE') && data !== null) {
			url += (url.indexOf('?') === -1 ? '?' : '&');
			url += data;
		}

		

		// 如果url是带参数的，则对url中参数的名值对编码
		if (url.indexOf('?') !== -1 && !unencode) {
			var params  = url.substring(url.indexOf('?') + 1).split('&'),
				pLength = params.length - 1,
				param,
				paramString = '';

			//url截取最后一个是'?'
			url = url.slice(0,url.indexOf('?') + 1);
			// 遍历所有的名值对，对名和值编码，并将各个名值对用&连接起来
			for(;pLength >= 0; pLength --){
				param = params[pLength].split('=');
				paramString += encodeURIComponent(param[0]) + '=' + encodeURIComponent(param[1]) + '&';
			}
			// 截掉最后一个"&"
			paramString = paramString.slice(0,paramString.length - 1);
			//将url拼接回去
			url += paramString; 
		}
		// 非id创建xmlHttpRequest
		if (window.XMLHttpRequest && window.location.protocol !== 'file:') {
			var xhr = new XMLHttpRequest();
		}else if (window.ActiveXObject && window.location.protocol !== 'file:') {
			// IE创建xmlHttp对象，其实只有IE6及以下浏览器会通过window.activeXObject创建
			// 因为IE6以上浏览器都支持XMLHttpRequest
			var xhr = new window.ActiveXObject(userAgent.indexOf('MSIE 5') >= 0 ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP');
		}
		if (xhr === null) {
			throw new Error('您的系统或浏览器不支持xhr对象')
		}
		if (url.length === 0) {
			throw new Error('发送的url为空,ajax出现异常')
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				// 没有超时的时候执行
				if (!isTimeout) {
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
						if (dataType == 'json') {
							var jsonObj = Utils.parseJson(xhr.responseText);
							success(jsonObj);
						}else{
							success(xhr.responseText);
						}
					}else{
						var obj = {};
						obj.responseText = xhr.responseText;
						obj.opts         = opts;
						obj.status       = xhr.status;
						onError(obj);
					}
				}
				// 执行完成
				isComplete = true;
				// 删除对象，节省空间
				xhr = null;
			}
		}
		// 打开连接
		xhr.open(method,url,async);
		// 设置编码集
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(data);
		// 如果超时，执行超时的回调函数
		window.setTimeout(function () {
			// 如果还没有complete,及上面还没有执行，则执行超时和执行完成时的回调函数
			if (!isComplete) {
				isTimeout = true;
				onTimeout(opts);
			}
		},timeout)
	}

	Utils.serialize = function (form) {
		var parts = [],
			field = null,
			i,
			len,
			j,
			optLen,
			option,
			optValue;
		// 迭代每个表单字段
		for(i = 0,len = form.elements.length; i < len;i++){
			field = form.elements[i];
			// 检测type属性
			switch(field.type){
				case 'select-one':
				case 'select-multiplle':
					if (field.name.length) {
						for(j = 0, optLen = field.options.length;j < optLen;j++){
							// 单选框
							option = field.options[j];
							// 多选框
							if (option.selected) {
								optValue = '';
								if (option.hasAttribute) {
									// 
									optValue = (option.hasAttribute('value') ? option.value : option.text)
								}else{
									// ie specified
									optValue = (option.attributes['value'].specified ? option.value : option.text);
								}
								parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue));
							}
						}
					}
				break;
				case undefined:
				case 'file':
				case 'submit':
				case 'reset':
				case 'button':
					break;
				case 'radio':
				case 'checkbox':
					if (!field.checked) {
						break;
					}
				default:
				// 不包含没有名字的表单字段
					if (field.name.length) {
						parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
					}
			}
		}
		return parts.join('&');
	}

	Utils.serializeObject = function () {
		var a,o,h,i,e;
		a = this.serialize();
		o = {};
		h = o.hasOwnProperty;
		for(i = 0;i < a.length;i++){
			e = a[i];
			if (!h.call(o,e.name)) {
				o[e.name] = e.value;
			}
		}
		return o;
	}

	Utils.cleanWhitespace = function (element) {
		var i,
			len = element.childNodes.length;
		for (i = 0 ;i < len;i++) {
			var node = element.childNodes[i];
			if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
				node.parentNode.removeChild(node);
			}
		}
	}



	return Utils;

});
