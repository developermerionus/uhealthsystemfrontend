<!-- 
 lang/en-us/fenxiao/withdraw_apply.js
 lang/zh-cn/fenxiao/withdraw_apply.js
 -->

<template>
	<view class="container" :data-theme="themeStyle">
		<view class="outer-container-wrap">
			<navbar></navbar>
			<view class="container-body-wrap">
				<view class="empty-box"></view>
				<view class="withdraw-wrap">
					<!-- <view class="title">{{ fenxiaoWords.account }}将{{ fenxiaoWords.withdraw }}到Masspay钱包 </view> -->
					<view class="title">{{ $lang('wallet_title') }}</view>
					<view class="money-wrap">
						<text class="unit">{{ $lang('common.currencySymbol') }} </text>
						<input type="number" class="withdraw-money" v-model="withdrawMoney" />
					</view>
					<view class="bootom">
						<view>
<!-- 							<text class="color-tip">
								可{{ fenxiaoWords.withdraw }}{{ fenxiaoWords.account }}：{{ $lang('common.currencySymbol') }}{{ balance | moneyFormat }}
							</text> -->
							<text class="color-tip">
								{{ $lang('wallet_bottom_tip') }}：{{ $lang('common.currencySymbol') }}{{ balance | moneyFormat }}
							</text>
							<text class="color-tip coupon-tip">
								{{ $lang('wallet_coupon_tip') }}：{{ $lang('common.currencySymbol') }}{{ coupon }}
							</text>
						</view>
					</view>
				</view>
				<view class="desc">
					<!-- <text>申请3-7个工作日内可提现到Masspay钱包，钱包中的金额可自行转到会员自己的银行卡上。</text> -->
					<text>{{ $lang('wallet_description')}}</text>
				</view>
				<view class="btn withdraw_btn" :class="{ disabled: withdrawMoney == '' || withdrawMoney == 0 }"
					@click="withdraw" v-if="member_level>1">
					{{ $lang(fenxiaoWords.withdraw) + $lang('buttonWords_toMasspay') }}
				</view>
				<view class="btn transfer_btn"
					@click="$util.redirectTo('/otherpages/fenxiao/transferMToReferee_apply/transferMToReferee_apply')">
					<image class="transfer-icon" src="../../../static/images/icons/transferMToReferee.png"></image>
					{{ $lang('transfer_to_referee') }}		
				</view>
				<view class="withdraw-list btn"
					@click="$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list')"
					v-if="member_level>1">
					<view class="color-tip">{{ $lang('withdrawal_details') }}</view>
				</view>
				<view class="withdraw-list btn"
					@click="$util.redirectTo('/otherpages/fenxiao/wallet_balance_detail/wallet_balance_detail')">
					<view class="color-tip">{{ $lang('wallet_balance_details') }}</view>
				</view>
			</view>
			<loading-cover ref="loadingCover"></loading-cover>

		</view>

	</view>
</template>

<script>
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				fenxiaoInfo: {
					account: 0
				},
				withdrawConfig: {
					withdraw: 0
				},
				withdrawMoney: '',
				isSub: false,
				balance: 0,
				member_level: 0,
				coupon:0,
				
			};
		},
		components: {},
		mixins: [fenxiaoWords, globalConfig],
		onLoad() {
			this.getBonus();
		},
		onShow() {
			this.getCoupon();
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			// if (!this.addonIsExit.fenxiao) {
			// 	this.$util.showToast({
			// 		title: '商家未开启分销',
			// 		mask: true,
			// 		duration: 2000
			// 	});
			// 	setTimeout(() => {
			// 		this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
			// 	}, 2000);
			// 	return;
			// }
			// 刷新多语言
			this.$langConfig.refresh();
			this.$langConfig.title(this.fenxiaoWords.withdraw);

			// if (uni.getStorageSync('token')) {
			// 	this.getFenxiaoInfo();
			// 	this.getWithdrawConfig();
			// } else {
			// 	this.$util.redirectTo('/pages/login/login/login', {
			// 		back: '/otherpages/fenxiao/withdraw_apply/withdraw_apply'
			// 	});
			// }
		},
		methods: {
			getCoupon() {
				this.$api.sendRequest({
					url: '/api/member/getCouponInfo',
					success: res => {
						if (res.code >= 0) {
							this.coupon = res.data[0].coupon;
						}
					}
				})
			},
			getBonus() {
				this.$api.sendRequest({
					url: '/api/member/bonus',
					data: {
						lastweek: 0,
					},
					success: res => {
						if (res.code >= 0) {
							this.balance = res.data[0].epoint_balance;
							this.member_level = res.data[0].member_level;
						}
					}
				})
			},
			withdraw() {
				if (this.verify()) {
					this.$refs.loadingCover.show();
					if (this.isSub) return;
					this.isSub = true;

					// #ifdef MP-WEIXIN
					this.subscribeMessage(() => {
						this.$api.sendRequest({
							url: '/api/memberwithdraw/withdrawApply',
							data: {
								money: this.withdrawMoney
							},
							success: res => {
								if (res.code >= 0) {
									this.$refs.loadingCover.hide();
									// this.$util.showToast({
									// 	title: this.$lang('withdraw_success') // '提现申请成功'
									// });
									this.$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list', {}, 'redirectTo');
									// setTimeout(() => {
									// 	this.$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list', {}, 'redirectTo');
									// }, 1500);
									
								} else {
									this.$refs.loadingCover.hide();
									this.isSub = false;
									this.$util.showToast({
										title: res.message
									});
								}
							},
							fail: res => {
								this.isSub = false;
								this.$refs.loadingCover.hide();
							}
						});
					});
					// #endif

					// #ifndef MP-WEIXIN
					this.$api.sendRequest({
						url: '/api/memberwithdraw/withdrawApply',
						data: {
							money: this.withdrawMoney
						},
						success: res => {
						//	console.log(res);
							if (res.code >= 0) {
								// this.$util.showToast({
								// 	title: this.$lang('withdraw_success') // '提现申请成功'
								// });
								this.$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list', {}, 'redirectTo');
								// setTimeout(() => {
								// 	this.$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list', {}, 'redirectTo');
								// }, 1500);
							} else {
								this.isSub = false;
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							this.isSub = false;
						}
					});
					// #endif
				}
			},
			verify() {
				if (this.withdrawMoney == '' || this.withdrawMoney == 0 || isNaN(parseFloat(this.withdrawMoney))) {
					this.$util.showToast({
						title: this.$lang('verify_alerts_1') //'请输入提现金额'
					});
					return false;
				}
				if (this.withdrawMoney < 0) {
					this.$util.showToast({
						title: this.$lang('verify_alerts_4') //'提现金额不能为负值'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) > parseFloat(this.balance)) {
					this.$util.showToast({
						title: this.$lang('verify_alerts_2') // '提现金额超出可提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) > 3000) {
					this.$util.showToast({
						title: this.$lang('verify_alerts_3') // '提现金额超出限额'
					});
					return false;
				}
				// if (parseFloat(this.withdrawMoney) < parseFloat(this.withdrawConfig.withdraw)) {
				// 	this.$util.showToast({ title: '提现金额小于最低提现金额' });
				// 	return false;
				// }
				return true;
			},
			/**
			 * 获取佣金提现配置
			 */
			getWithdrawConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/withdraw',
					success: res => {
						if (res.code >= 0) {
							this.withdrawConfig = res.data;
						}
					}
				});
			},
			/**
			 * 获取分销商信息
			 */
			getFenxiaoInfo() {
				this.$api.sendRequest({
					url: '/fenxiao/api/fenxiao/detail',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.fenxiaoInfo = res.data;
							this.$refs.loadingCover.hide();
						} else {
							this.$util.redirectTo('/otherpages/fenxiao/apply/apply');
						}
					}
				});
			},
			/**
			 * 微信订阅消息
			 */
			subscribeMessage(callback) {
				this.$api.sendRequest({
					url: '/weapp/api/weapp/messagetmplids',
					data: {
						keywords: 'FENXIAO_WITHDRAWAL_SUCCESS,FENXIAO_WITHDRAWAL_ERROR'
					},
					success: res => {
						if (res.code == 0 && res.data.length) {
							uni.requestSubscribeMessage({
								tmplIds: res.data,
								fail: res => {
							//		console.log('fail', res);
								},
								complete: () => {
									callback();
								}
							});
						} else {
							callback();
						}
					},
					fail: res => {
						callback();
					}
				});
			}
		},
		filters: {
			/**
			 * 金额格式化输出
			 * @param {Object} money
			 */
			moneyFormat(money) {
				return Number(money).toFixed(2);
			}
		},
		onReady() {
			this.$refs.loadingCover.hide();
		}
		

	};
</script>

<style lang="scss">
	.coupon-tip {
		margin-left:40px;
	}
	.container {
		width: 100vw;
		height: 100vh;
		background: $color-bg;

	}
	
	.outer-container-wrap {
		// -webkit-box-sizing: border-box;
		// -moz-box-sizing: border-box;
		// box-sizing: border-box;
		max-width: 1200px;
		margin: 0 auto;
	}

	.container-body-wrap {
		display: flex;
		flex-direction: column;
		min-height: 50vh;
		justify-content: center;
	}

	.align-right {
		text-align: right;
	}

	.withdraw-wrap {
		margin: 20rpx 30rpx 0;
		padding: 30rpx;
		border-radius: 10rpx;
		background-color: #fff;

		.title {
			font-size: $font-size-base;
			color: $color-tip;
		}

		.money-wrap {
			padding: 20rpx 0;
			border-bottom: 1rpx solid $color-line;
			display: flex;

			.unit {
				font-size: 60rpx;
				line-height: 1;
			}

			.withdraw-money {
				height: 60rpx;
				line-height: 1;
				min-height: 60rpx;
				padding-left: 20rpx;
				font-size: 60rpx;
				flex: 1;
				font-weight: 500;
				vertical-align: middle;
			}
		}

		.bootom {
			display: flex;
			padding-top: 30rpx;

			&>view {
				font-size: $font-size-base;
				line-height: 1;
				flex: 1;
			}
		}
	}

	.btn {
		margin: 0 30rpx;
		margin-top: 60rpx;
		height: 80rpx;
		line-height: 80rpx;
		//border-radius: 80rpx;
		color: #fff;

		text-align: center;
		border-radius: 10rpx;

		&.disabled {
			background: #ccc;
			border-color: #ccc;
			color: #fff;
		}

	}

	.withdraw_btn {
		background: linear-gradient(to right, #10869c 0%, #118ca3 12%,
				#139fb9 34%, #14a5c0 47%, #139fb9 67%, #118ca3 89%, #10869c 100%);
	}
	
	.transfer_btn {
		background: linear-gradient(to right, #10869c 0%, #118ca3 12%,
				#139fb9 34%, #14a5c0 47%, #139fb9 67%, #118ca3 89%, #10869c 100%);
		
		.transfer-icon {
			vertical-align: middle;
			width: 25px;
			height: 25px;
			padding:0 5px;
		}
	}

	.desc {
		margin: 20rpx 40rpx;
		font-size: $font-size-tag;
		color: $color-tip;
	}

	.withdraw-list {
		border: 2rpx solid $color-disabled;
		text-align: center;
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;

	}
	
	
	@media screen and (min-width: 750px) {
		
		.container-body-wrap {
			max-width: 750px;
			margin: 0 auto;
		}
		
	}
</style>
