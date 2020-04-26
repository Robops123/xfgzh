<template>
	<view>
		<view>
			<view class="list"  >
				<view class="title">
					<text>可燃气体检测仪3发现疑似媒体谢咯大厦时间段</text>
					<fa-icon class="fr" type="file-video-o" color="#327BF8"></fa-icon>
				</view>
				<view class="brief">
					<view id="liquidFill"></view>
					<view class="cgray">
						<view>
							<image src="../../static/img/device/locationg.png" mode="" style="vertical-align: middle;"></image>
							<text>清明桥历史文化街区-游船码头</text>
						</view>
						<view>
							<text class="type-name">联系人：</text>
							<text>张XX</text>
							<text class="fr">1029327831723</text>
						</view>
						<view>
							<text class="type-name">建筑数量：</text>
							<text>23</text>
						</view>
						<view>
							<text class="type-name">消防等级：</text>
							<text>非消防安全重点单位</text>
						</view>
						
					</view>
				</view>
				<view class="operate">
					<view class="cblue">督办</view>
					<view class="cblue" >查岗</view>
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
			<view v-if="curIndex==0">
				<view class="my-device" v-for="(item,index) in 2" :key='index'>
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
						<text class=" cblue" @click="toDetail(item.devId,0)">查看详情</text>
					</view>
				</view>
			</view>
			
			
			<!-- 告警 -->
			<view v-if="curIndex==1">
				<view class="list"    v-for="(item,index) in 2" :key="index" >
				 <view class="status-word finish">已处理</view>
					<view class="title">
						可燃气体检测仪3发现疑似媒体谢咯大厦时间段
					</view>
					<view class="coffline describe">啊实打实大师到江安石大姐爱神的箭暗色调驾驶机动阿萨德奥斯迪偶家艾斯欧到江安死哦精雕机搜的窘境艾斯欧弟就欧艾斯的我OA就搜到</view>
					<view class="brief2 brief">
							<image src="../../static/img/device/location.png" mode=""></image>
						<view>
							<view class="address cblue">啥啥啥肯定会将卡仕达</view>
							<view class="date coffline">2020-04-20 12:23:11
							<text class="fr warn">已延期一天3小时</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 巡检 -->
			<view v-if="curIndex==2">
				<view class="list"    v-for="(item,index) in 2" :key="index" >
				 <view class="status-word finish">已处理</view>
					<view class="title">
						2020-04-02 12:12:12~2020-04-02 12:12:13
					</view>
					<view class="coffline describe">巡检人:阿萨德打</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import echartsLiquidfill from 'echarts-liquidfill'
	import faIcon from '@/components/fa-icon/fa-icon.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		components:{
			faIcon,
			uniLoadMore
		},
		data(){
			return{
				curIndex:0,
				sh:'',
				dataList:[],
				page:1,
				pageSize:20,
				total:0,
				more:''
			}
		},
		computed: {
		     noMore () {
		       return this.dataList.length >= this.total
		     },
		   },
		mounted(){
			var that=this
			this.liquidFill(); 
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
							  that.getList(that.page,id)
			// },2000)
		},
		methods:{
			tap(index){
				this.curIndex=index
				if(t==1){
					 
				}else{
					
				}
				this.reset()
				this.getList()
			},
			reset(){
				this.page=1
				this.total=0
				this.dataList=[]
				this.more=''
			},
			getList(p,id){
				var that=this
				// var params={
				//   page:p,
				//   pagesize: this.pageSize
				// }
				// if(this.page==1){
				// 	this.$loading()
				// }
				  // var params={
				  // 	   id:id
				  // }
				  if(this.active==1){
					  this.url2+='&cateid='+id
				  }else{
					  this.url2+='&brandid='+id
				  }
				  this.$apiPost(this.url2).then((res) =>{
					  that.dataList=that.dataList.concat(res.data)
					  that.more=''
					  // if(that.page==1){
					  // 	uni.hideLoading()
					  // }
				  })
			},
			liquidFill (){//方法
			                  var arrWatter1={};
			           		arrWatter1.warterId = 'water_echarts_hd';
			           		arrWatter1.data=[
			           			{"newdata":"5555","toldata":"10000"}
			           		];	
			            
			            
			               var myChart = this.$echarts.init(document.getElementById('liquidFill'));
			           		var value = 70;//水滴中间显示的数据
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
</style>
