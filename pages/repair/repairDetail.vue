<template>
	<view>
		<view class="list"    >
		 <image src="../../static/img/message/bx.png" mode="" class="status"></image>
			<view class="title">
				{{data.devName}}
			</view>
			<view class="coffline describe">{{data.remark}}</view>
			<view class="brief">
				<view>
					<image src="../../static/img/device/location.png" mode=""></image>
				</view>
				<view>
					<view class="address cblue">{{data.address}}</view>
					<view class="date coffline">{{data.updateTime}}</view>
				</view>
			</view>
		</view>
		
		<view class="list" >
		 <evan-steps :active="data.repairHandleList.length-1" >
		 			<evan-step v-for="(item,index) in data.repairHandleList" :key="index"
				:progress="item.handleType"	 :title="item.handleContent" :description="item.handleTime"></evan-step>
		 			<!-- <evan-step title="第二步" description="详情详情详情详情"></evan-step>
		 			<evan-step title="第三步" description="详情详情详情详情"></evan-step> -->
		 		</evan-steps>
		</view>
	</view>
</template>

<script>
	import EvanSteps from '@/components/evan-steps/evan-steps.vue'
		import EvanStep from '@/components/evan-steps/evan-step.vue'
		import request from '../../api/request.js'
		import global from '../../static/js/global.js'
	export default{
		components:{
			EvanSteps,
			EvanStep
		},
		data(){
			return {
				data:'',
				id:'',
				steps:[
					{status:'提交申请',des:'申请已提交，等待受理',date:'2020-04-15 22:08:12'},
					{status:'正式受理',des:'维保员-张三已接收工单，等待上门处理',date:'2020-04-15 22:08:13'},
					{status:'受理反馈',des:'维修已完成',date:'2020-04-15 22:08:14'},
					{status:'提交申请',des:'保修处理完成',date:'2020-04-15 22:08:15'},
				]
			}
		},
		onLoad(p){
			this.id=p.id
			this.getDetail()
		},
		methods:{
			getDetail(){
				global.showLoading()
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					repairId:this.id
				}
				request.apiGet(url,param).then((res) =>{
					if(res.code == '0'){
						that.data=res.data
						global.hideLoading()
					}
				}).catch(() =>{
					global.hideLoading()
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f2f2f2;
	}
	.list{
		position: relative;
		align-items: center;
		padding: 20upx 30upx;
		margin:  20upx;
		background: #fff;
		position: relative;
	}
	.list .title{
		max-width: 80%;
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
	.brief image{
		width: 60upx !important;
		height: 60upx !important;
	}
	.brief .address{
		font-size: 32upx;
	}
	.operate{
		display: flex;
		justify-content: space-evenly;
		padding: 20upx 0;
		border-top: 1px solid #f2f2f2;
	}
	.list .describe{
		max-width: 90%;
		margin: 10upx 0;
	}
</style>
