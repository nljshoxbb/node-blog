(function (window) {
    /**
     * Slider
     * A simple slider plugin
     * @Author Heby
     *
     * @param {Object}          opts                    参数集
     * @param {Element}         opts.dom                外层元素
     * @param {String}          opts.titCell            分页元素类名
     * @param {String}          opts.mainCell           滑块元素类名
     * @param {Number}          opts.duration           滑动间隔时间，单位为毫秒
     * @param {Number}          opts.speed              滑动速度
     * @param {String}          opts.effect             滑动效果
     * @param {Boolean}         opts.isLooping          是否循环滑动
     * @param {Boolean}         opts.isAutoPlay         是否自动切换
     * @param {String}          opts.trigger            触发分页的事件名
     * @param {Boolean}         opts.pagination         是否自动分页
     * @param {Boolean}         opts.navigation         是否需要上下页导航
     * @param {Boolean}         opts.pauseOnHover       鼠标移动到元素上时是否暂停切换
     *
     * @class
     */


    'use strict';

    var Slider;
    Slider = function (opts) {
        this.dom = opts.dom;
        this.duration = opts.duration || 5000;
        this.speed = opts.speed || 400;
        this.effect = opts.effect || 'left';
        this.isAutoPlay = opts.isAutoPlay || false;
        this.trigger = opts.trigger || 'click';
        this.pagination = opts.pagination || false;
        this.navigation = opts.navigation || false;
        this.pauseOnHover = opts.pauseOnHover || false;

        this.index = 1;
        this.timer = null;
        this.animated = false;

        this.init();

    };


    Slider.prototype = {
        utils: {
            // 检测是否为Dom元素
            isElement: function (o) {
                if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
                    return true;
                } else {
                    return (o && o.nodeType && o.nodeType === 1) ? true : false;
                }
            },

            // 检测是否为 String
            isString: function (s) {
                return (s === "" || s) && (s.constructor === String || Object.prototype.toString.call(s) === '[object String]');
            },

            // 检测是否为 Object
            isObject: function (o) {
                return o && (o.constructor === Object || Object.prototype.toString.call(o) === "[object Object]");
            },

            indexOf: function (arr, elem) {
                //数组或类数组对象
                if (arr.length) {
                    return [].indexOf.call(arr, elem);
                }
                else if (this.isObject(arr)) {
                    for (var i in arr) {
                        if (arr.hasOwnProperty(i) && arr[i] === elem) {
                            return i;
                        }
                    }
                }
            },

            each: function (arr, callback) {
                if (arr.length) {
                    return [].forEach.call(arr, callback);
                }
                else if (this.isObject(arr)) {
                    for (var i in arr) {
                        if (arr.hasOwnProperty(i))
                            if (callback.call(arr[i], arr[i], i, arr) === false) return;
                    }
                }
            },
            text: function (el, text) {
                if(this.isString(text)){
                    if(typeof el.textContent == 'string'){
                        el.textContent = text;
                    }else{
                        el.innerText = text;
                    }
                }
            },
            getVendorPropertyName: function (name) {
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
            },
            getStyle: function (el, styleName) {
                if (!el) {
                    return;
                }
                styleName = this.getVendorPropertyName(styleName);
                if (styleName === "float") {
                    styleName = "cssFloat";
                }
                if (el.style[styleName]) {
                    return el.style[styleName];
                } else if (window.getComputedStyle) {
                    return window.getComputedStyle(el, null)[styleName];
                    // 在浏览器中返回关联document的window对象，如果没有则返回null
                    // 当前上下文的window 不等于当前document关联的window时
                    // 使用Firefox 3.6时，其frame中需要使用document.defaultView去获取window对象，才能使用其getComputedStyle方法
                } else if (document.defaultView && document.defaultView.getComputedStyle) {
                    styleName = styleName.replace(/([/A-Z])/g, "-$1");
                    styleName = styleName.toLowerCase();
                    var style = document.defaultView.getComputedStyle(el, "");
                    return style && style.getPropertyValue(styleName);
                    // ie
                } else if (el.currentStyle) {
                    return el.currentStyle[styleName];
                }

            },
            setStyle: function (elem, styleName, styleValue) {
                var _this = this;

                if (elem.length) {
                    this.each(elem, function (e) {
                        _this.setStyle(e, styleName, styleValue);
                    });
                    return;
                }
                if (this.isObject(styleName)) {
                    var style = document.createElement('div').style;
                    var old = '';
                    for (var n in styleName) {
                        old = n;
                        n = _this.getVendorPropertyName(n);
                        //if (styleName.hasOwnProperty(n)) {
                        if (n in style) {
                            elem.style[n] = styleName[old];
                        }
                    }
                    return;
                }
                if (this.isString(styleName)) {
                    styleName = this.getVendorPropertyName(styleName);
                    elem.style[styleName] = styleValue;
                }
            },
            animate: function (obj, json, times, fx, fn) {
                var tween = {
                    linear: function (t, b, c, d) {  //匀速
                        return c * t / d + b;
                    },
                    easeIn: function (t, b, c, d) {  //加速曲线
                        return c * (t /= d) * t + b;
                    },
                    easeOut: function (t, b, c, d) {  //减速曲线
                        return -c * (t /= d) * (t - 2) + b;
                    }
                };
                var This = this;
                var iCur = {};
                var startTime = now();

                for (var attr in json) {
                    iCur[attr] = 0;
                    if (attr == 'opacity') {
                        iCur[attr] = Math.round(This.getStyle(obj, attr) * 100);
                    }
                    else {
                        iCur[attr] = parseInt(This.getStyle(obj, attr));
                    }
                }
                clearInterval(obj.timer);
                obj.timer = setInterval(function () {
                    var changeTime = now();
                    var scale = 1 - Math.max(0, startTime - changeTime + times) / times; //1000 - 0  ->  1 - 0  -> 0 - 1

                    for (var attr in json) {
                        var value = tween[fx](scale * times, iCur[attr], json[attr] - iCur[attr], times);

                        if (attr == 'opacity') {
                            obj.style.filter = 'alpha(opacity=' + value + ')';
                            obj.style.opacity = value / 100;
                        }
                        else {
                            obj.style[attr] = value + 'px';
                        }
                    }

                    if (scale == 1) {
                        clearInterval(obj.timer);
                        if (fn) {
                            fn.call(obj);
                        }
                    }
                }, 13);
                function now() {
                    return (new Date()).getTime();
                }
            },
            supportCss3: function (style) {
                var prefix = ['webkit', 'Moz', 'ms', 'o'],
                    i,
                    l,
                    humpString = [],
                    htmlStyle = document.documentElement.style,
                    _toHumb = function (string) {
                        return string.replace(/-(\w)/g, function ($0, $1) {
                            return $1.toUpperCase();
                        });
                    };

                for (i in prefix)
                    humpString.push(_toHumb(prefix[i] + '-' + style));

                humpString.push(_toHumb(style));

                for (l in humpString)
                    if (humpString[l] in htmlStyle) return true;

                return false;
            },

            supportTransition: function () {
                return this.supportCss3('transition');
            }
        },
        build: function () {
            var _this = this;

            this.slideBox = this.dom.children[0];
            this.slideBoxUl = this.slideBox.children[0];
            this.slideItem = this.slideBoxUl.getElementsByTagName('li');
            this.slideItemLen = this.slideItem.length;
            this.slideWidth = this.dom.offsetWidth;
            this.slideHeight = this.dom.offsetHeight;

            this.utils.setStyle(this.slideBox, {
                'width': this.slideWidth + 'px',
                'height': this.slideHeight + 'px',
                'overflow': 'hidden'
            });
            
            // 设置为 true，如果您需要克隆节点及其属性，以及后代
            var firstElem = this.slideItem[0].cloneNode(true);
            var lastElem = this.slideItem[this.slideItemLen - 1].cloneNode(true);

            switch (this.effect) {
                case 'toggle':
                    this.utils.setStyle(this.slideBox, {
                        'width': this.slideWidth + 'px',
                        'height': this.slideHeight + 'px'
                    });
                    break;
                case 'left':
                    // 第一个li前插入
                    this.slideBoxUl.insertBefore(lastElem, this.slideBoxUl.children[0]);
                    this.slideBoxUl.appendChild(firstElem);

                    if (this.utils.supportTransition()) {
                        _this.utils.setStyle(_this.slideBoxUl, {
                            'position': 'relative',
                            'width': _this.slideWidth * (_this.slideItemLen + 2) + 'px',
                            'height': _this.slideHeight + 'px',
                            'transform': 'translateX(' + -_this.slideWidth + 'px)',
                            'transition': '0'
                        });
                    } else {
                        this.utils.setStyle(this.slideBoxUl, {
                            'position': 'absolute',
                            'left': -this.slideWidth + 'px',
                            'top': 0,
                            'width': this.slideWidth * (this.slideItemLen + 2) + 'px',
                            'height': this.slideHeight + 'px'
                        });
                    }
                    break;
                case 'top':
                    this.slideBoxUl.insertBefore(lastElem, this.slideBoxUl.children[0]);
                    this.slideBoxUl.appendChild(firstElem);

                    if (this.utils.supportTransition()) {
                        _this.utils.setStyle(_this.slideBoxUl, {
                            'position': 'relative',
                            'width': _this.slideWidth + 'px',
                            'height': _this.slideHeight * (_this.slideItemLen + 2) + 'px',
                            'transform': 'translateY(' + -_this.slideHeight + 'px)',
                            'transition': '0'
                        });
                    } else {
                        this.utils.setStyle(this.slideBoxUl, {
                            'position': 'absolute',
                            'left': 0,
                            'top': -this.slideHeight + 'px',
                            'width': this.slideWidth + 'px',
                            'height': this.slideHeight * (this.slideItemLen + 2) + 'px'
                        });
                    }
                    break;
                case 'fade':
                    this.utils.setStyle(this.slideItem, {
                        'position': 'absolute',
                        'left': 0,
                        'top': 0,
                        'z-index': 0,
                        'opacity': 0,
                        'filter': 'alpha(opacity=0)'
                    });
                    this.utils.setStyle(this.slideItem[0], {
                        'z-index': 1,
                        'opacity': 1,
                        'filter': 'alpha(opacity=100)'
                    });
                    break;
            }


            // 创建 pagination 元素
            if (this.pagination) {
                var divTmp = document.createElement('div');
                var olTmp = document.createElement('ol');

                for (var i = 0; i < this.slideItemLen; i++) {
                    var liTmp = document.createElement('li');
                    liTmp.innerText = (i + 1).toString();
                    liTmp.setAttribute('data-index', (i + 1).toString());
                    olTmp.appendChild(liTmp);
                }

                olTmp.children[0].className = 'active';
                divTmp.className = 'slide-hd';
                divTmp.appendChild(olTmp);

                this.paginationBox = this.dom.appendChild(divTmp);
                this.paginationBtns = this.paginationBox.getElementsByTagName('li');

            }

            // 创建 navigation 元素
            if (this.navigation) {
                var prevBtn = document.createElement('div');
                var nextBtn = document.createElement('div');

                prevBtn.className = 'slide-prev-btn';
                this.utils.text(prevBtn, 'prev');
                nextBtn.className = 'slide-next-btn';
                this.utils.text(nextBtn, 'next');

                this.utils.setStyle([prevBtn, nextBtn], {
                    'display': 'none'
                });

                this.prevBtn = this.dom.appendChild(prevBtn);
                this.nextBtn = this.dom.appendChild(nextBtn);

            }

            if (this.navigation && this.pauseOnHover) {
                this.dom.onmouseover = function (e) {
                    if (_this.isAutoPlay) {
                        _this.stop();
                    }
                    _this.utils.setStyle([_this.prevBtn, _this.nextBtn], {
                        'display': 'block'
                    });
                };
                this.dom.onmouseout = function (e) {
                    if (_this.isAutoPlay) {
                        _this.play();
                    }
                    _this.utils.setStyle([_this.prevBtn, _this.nextBtn], {
                        'display': 'none'
                    });
                };
            }

        },
        play: function () {
            var _this = this;
            this.timer = setTimeout(function () {
                _this.nextBind();
                _this.play();
            }, _this.duration);
        },
        stop: function () {
            clearTimeout(this.timer);
        },
        goTo: function (offset) {
            this.animated = true;
            var _this = this;
            var transitionEndEventName = function () {
                var i,
                    undefined,
                    el = document.createElement('div'),
                    transitions = {
                        'transition': 'transitionend',
                        'MozTransition': 'MozTransitionEnd',
                        'WebkitTransition': 'webkitTransitionEnd',
                        'MSTransitionEnd': 'MSTransitionEnd'
                    };

                for (i in transitions) {
                    if (transitions.hasOwnProperty(i) && el.style[i] !== 'undefined') {
                        return transitions[i];
                    }
                }
            };

            switch (this.effect) {
                case 'toggle':
                    this.utils.each(this.slideItem, function (item) {
                        item.style.display = 'none';
                    });
                    this.slideItem[offset - 1].style.display = 'block';
                    this.animated = false;
                    break;
                case 'left':
                    var offsetLeft = 0;



                    if (this.utils.supportTransition()) {
                        offsetLeft = parseInt(_this.utils.getStyle(_this.slideBoxUl, 'transform').replace(/[^0-9\-]/ig, '')) + offset;

                        this.utils.setStyle(this.slideBoxUl, {
                            'transition': _this.speed + 'ms',
                            'transform': 'translateX(' + offsetLeft + 'px)'
                        });
                        var moveToLeft = function () {
                            if (offsetLeft > -_this.slideWidth) {
                                _this.utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateX(' + -_this.slideWidth * _this.slideItemLen + 'px)'
                                });
                            }
                            if (offsetLeft < (-_this.slideWidth * _this.slideItemLen)) {
                                _this.utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateX(' + -_this.slideWidth + 'px)'
                                });
                            }

                            _this.animated = false;
                            _this.slideBoxUl.removeEventListener(transitionEndEventName(), moveToLeft, false);
                        };

                        this.slideBoxUl.addEventListener(transitionEndEventName(), moveToLeft, false);
                    } else {
                        offsetLeft = parseInt(_this.utils.getStyle(_this.slideBoxUl, 'left')) + offset;

                        _this.utils.animate(_this.slideBoxUl, {'left': offsetLeft}, _this.speed, 'easeOut', function () {
                            if (offsetLeft > -_this.slideWidth) {
                                _this.slideBoxUl.style.left = -_this.slideWidth * _this.slideItemLen + 'px';
                            }

                            if (offsetLeft < (-_this.slideWidth * _this.slideItemLen)) {
                                _this.slideBoxUl.style.left = -_this.slideWidth + 'px';
                            }

                            _this.animated = false;
                        });
                    }
                    break;
                case 'top':
                    var offsetTop = 0;

                    if (this.utils.supportTransition()) {
                        offsetTop = parseInt(_this.utils.getStyle(_this.slideBoxUl, 'transform').replace(/[^0-9\-]/ig, '')) + offset;

                        this.utils.setStyle(this.slideBoxUl, {
                            'transition': _this.speed + 'ms',
                            'transform': 'translateY(' + offsetTop + 'px)'
                        });
                        var moveToTop = function () {
                            if (offsetTop > -_this.slideHeight) {
                                _this.utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateY(' + -_this.slideHeight * _this.slideItemLen + 'px)'
                                });
                            }
                            if (offsetTop < (-_this.slideHeight * _this.slideItemLen)) {
                                _this.utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateY(' + -_this.slideHeight + 'px)'
                                });
                            }

                            _this.animated = false;
                            _this.slideBoxUl.removeEventListener(transitionEndEventName(), moveToTop, false);
                        };

                        this.slideBoxUl.addEventListener(transitionEndEventName(), moveToTop, false);
                    } else {
                        offsetTop = parseInt(_this.utils.getStyle(_this.slideBoxUl, 'top')) + offset;

                        _this.utils.animate(_this.slideBoxUl, {'top': offsetTop}, _this.speed, 'easeOut', function () {
                            if (offsetTop > -_this.slideHeight) {
                                _this.slideBoxUl.style.top = -_this.slideHeight * _this.slideItemLen + 'px';
                            }

                            if (offsetTop < (-_this.slideHeight * _this.slideItemLen)) {
                                _this.slideBoxUl.style.top = -_this.slideHeight + 'px';
                            }

                            _this.animated = false;
                        });
                    }
                    break;
                case 'fade':
                    for (var i = 0; i < _this.slideItemLen; i++) {
                        if (parseInt(_this.utils.getStyle(_this.slideItem[i], 'z-index')) === 1) {
                            _this.utils.animate(_this.slideItem[i], {
                                'opacity': 0
                            }, _this.speed, 'easeOut', function () {
                                _this.utils.setStyle(_this.slideItem[i], 'z-index', 0);
                            });
                            break;
                        }
                    }
                    _this.utils.animate(_this.slideItem[offset - 1], {
                        'opacity': 100
                    }, _this.speed, 'easeOut', function () {
                        _this.utils.setStyle(_this.slideItem[offset - 1], 'z-index', 1);
                        _this.animated = false;
                    });
                    break;
            }
        },
        showButton: function () {
            for (var i = 0; i < this.slideItemLen; i++) {
                if (this.paginationBtns[i].className === 'active') {
                    this.paginationBtns[i].className = '';
                    break;
                }
            }
            this.paginationBtns[this.index - 1].className = 'active';
        },
        nextBind: function () {
            if (this.animated) {
                return;
            }
            if (this.index == this.slideItemLen) {
                this.index = 1;
            } else {
                this.index++;
            }

            switch (this.effect) {
                case 'toggle':
                    this.goTo(this.index);
                    break;
                case 'left':
                    this.goTo(-this.slideWidth);
                    break;
                case 'top':
                    this.goTo(-this.slideHeight);
                    break;
                case 'fade':
                    this.goTo(this.index);
                    break;
            }
            if (this.pagination) {
                this.showButton();
            }
        },
        prevBind: function () {
            if (this.animated) {
                return;
            }
            if (this.index == 1) {
                this.index = this.slideItemLen;
            } else {
                this.index--;
            }

            switch (this.effect) {
                case 'toggle':
                    this.goTo(this.index);
                    break;
                case 'left':
                    this.goTo(this.slideWidth);
                    break;
                case 'top':
                    this.goTo(this.slideHeight);
                    break;
                case 'fade':
                    this.goTo(this.index);
                    break;
            }
            if (this.pagination) {
                this.showButton();
            }
        },
        navigationFn: function () {
            var _this = this;
            this.nextBtn.onclick = function (e) {
                _this.nextBind();
            };
            this.prevBtn.onclick = function (e) {
                _this.prevBind();
            };
        },
        paginationFn: function () {
            var _this = this;
            for (var i = 0; i < this.slideItemLen; i++) {
                this.paginationBtns[i]['on' + this.trigger] = function (e) {
                    if (_this.animated) {
                        return;
                    }
                    if (this.className === 'active') {
                        return;
                    }

                    var myIndex = parseInt(this.getAttribute('data-index'));
                    var offset = 0;

                    switch (_this.effect) {
                        case 'toggle':
                            offset = myIndex;
                            break;
                        case 'left':
                            offset = -_this.slideWidth * (myIndex - _this.index);
                            break;
                        case 'top':
                            offset = -_this.slideHeight * (myIndex - _this.index);
                            break;
                        case 'fade':
                            offset = myIndex;
                            break;
                    }

                    _this.goTo(offset);
                    _this.index = myIndex;
                    _this.showButton();
                }
            }
        },
        init: function () {
            this.build();
            if (this.isAutoPlay) {
                this.play();
            }
            if (this.navigation) {
                this.navigationFn();
            }
            if (this.pagination) {
                this.paginationFn();
            }
        }
    };


    window.Slider = Slider;
})(window);
