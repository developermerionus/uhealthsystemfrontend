<template>
	<view>
		
		<view class="set-card" v-if="setCard">
			<view class="edit-info-box">
				<text class="info-name">信用卡号</text>
				<input class="uni-input info-content input-len" type="number" maxlength="30" placeholder="请输入信用卡号" v-model="formData.number" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">过期时间</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" placeholder="信用卡过期时间 如2025-01" v-model="formData.exp_date" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">CVC</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" placeholder="CVC 如353" v-model="formData.cvc" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">姓氏</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" placeholder="姓氏" v-model="formData.first_name" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">名字</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" placeholder="名字" v-model="formData.last_name" />
			</view>
			<br>
			<view class="save-item" @click="confirm(2)">
				<button type="primary">确认支付</button>
			</view>
			<br>
			<view class="save-item" @click="setCard = false">
				<button type="default">返回</button>
			</view>
		</view>
		
		<!-- 选择支付方式弹窗 -->
		<uni-popup ref="choosePaymentPopup" type="center">
			<view class="choose-payment-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">支付方式</text>
					<text class="iconfont iconclose" @click="close()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="pay-money">
						<!-- <text class="unit">{{ $lang('common.currencySymbol') }}</text> -->
						<text class="money">支付金额{{ payMoney | moneyFormat }}元</text>
					</view>

					<view class="payment-item" v-if="balanceDeduct > 0">
						<view class="iconfont iconyue"></view>
						<view class="info-wrap">
							<text class="name">余额抵扣</text>
							<view class="money">可用${{ balanceDeduct }}</view>
						</view>
						<ns-switch class="balance-switch" @change="useBalance" :checked="isBalance == 1"></ns-switch>
					</view>
					<block v-if="payMoney > 0">
						<block v-if="payTypeList.length">
							<view class="payment-item" v-for="(item, index) in payTypeList" :key="index" @click="payIndex = index">
								<view class="iconfont" :class="item.icon"></view>
								<text class="name">{{ item.name }}</text>
								<text class="iconfont" :class="payIndex == index ? 'iconyuan_checked color-base-text' : 'iconcheckboxblank'"></text>
							</view>
						</block>
						<block v-else><view class="empty">平台尚未配置支付方式！</view></block>
					</block>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg" @click="confirm(1)">确认支付</view></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import nsSwitch from '@/components/ns-switch/ns-switch.vue';

// #ifdef H5
import { Weixin } from 'common/js/wx-jssdk.js';
// #endif

export default {
	name: 'payment',
	components: {
		uniPopup,
		nsSwitch
	},
	props: {
		balanceDeduct: {
			type: [Number, String],
			default: ''
		},
		isBalance: {
			type: Number,
			default: 0
		},
		payMoney: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			isIphoneX: false,
			payIndex: 0,
			// #ifdef H5
			payTypeList: [
				{
					name: '支付宝支付',
					icon: 'iconzhifubaozhifu-',
					type: 'alipay'
				},
				{
					name: '微信支付',
					icon: 'iconweixin1',
					type: 'wechatpay'
				},
				{
					name: '支付宝支付',
					icon: 'iconzhifubaozhifu-',
					type: 'alioverseaspay'
				},
				{
					name: '信用卡支付',
					icon: '2',
					type: 'authorizenetpay'
				}
			],
			timer: null,
			// #endif
			// #ifdef MP-WEIXIN
			payTypeList: [
				{
					name: '微信支付',
					provider: 'wxpay',
					icon: 'iconweixin1',
					type: 'wechatpay'
				}
			],
			// #endif
			payInfo: {},
			setCard:false,
			is_save : false,
			formData: {
				number:'',
				exp_date:'',
				cvc:'',
				first_name:'',
				last_name:''
			},
		};
	},
	created() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		
		this.getPayType();
	},
	methods: {
		open() {
			this.$refs.choosePaymentPopup.open();
		},
		close() {
			this.$refs.choosePaymentPopup.close();
		},
		// 使用余额
		useBalance() {
			this.$emit('useBalance');
		},
		confirm(num) {
			if (this.payTypeList.length == 0 && this.payMoney > 0) {
				this.$util.showToast({
					title: '请选择支付方式！'
				});
				return;
			}
			
			var payType = this.payTypeList[this.payIndex];
			
			if(payType.type == 'authorizenetpay' && num == 1){
				this.setCard = true;
				return false;
			}
			
			if(payType.type == 'authorizenetpay' && num == 2){
				if (this.formData.number == '') {
					this.$util.showToast({
						title: '请输入卡号'
					});
					return;
				}
				if (this.formData.exp_date== '') {
					this.$util.showToast({
						title: '请输入信用卡过期时间'
					});
					return;
				}
				if (this.formData.cvc== '') {
					this.$util.showToast({
						title: '请输入cvc'
					});
					return;
				}
				if (this.formData.first_name== '') {
					this.$util.showToast({
						title: '请输入姓氏'
					});
					return;
				}
				if (this.formData.last_name== '') {
					this.$util.showToast({
						title: '请输入姓名'
					});
					return;
				}
			}
			
			uni.showLoading({
				title: '支付中...',
				mask: true
			});
			this.$refs.choosePaymentPopup.close();
			this.$emit('confirm');
			uni.setStorageSync('pay_flag', 1);
		},
		getPayInfo(out_trade_no) {
			this.$api.sendRequest({
				url: '/api/pay/info',
				data: {
					out_trade_no
				},
				success: res => {
					if (res.code >= 0 && res.data) {
						this.payInfo = res.data;
						this.pay();
					} else {
						this.$util.showToast({
							title: '未获取到支付信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
						}, 1500);
					}
				}
			});
		},
		getPayType() {
		
			this.$api.sendRequest({
				url: '/api/pay/type',
				success: res => {
					if (res.code == 0) {
						if (res.data.pay_type == '') {
							this.payTypeList = [];
						} else {
							var payTypeList = [];
							for(let i in this.payTypeList){
								 
								if (res.data.pay_type.indexOf(this.payTypeList[i]['type']) !== -1) {
									
									payTypeList.push(this.payTypeList[i]);
								}
							}
							this.payTypeList = payTypeList;
						}
					}
				}
			});
		},
		// #ifdef H5
		pay() {
			var payType = this.payTypeList[this.payIndex];
			if (!payType) return;
			let that = this;
			
			if(payType.type == 'authorizenetpay'){
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no:this.payInfo.out_trade_no,
							pay_type:payType.type,
							authorizenetpay_param:JSON.stringify(this.formData)
						},
						success: res => {
							uni.hideLoading();
							if (res.code >= 0) {
								this.checkPayStatus();
							}else {
								this.$util.showToast({ title: '支付失败，请检查信用卡信息是否有误' });
							}
						}
					})
					 
			}else{
			this.$api.sendRequest({
				url: '/api/pay/pay',
				data: {
					out_trade_no: this.payInfo.out_trade_no,
					pay_type: payType.type,
					return_url: encodeURIComponent(this.$config.h5Domain + '/pages/pay/result/result?code=' + this.payInfo.out_trade_no)
				},
				success: res => {
					uni.hideLoading();
					if (res.code >= 0) {
						
						switch (payType.type) {
							case 'alipay':
								location.href = res.data.data;
								this.checkPayStatus();
								break;
							case 'alioverseaspay':

								location.href = res.data;
								this.checkPayStatus();
								break;
							case 'authorizenetpay':
								this.checkPayStatus();
								
								
								break;
								
							case 'wechatpay':
								if (this.$util.isWeiXin()) {
									if (uni.getSystemInfoSync().platform == 'ios') {
										var url = uni.getStorageSync('initUrl');
									} else {
										var url = location.href;
									}
									// 获取jssdk配置
									this.$api.sendRequest({
										url: '/wechat/api/wechat/jssdkconfig',
										data: { url: url },
										success: jssdkRes => {
											var wxJS = new Weixin(),
												payData = res.data.data;
											wxJS.init(jssdkRes.data);
											wxJS.pay(
												{
													timestamp: payData.timestamp,
													nonceStr: payData.nonceStr,
													package: payData.package,
													signType: payData.signType,
													paySign: payData.paySign
												},
												res => {
													if (res.errMsg == 'chooseWXPay:ok') {
														this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
													} else {
														this.$util.showToast({ title: res.errMsg });
													}
												}
											);
										}
									});
								} else {
									location.href = res.data.url;
									this.checkPayStatus();
								}
								break;
						}
					} else {
						this.$util.showToast({ title: res.message });
					}
				},
				fail: res => {
					uni.hideLoading();
					this.$util.showToast({ title: 'request:fail' });
				}
			});
			}
		},
		checkPayStatus() {
			this.timer = setInterval(() => {
				this.$api.sendRequest({
					url: '/api/pay/status',
					data: { out_trade_no: this.payInfo.out_trade_no },
					success: res => {
						if (res.code == 0) {
							if (res.data.pay_status == 2) {
								clearInterval(this.timer);
								this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
							}
						} else {
							clearInterval(this.timer);
						}
					}
				});
			}, 1000);
		},
		// #endif
		// #ifdef MP-WEIXIN
		pay() {
			var payType = this.payTypeList[this.payIndex];
			if (!payType) return;
			if (payType.provider == 'wxpay') {
				this.$api.sendRequest({
					url: '/api/pay/pay',
					data: {
						out_trade_no: this.payInfo.out_trade_no,
						pay_type: payType.type
					},
					success: res => {
						uni.hideLoading();
						if (res.code >= 0) {
							var payData = res.data.data;
							uni.requestPayment({
								provider: payType.provider,
								timeStamp: payData.timeStamp,
								nonceStr: payData.nonceStr,
								package: payData.package,
								signType: payData.signType,
								paySign: payData.paySign,
								success: res => {
									this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, '', 'redirectTo');
								},
								fail: res => {
									this.flag = false;
									if (res.errMsg == 'requestPayment:fail cancel') {
										this.$util.showToast({ title: '您已取消支付' });
									} else {
										uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
									}
									setTimeout(() => {
										this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, 'redirectTo');
									}, 2000);
								}
							});
						} else {
							this.$util.showToast({ title: res.message });
							setTimeout(() => {
								this.$util.redirectTo('/pages/pay/result/result', { code: this.payInfo.out_trade_no }, 'redirectTo');
							}, 2000);
						}
					},
					fail: res => {
						uni.hideLoading();
						this.$util.showToast({ title: 'request:fail' });
					}
				});
			}
		}
		// #endif
	},
	// #ifdef H5
	deactivated() {
		clearInterval(this.timer);
	},
	// #endif
	filters: {
		/**
		 * 金额格式化输出
		 * @param {Object} money
		 */
		moneyFormat(money) {
			return parseFloat(money).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
.popup {
	width: 75vw;
	background: #fff;
	border-top-left-radius: $border-radius;
	border-top-right-radius: $border-radius;

	.popup-header {
		display: flex;
		border-bottom: 2rpx solid $color-line;
		position: relative;
		padding: 40rpx;

		.tit {
			flex: 1;
			font-size: $font-size-toolbar;
			line-height: 1;
			text-align: center;
		}
		.iconfont {
			line-height: 1;
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translate(0, -50%);
			color: $color-tip;
			font-size: $font-size-toolbar;
		}
	}

	.popup-body {
		height: calc(100% - 250rpx);
		&.safe-area {
			height: calc(100% - 270rpx);
		}
	}

	.popup-footer {
		height: 100rpx;

		.confirm-btn {
			height: 72rpx;
			line-height: 72rpx;
			color: #fff;
			text-align: center;
			margin: 20rpx 30rpx 0;
			border-radius: 40rpx;
		}

		&.bottom-safe-area {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
}
.choose-payment-popup {
	.payment-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		margin: 0 30rpx;
		border-bottom: 1px solid $color-line;
		padding: 20rpx 0;
		&:nth-child(2) {
			padding-top: 0;
		}
		&:last-child {
			border-bottom: none;
		}
		.iconfont {
			font-size: 64rpx;
		}
		.iconyue {
			color: #faa218;
		}
		.iconweixin1 {
			color: #24af41;
		}
		.iconzhifubaozhifu- {
			color: #00a0e9;
		}
		.iconcheckboxblank {
			font-size: 40rpx;
			color: $color-line;
		}
		.iconyuan_checked {
			font-size: 40rpx;
		}
		.name {
			margin-left: 20rpx;
			font-size: $font-size-base;
			flex: 1;
		}
		.info-wrap {
			flex: 1;
			margin-left: 20rpx;
			.name {
				margin-left: 0;
				font-size: $font-size-base;
				flex: 1;
			}
			.money {
				color: $color-tip;
				font-size: $font-size-tag;
			}
		}

		.box {
			flex: 1;
			padding: 0 10rpx;
			line-height: inherit;
			text-align: right;

			input {
				font-size: $font-size-tag !important;
			}
		}
		&.set-pay-password {
			height: initial;
			.box {
				font-size: $font-size-tag !important;
			}
		}
	}
	.pay-money {
		text-align: center;
		padding: 20rpx 0 40rpx 0;
		background-color: #fff;
		font-weight: bold;
		margin-top: 30rpx;
		line-height: 1;
		.unit {
			margin-right: 4rpx;
			font-size: $font-size-tag;
		}
		.money {
			font-size: $font-size-toolbar;
		}
	}
}
.empty {
	width: 100%;
	text-align: center;
	padding: 40rpx 0;
	color: $color-sub;
	font-size: $font-size-tag;
}

.edit-info-box {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 40rpx;
	min-height: 50rpx;
	background-color: #fff;

	.info-name {
		width: 150rpx;
		font-size: $font-size-base;
		text-align: left;
	}

	.info-content {
		&:first-of-type {
			// width: auto !important;
		}

		margin-right: auto;
		width: 500rpx;
		font-size: $font-size-base;
		padding: 0;
	}

	.dynacode {
		margin: 0;
		padding: 0 10rpx;
		width: 250rpx;
		height: 60rpx;
		font-size: $font-size-base;
		line-height: 60rpx;
		color: #fff;
		word-break: break-all;
	}
	.edit-sex-list {
		display: flex;
		label {
			display: flex;
			margin-left: 30rpx;
			align-items: center;
		}
	}
	uni-radio .uni-radio-input {
		width: 32rpx;
		height: 32rpx;
	}
}
.set-card{
	background-color: #f8f8f8;
	position: fixed;
	width: 100vw;
	min-height: 100vh;
	z-index: 100;
	top: 0;
	left: 0;
}
</style>
