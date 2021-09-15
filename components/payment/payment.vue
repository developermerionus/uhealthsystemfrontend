<template>
	<view>
		<view  v-if="setCard">
			<!-- <view class="empty-bar-view"></view> -->
			<view class="edit-info-box out-focus" >
				<text class="info-name">{{$lang('common.credit_card_no')}}</text>
				<input :focus="focusFlag" class="focus uni-input info-content input-len" type="number" maxlength="30" :placeholder="$lang('common.input_card_no')" v-model="formData.number" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.credit_card_valid')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.card_valid')" v-model="formData.exp_date" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">CVC</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.last_3_digit')" v-model="formData.cvc" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.last_name')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.last_name')" v-model="formData.first_name" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.first_name')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.first_name')" v-model="formData.last_name" />
			</view>
			<view class="edit-info-box" style='justify-content: flex-start;'>
				<text class="info-name" >{{$lang('common.country')}}<!-- <text>*</text> --></text>
				<picker @change="bindPickerChange" :value="index" :range="tempCountryList" class="picker" range-key="name">
				<!-- 	<text class="desc uni-input">{{ $lang(`common.${countryList[index].name}`)?  $lang(`common.${countryList[index].name}`):countryList[index].name}}</text>
				 -->
				 <text class="desc uni-input">{{tempCountryList[index]}}</text>
				 
				 </picker>
			</view>
		
			<view class="credit-card-icon-box">
				<text>{{$lang('common.creditCardRequirement')}}:</text>
				<br>
				<img src="https://img.icons8.com/color/48/000000/visa.png"/>
				<img src="https://img.icons8.com/color/48/000000/mastercard.png"/>
				<img src="https://img.icons8.com/color/48/000000/amex.png"/>
				<img src="https://img.icons8.com/color/48/000000/discover.png"/>
			</view>
			<!-- <br> -->
			<view v-show="billingAddressShow">
			<view class="edit-info-box">
				<text>{{$lang('common.billingaddress')}}:</text>
			</view>
			<!-- <view class="edit-info-box">
				<text class="info-name">{{$lang('common.country')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.country')" v-model="formData.country" />
			</view> -->
			
			<!-- <view class="edit-info-box" v-show="localType !== 2">
				<text class="info-name">{{$lang('common.state')}}</text>
				<input  class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.state')" v-model="formData.state" />
			</view> -->
			<view class="edit-info-box" >
				<text class="info-name" >
					{{$lang('common.state')}}
				<!-- 	<text>*</text> -->
				</text>
				<input class="uni-input  info-content input-len" type="text" placeholder-class="placeholder-class" :placeholder="$lang('common.state')"
				 maxlength="100" v-model="formData.state=cardFormData.state" @click="goState()"/>
			</view>
			
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.city')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.city')" v-model="formData.city" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.street')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.street')" v-model="formData.address" />
			</view>
			
			
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.zipcode')}}</text>
				<input class="uni-input info-content input-len" type="number" maxlength="30" :placeholder="$lang('common.zipcode')" v-model="formData.zip" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.phonenumber')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.phonenumber')" v-model="formData.phone" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.email')}}</text>
				<input class="uni-input info-content input-len" type="email" maxlength="30" :placeholder="$lang('common.email')" v-model="formData.email" />
			</view>
			<!-- <view class="edit-info-box">
				<text class="info-name">{{$lang('common.confirmemail')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.confirmemail')" v-model="formData.email" />
			</view> -->
			</view>
			<br>
			<view class="save-item" @click="confirm(2)">
				<button type="primary">{{$lang('common.confirm')}}</button>
			</view>
			<br>
			<view class="save-item" @click="cancelHandler()">
				<button type="default">{{$lang('common.cancel')}}</button>
			</view>
		</view>
		
		<!-- 选择支付方式弹窗 -->
		<uni-popup ref="choosePaymentPopup" type="center">
			<view class="choose-payment-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">{{$lang('common.pay_method')}}</text>
					<text class="iconfont iconclose" @click="close()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="pay-money">
						<!-- <text class="unit">{{ $lang('common.currencySymbol') }}</text> -->
						<text class="money">{{$lang('common.pay_amount')}}{{ payMoney | moneyFormat }}</text>
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
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }"><view class="confirm-btn color-base-bg" @click="confirm(1)">{{$lang('common.confirm')}}</view></view>
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
		},
		cardFormData: {
			type: Object,
			default:{state:''}
		}
	},
	data() {
		return {
			tempCountryList:[],
			name:'',
			countryList: [
				{
					"id":0,
					"name":"China"
				},
			],
			index: 0,
			setCard: false,
			focusFlag: false,
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
					name: this.$lang('common.alipay'),
					icon: 'iconzhifubaozhifu-',
					type: 'alioverseaspay'
				},
				{
					name: this.$lang('common.credit_card'),
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
					type: 'wechatpay',	
				}
			],
			// #endif
			billingAddressShow:true,
			payInfo: {},
			showCountry:[1,153],
			is_save : false,
			formData: {
				number:'',
				exp_date:'',
				cvc:'',
				first_name:'',
				last_name:'',
				address:'',
				city:'',
				state:'',
				zip:'',
				country:'United State',
				phone:'',
				email:''
			},
		};
	},
	
	
	created() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		
		this.getPayType();
		
		//this.getCardInfo();
		
		this.getCountryList();
	},
	methods: {
		bindPickerChange(e) {
				this.index = e.detail.value;
				//console.log('index',e.detail.value);
				this.formData.country = this.countryList[this.index].name;
				if(this.showCountry.indexOf(this.countryList[this.index].id)<0) {
					this.billingAddressShow = false;
					this.formData.address = '';
					this.formData.city='';
					this.cardFormData.state='';
					this.formData.zip='';
					this.formData.phone='';
					this.formData.email='';
				}
				else {
					this.billingAddressShow = true;
					this.formData.address = '';
					this.formData.city='';
					this.cardFormData.state='';
					this.formData.zip='';
					this.formData.phone='';
					this.formData.email='';
				}
		},
		goState() {
			uni.navigateTo({
				url: `/otherpages/member/indexed-list/indexed-list?country=${this.countryList[this.index].id}&from=1`
			});
		},
		getCountryList() {
			this.$api.sendRequest({
				url: '/api/address/country',
				success: res => {
					if (res.code >= 0 && res.data) {
						//console.log('res.data',res.data);
						this.countryList = res.data.filter(item=> item.id!=0);
						for (let v in this.countryList) {
							this.tempCountryList.push(this.$lang(`common.${this.countryList[v].id}`));
						}
						//console.log(this.tempCountryList);
						
					}
				}
			});
		},
		getUsStates() {
			this.$api.sendRequest({
				url: '/api/member/getUsStates',
				data: {
					pid: 1, // if USA, pid = 1
				},
				success: res => {
				//	console.log(res);
					let usStateListTemp = [];
					this.usStateList = [];
					if (res.code == 0) {
						usStateListTemp = res.data;
						for ( var i=0; i<usStateListTemp.length; i++) {
							for (var j=0; j<usStateListTemp[i].data.length; j++) {
								this.usStateList.push(usStateListTemp[i].data[j]);
							}
						}
					}
					//console.log(this.usStateList);
				},
			})
		},
		cancelHandler() {
			this.setCard = false;
			this.$emit('showHandler');
		},
		but(){
		    
			uni.createSelectorQuery().select('.focus').boundingClientRect(data=>{
		    //目标位置的节点：类class或者id
			uni.createSelectorQuery().select(".out-focus").boundingClientRect(res=>{
		    //最外层盒子的节点：类class或者id
			uni.pageScrollTo({
		    
			duration: 100,//过渡时间
			//scrollTop:data.top+590 - res.top,//到达距离顶部的top值
			scrollTop:data.top - res.top,//如果置顶
					})
				}).exec()
			}).exec();
		},
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
				this.focusFlag = false;
				this.$nextTick(function() {
					this.focusFlag = true;
					this.but();
					this.$emit('showHandler');
					});
				this.close()
				return false;
			}
			
			if(payType.type == 'authorizenetpay' && num == 2){
				if (this.formData.number == '') {
					this.$util.showToast({
						title: this.$lang('common.input_card_no')
					});
					return;
				}
				if (this.formData.exp_date== '') {
					this.$util.showToast({
						title: this.$lang('common.card_valid')
					});
					return;
				}
				if (this.formData.cvc== '') {
					this.$util.showToast({
						title: this.$lang('common.input_cvc')
					});
					return;
				}
				if (this.formData.first_name== '') {
					this.$util.showToast({
						title: this.$lang('common.input_first_name')
					});
					return;
				}
				if (this.formData.last_name== '') {
					this.$util.showToast({
						title: this.$lang('common.input_last_name')
					});
					return;
				}
				if (this.formData.country== '') {
					this.$util.showToast({
						title: this.$lang('common.input_country')
					});
					return;
				}
				if(this.billingAddressShow) {
				if (this.formData.state== '') {
					this.$util.showToast({
						title: this.$lang('common.input_state')
					});
					return;
				}
				if (this.formData.city== '') {
					this.$util.showToast({
						title: this.$lang('common.input_city')
					});
					return;
				}
				if (this.formData.street== '') {
					this.$util.showToast({
						title: this.$lang('common.input_street')
					});
					return;
				}
				if (this.formData.phone== '') {
					this.$util.showToast({
						title: this.$lang('common.input_phone')
					});
					return;
				}
				if (this.formData.email== '') {
					this.$util.showToast({
						title: this.$lang('common.input_email')
					});
					return;
				}
				}
				
			}
			
			uni.showLoading({
				title: this.$lang('common.paying'),
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
		// getCardInfo() {
		// 	this.$api.sendRequest({
		// 		url: '/api/member/getCard',
		// 		success: res => {
		// 			if (res.code == 0) {
		// 				this.formData = res.data;
		// 			}
		// 		}
		// 	});
		// },
		// #ifdef H5
		pay() {
			var payType = this.payTypeList[this.payIndex];
			if (!payType) return;
			let that = this;         
			if(payType.type == 'authorizenetpay'){
				//console.log('formData', this.formData);
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no:this.payInfo.out_trade_no,
							pay_type:payType.type,
							authorizenetpay_param:JSON.stringify(this.formData)
						},
						success: res => {
							// console.log(res);
							uni.hideLoading();
							if (res.code >= 0) {
								this.checkPayStatus();
							}else {
								uni.showModal({
									title: this.$lang('common.failed_pay'),
									content: JSON.stringify(res.data)
								})
								
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
						console.log(res)
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
	max-width: 700px;
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

.credit-card-icon-box {
	margin: 15px;
}

.set-card{
	background-color: #ffffff;
	position: fixed;
	width: 100vw;
	min-height: 100vh;
	max-width: 1200px;
	right: 0;
	left: 0;
	margin: 0 auto;
	z-index: 100;
	top: 0;
	left: 0;
}

.empty-bar-view {
	//width: 100vw;
	width: 100%;
	//height: 10vh;
	min-height: 200rpx;
}


</style>
