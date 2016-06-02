define(['utils'],function (Utils) {
    (function (window, document) {

        'use strict';

        function Popuper(config) {
            return new Popuper.prototype.init(config);
        }

        Popuper.prototype = {

            constructor: Popuper,

            init: function (config) {

                this.container  = config.wrap || null;
                this.wrap       = this.container.querySelector('.pop-wrap') || null;
                this.header     = this.container.querySelector('.pop-header') || null;
                this.effect     = config.effect || 'top'; //出现方向
                this.speed      = config.speed  || '.4s';  //动画时间


                if (!this.container || !this.wrap || !this.header) {
                    console.warn('HTML格式不符');
                    return;
                }

                var _this = this,
                    confirm = this.container.querySelector('.confirm'),
                    cancel = this.container.querySelector('.cancel');

                this.build();

                //绑定确定按钮事件
                if (!!confirm) {
                    // 只执行一次
                    confirm.onclick = function () {
                        config.confirm();
                        _this.hide();
                    }
                }

                //绑定取消按钮事件
                if (!!cancel) {
                    cancel.onclick = function () {
                        config.cancel();
                        _this.hide();
                    }
                }

                // 点击提示框外的部分关闭提示框
                Utils.addEvent(this.container,'click',function (event) {
                    event = event || window.event;
                    if (event.target.className === _this.container.className) {
                        config.cancel();
                        _this.hide();                     
                    }
                })

                this.toggle();
                return this;
            },
            build:function () {
                Utils.setStyle(this.container,{
                  'transition-duration':this.speed,
                  'opacity':'0',
                  'filter': 'alpha(opacity=0)'
                })
                Utils.setStyle(this.wrap,{
                    'transition-duration':this.speed,
                    'opacity':'0',
                    'filter': 'alpha(opacity=0)'
                })
                switch(this.effect){
                    case 'top':
                        Utils.setStyle(this.wrap,{
                          'transform':'translate(0,-25%)'
                        })
                        break;
                    case 'bottom':
                        Utils.setStyle(this.wrap,{
                          'transform':'translate(0,25%)'
                        })
                        break;
                    case 'left':
                        Utils.setStyle(this.wrap,{
                          'transform':'translate(-25%,0)'
                        })
                        break;
                    case 'right':
                        Utils.setStyle(this.wrap,{
                          'transform':'translate(25%,0)'
                        })
                }
            },

            show: function () {
                var _this = this;
                Utils.setStyle(this.container,{
                    'opacity':'1',
                    'filter': 'alpha(opacity=100)',
                    'display':'block'
                })
                this.status = true;
                this.width = this.wrap.clientWidth;
                this.height = this.wrap.clientHeight;
                Utils.setStyle(this.wrap,{
                    'transform':'translate(0,0)',
                    'opacity':'1',
                    'filter': 'alpha(opacity=100)' 
                })
                //禁止页面滚动，不支持火狐
                window.addEventListener('mousewheel', _stopScroll, false);

                return this;
            },

            hide: function () {
                Utils.setStyle(this.container,{
                    'display':'none',
                    'opacity':'0',
                    'filter': 'alpha(opacity=0)',
                    'transition-duration':'0.3s'
                })
                Utils.setStyle(this.wrap,{
                    'transform':'translate(0,-25%)',
                    'filter': 'alpha(opacity=0)',
                    'opacity':'0',
                    'transition-duration':'0.3s'
                })
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
