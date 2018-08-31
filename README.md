# popicker
无限级别联动选择工具(Unlimited level linkage selection tool)

# 安装方法
## script标签引入
```zsh
<script src="./popicker.js"></script>
```
## require方式
```zsh
1. npm install popicker
2. var Popicker = require('popicker');
```
## import方式
```zsh
1. npm install popicker
2. import Popicker from 'popicker'
```

# 可配置项/Configuration
带`*`标志为必填项。
## el *
触发显示面板DOM元素
## targetElement
选择完成后，回显text数据的元素。不填则默认为el
## type
生成几级框架。不填默认为1。目前理论上支持无限级别
## valueTarget
设置选择完成之后，索要设置表单元素的value。
## data *
联动工具所展示的数据。为数组元素中嵌套数组格式。
## styleType
面板样式。支持bottom和middle。默认为bottom，暂不支持midlle
## displayField
单项文字属性名。不填默认为text
## valueField
单项value属性名。不填写默认为value
## childField
下一级别数组属性名。不填写默认为children
## preLoadData
初始化时预加载数据。
格式为`[{ value: '16' }, { value: '186' }]`，其中属性名固定为value
## connector
回显文字时的连接符。不填默认为`-`
## beforeShow
显示面板前方法
## complete
选择完成后方法。参数为选择结果数组


# 使用实例/Usage
```zsh
var data = [{
    "text": "北京",
    "value": "2",
    "children": [{
        "text": "北京市",
        "value": "36",
        "children": [{
            "text": "东城区",
            "value": "377"
        },
        {
            "text": "西城区",
            "value": "378"
        },
        {
            "text": "崇文区",
            "value": "379"
        },
        {
            "text": "宣武区",
            "value": "380"
        },
        {
            "text": "朝阳区",
            "value": "381"
        },
        {
            "text": "石景山区",
            "value": "383"
        },
        {
            "text": "延庆县",
            "value": "394"
        }]
    }]
}, {
    "text": "天津",
    "value": "3",
    "children": [{
        "text": "天津市",
        "value": "37",
        "children": [{
            "text": "和平区",
            "value": "395"
        },
        {
            "text": "河东区",
            "value": "396"
        },
        {
            "text": "河西区",
            "value": "397"
        },
        {
            "text": "南开区",
            "value": "398"
        },
        {
            "text": "河北区",
            "value": "399"
        },
        {
            "text": "西青区",
            "value": "405"
        },
        {
            "text": "滨海新区",
            "value": "416"
        }]
    }]
}];
var picker = new Popicker({
    el: document.querySelector('#picker'),
    data: data,
    type: 3,
    preLoadData: [{value: '4'}, {value: '39'}, {value: '442'}],
    beforeShow: () => {
        
    },
    complete: result => {
    
    }
})
```
