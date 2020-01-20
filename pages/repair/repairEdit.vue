<template>
	<view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">联系人：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.contact" placeholder="联系人" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">联系电话：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.phone" placeholder="联系电话" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备所在地址：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.address" placeholder="选择设备所在地址: " 
				placeholder-class="placeholder"  disabled/>
			</view>
			
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备IMEI号：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" disabled v-model="form.imei" placeholder="设备IMEI号" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">故障描述：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.remark" placeholder="故障描述" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">购买日期：</text>
			</view>
			<!-- <view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="remark" placeholder="购买日期" placeholder-class="placeholder" />
			</view> -->
			<view class="yt-list-cell desc-cell">
				<dyDatePicker placeholder="购买日期" v-model='form.buyDate' ref='datePicker'></dyDatePicker>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">购买商家：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.buyCom" placeholder="购买商家" placeholder-class="placeholder" />
			</view>
		</view>
		<button class="add-btn" @click="submit">报修提交</button>
		
	</view>
</template>

<script>
	import dyDatePicker from '../../components/dy-Date/dy-Date.vue'
	import {handleSignClick,setSignInfo,addSignInfo,getSignInfo,delSignInfo,getInfo , key} from "./index.js"
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	
	export default {
		components: {
			dyDatePicker
		},
		data() {
			return {	
				from_minSelect: '1900/01/01',
				from_maxSelect: '2050/12/31',
				to_minSelect: '1900/01/01',
				to_maxSelect: '2050/12/31',
				from: '',
				to: '',
				index:0,
				address:"选择位置",
				form:{
					devId:'',
					baiduLongitude:'',
					baiduLatitude:'',
					contact:'',
					phone:'',
					address:'',
					imei:'',
					remark:'',
					buyTime:'',
					buyCompany:''
				}
			}
		},
		onLoad(p){
			var params=JSON.parse(p.item)
			console.log(params)
			this.index=p.index
			this.form.devId=params.devId
			this.form.address=params.devLocation
			this.form.imei=params.imei
			this.form.baiduLongitude=params.baiduLongitude
			this.form.baiduLatitude=params.baiduLatitude
			this.form.buyCom=params.buyCom
			this.form.buyDate=params.buyDate
		},
		methods: {
			submit: function() {
				// uni.switchTab({
				// 	url:"/pages/index/index"
				// })
				var that=this
				this.form.buyTime=this.$refs.datePicker.date
				// if(this.check().pass){
					global.showLoading()
					request.apiPost('/toc/deviceRepair/repair',this.form).then((res) =>{
						if(res.code == '0'){
							global.showToast('提交报修成功')
							uni.$emit('update',that.index)
							 setTimeout(function(){
								uni.navigateBack()
							},1000)
							global.hideLoading()
						}else{
							global.hideLoading()
							global.showToast(res.msg)
						}
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				// }
				// else{
				// 	global.showToast(this.check().msg)
				// }
			},
			getFromData(time) {
				this.to_minSelect = time
				this.from = time
			},
			
			// 选择地址
			openLocation(){
				var that = this;
				uni.chooseLocation({
					success: function (res) {
						that.form.address = res.address;
						// that.signInfo.address = res.address;
						// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
						// var s = pointInsideCircle([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.r/10000);
						// that.is = s;
					}
				});
			},
			check(){
				if(this.form.contact!=''){
					var regexp=/^1[3456789]\d{9}$/
					if(regexp.test(this.form.phone)){
						if(this.form.address!=''){
							if(this.form.remark!=''){
								return {msg:'',pass:true}
							}else{
								return {msg:'请填写故障描述',pass:false}
							}
						}else{
							return {msg:'请填写设备所在地址',pass:false}
						}
					}else{
						return {msg:'请填写正确联系方式',pass:false}
					}
				}else{
					return {msg:'请填写联系人',pass:false}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background: gainsboro;
		padding-bottom: 100upx;
	}

	

	.yt-list {
		// margin-top: 16upx;
		border-bottom: 1px solid gainsboro;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: dimgray;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: #f85e52;

			&.disabled {
				color: #f85e52;
			}

			&.active {
				color: #f85e52;
			}

			&.red {
				color: #f85e52;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 160upx;
			}
		}

		.desc {
			flex: 1;
			font-size: 28upx;
			color: darkgray;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}

	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
