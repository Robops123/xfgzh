<template>
	<view>
		<view>
			<view class="list"  >
				<view class="title">
					<text>{{data.ownerName}}</text>
					<fa-icon class="fr" type="file-video-o" color="#327BF8" ></fa-icon>
				</view>
				<view class="brief">
					<view id="liquidFill"></view>
					<view class="cgray">
						<view>
							<image src="../../static/img/device/locationg.png" mode="" style="vertical-align: middle;"></image>
							<text>{{data.ownerAddress}}</text>
						</view>
						<view>
							<text class="type-name">联系人：</text>
							<text>{{data.chargeUser}}</text>
							<text class="fr">{{data.chargeUserConn}}</text>
						</view>
						<view>
							<text class="type-name">建筑数量：</text>
							<text>{{data.buildCount}}</text>
						</view>
						<view>
							<text class="type-name">消防等级：</text>
							<text>{{data.ownerRegulatorName}}</text>
						</view>
						
					</view>
				</view>
				<view class="operate">
					<view class="cblue" @click="promptVisible2=true">督办</view>
					<view class="cblue" @click="promptVisible=true">查岗</view>
				</view>
			</view>
			
			
			<view :class="{'my-tabs':true}">
				<view  :class="{'tab-item':true,'active':curIndex==0}" @tap="tap(0)" style="border-radius: 90upx 0 0 90upx;">
					<text >接入设备</text>
				</view>
				<view  :class="{'tab-item':true,'active':curIndex==1}" @tap="tap(1)">
					<text >告警</text>
				</view>
				<view  :class="{'tab-item':true,'active':curIndex==2}" @tap="tap(2)" style="border-radius: 0 90upx 90upx 0;">
					<text >巡检</text>
				</view>
			</view>
			
			
			<!-- 介入设备 -->
			<scroll-view scroll-y="true" >
				<view v-if="curIndex==0">
					<view class="my-device" v-for="(item,index) in dataList" :key='index'>
						<view class="device-top">
							<text>{{item.devName}}</text>
							<text class="status offline" :class="{online:item.devState==1}">{{item.devState==0 ? '离线':'在线'}}</text>
							
						</view>
						<view class="device-main">
							<view class="device-main-left">
								<image src="../../static/img/cameraIcoOffline.png" mode=""></image>
							</view>
							<view class="device-main-right">
								<view>{{item.typeName}}</view>
								<view :class="{cwarning:item.isWarn==1}">{{item.isWarn==0 ? '无告警':'告警'}}</view>
								<view>共享人数:{{item.shareCount}}</view>
							</view>
						</view>
						<view class="device-bottom">
							<text class=" cblue" @click="toDetail(item.devId,1)">查看详情</text>
						</view>
					</view>
				</view>
				
				
				<!-- 告警 -->
				<view v-if="curIndex==1">
					<view class="list"    v-for="(item,index) in dataList" :key="index" >
					  <view class="status-word finish" v-if="item.status==0">已解除</view>
					   <view class="status-word progress" v-if="item.status==2">已确认</view>
					    <view class="status-word finish" v-if="item.status==3">误报</view>
						<view class="title">
							{{item.title}}
						</view>
						<view class="coffline describe">OA就搜到</view>
						<view class="brief2 brief">
								<image src="../../static/img/device/location.png" mode=""></image>
							<view>
								<view class="address cblue">{{item.devLocation}}</view>
								<view class="date coffline">{{item.updateTime}}
								<text class="fr warn">已延期一天3小时</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 巡检 -->
				<view v-if="curIndex==2">
					<view class="list"    v-for="(item,index) in dataList" :key="index" @click='previewFile(item.missionId)'>
					 <view class="status-word finish" v-if="item.hasTrouble==0">无隐患</view>
					 <view class="status-word problem" v-else>有隐患</view>
						<view class="title">
							{{item.missionStartTime}} - {{item.missionEndTime}}
						</view>
						<view class="coffline describe">巡检人:{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		
		<!-- 查岗 -->
		<prompt :visible.sync="promptVisible" title='查岗下发' class="prompt2"  @confirm="clickPromptConfirm" mainColor="#e74a39">
		  <!-- 这里放入slot内容-->
		 <view>查岗问题</view>
		 <input type="text" class="input" value="" v-model="question" placeholder=""/>
		 <view>答案</view>
		 <input type="text" class="input" value="" v-model="answer" placeholder=""/>
		</prompt>
		
		
		<!-- 督办 -->
		<prompt :visible.sync="promptVisible2" title='督办下发' class="prompt2"  @confirm="clickPromptConfirm2" mainColor="#e74a39">
		  <!-- 这里放入slot内容-->
		 <view>督办标题</view>
		 <input type="text" class="input" value="" v-model="title" placeholder=""/>
		 <view>督办内容</view>
		 <textarea value="" placeholder="" class="input" v-model="content"/>
		</prompt>
		
		
	</view>
</template>

<script>
	import echartsLiquidfill from 'echarts-liquidfill'
	import faIcon from '@/components/fa-icon/fa-icon.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import Prompt from '@/components/zz-prompt/index.vue'
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default{
		components:{
			faIcon,
			uniLoadMore,
			Prompt
		},
		data(){
			return{
				showFilePreview:false,
				fileSrc:'',
				question:'',answer:'',title:'',content:'',
				promptVisible:false,
				promptVisible2:false,
				tenantId:'',
				url:'/tob/owner/deviceList',
				data:'',
				curIndex:0,
				sh:'',
				dataList:[],
				page:1,
				pageSize:10,
				total:0,
				more:'',
			}
		},
		computed: {
		     noMore () {
		       return this.dataList.length >= this.total
		     },
		   },
		onLoad(p){
			var that=this
			this.tenantId=p.id
			this.getDetail()
			this.getList(this.page)
		},
		onReachBottom(){
			if(this.noMore){
								this.more='noMore'
								return;
							}
							var that=this
							this.more='loading'
			// setTimeout(function(){
							  that.page++
							  that.getList(that.page)
			// },2000)
		},
		methods:{
			tap(index){
				this.curIndex=index
				if(index==0){
					 this.url='/tob/owner/deviceList'
				}else if(index==1){
					this.url='/tob/owner/warnList'
				}else if(index==2){
					this.url='/tob/owner/inspection'
				}
				this.reset()
				this.getList(this.page)
			},
			reset(){
				this.page=1
				this.total=0
				this.dataList=[]
				this.more=''
			},
			getList(p){
				console.log('p')
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					tenantId:this.tenantId,
					page:p,
					count:5
				},that=this
				request.apiGet(this.url,param).then((res) =>{
					if(res.code == '0'){
						that.dataList=res.data
						that.total=res.total
						// that.getDevState()
						global.hideLoading()
					}else{
						console.log('else')
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			// 业主详情
			getDetail(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					tenantId:this.tenantId,
				},that=this
				request.apiGet('/tob/owner/info',param).then((res) =>{
					if(res.code == '0'){
						// that.markers=res.data
						that.data=res.data
						that.liquidFill(data.safeScore); 
						global.hideLoading()
					}else{
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			// 查岗
			clickPromptConfirm(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					tenantId:this.tenantId,
					question:encodeURIComponent(this.question),
					answer:this.answer
				},that=this
				request.apiPost('/tob/owner/checkPost',param).then((res) =>{
					if(res.code == '0'){
						// that.markers=res.data
						global.showToast('下发成功')
						this.promptVisible=false
						global.hideLoading()
					}else{
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			// 督办
			clickPromptConfirm2(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					tenantId:this.tenantId,
					title:this.title,
					content:this.content
				},that=this
				request.apiPost('/tob/owner/urge',param).then((res) =>{
					if(res.code == '0'){
						// that.markers=res.data
						global.showToast('下发成功')
						this.promptVisible2=false
						global.hideLoading()
					}else{
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			liquidFill (s){//方法
			                  var arrWatter1={};
			           		arrWatter1.warterId = 'water_echarts_hd';
			           		arrWatter1.data=[
			           			{"newdata":"5555","toldata":"10000"}
			           		];	
			            
			            
			               var myChart = this.$echarts.init(document.getElementById('liquidFill'));
			           		var value = s;//水滴中间显示的数据
			           		var toldata = 100;//该水滴的总数据
			           		var num = parseFloat(value/toldata);
			           		var data = [];
			           			data.push(num);
			           	var	option = {
			           			series: [{
			           				type: 'liquidFill',
			           				data: data,
			           				radius: '80%',
			           				center: ['50%', '50%'],//所在位置
			           				 // shape: 'pin'气球效果 ;'roundRect'方形效果;'diamond',菱形效果
			           				backgroundStyle: {
			           					// borderWidth: 10,//内边框粗细
			           					// borderColor: 'red',//内边框颜色
			           					color: '#fff'//底色
			           				},
			           				itemStyle: {
			           					normal: {
			           						color: '#18a0d9'
			           					}
			           				},
			           				label: {
			           				            position: ['50%', '50%'],
			           				            formatter: function() {
			           				                return value+'\n 安全指数';
			           				            },
			           				            fontSize: 12,
			           				            color: '#fff'
			           				        },
			           				outline: {
			           					show: false//边框
			           				}
			           				// waveAnimation: false, // 禁止左右波动
			           			}]
			           		};
			           		myChart.setOption(option);
			       },
				   previewFile(id){
					   uni.navigateTo({
					   	url:'./filePreview?inspectionId='+id
					   })
				   },
				   toDetail(id,type){
					   uni.navigateTo({
					   	url:"/pages/adddevice/devicedetail?id="+id+'&type='+type
					   })
				   }
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f2f2f2;
	}
	.list{
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		position: relative;
		touch-callout: none;
		margin:  20upx;
		padding: 20upx;
	}
	.list .title>text{
		max-width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.list .status{
		position: absolute;
		right: 15upx;
		top: 0;
		width: 90upx;
		height: 90upx;
	}
	.brief{
		padding-top: 0 !important;
	}
	.brief>view{
		display: inline-block;
		vertical-align: top;
		
	}
	.brief2>view{
		width: 580upx;
	}
	.brief image{
		width: 60upx !important;
		height: 60upx !important;
		margin-right: 20upx;
	}
	.brief .address{
		font-size: 32upx;
	}
	.brief .type-name{
		display: inline-block;
		width: 160upx;
		text-align: right;
	}
	.operate{
		display: flex;
		justify-content: space-evenly;
		padding: 20upx 0 0;
		border-top: 1px solid #f2f2f2;
	}
	.operate>view{
		padding:0 40upx;
		border-radius: 40upx;
		border: 1px solid #0092fe;
	}
	#liquidFill{
		width: 200upx;
		height: 200upx;
	}
	
	
	.my-tabs {
		background-color: #ffffff;
		height: 88upx;
		font-size: 28upx;
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		/* border-top: 2upx solid #dddddd; */
		/* border-bottom: 2upx solid #dddddd; */
		/* min-width: 100%; */
		width: 80%;
		margin: 20upx auto;
		border-radius: 90upx;
		overflow-x: auto;
		
		.tab-item{
			box-sizing: border-box;
			width: 33%;
			line-height: 48upx;
			padding: 20upx 0;
			min-width: 100upx;
			display: flex;
			justify-content: center;
		}
		.tab-item.active{
			position: relative;
			background-color: #2a95f0;
			color: #fff;
		}
		.tab-item.active::after{
			content: "";
			position: absolute;
			bottom: 0;
			left:50%;
			transform: translateX(-50%);
			width: 100%;
			border-bottom: 4upx solid #3682FF;
			/* animation: test ease 1 1.5s; */
		}
	}
	.my-tabs.space-between{
		justify-content: space-between;
	}
	
	.status-word{
		position: absolute;
		right: 0;
		top: 20upx;
		padding: 0 5upx 0 20upx  ;
		border-radius: 40upx 0 0 40upx;
		color: #fff;
	}
	.describe{
		margin-top: 20upx;
		height: 58upx;
		overflow:hidden;//一定要写
		white-space: nowrap;
		    text-overflow: ellipsis;//超出省略号
		    display:-webkit-box;//一定要写
		    -webkit-line-clamp: 2;//控制行数
		    -webkit-box-orient: vertical;//一定要写
	}
	.progress{
		background-color: #54b7e4;
	}
	.finish{
		background-color: #847d7a;
	}
	.problem{
		background-color: #e74c13;
	}
	.warn{
		color: #EA7A19;
	}
	
	
	.my-device{
		display: inline-block;
		background-color: #fff;
		width: 46%;
		margin: 20upx 1% 0 2%;
		border-radius: 8px;
	}
	.device-top{
		padding: 15upx 0;
		border-bottom: 1px solid #333;
	}
	.device-main{
		padding: 20upx;
		box-sizing: border-box;
	}
	.device-main-left{
		width: 45%;
	}
	.device-main-right{
		width: 55%;
	}
	.device-main-right{
		line-height: 1.5;
	}
	.device-main-left,
	.device-main-right{
		display: inline-block;
		vertical-align: middle;
	}
	.device-main-left image{
		width: 60upx;
		height: 60upx;
	}
	.device-container{
		padding-bottom: 30upx;
	}
	.device-bottom{
		color: #2794F0;
		text-align: center;
		padding: 15upx 0;
		border-top: 1px solid #333;
		font-size: 30upx;
	}
	.status.online{
		border: 1px solid #6BBD8F !important;
		color: #6BBD8F !important;
	}
	.status.offline{
		border: 1px solid #999999;
		color: #999999;
		margin-left: 20upx;
	}
	.input{
		margin: 20upx 0;
		padding: 15upx 0;
		font-size: 28upx;
		width: 85%;
		border: 1px solid #f2f2f2;
	}
	
	
	
	
	.file-preview{
		    position: fixed;
		    left: 0;
		    top: 0;
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: flex;
		    -webkit-box-pack: center;
		    -webkit-justify-content: center;
		    justify-content: center;
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    align-items: center;
		    width: 100%;
		    height: 100vh;
		    background: rgba(0, 0, 0, .2);
		    -webkit-transition: opacity .2s linear;
		    transition: opacity .2s linear;
	}
	file-preview-content{
		    position: relative;
		    display: -webkit-box;
		    display: -webkit-flex;
		    display: flex;
		    -webkit-box-orient: vertical;
		    -webkit-box-direction: normal;
		    -webkit-flex-direction: column;
		    flex-direction: column;
		    -webkit-box-pack: justify;
		    -webkit-justify-content: space-between;
		    justify-content: space-between;
		    -webkit-box-align: center;
		    -webkit-align-items: center;
		    align-items: center;
		    width: 80%;
		    min-height: 150px;
			max-height: 60%;
		    background: white;
		    border-radius: 10px;
		    /* overflow: hidden; */
		    z-index: 9999;
	}
</style>
