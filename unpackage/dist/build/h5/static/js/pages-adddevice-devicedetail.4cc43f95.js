(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-adddevice-devicedetail"],{"23bb":function(t,e,i){"use strict";var a=i("ee27");i("d81d"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;i("5db1");var n=a(i("9c15")),o=a(i("6352")),d=a(i("e88e")),s=a(i("6ebd")),l=a(i("ca5b")),r={components:{UniIcons:n.default,Prompt:o.default,uniCombox:d.default},data:function(){return{promptVisible:!1,promptVisible2:!1,mapReady:!1,address:"",candidates:[],id:"",type:"",form:{devId:"",baiduLongitude:"",baiduLatitude:"",contact:"",phone:"",address:"",imei:"",remark:"",buyTime:"",devName:""},markers:[],shareList:"",data:"",choosedLocationId:"",toPhone:"",toName:""}},onLoad:function(t){this.id=t.id,this.type=t.type,this.getDetail(),this.mapReady=!0},methods:{submit:function(){uni.switchTab({url:"/pages/index/index"})},more:function(t){uni.navigateTo({url:"/pages/adddevice/devicemore?id="+this.form.devId})},getLocation:function(){var t=this;0!==this.clickNum&&uni.showLoading({title:"获取中...",mask:!0}),this.clickNum>=3?uni.showToast({title:"请稍后尝试！",icon:"none",mask:!0}):(this.clickNum++,uni.getLocation({type:"gcj02",success:function(e){uni.hideLoading(),t.latitude=e.latitude,t.longitude=e.longitude,t.covers[1]={id:1,latitude:e.latitude,longitude:e.longitude,iconPath:"../../static/location.png"};var i=pointInsideCircle([t.latitude,t.longitude],[t.circles[0].latitude,t.circles[0].longitude],t.r/1e5);t.is=i,t.signInfo.latitude=e.latitude,t.signInfo.longitude=e.longitude,t.signInfo.mode=i?"正常打卡":"外勤打卡",t.getAdd()},fail:function(e){uni.hideLoading(),t.address="请检查位置信息！",uni.showToast({title:"请检查位置信息状态！",icon:"none",mask:!0,duration:3e3})}}))},openLocation:function(){var t=this;uni.chooseLocation({success:function(e){t.address=e.address,t.signInfo.address=e.address;var i=pointInsideCircle([t.latitude,t.longitude],[t.circles[0].latitude,t.circles[0].longitude],t.r/1e4);t.is=i}})},updated:function(){var t=this;wx.getLocation({type:"gcj02",success:function(e){t.latitude=e.latitude,t.longitude=e.longitude,t.nearDistance(t.markers,t.latitude,t.longitude)},fail:function(t){}})},regionchange:function(t){var e=this,i=wx.createMapContext("myMap",this);i.getCenterLocation({success:function(t){e.centerLatitude=t.latitude,e.centerLongitude=t.longitude,e.nearDistance(e.markers,e.centerLatitude,e.centerLongitude)},fail:function(t){}})},handler:function(t){var e=t.BMap,i=t.map,a=new e.Point(this.form.baiduLongitude,this.form.baiduLatitude);i.centerAndZoom(a,15);var n=new e.Marker(a);i.addOverlay(n);new e.Geolocation},editAddress:function(){this.promptVisible=!0},getDetail:function(){var t=this,e={openId:uni.getStorageSync("openid"),devId:this.id};s.default.apiGet("/toc/device/info",e).then((function(e){"0"==e.code?(t.data=e.data,l.default.hideLoading()):(l.default.hideLoading(),l.default.showToast(e.msg))})).catch((function(t){l.default.hideLoading(),l.default.showToast(t)}))},getAddress:function(){var t=this,e={page:1,count:10,address:this.address};t.candidates=[],s.default.apiGet("/toc/address/bindList",e).then((function(e){t.candidates=e.rows,l.default.hideLoading()})).catch((function(t){l.default.hideLoading(),l.default.showToast(t)}))},chooseLocation:function(t){this.choosedLocationId=t},clickPromptConfirm:function(){var t=this,e={openId:uni.getStorageSync("openid"),devId:this.data.devId,addressId:this.choosedLocationId};s.default.apiPost("/toc/device/changeAddress",e).then((function(e){"0"==e.code?(l.default.showToast("更改成功"),t.promptVisible=!1,t.getDetail()):l.default.showToast(e.msg),l.default.hideLoading()})).catch((function(t){l.default.hideLoading(),l.default.showToast(t)}))},clickPromptConfirm2:function(){var t=this,e={openId:uni.getStorageSync("openid"),devId:this.data.devId,toPhone:this.toPhone,toName:this.toName};s.default.apiPost("/toc/device/share",e).then((function(e){"0"==e.code?(l.default.showToast("更改成功"),t.promptVisible2=!1,t.getDetail()):l.default.showToast(e.msg),l.default.hideLoading()})).catch((function(t){l.default.hideLoading(),l.default.showToast(t)}))},stopShare:function(t){var e=this,i={openId:uni.getStorageSync("openid"),shareId:t};s.default.apiPost("/toc/device/cancelShare",i).then((function(t){"0"==t.code?(l.default.showToast("更改成功"),e.getDetail()):l.default.showToast(t.msg),l.default.hideLoading()})).catch((function(t){l.default.hideLoading(),l.default.showToast(t)}))}}};e.default=r},"2c03":function(t,e,i){"use strict";var a=i("ee27");i("4de4"),i("c975"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("4e08")),o={name:"uniCombox",components:{uniIcons:n.default},props:{label:{type:String,default:""},labelWidth:{type:String,default:"auto"},placeholder:{type:String,default:""},candidates:{type:Array,default:function(){return[]}},emptyTips:{type:String,default:"无匹配项"},value:{type:String,default:""}},data:function(){return{showSelector:!1,inputVal:""}},computed:{labelStyle:function(){return"auto"===this.labelWidth?{}:{width:this.labelWidth}},filterCandidates:function(){var t=this;return this.candidates.filter((function(e){return e.address.indexOf(t.inputVal)>-1}))},filterCandidatesLength:function(){return this.filterCandidates.length}},watch:{value:{handler:function(t){console.log(t),this.inputVal=t},immediate:!0}},methods:{toggleSelector:function(){this.showSelector=!this.showSelector},onFocus:function(){this.showSelector=!0},onBlur:function(){var t=this;setTimeout((function(){t.showSelector=!1}),50)},onSelectorClick:function(t){this.inputVal=this.filterCandidates[t].address,this.showSelector=!1,this.$emit("click",this.filterCandidates[t].id)},onInput:function(){var t=this;setTimeout((function(){t.$emit("input",t.inputVal)}))}}};e.default=o},"35d7":function(t,e,i){"use strict";var a=i("8db9"),n=i.n(a);n.a},"445f":function(t,e,i){"use strict";i.r(e);var a=i("f233"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},4577:function(t,e,i){"use strict";var a=i("906e"),n=i.n(a);n.a},"589b":function(t,e,i){"use strict";i.r(e);var a=i("eb56"),n=i("f6c5");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("35d7");var d,s=i("f0c5"),l=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"01f6473a",null,!1,a["a"],d);e["default"]=l.exports},"5c0e":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,"uni-view[data-v-468897a2],\n  uni-button[data-v-468897a2],\n  uni-input[data-v-468897a2]{-webkit-box-sizing:border-box;box-sizing:border-box}.prompt-box[data-v-468897a2]{position:fixed;left:0;top:0;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%;height:100vh;background:rgba(0,0,0,.2);-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.prompt[data-v-468897a2]{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:%?600?%;min-height:%?300?%;background:#fff;border-radius:%?20?%;\n    /* overflow: hidden; */z-index:9999}.prompt-top[data-v-468897a2]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%}.prompt-title[data-v-468897a2]{margin:%?20?% 0;color:#333}.prompt-input[data-v-468897a2]{width:%?520?%;min-height:%?72?%;padding:%?8?% %?16?%;border:%?2?% solid #ddd;border-radius:%?8?%;font-size:%?28?%;text-align:left}.prompt-buttons[data-v-468897a2]{display:-webkit-box;display:-webkit-flex;display:flex;width:100%;-webkit-box-shadow:0 0 %?2?% %?2?% #eee;box-shadow:0 0 %?2?% %?2?% #eee}.prompt-buttons uni-button[data-v-468897a2]:after{border-radius:0}uni-button[data-v-468897a2]{width:50%;background:#fff;border-radius:0}.prompt-cancle[data-v-468897a2]{background:#fff}.prompt-confirm[data-v-468897a2]{color:#fff}",""]),t.exports=e},"5db1":function(t,e,i){"use strict";function a(){console.log(1)}function n(t){var e={main:[t]};uni.setStorageSync("signInfo",JSON.stringify(e))}function o(t,e){e.main.push(t),uni.setStorageSync("signInfo",JSON.stringify(e))}function d(){var t=uni.getStorageSync("signInfo");if(t)return JSON.parse(t)}function s(){uni.removeStorage({key:"signInfo",success:function(){uni.showToast({title:"重置成功"})}})}function l(t){var e=new Date,i={mode:t.mode,nowT:e,address:t.address,time:t.time,latitude:t.latitude,longitude:t.longitude,remarks:t.remarks};return i}Object.defineProperty(e,"__esModule",{value:!0}),e.handleSignClick=a,e.setSignInfo=n,e.addSignInfo=o,e.getSignInfo=d,e.delSignInfo=s,e.getInfo=l,e.key=void 0;var r="VEEBZ-HJL34-U3LUY-XUBOX-NSUF7-E4BRF";e.key=r},6352:function(t,e,i){"use strict";i.r(e);var a=i("af9c"),n=i("445f");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("4577");var d,s=i("f0c5"),l=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"468897a2",null,!1,a["a"],d);e["default"]=l.exports},"72c8":function(t,e,i){var a=i("e041");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("ee77c9b8",a,!0,{sourceMap:!1,shadowMode:!1})},"7cfd":function(t,e,i){"use strict";i.r(e);var a=i("2c03"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},"8db9":function(t,e,i){var a=i("97a0");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("1532543e",a,!0,{sourceMap:!1,shadowMode:!1})},"906e":function(t,e,i){var a=i("5c0e");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("39524412",a,!0,{sourceMap:!1,shadowMode:!1})},"97a0":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/* 页面左右间距 */\n/* 文字尺寸 */\n/*文字颜色*/\n/* 边框颜色 */\n/* 图片加载中颜色 */\n/* 行为相关颜色 */uni-page-body[data-v-01f6473a]{background:#f0f0f0}.yt-list[data-v-01f6473a]{margin-top:%?16?%;background:#fff}.yt-list-cell[data-v-01f6473a]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;line-height:%?70?%;position:relative}.yt-list-cell.cell-hover[data-v-01f6473a]{background:#fafafa}.yt-list-cell.b-b[data-v-01f6473a]:after{left:%?30?%}.yt-list-cell .cell-icon[data-v-01f6473a]{height:%?32?%;width:%?32?%;font-size:%?22?%;color:#fff;text-align:center;line-height:%?32?%;background:#f85e52;border-radius:%?4?%;margin-right:%?12?%}.yt-list-cell .cell-icon.hb[data-v-01f6473a]{background:#ffaa0e}.yt-list-cell .cell-icon.lpk[data-v-01f6473a]{background:#3ab54a}.yt-list-cell .cell-tit[data-v-01f6473a]{-webkit-box-flex:1;-webkit-flex:1;flex:1;font-size:%?26?%;color:#696969;margin-right:%?10?%}.yt-list-cell .cell-tip[data-v-01f6473a]{font-size:%?26?%;color:#f85e52}.yt-list-cell .cell-tip.disabled[data-v-01f6473a]{color:#f85e52}.yt-list-cell .cell-tip.active[data-v-01f6473a]{color:#f85e52}.yt-list-cell .cell-tip.red[data-v-01f6473a]{color:#f85e52}.yt-list-cell.desc-cell[data-v-01f6473a]{position:relative}.yt-list-cell.desc-cell .cell-tit[data-v-01f6473a]{max-width:%?160?%}.yt-list-cell .desc[data-v-01f6473a]{-webkit-box-flex:1;-webkit-flex:1;flex:1;font-size:%?28?%;color:#a9a9a9}.yt-list-cell uni-switch[data-v-01f6473a]{-webkit-transform:translateX(%?16?%) scale(.84);transform:translateX(%?16?%) scale(.84)}.add-btn[data-v-01f6473a]{position:fixed;left:%?30?%;right:%?30?%;bottom:%?16?%;z-index:95;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;width:%?690?%;height:%?80?%;font-size:%?32?%;color:#fff;background-color:#fa436a;border-radius:%?10?%;-webkit-box-shadow:1px 2px 5px rgba(219,63,96,.4);box-shadow:1px 2px 5px rgba(219,63,96,.4)}.mini-btn[data-v-01f6473a]{line-height:32px;height:32px;margin-right:%?10?%}.map-warpper[data-v-01f6473a]{position:absolute;left:0;top:0;width:100%;height:100%}.card[data-v-01f6473a]{padding:%?20?% %?20?% 0;background-color:#fff;margin:%?30?%;border-radius:8px}.card .line[data-v-01f6473a]{padding:%?10?% 0}.card .border-line[data-v-01f6473a]{border-bottom:1px solid #f2f2f2}.edit-btn[data-v-01f6473a]{padding:%?20?%;text-align:center;border-top:1px solid #e6e6e6}.add-share-btn[data-v-01f6473a]{padding:%?5?% %?20?%;background:#2a95f0;border-radius:24px;color:#fff;margin-top:%?-5?%}.card2[data-v-01f6473a]{padding:0!important;margin:%?40?% %?30?%}.card2 .border-line[data-v-01f6473a]{font-size:%?24?%}.card2 uni-text[data-v-01f6473a]{display:inline-block;padding:0 %?10?%;line-height:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;-webkit-box-sizing:border-box;box-sizing:border-box}.card2 .left-border[data-v-01f6473a]{border-left:1px solid #111}.co1[data-v-01f6473a]{width:16%}.col2[data-v-01f6473a]{width:34%}.col3[data-v-01f6473a]{width:29%}.col4[data-v-01f6473a]{width:20%}.sharemap[data-v-01f6473a]{height:%?800?%!important}.btn[data-v-01f6473a]{background:#3f87ff!important;border-radius:34px!important;font-size:%?34?%;margin-top:%?60?%}.input[data-v-01f6473a]{margin:%?20?% 0;padding:%?15?% 0;font-size:%?28?%;width:85%;border:1px solid #f2f2f2}body.?%PAGE?%[data-v-01f6473a]{background:#f0f0f0}',""]),t.exports=e},"9e9c":function(t,e,i){"use strict";var a={"uni-icons":i("4e08").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"uni-combox"},[t.label?i("v-uni-view",{staticClass:"uni-combox__label",style:t.labelStyle},[i("v-uni-text",[t._v(t._s(t.label))])],1):t._e(),i("v-uni-view",{staticClass:"uni-combox__input-box"},[i("v-uni-input",{staticClass:"uni-combox__input",attrs:{type:"text",placeholder:t.placeholder},on:{input:function(e){arguments[0]=e=t.$handleEvent(e),t.onInput.apply(void 0,arguments)},focus:function(e){arguments[0]=e=t.$handleEvent(e),t.onFocus.apply(void 0,arguments)},blur:function(e){arguments[0]=e=t.$handleEvent(e),t.onBlur.apply(void 0,arguments)}},model:{value:t.inputVal,callback:function(e){t.inputVal=e},expression:"inputVal"}}),i("uni-icons",{staticClass:"uni-combox__input-arrow",attrs:{color:"#3f87ff",type:"location-filled",size:"14"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toggleSelector.apply(void 0,arguments)}}}),t.showSelector?i("v-uni-view",{staticClass:"uni-combox__selector"},[i("v-uni-scroll-view",{staticClass:"uni-combox__selector-scroll",attrs:{"scroll-y":"true"}},[0===t.filterCandidatesLength?i("v-uni-view",{staticClass:"uni-combox__selector-empty"},[i("v-uni-text",[t._v(t._s(t.emptyTips))])],1):t._e(),t._l(t.filterCandidates,(function(e,a){return i("v-uni-view",{key:a,staticClass:"uni-combox__selector-item",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onSelectorClick(a)}}},[i("v-uni-text",[t._v(t._s(e.address))])],1)}))],2)],1):t._e()],1)],1)},o=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}))},af9c:function(t,e,i){"use strict";var a,n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.visible?i("v-uni-view",{staticClass:"prompt-box",on:{touchmove:function(e){arguments[0]=e=t.$handleEvent(e),(!0).apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"prompt"},[i("v-uni-view",{staticClass:"prompt-top"},[i("v-uni-text",{staticClass:"prompt-title"},[t._v(t._s(t.title))]),t._t("default")],2),i("v-uni-view",{staticClass:"prompt-buttons"},[i("v-uni-button",{staticClass:"prompt-cancle",staticStyle:{color:"#3f87ff"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.close.apply(void 0,arguments)}}},[t._v("取消")]),i("v-uni-button",{staticClass:"prompt-confirm ",staticStyle:{"background-color":"#3f87ff"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.confirm.apply(void 0,arguments)}}},[t._v("确定")])],1)],1)],1):t._e()},o=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}))},c54b:function(t,e,i){"use strict";var a=i("72c8"),n=i.n(a);n.a},ca5b:function(t,e,i){"use strict";var a=i("ee27");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("96cf");var n=a(i("c964"));if(!o)var o={};function d(){return s.apply(this,arguments)}function s(){return s=(0,n.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.showLoading({title:"请等待",mask:!0});case 1:case"end":return t.stop()}}),t)}))),s.apply(this,arguments)}function l(){return r.apply(this,arguments)}function r(){return r=(0,n.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.hideLoading();case 1:case"end":return t.stop()}}),t)}))),r.apply(this,arguments)}function c(t){return u.apply(this,arguments)}function u(){return u=(0,n.default)(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:uni.showToast({title:e||e.msg,mask:!0,icon:0==e.status?"success":"",duration:1500});case 1:case"end":return t.stop()}}),t)}))),u.apply(this,arguments)}o.PATH="http://47.103.152.26/api";var f={showLoading:d,hideLoading:l,showToast:c};e.default=f},e041:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/* 页面左右间距 */\n/* 文字尺寸 */\n/*文字颜色*/\n/* 边框颜色 */\n/* 图片加载中颜色 */\n/* 行为相关颜色 */.uni-combox[data-v-162f1a68]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.uni-combox__label[data-v-162f1a68]{font-size:16px;line-height:22px;padding-right:10px;color:#999}.uni-combox__input-box[data-v-162f1a68]{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-flex:1;-webkit-flex:1;flex:1;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.uni-combox__input[data-v-162f1a68]{-webkit-box-flex:1;-webkit-flex:1;flex:1;font-size:12px;height:22px;line-height:22px}.uni-combox__selector[data-v-162f1a68]{-webkit-box-sizing:border-box;box-sizing:border-box;position:absolute;top:42px;left:0;width:100%;background-color:#fff;border-radius:6px;-webkit-box-shadow:#ddd 4px 4px 8px,#ddd -4px -4px 8px;box-shadow:#ddd 4px 4px 8px,#ddd -4px -4px 8px;z-index:2}.uni-combox__selector-scroll[data-v-162f1a68]{max-height:200px;-webkit-box-sizing:border-box;box-sizing:border-box}.uni-combox__selector[data-v-162f1a68]::before{content:"";position:absolute;width:0;height:0;border-bottom:solid 6px #fff;border-right:solid 6px transparent;border-left:solid 6px transparent;left:50%;top:-6px;margin-left:-6px}.uni-combox__selector-empty[data-v-162f1a68],\n.uni-combox__selector-item[data-v-162f1a68]{line-height:36px;font-size:14px;text-align:center;border-bottom:solid 1px #ddd;margin:0 10px;z-index:9999}.uni-combox__selector-empty[data-v-162f1a68]:last-child,\n.uni-combox__selector-item[data-v-162f1a68]:last-child{border-bottom:none}',""]),t.exports=e},e88e:function(t,e,i){"use strict";i.r(e);var a=i("9e9c"),n=i("7cfd");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("c54b");var d,s=i("f0c5"),l=Object(s["a"])(n["default"],a["b"],a["c"],!1,null,"162f1a68",null,!1,a["a"],d);e["default"]=l.exports},eb56:function(t,e,i){"use strict";var a={"uni-icons":i("4e08").default,"uni-combox":i("e88e").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",[i("v-uni-view",{staticClass:"card"},[i("v-uni-view",{staticClass:"line"},[i("v-uni-text",{staticClass:"cgray"},[t._v("所属地址:")]),t._v(t._s(t.data.devLocation))],1),i("v-uni-view",{staticClass:"line"},[i("v-uni-text",{staticClass:"cgray"},[t._v("设备型号:")]),t._v(t._s(t.data.typeName)),i("v-uni-text",{staticClass:"fr"},[i("v-uni-text",{staticClass:"cgray"},[t._v("设备名称:")]),t._v(t._s(t.data.devName))],1)],1),i("v-uni-view",{staticClass:"line"},[i("v-uni-text",{staticClass:"cgray"},[t._v("告警状态:")]),i("v-uni-text",{class:{cwarning:1==t.data.isWarn}},[t._v(t._s(1==t.data.isWarn?"有":"无"))]),i("v-uni-text",{staticClass:"fr"},[i("v-uni-text",{staticClass:"cgray"},[t._v("在线状态:")]),0==t.data.isBroken?i("v-uni-text",[i("v-uni-text",{class:{conline:1==t.data.devState,coffline:0==t.data.devState}},[t._v(t._s(1==t.data.devState?"在线":"离线"))])],1):i("v-uni-text",{staticClass:"cwarning"},[t._v("故障")])],1)],1),i("v-uni-view",{staticClass:"line"},[i("v-uni-text",{staticClass:"cgray"},[t._v("历史告警数:")]),t._v(t._s(t.data.warnCount)),i("v-uni-text",{staticClass:"fr"},[i("v-uni-text",{staticClass:"cgray"},[t._v("历史误报数:")]),t._v(t._s(t.data.misreportCount))],1)],1),0==t.type?i("v-uni-view",{staticClass:"edit-btn cblue",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.editAddress.apply(void 0,arguments)}}},[t._v("修改")]):t._e()],1),0==t.type?i("v-uni-view",{staticStyle:{margin:"0 30upx"}},[i("v-uni-text",[t._v("共享记录")]),i("v-uni-view",{staticClass:"fr add-share-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.promptVisible2=!0}}},[i("uni-icons",{attrs:{type:"plus",color:"#fff"}}),t._v("添加共享")],1)],1):t._e(),0==t.type?i("v-uni-view",{staticClass:"card card2"},t._l(t.data.deviceShareList,(function(e,a){return i("v-uni-view",{key:a,staticClass:"line border-line"},[i("v-uni-text",{staticClass:"col1"},[t._v(t._s(e.shareToUser))]),i("v-uni-text",{staticClass:"left-border col2"},[t._v(t._s(e.shareToUserPhone))]),i("v-uni-text",{staticClass:"left-border col3"},[t._v(t._s(e.nickName))]),i("v-uni-text",{staticClass:"cblue left-border col4",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.stopShare(e.id)}}},[t._v("取消共享")])],1)})),1):t._e(),i("v-uni-view",{staticClass:"yt-list-cell desc-cell"},[i("v-uni-view",{staticClass:"map-warpper"}),t.data?i("baidu-map",{class:{sharemap:1==t.type},staticStyle:{width:"100%",height:"500upx"},attrs:{center:{lng:t.data.baiduLongitude,lat:t.data.baiduLatitude},zoom:15},on:{ready:function(e){arguments[0]=e=t.$handleEvent(e),t.handler.apply(void 0,arguments)}}},[i("bm-label",{attrs:{content:t.data.devLocation,position:{lng:t.data.baiduLongitude,lat:t.data.baiduLatitude},labelStyle:{color:"#333",fontSize:"16px"}}}),i("bm-marker",{attrs:{position:{lng:t.data.baiduLongitude,lat:t.data.baiduLatitude},dragging:!1,zIndex:999999999}})],1):t._e()],1),i("prompt",{attrs:{visible:t.promptVisible,title:"新地址",mainColor:"#e74a39"},on:{"update:visible":function(e){arguments[0]=e=t.$handleEvent(e),t.promptVisible=e},confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.clickPromptConfirm.apply(void 0,arguments)}}},[i("uni-combox",{staticClass:"input",attrs:{candidates:t.candidates,value:t.address},on:{input:function(e){arguments[0]=e=t.$handleEvent(e),t.getAddress.apply(void 0,arguments)},click:function(e){arguments[0]=e=t.$handleEvent(e),t.chooseLocation.apply(void 0,arguments)}},model:{value:t.address,callback:function(e){t.address=e},expression:"address"}})],1),i("prompt",{staticClass:"prompt2",attrs:{visible:t.promptVisible2,title:"添加分享",mainColor:"#e74a39"},on:{"update:visible":function(e){arguments[0]=e=t.$handleEvent(e),t.promptVisible2=e},confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.clickPromptConfirm2.apply(void 0,arguments)}}},[i("v-uni-view",[t._v("手机号")]),i("v-uni-input",{staticClass:"input",attrs:{type:"text",value:"",placeholder:"请输入对方手机号"},model:{value:t.toPhone,callback:function(e){t.toPhone=e},expression:"toPhone"}}),i("v-uni-view",[t._v("名称")]),i("v-uni-input",{staticClass:"input",attrs:{type:"text",value:"",placeholder:"请输入对方名称"},model:{value:t.toName,callback:function(e){t.toName=e},expression:"toName"}})],1)],1)},o=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}))},f233:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={props:{visible:{type:Boolean,default:!1,required:!0},title:{type:String,default:"提示"},placeholder:{type:String,default:"请输入内容"},mainColor:{type:String,default:"#3f87ff"},defaultValue:{type:String,default:""},inputStyle:{type:String,default:""},isMutipleLine:{type:Boolean,default:!1}},data:function(){return{value:""}},watch:{visible:function(t){t&&(this.value=this.defaultValue)}},mounted:function(){this.value="true"===this.defaultValue?"":this.defaultValue},methods:{close:function(){this.$emit("update:visible",!1)},confirm:function(){this.$emit("confirm",this.value),this.value=""}}};e.default=a},f6c5:function(t,e,i){"use strict";i.r(e);var a=i("23bb"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a}}]);