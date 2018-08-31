'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Popicker <>
 * Copyright Qinwen Zhou
 */

; (function () {
    /** Detect free variable `global` from Node.js. */
    var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Detect free variable `exports`. */
    var freeExports = (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    Object.prototype.default = function (obj1, obj2) {
        Object.getOwnPropertyNames(obj2).forEach(function (item) {
            if (!obj1.hasOwnProperty(item)) {
                obj1[item] = obj2[item];
            }
        });
    };
    Array.prototype.filter = function (arr, fn) {
        var filterArr = new Array();
        arr.forEach(function (item) {
            if (fn(item)) {
                filterArr.push(item);
            }
        });
        return filterArr;
    };

    var init = Symbol('init');
    var initFrame = Symbol('initFrame');
    var createElement = Symbol('createElement');
    var createPickerItems = Symbol('createPickerItems');
    var addPickerMethod = Symbol('addPickerMethod');
    var setCurrentSelectStyle = Symbol('setCurrentSelectStyle');
    var selectResult = Symbol('selectResult');
    var colLength = Symbol('colLength');
    var preLoadDataMethod = Symbol('preLoadDataMethod');
    var currentColDataList = Symbol('currentColDataList');
    var moveToItem = Symbol('moveToItem');
    var setNextCol = Symbol('setNextCol');

    var __defaultConfig = {
        frameClass: 'popicker-box',
        frameBgClass: 'popicker-bg',
        frameHeaderClass: 'popicker-header',
        frameCancelClass: 'popicker-cancel',
        frameConfirmClass: 'popicker-confirm',
        frameContentClass: 'popicker-content',
        frameColClass: 'popicker-col',
        frameItemClass: 'popicker-item',
        frameItemSelectedClass: 'popicker-selected',
        frameItemSelectedSecondClass: 'popicker-selected-second',
        frameItemSelectedThirdClass: 'popicker-selected-third',
        frameItemSelectedFourthClass: 'popicker-selected-fourth',
        baselineClass: 'popicker-baseline',
        baselineHeight: 32,
        headerHeight: 30,
        contentHeight: 200,
        itemHeight: 32,
        cssPath: './Popicker.css',
        cssId: 'PopickerRelayCss'
    };
    __defaultConfig.baseTop = (__defaultConfig.contentHeight - __defaultConfig.baselineHeight) / 2;

    var Popicker = function () {
        function Popicker() {
            var _this = this;

            _classCallCheck(this, Popicker);

            this.config = [].slice.call(arguments)[0];
            if (Validator.isEmpty(this.config)) {
                Validator.throwError('Picker工具需要传递配置信息！');
            }
            if (Object.prototype.toString.call(this.config) !== '[object Object]') {
                Validator.throwError('Picker工具配置信息为对象格式！');
            }
            Object.default(this.config, {
                targetElement: this.config.el,
                type: 1,
                valueTarget: this.config.el,
                triggerOnce: false,
                styleType: 'bottom',
                displayField: 'text',
                valueField: 'value',
                childField: 'children',
                connector: '-',
                beforeShow: function beforeShow() { },
                complete: function complete() { },
                version: 1
            });

            var props = {
                el: { //＊触发生成面板的元素
                    required: true,
                    reg: HTMLElement
                },
                targetElement: { //选择完成后，回显数据的元素。不填则默认为element
                    required: true,
                    reg: HTMLElement
                },
                type: { //生成几级框架。不填默认为1。目前理论上支持无限级别
                    required: true,
                    reg: /^[1-9]$/
                },
                valueTarget: { //设置其它元素的value。仅支持表单元素
                    required: true,
                    reg: HTMLElement
                },
                triggerOnce: { //初始化后是否立即触发一次事件。不填默认为false
                    required: false,
                    reg: Boolean
                },
                data: { //内部数据。如为日历，可不传
                    required: true,
                    reg: Array
                },
                dataRange: { //显示时间范围'{start: '2010', end: 'end'}'
                    required: false,
                    reg: {
                        fn: function fn(range) {
                            if (Object.prototype.toString.call(range) !== '[object Object]') {
                                if (!Object.getOwnPropertyDescriptor(range, 'start') && !Object.getOwnPropertyDescriptor(range, 'end')) {
                                    return false;
                                }
                            }
                        }
                    }
                },
                styleType: { //面板样式。支持bottom，middle。默认为bottom，暂不支持midlle
                    required: false,
                    reg: /^middle|bottom$/
                },
                displayField: { //text名称。不填默认为text
                    required: false,
                    reg: String
                },
                valueField: { //value名称。不填默认为value
                    required: false,
                    reg: String
                },
                childField: { //children名称。不填默认为children
                    required: false,
                    reg: String
                },
                preLoadData: { //[{ value: '16' }, { value: '186' }],   //初始化时预加载数据
                    required: false,
                    reg: Array
                },
                connector: {
                    required: true,
                    reg: /^.$/
                },
                beforeShow: { //显示面板前方法
                    required: false,
                    reg: Function
                },
                complete: { //选择完成后方法
                    required: false,
                    reg: Function
                }
            };
            Validator.propsType(props, this.config);

            var idKey = '\u8D75\u5144\u6258\u6211\u5E2E\u4F60\u529E\u70B9\u4E8B' + Date.now() + this.version;
            this.id = Util.bit32(idKey);
            this.bgid = Util.bit32(idKey + 'bg');
            this[init] = false;

            this[colLength] = this.config.type;

            this[selectResult] = new Array();
            this[currentColDataList] = new Array();
            this.result = [];

            this.config.el.addEventListener('click', function (e) {
                _this.config.beforeShow();
                Util.loadRelyCss(__defaultConfig.cssPath);
                _this[initFrame]();
                _this.show();
            });
        }

        _createClass(Popicker, [{
            key: initFrame,
            value: function value() {
                //初始化框架
                if (this[init]) return;
                this[init] = true;
                var fragment = document.createDocumentFragment();
                this.frameElement = this[createElement]({
                    class: __defaultConfig.frameClass + ' ' + this.config.styleType,
                    id: this.id
                });
                this.frameElementBg = this[createElement]({
                    class: __defaultConfig.frameBgClass,
                    id: this.bgid
                });
                this.frameElement.appendChild(this[createPickerItems]());
                document.body.appendChild(this.frameElement);
                document.body.appendChild(this.frameElementBg);
                this[addPickerMethod]();
                this[preLoadDataMethod]();
            }
        }, {
            key: createElement,
            value: function value(config) {
                //封装创建dom方法
                Object.default(config, { tag: 'div', in: '' });
                var el = document.createElement(config.tag);
                for (var attr in config) {
                    if (attr !== 'in' && (typeof config[attr] === 'string' || typeof config[attr] === 'number' || typeof config[attr] === 'boolean')) {
                        el.setAttribute(attr, config[attr]);
                    }
                }
                el.innerText = config.in;
                return el;
            }
        }, {
            key: createPickerItems,
            value: function value() {
                var _this2 = this;

                //创建dom标签
                var fragmentMain = document.createDocumentFragment(),
                    fragment = document.createDocumentFragment(),
                    header = this[createElement]({
                        class: '' + __defaultConfig.frameHeaderClass
                    });
                this.baseline = this[createElement]({
                    class: '' + __defaultConfig.baselineClass
                });
                this.content = this[createElement]({
                    class: '' + __defaultConfig.frameContentClass
                });
                this.headerCancel = this[createElement]({
                    class: '' + __defaultConfig.frameCancelClass,
                    in: '取消'
                });
                this.headerConfirm = this[createElement]({
                    class: '' + __defaultConfig.frameConfirmClass,
                    in: '完成'
                });

                //添加popicker-col分栏和分栏中元素
                var _colLength = this[colLength];
                var _createColElement = function _createColElement(arr) {
                    var colElement = _this2[createElement]({
                        class: __defaultConfig.frameColClass + ' ' + __defaultConfig.frameColClass + '-' + _this2[colLength],
                        style: 'top:' + __defaultConfig.baseTop + 'px',
                        parentIndex: 0
                    });
                    _this2[currentColDataList].push(arr);
                    _this2[selectResult].push({
                        txt: arr[0][_this2.config.displayField],
                        val: arr[0][_this2.config.valueField],
                        order: 0
                    });
                    arr.forEach(function (item) {
                        colElement.appendChild(_this2[createElement]({
                            tag: 'p',
                            class: __defaultConfig.frameItemClass,
                            data: item[_this2.config.valueField],
                            in: item[_this2.config.displayField]
                        }));
                    });
                    _this2[setCurrentSelectStyle](colElement.firstChild);
                    fragment.appendChild(colElement);
                    _colLength--;
                    if (_colLength > 0) {
                        _createColElement(arr[0][_this2.config.childField]);
                    }
                };
                _createColElement(this.config.data);

                this.content.appendChild(fragment);
                header.appendChild(this.headerCancel);
                header.appendChild(this.headerConfirm);
                fragmentMain.appendChild(header);
                fragmentMain.appendChild(this.content);
                fragmentMain.appendChild(this.baseline);
                return fragmentMain;
            }
        }, {
            key: addPickerMethod,
            value: function value() {
                var _this3 = this;

                //添加点击、触摸方法
                this.headerConfirm.addEventListener('click', function (e) {
                    var showTxtArr = [],
                        showValArr = [];
                    _this3.result = [];
                    _this3[selectResult].forEach(function (item) {
                        _this3.result.push({ txt: item.txt, val: item.val });
                        showTxtArr.push(item.txt);
                        showValArr.push(item.val);
                    });
                    try {
                        _this3.config.targetElement.innerText = showTxtArr.join(_this3.config.connector);
                        _this3.config.valueTarget.value = showValArr.join(_this3.config.connector);
                        _this3.config.complete(_this3.result);
                    } catch (e) {
                        console.log(e);
                    }
                    _this3.hide();
                });
                this.headerCancel.addEventListener('click', function (e) {
                    _this3.hide();
                });
                var _previousTop = 0,
                    _startTop = 0;
                this.content.addEventListener('touchstart', function (e) {
                    if (e.target == _this3.content || e.target == _this3.baseline || !Util.versions().mobile) return;
                    var targetTouches = e.targetTouches || e.originalEvent.targetTouches; //可能为兼容问题
                    if (targetTouches.length == 1) {
                        // e.preventDefault();    //会阻止点击事件
                        var touch = targetTouches[0];
                        _previousTop = touch.pageY;
                        _startTop = parseInt(e.target.parentNode.style.top);
                    }
                }, false);
                this.content.addEventListener('touchmove', function (e) {
                    if (e.target == _this3.content || e.target == _this3.baseline || !Util.versions().mobile) return;
                    var targetTouches = e.targetTouches || e.originalEvent.targetTouches; //可能为兼容问题
                    if (targetTouches.length == 1) {
                        // e.preventDefault();    //会阻止点击事件
                        var touch = targetTouches[0];
                        var targetTop = touch.pageY - _previousTop;
                        e.target.parentNode.style.top = _startTop + targetTop + 'px';
                        e.target.parentNode.setAttribute('top', _startTop + targetTop + 'px');
                    }
                }, false);
                this.content.addEventListener('touchend', function (e) {
                    if (e.target == _this3.content || e.target == _this3.baseline || !Util.versions().mobile) return;
                    var parentNode = e.target.parentNode,
                        endTop = parseInt(parentNode.style.top),
                        minTop = __defaultConfig.baseTop - parentNode.offsetHeight + __defaultConfig.baselineHeight,
                        maxTop = __defaultConfig.baseTop;
                    if (endTop > maxTop) {
                        parentNode.style.top = maxTop + 'px';
                    } else if (endTop < minTop) {
                        parentNode.style.top = minTop + 'px';
                    } else {
                        parentNode.style.top = endTop + 'px';
                    }
                    var parentTop = parseInt(parentNode.style.top);
                    var moveItemsCount = Math.round((parentTop - __defaultConfig.baseTop) / __defaultConfig.itemHeight);
                    parentNode.style.top = __defaultConfig.baseTop + moveItemsCount * __defaultConfig.itemHeight + 'px';
                    _this3[setCurrentSelectStyle](parentNode.children[Math.abs(moveItemsCount)]);

                    var selectItem = parentNode.children[Math.abs(moveItemsCount)];

                    var parentNodeIndex = [].slice.call(parentNode.parentNode.children).findIndex(function (item) {
                        return item == parentNode;
                    });
                    _this3[selectResult][parentNodeIndex] = { txt: selectItem.innerText, val: selectItem.getAttribute('data'), order: Math.abs(moveItemsCount) };
                    _this3[setNextCol](selectItem);
                }, false);

                this.content.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (e.target == _this3.content || e.target == _this3.baseline || e.target.className.search(__defaultConfig.frameItemClass) == -1) return;
                    _this3[moveToItem](e.target);
                    _this3[setNextCol](e.target);
                }, false);
            }
        }, {
            key: setCurrentSelectStyle,
            value: function value(el) {
                //设置单项样式
                var children = [].slice.call(el.parentNode.children);
                var index = children.findIndex(function (item) {
                    return item == el;
                });
                children.forEach(function (item) {
                    item.className = __defaultConfig.frameItemClass;
                });
                try {
                    var classArray = [__defaultConfig.frameItemClass + ' ' + __defaultConfig.frameItemSelectedClass, __defaultConfig.frameItemClass + ' ' + __defaultConfig.frameItemSelectedSecondClass, __defaultConfig.frameItemClass + ' ' + __defaultConfig.frameItemSelectedThirdClass, __defaultConfig.frameItemClass + ' ' + __defaultConfig.frameItemSelectedFourthClass];
                    for (var i = index - 3; i < index + 4; i++) {
                        if (i < 0 || !children[i]) continue;
                        children[i].className = classArray[Math.abs(i - index)];
                    }
                } catch (e) { };
            }
        }, {
            key: preLoadDataMethod,
            value: function value() {
                var _this4 = this;

                //初始化时预设数据
                if (this.config.preLoadData) {
                    // 重设this[currentColDataList]
                    var _resetCurrentColIndex = 0;
                    var _resetCurrentColDataList = function _resetCurrentColDataList(arr, value) {
                        _this4[currentColDataList][_resetCurrentColIndex] = arr;
                        _resetCurrentColIndex++;
                        if (_resetCurrentColIndex < _this4[colLength]) {
                            var currentItem = arr.find(function (item) {
                                return item[_this4.config.valueField] == value;
                            });
                            if (!currentItem) {
                                Validator.throwError('预设数据出错，请检查');
                            }
                            _resetCurrentColDataList(currentItem[_this4.config.childField], _this4.config.preLoadData[_resetCurrentColIndex][_this4.config.valueField]);
                        }
                    };
                    _resetCurrentColDataList(this.config.data, this.config.preLoadData[0][this.config.valueField]);

                    //重设this[selectResult]
                    this[currentColDataList].forEach(function (item, index) {
                        _this4[selectResult][index] = {
                            txt: item.find(function (i) {
                                return i[_this4.config.valueField] == _this4.config.preLoadData[index][_this4.config.valueField];
                            })[_this4.config.displayField],
                            val: item.find(function (i) {
                                return i[_this4.config.valueField] == _this4.config.preLoadData[index][_this4.config.valueField];
                            })[_this4.config.valueField],
                            order: item.findIndex(function (i) {
                                return i[_this4.config.valueField] == _this4.config.preLoadData[index][_this4.config.valueField];
                            })
                        };
                    });

                    //重设多级框架
                    var firstColItem = [].slice.call(this.content.firstChild.children).find(function (item) {
                        return item.getAttribute('data') == _this4.config.preLoadData[0][_this4.config.valueField];
                    });
                    this[moveToItem](firstColItem);

                    var _loop = function _loop() {
                        var parentNode = _this4.content.children[i];
                        parentNode.innerHTML = '';
                        var fragment = document.createDocumentFragment();
                        _this4[currentColDataList][i].forEach(function (item) {
                            fragment.appendChild(_this4[createElement]({
                                tag: 'p',
                                class: __defaultConfig.frameItemClass,
                                data: item[_this4.config.valueField],
                                in: item[_this4.config.displayField]
                            }));
                        });
                        parentNode.append(fragment);
                        var el = [].slice.call(parentNode.children).find(function (item) {
                            return item.getAttribute('data') == _this4.config.preLoadData[i][_this4.config.valueField];
                        });
                        _this4[moveToItem](el);
                    };

                    for (var i = 1; i < this[selectResult].length; i++) {
                        _loop();
                    }
                }
            }
        }, {
            key: moveToItem,
            value: function value(el) {
                var parentNode = el.parentNode,
                    index = [].slice.call(parentNode.children).findIndex(function (item) {
                        return item == el;
                    });
                var moveColTargetTop = __defaultConfig.baseTop - index * __defaultConfig.itemHeight;
                parentNode.style.top = moveColTargetTop + 'px';
                this[setCurrentSelectStyle](el);

                var parentNodeIndex = [].slice.call(parentNode.parentNode.children).findIndex(function (item) {
                    return item == parentNode;
                });
                this[selectResult][parentNodeIndex] = { txt: el.innerText, val: el.getAttribute('data'), order: index };
            }
        }, {
            key: setNextCol,
            value: function value(el) {
                var _this5 = this;

                var parentNode = el.parentNode;
                var parentParentNode = parentNode.parentNode;
                var parentNodeIndex = [].slice.call(parentParentNode.children).findIndex(function (item) {
                    return item == parentNode;
                });
                var currentItemIndex = [].slice.call(parentNode.children).findIndex(function (item) {
                    return item == el;
                });

                var nextArr = this[currentColDataList][parentNodeIndex][currentItemIndex][this.config.childField];
                for (var i = parentNodeIndex + 1; i < this[colLength]; i++) {
                    try {
                        (function () {
                            var colElement = parentParentNode.children[i];
                            colElement.innerHTML = '';

                            var fragment = document.createDocumentFragment();

                            nextArr.forEach(function (item) {
                                fragment.appendChild(_this5[createElement]({
                                    tag: 'p',
                                    class: __defaultConfig.frameItemClass,
                                    data: item[_this5.config.valueField],
                                    in: item[_this5.config.displayField]
                                }));
                            });

                            colElement.appendChild(fragment);
                            _this5[setCurrentSelectStyle](colElement.firstChild);

                            _this5[moveToItem](colElement.firstChild);
                            _this5[selectResult][i] = { txt: colElement.firstChild.innerText, val: colElement.firstChild.getAttribute('data') };

                            _this5[currentColDataList][i] = nextArr;

                            nextArr = nextArr[0][_this5.config.childField];
                        })();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }, {
            key: 'hide',
            value: function hide() {
                var self = this;
                var fn = function fn() {
                    self.frameElement.style.display = 'none';
                    self.frameElementBg.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    document.body.style.height = 'auto';
                };
                Util.animateCss(this.frameElement, 'fadeOutDown', fn);
            }
        }, {
            key: 'show',
            value: function show() {
                document.body.style.overflow = 'hidden';
                document.body.style.height = Util.getClientHeight() + 'px';
                this.frameElement.style.display = 'block';
                this.frameElementBg.style.display = 'block';
                Util.animateCss(this.frameElement, 'fadeInUp');
            }
        }]);

        return Popicker;
    }();

    var Util = function () {
        function Util() {
            _classCallCheck(this, Util);
        }

        _createClass(Util, null, [{
            key: 'bit32',
            value: function bit32(value) {
                var val = '';
                for (var i = 0; i < value.length; i++) {
                    val += value.charCodeAt(i).toString(32);
                }
                return val;
            }
        }, {
            key: 'getClientHeight',
            value: function getClientHeight() {
                return parseInt(document.documentElement.clientHeight || document.body.clientHeight);
            }
        }, {
            key: 'animateCss',
            value: function animateCss(el, animationName, callback) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                var originClass = el.className;
                originClass = Array.prototype.filter(originClass.split(' '), function (item) {
                    return !/^animate/i.test(item);
                }).join(' ');
                el.className = originClass + ' animated ' + animationName;
                callback = callback || function () { };

                animationEnd.split(' ').forEach(function (item) {
                    el.addEventListener(item, function () {
                        el.className = originClass;
                        callback();
                        callback = function callback() { };
                    });
                });
            }
        }, {
            key: 'versions',
            value: function versions() {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == " qq" //是否QQ
                };
            }
        }, {
            key: 'loadRelyCss',
            value: function loadRelyCss(csspath) {
                if (document.getElementById(__defaultConfig.cssId)) {
                    return;
                }
                var head = document.getElementsByTagName('head');
                var es = document.createElement('link');
                es.href = csspath;
                es.rel = 'stylesheet';
                es.type = 'text/css';
                es.id = __defaultConfig.cssId;
                head[0].appendChild(es);
            }
        }]);

        return Util;
    }();

    var Validator = function () {
        function Validator() {
            _classCallCheck(this, Validator);
        }

        _createClass(Validator, null, [{
            key: 'isEmpty',
            value: function isEmpty(value) {
                return value == undefined || value == null || value == '';
            }
        }, {
            key: 'isEmptyObject',
            value: function isEmptyObject(value) {
                return Object.getOwnPropertyNames(value).length == 0;
            }
        }, {
            key: 'propsType',
            value: function propsType(props, value) {
                var _this6 = this;

                var names = Object.getOwnPropertyNames(props);
                names.forEach(function (name) {
                    var required = props[name].required;
                    if (required) {
                        if (_this6.isEmpty(value[name])) {
                            _this6.throwError(name + '\u4E3A\u5FC5\u4F20\u5B57\u6BB5\uFF01');
                        }
                    }
                    if (!_this6.isEmpty(value[name])) {
                        var reg = props[name].reg;
                        if (reg instanceof RegExp) {
                            if (!reg.test(value[name])) {
                                _this6.throwError(name + '\u6570\u636E\u683C\u5F0F\u4E0D\u5339\u914D\uFF01');
                            }
                        } else if (Object.prototype.toString.call(reg) === '[object Object]') {
                            if (!reg.fn(value[name])) {
                                _this6.throwError(name + '\u6570\u636E\u672A\u901A\u8FC7\u51FD\u6570\u6821\u9A8C\uFF01');
                            }
                        } else if (reg instanceof Function) {
                            if (reg === String) {
                                if (typeof value[name] !== 'string') {
                                    _this6.throwError(name + '\u6570\u636E\u7C7B\u578B\u4E0D\u5339\u914D\uFF01');
                                }
                            } else {
                                if (!(value[name] instanceof reg)) {
                                    _this6.throwError(name + '\u6570\u636E\u7C7B\u578B\u4E0D\u5339\u914D\uFF01');
                                }
                            }
                        }
                    }
                });
            }
        }, {
            key: 'throwError',
            value: function throwError(msg) {
                throw new Error(msg);
                return false;
            }
        }]);

        return Validator;
    }();

    //Export Popicker
    // Some AMD build optimizers, like r.js, check for condition patterns like:


    if (typeof define == 'function' && _typeof(define.amd) == 'object' && define.amd) {
        // Expose Popicker on the global object to prevent errors when Popicker is
        // loaded by a script tag in the presence of an AMD loader.
        root.Popicker = Popicker;

        // Define as an anonymous module so, through path mapping
        define(function () {
            return Popicker;
        });
    }
    // Check for `exports` after `define` in case a build optimizer adds it.
    else if (freeModule) {
        // Export for CommonJS support.
        freeExports.Popicker = Popicker;
    } else {
        // Export to the global object.
        root.Popicker = Popicker;
    }
}).call(undefined);