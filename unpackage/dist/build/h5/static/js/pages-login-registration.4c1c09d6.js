(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-registration"],{"0057":function(t,e,n){t.exports=n.p+"static/img/bg.1225a147.png"},"0126":function(t,e,n){"use strict";var i=n("40e80"),a=n.n(i);a.a},"1de5":function(t,e,n){"use strict";t.exports=function(t,e){return e||(e={}),t=t&&t.__esModule?t.default:t,"string"!==typeof t?t:(/^['"].*['"]$/.test(t)&&(t=t.slice(1,-1)),e.hash&&(t+=e.hash),/["'() \t\n]/.test(t)||e.needQuotes?'"'.concat(t.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):t)}},"40e80":function(t,e,n){var i=n("afa8");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=n("4f06").default;a("7b88977e",i,!0,{sourceMap:!1,shadowMode:!1})},"4b55e":function(t,e,n){"use strict";var i,a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"login-bg"},[n("v-uni-view",{staticClass:"appname",staticStyle:{"margin-top":"100upx"}},[t._v("未蓝消防")]),n("v-uni-view",{staticClass:"content"},[n("v-uni-view",{staticClass:"uni-form-item uni-column"},[n("v-uni-view",[t._v("账号")]),n("v-uni-input",{staticClass:"uni-input",attrs:{type:"tel",name:"",placeholder:"请输入手机号"},model:{value:t.phone,callback:function(e){t.phone=e},expression:"phone"}})],1),n("v-uni-view",{staticClass:"uni-form-item uni-column"},[n("v-uni-view",[t._v("验证码")]),n("v-uni-view",{staticStyle:{position:"relative",padding:"10upx 0"}},[n("v-uni-input",{staticClass:"uni-input",attrs:{type:"text",name:"",placeholder:"请输入验证码"},model:{value:t.picCode,callback:function(e){t.picCode=e},expression:"picCode"}}),n("v-uni-image",{staticClass:"veribtn veripic",attrs:{src:t.pic,mode:""},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.changePic.apply(void 0,arguments)}}})],1)],1),n("v-uni-view",{staticClass:"uni-form-item uni-column"},[n("v-uni-view",[t._v("短信验证码")]),n("v-uni-view",{staticStyle:{position:"relative",padding:"10upx 0"}},[n("v-uni-input",{staticClass:"uni-input",attrs:{type:"text",name:"",placeholder:"短信验证码"},model:{value:t.code,callback:function(e){t.code=e},expression:"code"}}),n("v-uni-button",{staticClass:"veribtn",attrs:{disabled:!t.show},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.getCode.apply(void 0,arguments)}}},[n("span",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}]},[t._v("获取验证码")]),n("span",{directives:[{name:"show",rawName:"v-show",value:!t.show,expression:"!show"}],staticClass:"count"},[t._v(t._s(t.count)+" s")])])],1)],1),n("v-uni-button",{staticClass:"login-btn",attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.register.apply(void 0,arguments)}}},[t._v("注册")])],1)],1)},o=[];n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}))},"4dc4":function(t,e,n){"use strict";n.r(e);var i=n("697a"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=a.a},"4f12":function(t,e,n){"use strict";n.r(e);var i=n("4b55e"),a=n("4dc4");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n("0126");var r,s=n("f0c5"),u=Object(s["a"])(a["default"],i["b"],i["c"],!1,null,"e7a1b634",null,!1,i["a"],r);e["default"]=u.exports},"697a":function(t,e,n){"use strict";var i=n("ee27");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("ca5b")),o=i(n("6ebd")),r={data:function(){return{seconds:10,count:60,timer:null,show:!0,phone:"",code:"",picCode:"",password:"",t:"",userType:"",openId:""}},onLoad:function(t){this.userType=t.userType,this.t=this.generateRandom(),this.openId=uni.getStorageSync("openid")},methods:{getCode:function(){if(""!=this.picCode){a.default.showLoading();var t={phone:this.phone,t:this.t,captchaCode:this.picCode},e=this;o.default.apiGet("/weixin/sendVaildMsg",t).then((function(t){"0"==t.code?e.settimer():a.default.showToast(t.msg),a.default.hideLoading()})).catch((function(t){a.default.hideLoading(),a.default.showToast("网络错误")}))}else a.default.showToast("请填写图中验证码中的内容")},settimer:function(){var t=this;this.timer||(this.count=60,this.show=!1,this.timer=setInterval((function(){t.count>0&&t.count<=60?t.count--:(t.show=!0,clearInterval(t.timer),t.timer=null)}),1e3))},register:function(){var t=/^1[3456789]\d{9}$/,e=this;if(t.test(this.phone)){a.default.showLoading();var n={openId:uni.getStorageSync("openid"),phone:this.phone,code:this.code,userType:this.userType};o.default.apiPost("/toc/tocUser/register",n).then((function(t){"0"==t.code?(0==e.userType?(uni.setStorageSync("usertype","gr"),uni.setStorageSync("openid",e.openId),uni.setStorageSync("userinfo",t.data),uni.switchTab({url:"/pages/index/index"})):(uni.$emit("registered"),uni.redirectTo({url:"./loginDW"})),a.default.hideLoading()):(a.default.hideLoading(),a.default.showToast(t.msg))})).catch((function(t){a.default.hideLoading(),a.default.showToast(t)}))}else a.default.showToast("请输入正确手机号")},gotoLogin:function(){uni.navigateTo({url:"login"})},generateRandom:function(){for(var t="abcdefghijklmnopqrstuvwxyz1234567890",e="",n=t.length,i=0;i<4;i++)e+=t[Math.floor(Math.random()*n)];return e},changePic:function(t){this.t=this.generateRandom()}},computed:{disableCodeBtn:function(){return this.codeBtn.waitingCode<4},pic:function(){return o.default.baseURL+"/weixin/captcha?t="+this.t}}};e.default=r},afa8:function(t,e,n){var i=n("24fb"),a=n("1de5"),o=n("0057");e=i(!1);var r=a(o);e.push([t.i,'@charset "UTF-8";\n/* 页面左右间距 */\n/* 文字尺寸 */\n/*文字颜色*/\n/* 边框颜色 */\n/* 图片加载中颜色 */\n/* 行为相关颜色 */.content[data-v-e7a1b634]{padding:%?50?% %?20?%;margin:0 %?30?% 0;background-color:#fff;border-radius:8px 8px 0 0;-webkit-box-shadow:0 0 8px #ccc;box-shadow:0 0 8px #ccc}.logo[data-v-e7a1b634]{text-align:center}.logo uni-image[data-v-e7a1b634]{height:%?200?%;width:%?200?%;margin:0 0 %?40?%}.uni-form-item[data-v-e7a1b634]{margin-bottom:%?40?%;padding:0;border-bottom:1px solid #e3e3e3}.uni-form-item .uni-input[data-v-e7a1b634]{font-size:%?30?%;padding:7px 0}.column-with-btn[data-v-e7a1b634]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.column-with-btn uni-button[data-v-e7a1b634]{font-size:%?24?%;margin:0;width:%?180?%;text-align:center}.column-with-btn uni-button[data-v-e7a1b634]:after{border:none}.column-with-btn uni-button.active[data-v-e7a1b634]{background-color:#fa436a;color:#fff}.img-captcha[data-v-e7a1b634]{width:%?150?%;height:%?60?%}uni-button[type="primary"][data-v-e7a1b634]{background-color:#fa436a;border-radius:0;font-size:%?34?%;margin-top:%?60?%}.links[data-v-e7a1b634]{text-align:center;margin-top:%?40?%;font-size:%?26?%;color:#999}.links uni-view[data-v-e7a1b634]{display:inline-block;vertical-align:top;margin:0 %?10?%}.links .link-highlight[data-v-e7a1b634]{color:#3f87ff}.login-bg[data-v-e7a1b634]{background-image:url('+r+");background-size:100%;background-repeat:no-repeat;border-top:1px solid #fff}.login-btn[data-v-e7a1b634]{background:#3f87ff!important;border-radius:34px!important}.veribtn[data-v-e7a1b634]{position:absolute;right:0;top:%?20?%;height:70%;margin-top:0;line-height:%?56?%;background-color:#fff;color:#3f87ff;border:1px solid #3f87ff}.veripic[data-v-e7a1b634]{width:%?230?%}",""]),t.exports=e},ca5b:function(t,e,n){"use strict";var i=n("ee27");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("96cf");var a=i(n("c964"));if(!o)var o={};function r(){return s.apply(this,arguments)}function s(){return s=(0,a.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.showLoading({title:"请等待",mask:!0});case 1:case"end":return t.stop()}}),t)}))),s.apply(this,arguments)}function u(){return c.apply(this,arguments)}function c(){return c=(0,a.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.hideLoading();case 1:case"end":return t.stop()}}),t)}))),c.apply(this,arguments)}function d(t){return l.apply(this,arguments)}function l(){return l=(0,a.default)(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.showToast({title:e||e.msg,mask:!0,icon:0==e.status?"success":"",duration:1500});case 1:case"end":return t.stop()}}),t)}))),l.apply(this,arguments)}o.PATH="http://47.103.152.26/api";var p={showLoading:r,hideLoading:u,showToast:d};e.default=p}}]);