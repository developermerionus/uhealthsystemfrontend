<template>
	<view class="container" :data-theme="themeStyle">
		<!-- <view class="container"> -->
		<view class="outer-container-wrap">
			<navbar></navbar>
			<view class="container-body-wrap">
				<view class="wallet-balance-cate">
					<block v-for="(item, index) in category" :key="index">
					<view class="cate-li"
						:class="{ 'active color-base-bg-before': status == item.id }"
						@click="selectCate(item.id)">
							{{ $lang(item.name) }} 
						</view>
					</block>
				</view>
				
				<mescroll-uni ref="mescroll" @getData="getData" top="140px" 
				class="member-point" :size="10">
				<block slot="list">
					<view class="wallet-balance-li" v-for="(item, index) in walletBalanceDetailList" :key="index">
						<view class="wallet-balance-li-box">
							<view class="wallet-balance-desc">
								<view class="desc-info">
									<!-- <text :style="transferState[item.status].color">{{ item.memo }} : </text> -->
									<text :style="amountColorByType(item.wallet_detail_status, item.amount)">{{ item.memo }}</text>
									<view class="desc-info-time">{{ item.trans_time }}</view>
								</view>
								<view class="desc-money-container">
									<view class="desc-money" :style="{ color : item.amount>=0 ? 'rgb(17, 189, 100)' : 'rgb(255, 69, 68)'}">
									<!-- <view class="desc-money" :style="amountColorByType(item.wallet_detail_status, item.amount)"> -->
										<!-- <view class="desc-money" :style="transferState[item.status].color"> -->
										${{ item.amount }}
									</view>
									<view class="desc-money">
										${{ item.balance? item.balance : 'NULL' }}
									</view>
								</view>
							</view>
						</view>
					</view>
					
					
					<block v-if="walletBalanceDetailList.length == 0 && emptyShow">
					<!-- 	<ns-empty :text="$lang('transferRecordsEmpty_0') " :isIndex="!1" v-if="status == 0">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_1')" :isIndex="!1" v-if="status == 1">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_2')" :isIndex="!1" v-if="status == 2">
						</ns-empty> -->
						<!-- <ns-empty :text="$lang('transferRecordsEmpty_3')" :isIndex="!1" v-if="status == 3">
						</ns-empty> -->
					</block>
				</block>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		data() {
			return {
				category: [{
						id: 0,
						name: 'all', // '全部',
						number: 2
					},
					// {
					// 	id: 1,
					// 	name: 'transferred', 
					// 	number: 0
					// },
				],

				// amountStatus: {
				// 	'1': {
				// 		color: 'color: rgb(255, 69, 68)',
				// 		text: 'Decrease'
				// 	},
				// 	'2': {
				// 		color: 'color: rgb(17, 189, 100)',
				// 		text: 'Increase'
				// 	},
				// },
				status: 0,
				walletBalanceDetailList: [],
				emptyShow: false

			};
		},
		mixins: [globalConfig],

		methods: {
			
			getData(mescroll) {
				this.emptyShow = false;
				if (mescroll.num == 1) {
					this.walletBalanceDetailList = [];
				};
				
				this.$api.sendRequest({
					// url: '/api/member/wallet_balance_detail_testsch',
					url: '/api/member/wallet_balance_detail',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						status: this.status
					},
					success: res => {
						this.emptyShow = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						// if (mescroll.num == 1) this.transferList = []; //如果是第一页需手动制空列表
						this.walletBalanceDetailList = [];
						this.walletBalanceDetailList = this.walletBalanceDetailList.concat(newArr); //追加新数据
						
						
						// const newArray = this.walletBalanceDetailList.filter((item, index) => item.status == 0);
						const newArray = this.walletBalanceDetailList.filter((value, index) => {
						    if (value.status == 0) return true;
						});
					
						this.walletBalanceDetailList.forEach((item, index) => {
							switch (item.status) {
								case -1:
									item['wallet_detail_status'] = -1; // -1: 拒绝
									break;
								case 0:
									if (item.memo.startsWith("发放到")) {
											// 0： 发放到
											item['wallet_detail_status'] = 5; // 5: 发放到
										} else if (item.memo.startsWith("余额支付")) {
											// 0： 余额支付
											item['wallet_detail_status'] = 6; // 6: 余额支付
										} else if (item.memo.startsWith("提现异常")) {
											// 0： 提现异常
											item['wallet_detail_status'] = 3; // 6: 余额支付
										} else {
											// 0: 其它人工调节金额
											item['wallet_detail_status'] = 7; // 6: 其它人工调节金额
										}
									break;
								case 1: 
									if (item.memo.startsWith("转账给")) {
										// 1: 转账自
										item['wallet_detail_status'] = 1; // 1: 转账给
									} else if (item.memo.startsWith("提现")) {
										// 1: 提现
										item['wallet_detail_status'] = 4; // 4: 提现
										item.amount = 0 - item.amount;
									}
									break;
								case 2: 
									item['wallet_detail_status'] = 2; // 2: 转账自
									break;
								case 3:
									item['wallet_detail_status'] = 3; // 3: 异常
								case 9: 
									item['wallet_detail_status'] = 9; // 9: callback, 退会员追回
									break;
								default: // 
								  item['wallet_detail_status'] = 8; // undefined category
							}

						});
						 
						this.walletBalanceDetailList = this.walletBalanceDetailList.slice().reverse();
						
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
				
			},
			
			selectCate(e) {
				this.status = e;
				this.$refs.mescroll.refresh();
			},
			
			amountColorByType(status, amount) {
				if (status === -1 || status === 3 || status == 9) {
					// 拒绝，异常，追回 使用红色
					return 'color: rgb(255, 69, 68)';
				// } else if (amount >= 0) {
				// 	return 'color: rgb(17, 189, 100)';
				// } else if (amount<0){
				// 	return 'color: rgb(72,61,139)';
				} else {
					// 其它使用黑色
					return 'color: rgb(19,19,20)';
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.outer-container-wrap {
		max-width: 1200px;
		margin: 0 auto;
	}

	.wallet-balance-cate {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background: #fff;
		position: fixed;
		top: 90px;
		z-index: 999;
		box-sizing: border-box;

		max-width: 1200px;
		margin: 0 auto;

		.cate-li {
			text-align: center;
			display: inline-block;
			height: 88rpx;
			font-size: 30rpx;
			position: relative;
			line-height: 88rpx;
			;

			&.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				background-color: red;
			}
		}
	}
	
	.wallet-balance-li {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		max-width: 1200px;
		margin: 0 auto;
		margin-top: 20rpx;
	}
	
	.wallet-balance-li-box {
			width: 100%;
			height: 100%;
			padding: 30rpx;
			background-color: #fff;
			box-sizing: border-box;
		
			.wallet-balance-desc {
				width: 100%;
				display: flex;
				justify-content: space-between;
				border-bottom: 2rpx solid $color-line;
				
				.desc-info {
					display: flex;
					justify-content: center;
					flex-direction: column;
			
					.desc-info-name {
						font-size: $font-size-base;
						color: $color-title;
						line-height: 1;
						margin-bottom: 10rpx;
					}
			
					.desc-info-time {
						margin-bottom: 10rpx;
						font-size: $font-size-tag;
						color: $color-tip;
					}
				}
			}
			
			
	
	}
	
</style>