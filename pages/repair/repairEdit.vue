<template>
	<view>
		<view class="card">
			<view class="line border-line">
				<text><text class="cerror">*</text>联系人:</text>
				<input type="text" value="" placeholder="输入联系人姓名"/>
			</view>
			<view class="line border-line">
				<text><text class="cerror">*</text>联系电话:</text>
				<input type="text" value="" placeholder="输入电话"/>
			</view>
			<view class="line border-line">
				<text><text class="cerror">*</text>设备所在地:</text>
				<uni-combox class="input"  :candidates="candidates"  v-model="address"></uni-combox>
			</view>
			<view class="line border-line">
				<text>设备IMEI号:</text>
				<input type="text" value="23123123123123" disabled/>
			</view>
		</view>
		
		<view class="card">
			<textarea value="" placeholder="输入故障描述" />
		</view>
		
		<view style="text-align: center;">
			<button class="add-btn" @click="submit">报修提交</button>
		</view>
		
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
				address:"",
				candidates:[],
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
		background: #f2f2f2;
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
		background:rgba(63,135,255,1) !important;
		border-radius:34px !important;
		font-size: 34upx;
		margin-top: 40upx;
		color: #fff;
		width: 80%;
	}
	.card{
		padding: 20upx 20upx 0;
		background-color: #fff;
		margin: 30upx;
		border-radius: 8px;
	}
	.card .line{
		padding: 20upx 0;
	}
	.card .border-line{
		border-bottom: 1px solid #f2f2f2;
	}
	.line>text{
		display: inline-block;
		vertical-align: middle;
		width: 30%;
		text-align: right;
	}
	.line>input,
	.line>.input{
		display: inline-block;
		vertical-align: middle;
		width: 64%;
		font-size: 28upx;
		margin-left: 5%;
	}
	
	.uni-input-placeholder,
	textarea{
		font-size: 28upx;
	}
</style>
