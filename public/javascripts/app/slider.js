/**
 * 轮播插件
 * 依赖utils模块
 * 
 */
define(['utils'],function (Utils) {
    (function (window,document) {
        'use strict';
        var Slider;

        function Slider(config) {
            return new Slider.prototype.init(config);
        }

        Slider.prototype = {
            // 初始化构建
            build: function () {
                var _this = this;

                this.slideBox       = this.dom.children[0];
                this.slideBoxUl     = this.slideBox.children[0];
                this.slideItem      = this.slideBoxUl.getElementsByTagName('li');
                this.slideItemLen   = this.slideItem.length;
                this.slideWidth     = this.dom.offsetWidth;
                this.slideHeight    = this.dom.offsetHeight;
               

                Utils.setStyle(this.slideBox, {
                    'width': this.slideWidth + 'px',
                    'height': this.slideHeight + 'px',
                    'overflow': 'hidden'
                });
                
                // 设置为 true，如果您需要克隆节点及其属性，以及后代
                var firstElem = this.slideItem[0].cloneNode(true);
                var lastElem = this.slideItem[this.slideItemLen - 1].cloneNode(true);

                switch (this.effect) {
                    case 'left':
                        // 第一个li前插入
                        this.slideBoxUl.insertBefore(lastElem, this.slideBoxUl.children[0]);
                        this.slideBoxUl.appendChild(firstElem);
                        Utils.setStyle(_this.slideBoxUl, {
                            'position': 'relative',
                            'width': _this.slideWidth * (_this.slideItemLen + 2) + 'px',
                            'height': _this.slideHeight + 'px',
                            'transform': 'translateX(' + -_this.slideWidth + 'px)',
                            'transition': '0'
                        });
                        break;
                    case 'fade':
                        Utils.setStyle(this.slideItem, {
                            'position': 'absolute',
                            'left': 0,
                            'top': 0,
                            'z-index': 0,
                            'opacity': 0,
                            'filter': 'alpha(opacity=0)'
                        });
                        Utils.setStyle(this.slideItem[0], {
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
                    Utils.text(prevBtn, 'prev');
                    nextBtn.className = 'slide-next-btn';
                    Utils.text(nextBtn, 'next');

                    Utils.setStyle([prevBtn, nextBtn], {
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
                        Utils.setStyle([_this.prevBtn, _this.nextBtn], {
                            'display': 'block'
                        });
                    };
                    this.dom.onmouseout = function (e) {
                        if (_this.isAutoPlay) {
                            _this.play();
                        }
                        Utils.setStyle([_this.prevBtn, _this.nextBtn], {
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
            // 设置相应移动状态
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
                    case 'left':
                        var offsetLeft = 0;
                        offsetLeft = parseInt(Utils.getStyle(_this.slideBoxUl, 'transform').replace(/[^0-9\-]/ig, '')) + offset;

                        Utils.setStyle(this.slideBoxUl, {
                            'transition': _this.speed + 'ms',
                            'transform': 'translateX(' + offsetLeft + 'px)'
                        });
                        var moveToLeft = function () {
                            if (offsetLeft > -_this.slideWidth) {
                                Utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateX(' + -_this.slideWidth * _this.slideItemLen + 'px)'
                                });
                            }
                            if (offsetLeft < (-_this.slideWidth * _this.slideItemLen)) {
                                Utils.setStyle(_this.slideBoxUl, {
                                    'transition': '0ms',
                                    'transform': 'translateX(' + -_this.slideWidth + 'px)'
                                });
                            }

                            _this.animated = false;
                            _this.slideBoxUl.removeEventListener(transitionEndEventName(), moveToLeft, false);
                        };

                        this.slideBoxUl.addEventListener(transitionEndEventName(), moveToLeft, false);
                        break;
                    case 'fade':
                        for (var i = 0; i < _this.slideItemLen; i++) {
                            if (parseInt(Utils.getStyle(_this.slideItem[i], 'z-index')) === 1) {
                                Utils.animate(_this.slideItem[i], {
                                    'opacity': 0
                                }, _this.speed, 'easeOut', function () {
                                    Utils.setStyle(_this.slideItem[i], 'z-index', 0);
                                });
                                break;
                            }
                        }
                        Utils.animate(_this.slideItem[offset - 1], {
                            'opacity': 100
                        }, _this.speed, 'easeOut', function () {
                            Utils.setStyle(_this.slideItem[offset - 1], 'z-index', 1);
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
                    case 'left':
                        this.goTo(-this.slideWidth);
                        break;
                    case 'fade':
                        this.goTo(this.index);
                        break;
                }
                if (this.pagination) {
                    this.showButton();
                }
            },
            // 绑定相应事件
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
                    case 'left':
                        this.goTo(this.slideWidth);
                        break;
                    case 'fade':
                        this.goTo(this.index);
                        break;
                }
                if (this.pagination) {
                    this.showButton();
                }
            },
            // 点击事件
            navigationFn: function () {
                var _this = this;
                this.nextBtn.onclick = function (e) {
                    _this.nextBind();
                };
                this.prevBtn.onclick = function (e) {
                    _this.prevBind();
                };
            },
            // 点击事件
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
                            case 'left':
                                offset = -_this.slideWidth * (myIndex - _this.index);
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
            // 初始化设置
            init: function (config) {
                this.dom          = config.dom;
                this.duration     = config.duration || 5000;
                this.speed        = config.speed || 400;
                this.effect       = config.effect || 'left';
                this.isAutoPlay   = config.isAutoPlay || false;
                this.trigger      = config.trigger || 'click';
                this.pagination   = config.pagination || false;
                this.navigation   = config.navigation || false;
                this.pauseOnHover = config.pauseOnHover || false;

                this.index = 1;
                this.timer = null;
                this.animated = false;
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
        
        Slider.prototype.init.prototype = Slider.prototype;

        window.Slider = Slider;

    })(window,document);
})
    

    


