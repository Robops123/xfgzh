<template>
    <!-- 侧滑导航根容器 -->
    <div class="page mapIndex">
        <!-- 主页面 -->
        <!-- 主页面header区域 -->
        <mt-header title="国联智行" fixed>
            <router-link to="/" slot="left">
                <mt-button icon="back" style="color:#fff;"></mt-button>
            </router-link>
            <mt-button slot="left" @click="toggle(true)" class="toggleside" >
                <i class="iconfont headerIcon iconCategory">&#xe740;</i>
                <sup v-if="msg_unread"></sup>
            </mt-button>
            <mt-button slot="right">
                <i class="iconfont headerIcon icon-mapsearch" @click="selectAddress">&#xe696;</i>
                <i class="iconfont headerIcon icon-saoyisao" @click="startScan"></i>
            </mt-button>
        </mt-header>

        <!-- 找车方法 -->
        <ul class="headerSelect" is-fixed>
            <router-link to="topList"><li><button>列表找车</button></li></router-link>
            <router-link to="conditions2"><li><button>条件选车</button></li></router-link>
            <router-link to="rentInstruction"><li><button>租车说明</button></li></router-link>
        </ul>

        <!--登录提示-->
        <p v-show="!isLogin" class="headerRemind headerRemindisLogin">您尚未登录，暂时无法租车
            <router-link to="signUp"><span style="margin-left:5px;">登录</span></router-link>
            <router-link to="cellPhoneNumber"><span>注册</span></router-link>
        </p>
        <!--会员认证提示-->
        <p v-show="isLogin&&GLOBAL.credit_status!=2" class="headerRemind">您尚未认证，暂时无法租车
            <router-link to="member_center"><span>会员认证</span></router-link>
        </p>
        <!--押金缴纳提示-->
        <p v-show="isLogin&&GLOBAL.credit_status==2&&!isDeposit" class="headerRemind">您尚未缴纳押金，暂时无法租车
            <router-link to="deliverDeposit"><span>缴纳押金</span></router-link>
        </p>

        <!-- 主页面map区域 -->
        <div id="allmap" v-bind:style="mapStyle">
        </div>
        <!-- 起点坐标 -->
        <!-- <img class="startPoint" src="../assets/startPoint.png" alt=""> -->

        <!-- 重定位和联系客服 -->
        <div  @click="reLocate()"  class="locatePoint"><i class="iconfont">&#xe611;</i></div>
        <div  @click="refresh()"  class="refreshPoint"><i class="iconfont">&#xe9d8;</i></div>
        <div  @click="goNear('mykey')" class="keyPoint"><i class="iconfont">&#xe612;</i></div>

        <div @click="telContact()" class="contactPoint"><i class="iconfont">&#xe65a;</i></div>
        <div class="teltip" v-show="teltipVisible">
            <h3>提示</h3>
            <p>客服在线时间早8:30至晚22:00，您确认拨打吗？</p>
            <div>
                <a @click="closeTelContact()">取消</a>
                <a href="tel:4009287758" @click="closeTelContact()" class="teltip_confirm">确认拨打</a>
            </div>
        </div>
        <div class="teltipbg" v-show="teltipVisible"></div>
        <div id="allmapMask" v-show="isMask"  @click="closeMask()"></div>

        <!-- 主页面网点信息和车辆信息区域 -->
        <div class="park" v-show="popChoose">
            <div class="parkHeader">
                <div class="parkHeader-top">
                    <div class="parkHeader-left">
                        <p>{{parkPointSelect.parkplacename}}</p>
                        <p>营业时间：{{parkPointSelect.runtime}}</p>
                        <p>{{parkPointSelect.district}}</p>
                    </div>
                    <div class="parkHeader-right">
                        <p  @click="navigator()"><i class="iconfont navigator_icon">&#xe773;</i></p>
                        <p>{{distance}}Km</p>
                    </div>
                </div>
                <div class="parkHeader-bottom">
                    <button @click="chooseCar()" v-bind:class="[!isActive ? 'active' : '','parkHeaderChange']">待租车辆</button>
                    <button @click="choosePark()" v-bind:class="[isActive ? 'active' : '','parkHeaderChange']">网点信息</button>
                </div>
            </div>
            <!--轮播图-->
            <div class="parkSlider"  v-show="isActive">
                <mt-swipe :auto="4000">
                    <mt-swipe-item v-for="picture in parkPointSelect.pictures">
                        <img class="img-responsive" :src="picture" alt="">
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <!--网点信息-->
            <ul class="parkMessage" v-show="isActive" style="overflow-y:auto">
                 <li @click="goNear('nearstore',parkPointSelect.parkplaceid,parkPointSelect.district)">
                    <span  class="parkMessageLeft">附近商家</span>
                    <span  class="parkMessageRight"><i class="iconfont gowhite">&#xe6f0;</i></span>
                </li>
                <!-- <li>
                    <span  class="parkMessageLeft">网点营业时间</span>
                    <span  class="parkMessageRight">{{parkPointSelect.runtime}}小时</span>
                </li> -->
                <li>
                    <span  class="parkMessageLeft">可用车辆</span>
                    <span  class="parkMessageRight">{{parkPointSelect.freecarnumber}}辆</span>
                </li>
                <li>
                    <span  class="parkMessageLeft">可用停车位</span>
                    <span  class="parkMessageRight">{{parkPointSelect.freeseatnumber}}个(供参考)</span>
                </li>
                <!-- <li>
                    <span  class="parkMessageLeft">位置</span>
                    <span  class="parkMessageRight">{{parkPointSelect.district}}</span>
                </li> -->
            </ul>
            <!--车辆信息-->
            <ul class="carMessage" v-show="!isActive" style="overflow-y:scroll">
                <li  v-for="carinfo in parkPointSelect.carinfos"  @click="tovehicleParticulars(carinfo.id)">
                    <img  v-if="carinfo.activitys.length!=0"  class="discount" src="../assets/images/discountActivity.png"/>
                    <img  v-if="carinfo.company_car.length!=0"  class="company" src="../assets/images/businessflag.png"/>
                    <img class="minicar" src="../assets/carGreen1.png" alt="" v-if="parseInt(carinfo.surpluspercent) <= 12.5||!carinfo.surpluspercent">
                    <img class="minicar" src="../assets/carGreen2.png" alt="" v-if="parseInt(carinfo.surpluspercent) > 12.5 && parseInt(carinfo.surpluspercent) <= 37.5">
                    <img class="minicar" src="../assets/carGreen3.png" alt="" v-if="parseInt(carinfo.surpluspercent) > 37.5 && parseInt(carinfo.surpluspercent) <= 62.5">
                    <img class="minicar" src="../assets/carGreen4.png" alt="" v-if="parseInt(carinfo.surpluspercent) > 62.5 && parseInt(carinfo.surpluspercent) <= 87.5">
                    <img class="minicar" src="../assets/carGreen5.png" alt="" v-if="parseInt(carinfo.surpluspercent) > 87.5">
                    <span class="mileage">
                      <p>{{carinfo.surplusdistance}}km</p>
                      <p class="capacity">
                        <b class="capacityElectric" v-bind:style="'width:'+carinfo.surpluspercent+'%'"></b>
                      </p>
                    </span>
                    <span class="carType">{{carinfo.carmodel}}</span>
                    <img class="quick" v-if="carinfo.carmodel=='IEV6E'||carinfo.carmodel=='EC200'" src="../assets/images/quick2.png" alt="">
                    <img class="quick" v-if="carinfo.carmodel!='IEV6E'&&carinfo.carmodel!='EC200'" src="../assets/images/white.png" alt="">
                    <span class="carNumber">{{carinfo.car_number}}</span>
                    <i class="iconfont">&#xe6f0;</i>
                </li>
                <img class="nocar_state" v-if="parkPointSelect.carinfos==false"  src="../assets/images/nocar_state.png" alt=""/>
            </ul>
        </div>

        <!--底部地址搜索-->
        <!-- <div class="car_address">
            <i @click="addressToPoint()" class="iconfont car_addressIcon">&#xe628;</i>
            <input class="car_addressText" type="text" v-model="curAddressText">
        </div>  -->
        <!-- 底部搜索附近网点的按钮 -->
        <img v-if="zoom>=15" @click="locateNear()" class="locateNear" src="../assets/images/locateNearest.png" alt="" >

        <!-- 侧滑菜单容器-->
        <mu-drawer :open="open" :docked="docked" width="70%" @close="toggle()">
            <ul class="drawerList"  @itemClick="docked ? '' : toggle()">
                <router-link to="member_center">
                    <li v-show="isLogin" class="firstChild">
                        <div  class="imgHeader">
                            <img :src="headimg">
                        </div>
                        <div  class="drawerHeader">
                            <!-- <p>{{givenname}}<span class="score">&nbsp;&nbsp;积分：{{score}}</span></p> -->
                            <p>{{phoneNumber}}</p>
                        </div>
                        <i class="iconfont go goHead">&#xe6f0;</i>
                    </li>
                </router-link>
                <li v-show="!isLogin" class="secondChild">
                    <router-link to="signUp"><button class="login">立即登录</button></router-link>
                    <router-link to="cellPhoneNumber"><button class="register">免费注册</button></router-link>
                </li>
                <router-link to="myOrder">
                    <li>
                        <i class="iconfont">&#xe79f;</i>
                        我的订单
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="mykey">
                    <li>
                        <i class="iconfont">&#xe634;</i>
                        我的钥匙
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="wallet">
                    <li>
                        <i class="iconfont">&#xe602;</i>
                        我的钱包
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="otherCharges">
                    <li>
                        <i class="iconfont">&#xe654;</i>
                        其他费用
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="invoiceRecord">
                    <li>
                        <i class="iconfont">&#xe77f;</i>
                        开票记录
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="violationHistory">
                    <li>
                        <i class="iconfont">&#xe615;</i>
                        违章记录
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="message">
                    <li>
                        <i class="iconfont">&#xe709;</i>
                        消息通知
                        <i class="iconfont go">&#xe6f0;</i>
                        <mu-badge v-if="msg_unread!=0" class="message" :content="''+msg_unread"  secondary slot="right"/>
                    </li>
                </router-link>
                <router-link to="helpCenter">
                    <li>
                        <i class="iconfont">&#xe632;</i>
                        帮助中心
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="feedback_record">
                    <li>
                        <i class="iconfont">&#xe708;</i>
                        意见反馈
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
                <router-link to="setting">
                    <li>
                        <i class="iconfont">&#xe609;</i>
                        个人设置
                        <i class="iconfont go">&#xe6f0;</i>
                    </li>
                </router-link>
            </ul>
        </mu-drawer>

        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Actionsheet } from 'mint-ui';
    import evt from 'assets/js/plusReady'
    export default {
        name: 'mapIndex',
        data () {
            return {
                headimg:this.GLOBAL.link,//头像

                open: false,//侧滑菜单打开关闭
                docked: false,//侧滑菜单打开关闭
                isDeposit:this.GLOBAL.isDeposit,//是否缴纳押金
                isLogin:this.GLOBAL.auth_status,//是否登录
                // givenname:this.GLOBAL.givenname,//姓名
                phoneNumber:this.GLOBAL.phone,//电话
                score:this.GLOBAL.score,//积分
                msg_unread:this.GLOBAL.msg_unread,//未读消息的条数

                popChoose:false,//是否显示弹出框
                isActive:false,//判断弹出框是显示网点信息还是车辆信息(true是网点，false是车辆)
                isMask:false,//是否显示遮罩层
                parkPoint:[],//所有网点的数据
                parkPointSelect:{},//被选中的网点数据
                distance:0,//选中网点距离用户当前位置的距离
                map:"",//地图
                zoom:15,//地图缩放级别
                zoomType:3,//地图缩放级别类型(三级展示用)
                zoomType2:2,//地图缩放级别类型(二级展示用)
                mapStyle:{//地图样式
                    width:'100%',
                    height:'100%',
                    top:'73px',
                    position:'absolute',
                    backgroundImage:'url(' + require('../assets/images/gezi.jpg') + ')'
                },
                longitude:'',//用户的坐标经度
                latitude:'',//用户的坐标纬度
                myLocation:'',//用户百度坐标格式
                //curAddressText:"",//搜索框显示的地址
                mapIndexTimer:'',
                search:[],//移动后仍在可视区域的网点数组
                allOverlay:[],//之前已经绘制的点
                newOverlay:[],//需要绘制的点

                sheetVisible:false,//选择导航的弹窗是否可见
                actions:[],//导航弹窗的选项内容及回调函数
                teltipVisible:false,//拨打电话的提示弹窗

                searchpoint:'',//搜索页传来的坐标
                listlatitude:'',//网点列表传过来的坐标
                listlongitude:'',//网点列表传过来的坐标
            }
        },
        watch:{
            'zoomType':function(){
                if(this.GLOBAL.zoom_type==3){
                    this.map.clearOverlays();
                    this.addUserMarker();
                }
            },
            'zoomType2':function(){
                if(this.GLOBAL.zoom_type==2){
                    this.map.clearOverlays();
                    this.addUserMarker();
                }
            },
        },
        mounted: function () {
            var self=this;
            //安卓硬件返回
            // pushHistory();
            // window.addEventListener("popstate", function(e) {
            //     self.$router.push({  name: 'index'});
            // }, false);
            // function pushHistory() {
            //     var state = {
            //         title: "title",
            //         url: "#"
            //     };
            //     window.history.pushState(state, "title", "#");
            // }
            self.searchpoint = self.$route.params.searchpoint;
            self.listlatitude = self.$route.params.listlatitude;
            self.listlongitude = self.$route.params.listlongitude;
            //删除条件选车的条件
            this.GLOBAL.delCookie("carmodel");
            this.GLOBAL.delCookie("carmodel_id");
            this.GLOBAL.delCookie("cartype");
            this.GLOBAL.delCookie("cartype_id");
            this.GLOBAL.delCookie("shouzi");
            this.GLOBAL.delCookie("shouzi_id");
            this.GLOBAL.delCookie("rangeValue1");
            this.GLOBAL.delCookie("rangeValue2");
            this.GLOBAL.delCookie("elect1");
            this.GLOBAL.delCookie("elect2");
            this.GLOBAL.delCookie("takeparkplace");
            this.GLOBAL.delCookie("takeparkplacename");
            this.GLOBAL.delCookie("takeparkplace_lat");
            this.GLOBAL.delCookie("takeparkplace_lon");
            this.GLOBAL.setCookie("myorderFrom","mapIndex");//设置我的订单的上一页判断
            Indicator.open();
            if(plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE){
                //初始化地图
                self.initMap();
            }
            else
            {
                self.mapIndexTimer=setInterval(this.checknetworkinfo,2000);
            }

            //从车辆详情页 返回到地图页 删除cookie里的不计免赔以及优惠套餐
            if(self.GLOBAL.getCookie("mianpei_value1")){
                self.GLOBAL.delCookie("mianpei_value1")
            }
            if(self.GLOBAL.getCookie("selectDiscount")){
                self.GLOBAL.delCookie("selectDiscount")
            }
        },
        methods: {
            selectAddress(){
                var self = this;
                self.GLOBAL.from = "mapIndex"
                self.$router.push({ name: 'mapSearch'});
            },
            checknetworkinfo:function() {
                if(plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE){
                    clearInterval(this.mapIndexTimer);
                    this.initMap();
                }
            },
            //刷新地图
            refresh:function(){
                this.map.clearOverlays();
                this.addUserMarker();
                this.get_lists();
            },
            //点击遮罩层隐藏车场详情的弹出框
            closeMask:function(){
                var self=this;
                self.isMask=false;
                self.popChoose=false;
                self.isActive=false;
                self.popCharge = false;
            },
            //查看网点信息点击网点信息
            choosePark:function(){
                var self=this;
                self.isActive=true;
            },
            //查看网点信息点击车辆信息
            chooseCar:function(){
                var self=this;
                self.isActive=false;
            },
            // 地图初始化
            initMap:function(){
                var self=this;
                //self.mapStyle.height=(window.innerHeight-73)+'px';
                console.log("window.innerHeight:"+window.innerHeight);
                console.log("地图高度为："+self.mapStyle.height);
                self.map = new BMap.Map("allmap");

                plus.geolocation.getCurrentPosition(function(p){
                    console.log('papahaha: ' + JSON.stringify(p));
                    if(p.coords.latitude<=1 || p.coords.longitude<=1){
                        self.latitude=self.GLOBAL.cur_position.latitude= 31.499056 ;
                        self.longitude=self.GLOBAL.cur_position.longitude =120.319158;
                        plus.nativeUI.alert( '无法获取定位，请打开网络或GPS定位', function(){
                        }, "定位失败", "确定" );
                    }
                    else{
                        self.latitude=self.GLOBAL.cur_position.latitude= p.coords.latitude ;
                        self.longitude=self.GLOBAL.cur_position.longitude = p.coords.longitude;
                    }

                    //如果从搜索地图页面携带了定位坐标过来，就设定位坐标为中心点
                    //如果从网点列表页传过来定位坐标，就设定位坐标为中心点
                    console.log("检索地点是:"+JSON.stringify(self.searchpoint));
                    if(self.searchpoint != ''&& self.searchpoint!=null && self.searchpoint!=undefined ){

                        console.log("检索地点是:"+self.searchpoint.longitude+","+self.searchpoint.latitude);
                        self.myLocationPoint= new BMap.Point(self.searchpoint.longitude, self.searchpoint.latitude);
                        self.addUserMarker();

                    }else if(self.listlatitude != ''&& self.listlatitude!=null && self.listlatitude!=undefined){

                        console.log("选中的网点列表中的:"+self.listlongitude+","+self.listlatitude);
                        self.myLocationPoint= new BMap.Point(self.listlongitude, self.listlatitude);

                    }else{

                        self.myLocationPoint= new BMap.Point(self.longitude, self.latitude);
                        self.addUserMarker();
                    }
                   
                    self.map.centerAndZoom(self.myLocationPoint, 15);
                    self.map.enableScrollWheelZoom(true);
                    //创建自己当前位置的标注
                    
                    //请求当前地图可视范围内的网点信息并添加标注到地图
                    setTimeout(function(){
                        self.get_lists();
                    },500);
                    //根据起点坐标解析出地址填入底部搜索框内
                    //self.pointToAddress();

                    //在地图拖动结束后根据当前地图中间点，请求当前地图可视范围内的网点信息,并解析出起点位置放在底部搜索框内
                    self.map.addEventListener("touchend", function(){
                        self.zoom=self.map.getZoom();
                        if(self.zoom<=9){
                            self.zoomType=1;//城市
                            self.zoomType2=1;//城市
                        }else if(self.zoom>=15){
                            self.zoomType=3;//网点
                            self.zoomType2=2;//网点
                        }else{
                            self.zoomType=2;//车区
                            self.zoomType2=2;//车区
                        }
                        self.get_lists();
                        //self.pointToAddress();
                    })

                }, function(e){
                    plus.nativeUI.alert( '无法获取定位，请打开网络或GPS定位', function(){

                    }, "定位失败", "确定" );
                } ,{provider:'baidu',coordsType:'bd09ll'});
            },
            // 给定位标注绑定点击定位功能
            reLocate:function(){
                var self=this;
                plus.geolocation.getCurrentPosition(function(p){
                     console.log('Geolocation info: ' + JSON.stringify(p));
                     if(p.coords.latitude<=1||p.coords.longitude<=1){
                         self.latitude=self.GLOBAL.cur_position.latitude= 31.499056 ;
                         self.longitude=self.GLOBAL.cur_position.longitude =120.319158;
                         plus.nativeUI.alert( '无法获取定位，请打开网络或GPS定位', function(){
                         }, "定位失败", "确定" );
                     }
                     else{
                         self.latitude=self.GLOBAL.cur_position.latitude= p.coords.latitude ;
                         self.longitude=self.GLOBAL.cur_position.longitude = p.coords.longitude;
                     }

                     self.myLocationPoint= new BMap.Point(self.longitude, self.latitude);
                     self.map.centerAndZoom(self.myLocationPoint, 15);
                     //创建自己当前位置的标注
                     self.addUserMarker();
                     //请求当前地图可视范围内的网点信息并添加标注到地图
                     self.zoom=self.map.getZoom();
                     if(self.zoom<=9){
                         self.zoomType=1;//城市
                     }else if(self.zoom>=15){
                         self.zoomType=3;//网点
                     }else{
                         self.zoomType=2;//车区
                     }
                     self.get_lists();
                     //根据起点坐标解析出地址填入底部搜索框内
                     //self.pointToAddress();

                 }, function(e){
                     plus.nativeUI.alert( '无法获取定位，请打开网络或GPS定位', function(){

                     }, "定位失败", "确定" );
                 } ,{provider:'baidu',coordsType:'bd09ll'});

            },
            // 附近商家
            goNear:function(url,id,address){
                this.$router.push({  name: url,params:{id:id,address:address}});
            },
            //拨打客服电话
            telContact(){
                var self = this;
                self.teltipVisible = true;
            },
            closeTelContact(){
                var self = this;
                self.teltipVisible = false;
            },
            //H5获取当前IP地址的坐标
            getLocation:function(){
                var self=this;
                if (navigator.geolocation){
                  var opts={
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 1000
                  };
                  navigator.geolocation.getCurrentPosition(self.getLocationSuccess,self.getLocationError,opts);
                }
                else
                {
                  //获取不到当前经纬度则提示
                  alert('获取不到你的经纬度信息，请打开GPS定位');
                }
            },
            //获取ip地址成功的回调函数
            getLocationSuccess:function(position){
              var self=this;
              self.GLOBAL.cur_position.latitude=position.coords.latitude;
              self.GLOBAL.cur_position.longitude=position.coords.longitude;
            },
            //获取ip地址失败的回调函数
            getLocationError:function (err){
                console.log(err.message);
            },
            //扫一扫
            startScan:function(){
                this.$router.push({  name: 'qrcode'});
            },
            //侧滑菜单打开关闭
            toggle:function (flag) {
                this.open = !this.open;
                this.docked = !flag;
            },
            //请求当前地图可视范围内的网点信息并添加标注到地图
            get_lists:function(){
                var self=this;
                setTimeout(function(){
                    var bounds = self.map.getBounds();
                    var sw = bounds.getSouthWest();//西南
                    var ne = bounds.getNorthEast();//东北
                    console.log('西南坐标'+JSON.stringify(sw));
                    console.log('东北坐标'+JSON.stringify(ne));
                    console.log('缩放级别'+self.zoom);
                    var lt_latitude=ne.lat;
                    var lt_longitude=sw.lng;
                    var rb_latitude=sw.lat;
                    var rb_longitude=ne.lng;
                    //获取当前地图上的坐标点
                    self.allOverlay=self.map.getOverlays();
                    self.newOverlay=[].concat(self.allOverlay);
                    //删除之前标注的在移动后不在可视区域的坐标点
                    var j=0;
                    for (var i = 0; i < self.allOverlay.length; i++){
                        if(self.allOverlay[i].toString()=="[object Marker]"){
                            var marketpoint = self.allOverlay[i].getPosition(); //获取marker的位置
                            // console.log("marker位置" + marketpoint.lng + "," +marketpoint.lat);
                            if(marketpoint.lng<lt_longitude|| marketpoint.lng>rb_longitude||marketpoint.lat<rb_latitude|| marketpoint.lat>lt_latitude){
                                //移除不在可视区域的点
                                console.log('移除不在可视区域的点'+marketpoint);
                                self.map.removeOverlay(self.allOverlay[i]);
                                //移除数据中不在可视区域的点
                                self.newOverlay.splice(i-j,1);
                                j++;
                            }
                        }
                    }
                    self.search=[];
                    //保存移动后仍在可视区域的网点为一个数组
                    for(var i = 0; i < self.newOverlay.length; i++ ){
                        if(self.newOverlay[i].toString()=="[object Marker]"){
                            var marketpoint2 = self.newOverlay[i].getPosition(); //获取marker的位置
                            self.search.push(marketpoint2.lat+'---'+marketpoint2.lng);
                        }
                    }
                    console.log('lt_latitude:'+lt_latitude);
                    console.log('lt_longitude:'+lt_longitude);
                    console.log('rb_latitude:'+rb_latitude);
                    console.log('rb_longitude:'+rb_longitude);
                    console.log('zoom:'+self.zoom);
                    console.log('profileid'+self.GLOBAL.profileid);
                    self.$http.post(self.GLOBAL.AdminDomain+'/api/f2c/getParkCarInfos.php',
                        {lt_latitude:lt_latitude,lt_longitude:lt_longitude,rb_latitude:rb_latitude,rb_longitude:rb_longitude,zoom:self.zoom,profileid:self.GLOBAL.profileid},
                        {emulateJSON:true,_timeout:5000,
                          onTimeout: (request) => {
                                Indicator.close();
                                MessageBox.alert('请求超时，请检查您的网络', '提示');
                           }
                        }
                    ).then((res) => {
                        Indicator.close();
                        var json=res.body;
                        console.log('getParkCarInfos.php'+JSON.stringify(json));
                        if(json.statusCode=='200'){
                            self.parkPoint=json.data;
                            self.addCarMarker();
                        }
                        if(json.statusCode=='301'){
                          Toast({
                              message: json.msg,
                              position: 'middle',
                              duration: 3000
                          });
                        }
                    })
                },500);
            },
            //添加网点的标注并绑定点击显示网点信息的弹框事件
            addCarMarker:function() {
                var self=this;
                for(var i in self.parkPoint){
                    var p=self.parkPoint[i];
                    var pstr=p.latitude+'---'+p.longitude;
                    if(self.search.indexOf(pstr)>=0){
                        console.log("不需绘制的重复点："+JSON.stringify(self.parkPoint[i]));
                    }
                    else{
                        //向地图上面添加点
                        console.log("需要的新画点："+JSON.stringify(self.parkPoint[i]));
                        (function(i) {
                            var parkPoint = new BMap.Point(self.parkPoint[i].longitude, self.parkPoint[i].latitude);
                            // var parkIcon = new BMap.Icon(require(`../assets/park4can.png`), new BMap.Size(50,58));
                            if(self.zoom>=15||(self.GLOBAL.zoom_type==2&&self.zoom>=10)){
                                var parkIcon = new BMap.Icon(self.parkPoint[i].icon_url, new BMap.Size(40,48));
                            }else{
                                var parkIcon = new BMap.Icon(self.parkPoint[i].icon_url, new BMap.Size(40,48));
                            }
                            
                            var parkMarker = new BMap.Marker(parkPoint,{icon:parkIcon});
                            parkMarker.setTop(true);
                            self.map.addOverlay(parkMarker);

                            parkMarker.addEventListener("click", function(){
                                if(self.zoom>=15){
                                    self.showPark(i);
                                }else if(self.zoom<10){
                                    self.map.centerAndZoom(new BMap.Point(self.parkPoint[i].longitude, self.parkPoint[i].latitude),10);
                                }else{
                                    self.map.centerAndZoom(new BMap.Point(self.parkPoint[i].longitude, self.parkPoint[i].latitude),15);
                                }
                            });
                        })(i);
                    }
                }
            },
            //点击搜索离用户最近的网点
            locateNear:function(){
                var self=this;

                self.$http.post(self.GLOBAL.AdminDomain+'/api/f2c/getNearParkplace.php',
                    {latitude:self.latitude,longitude:self.longitude,profileid:self.GLOBAL.profileid},
                    {emulateJSON:true,_timeout:5000,
                      onTimeout: (request) => {
                           MessageBox.alert('请求超时，请检查您的网络', '提示');
                       }
                    }
                ).then((res) => {
                    var json=res.body;
                    console.log('getNearParkplace.php'+self.latitude+","+self.longitude);
                    console.log('getNearParkplace.php'+JSON.stringify(json));
                    if(json.statusCode=='200'){
                        self.parkPoint=json.data;
                        for(var i in self.parkPoint){
                            (function(i) {
                                var minparkPoint = new BMap.Point(self.parkPoint[i].longitude, self.parkPoint[i].latitude);
                                self.map.centerAndZoom(minparkPoint, 15);
                                self.showPark(i);
                            })(i);
                        }
                    }
                    if(json.statusCode=='301'){
                      Toast({
                          message: json.msg,
                          position: 'middle',
                          duration: 3000
                      });
                    }
                })

            },
            //点击某个网点显示对应网点的详情并计算该网点与用户的距离（是否需改为距起点距离？？）
            showPark:function(i){
                this.parkPointSelect={};
                this.parkPointSelect=this.parkPoint[i];
                console.log("附近的网点信息："+JSON.stringify(this.parkPointSelect));

                var point1 = new BMap.Point(this.parkPoint[i].longitude,this.parkPoint[i].latitude);
                var point2 = new BMap.Point(this.longitude,this.latitude);
                this.distance = parseFloat(this.map.getDistance(point1,point2)/1000).toFixed(2);

                this.isMask=true;
                this.popChoose=true;
            },
            //点击某辆车到车辆详情
            tovehicleParticulars:function(id){
                this.GLOBAL.setCookie("carid",id);
                this.$router.push({  name: 'vehicleParticulars'});
            },
            //添加用户位置的标注
            addUserMarker:function(){
                var self=this;
                var myLocationIcon = new BMap.Icon(require(`../assets/myLocation3.svg`), new BMap.Size(40,80));
                var myLocationMarker = new BMap.Marker(self.myLocationPoint,{icon:myLocationIcon});
                self.map.addOverlay(myLocationMarker);
            },
            //根据当前起点位置解析出地址填入底部搜素框
            /*pointToAddress:function(){
                var self=this;
                var cp = self.map.getCenter();
                var gc = new BMap.Geocoder();
                gc.getLocation(cp, function(rs) {
                    var addComp = rs.addressComponents;
                    var address=addComp.province+addComp.city + addComp.district
                        + addComp.street + addComp.streetNumber;
                    self.curAddressText=address;
                });
            },*/
            //根据搜索框的地址重新初始化地图并创建用户和网点标注
            /*addressToPoint:function(){
                var self=this;
                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();
                // 将地址解析结果显示在地图上，并调整地图视野
                myGeo.getPoint(self.curAddressText, function(point){
                    if (point) {
                        self.map.centerAndZoom(point, 15);
                        self.addUserMarker();
                        self.get_lists();
                        Toast({
                          message: '定位成功',
                          position: 'middle',
                          duration: 500
                      });
                    }else{
                        Toast({
                          message: '定位失败',
                          position: 'middle',
                          duration: 500
                      });
                    }
                 },
                "无锡市");
            },*/
            //百度坐标转WGS-84坐标
            bd09towgs:function(baidu_lat,baidu_lng){
                //BD-09 to GCJ-02先将百度坐标转成中国坐标
                var tmp = GPS.bd_decrypt(parseFloat(baidu_lat),parseFloat(baidu_lng));
                //GCJ-02 to WGS-84再将中国坐标转成GPS坐标
                var dstarr = GPS.gcj_decrypt_exact(tmp['lat'],tmp['lon']);
                return dstarr;
            },
            //百度坐标转火星坐标
            bd09togcj:function(baidu_lat,baidu_lng){
                //BD-09 to GCJ-02先将百度坐标转成中国坐标
                var tmp = GPS.bd_decrypt(parseFloat(baidu_lat),parseFloat(baidu_lng));
                return tmp;
            },
            //导航
            navigator:function(){
                var self=this;
                console.log('设备名称'+plus.os.name);
                self.actions=[];
                // 设置目标位置坐标点和起始位置坐标点，目的地为网点
                var dst_wgs=self.bd09towgs(self.parkPointSelect.latitude,self.parkPointSelect.longitude);
                var dst = new plus.maps.Point(dst_wgs['lon'],dst_wgs['lat']);

                var dst_gcj=self.bd09togcj(self.parkPointSelect.latitude,self.parkPointSelect.longitude);
                var dst2 = new plus.maps.Point(dst_gcj['lon'],dst_gcj['lat']);

                var dst_detail=self.parkPointSelect.district;
                console.log('取车网点:'+dst_wgs['lon']+'--'+dst_wgs['lat']);


                //始发地--需设置为用户坐标
                var src_wgs=self.bd09towgs(self.latitude,self.longitude);
                var src = new plus.maps.Point(src_wgs['lon'],src_wgs['lat']);

                var src_gcj=self.bd09togcj(self.latitude,self.longitude);
                var src2 = new plus.maps.Point(src_gcj['lon'],src_gcj['lat']);

                console.log('用户坐标:'+src_wgs['lon']+'--'+src_wgs['lat']);

                // 调用系统地图显示
                if(plus.os.name=="iOS"){
                    self.showNavigator();
                }else{
                    plus.maps.openSysMap( dst, dst_detail, src );
                }
            },
            //展示导航选择弹框
            showNavigator:function(){
                var self=this;
                function obj(name,method) {
                    this.name=name;
                    this.method=method;
                }

                if(self.judgeExists('com.baidu.BaiduMap','baidumap://')) {
                    self.actions.push(new obj("百度地图",self.openAppBaidu));
                }
                if(self.judgeExists('com.autonavi.minimap','iosamap://')) {
                    self.actions.push(new obj("高德地图",self.openAppGaode));
                }
                self.actions.push(new obj("苹果地图",self.openAppIos));

                self.sheetVisible=true;

            },
            //打开百度导航
            openAppBaidu:function(){
                var self=this;
                window.location.href="baidumap://map/direction?origin="+self.latitude+","+self.longitude+"&destination="+self.parkPointSelect.latitude+","+self.parkPointSelect.longitude+"&mode=driving&src=webapp.navi.yourCompanyName.yourAppName" ;
            },
            //打开高德导航
            openAppGaode:function(){
                var self=this;
                // 设置目标位置坐标点和起始位置坐标点，目的地为网点
                var dst_gcj=self.bd09togcj(self.parkPointSelect.latitude,self.parkPointSelect.longitude);

                var dst_detail=self.parkPointSelect.district;

                //始发地--需设置为用户坐标
                var src_gcj=self.bd09togcj(self.latitude,self.longitude);

                window.location.href="iosamap://path?sourceApplication=applicationName&sid=BGVIS1&slat="+src_gcj['lat']+"&slon="+src_gcj['lon']+"&sname=我的位置&did=BGVIS2&dlat="+dst_gcj['lat']+"&dlon="+dst_gcj['lon']+"&dname="+dst_detail+"&dev=0&t=0" ;
            },
            //打开苹果导航
            openAppIos:function(){
                var self=this;
                // 设置目标位置坐标点和起始位置坐标点，目的地为网点
                var dst_gcj=self.bd09togcj(self.parkPointSelect.latitude,self.parkPointSelect.longitude);
                var dst2 = new plus.maps.Point(dst_gcj['lon'],dst_gcj['lat']);

                var dst_detail=self.parkPointSelect.district;

                //始发地--需设置为用户坐标
                var src_gcj=self.bd09togcj(self.latitude,self.longitude);
                var src2 = new plus.maps.Point(src_gcj['lon'],src_gcj['lat']);

                plus.maps.openSysMap( dst2, dst_detail, src2);
            },
            //判断客户端是否安装
            judgeExists: function(packageName,urlTypes) {
                if(plus.os.name=="iOS"){
                    var UIApplication = plus.ios.importClass("UIApplication");
                    var NSURL = plus.ios.importClass("NSURL");
                    var app = UIApplication.sharedApplication();
                    var bdScheme = NSURL.URLWithString(urlTypes);
                    var install = app.canOpenURL(bdScheme);
                    plus.ios.deleteObject(bdScheme);
                    plus.ios.deleteObject(app);
                    return install;
                }else{
                    try {
                        var main = plus.android.runtimeMainActivity();
                        var packageManager = main.getPackageManager();
                        var PackageManager = plus.android.importClass(packageManager);
                        var packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
                        if(packageInfo) {
                            //已安装
                            return true;
                        } else {
                            //未安装
                            return false;
                        }
                    } catch(e) {
                        //未安装
                        return false;
                    }
                }
            },
        }
    }
</script>
