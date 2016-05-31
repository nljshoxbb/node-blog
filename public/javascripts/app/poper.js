define(['utils'],function (Utils) {
    (function (window, document) {

        'use strict';

        function Popuper(param) {
            return new Popuper.prototype.init(param);
        }

        Popuper.prototype = {

            constructor: Popuper,
            container: null,
            wrap: null,
            header: null,
            status: false,
            width: 0,
            height: 0,

            init: function (param) {

                this.container = param.wrap || null;
                this.wrap = this.container.querySelector('.pop-wrap') || null;
                this.header = this.container.querySelector('.pop-header') || null;

                if (!this.container || !this.wrap || !this.header) {
                    console.warn('HTML格式不符');
                    return;
                }

                // this.type = param.type || info;

                //设置提示框类型
                // this.container.className += ' ' + this.type;

                var _this = this,
                    confirm = this.container.querySelector('.confirm'),
                    cancel = this.container.querySelector('.cancel');

                //绑定确定按钮事件
                if (!!confirm) {
                    confirm.addEventListener('click', function () {
                        param.confirm();
                        _this.hide();
                    }, false);
                }

                //绑定取消按钮事件
                if (!!cancel) {
                    cancel.addEventListener('click', function () {
                        param.cancel();
                        _this.hide();
                    }, false);
                }

                this.container.addEventListener('click', function (event) {
                    event = event || window.event;
                    if (event.target.className === _this.container.className) {
                        _this.hide();
                    }

                }, true);

                return this;
            },
            build:function () {
                  
            },

            show: function () {
                var _this = this;
                Utils.setStyle(this.container,{
                    'opacity':'1',
                    'display':'block'
                })
                this.status = true;
                this.width = this.wrap.clientWidth;
                this.height = this.wrap.clientHeight;
                Utils.setStyle(this.wrap,{
                    'transform':'translate(0,0)',
                    'opacity':'1',
                    'transition':'all .3s ease-out-in'
                })
                //禁止页面滚动，不支持火狐
                window.addEventListener('mousewheel', _stopScroll, false);

                return this;
            },

            hide: function () {

                // this.container.className = this.container.className.replace(/show/g, '').trim();
                this.wrap.style.cssText = '';
                Utils.setStyle(this.container,{
                    'display':'none',
                    'opacity':'0'
                })
                // Utils.setStyle(this.wrap,{
                //     'transform':'translate(0,-25%)',
                //     'opacity':'0'
                // })
                this.status = false;
                window.removeEventListener('mousewheel', _stopScroll, false);

                return this;
            },

            toggle: function () {

                if (this.status) {
                    this.hide();
                } else {
                    this.show();
                }

                return this;
            },

            edit: function (config) {

                var className = this.container.className;
                config.title ? this.header.querySelector('h3').innerText = config.title : null;
                config.content ? this.wrap.querySelector('.pop-content').innerHTML = config.content : null;
                // config.type ? this.container.className = className.replace(/(info)|(error)|(success)|(warning)/, '').trim() + ' ' + config.type : null;

                return this;
            }
        };

        function _stopScroll(event) {
            event = event || window.event;
            event.preventDefault();
        }

        Popuper.prototype.init.prototype = Popuper.prototype;

        window.Popuper = Popuper;

    })(window, document);
})
