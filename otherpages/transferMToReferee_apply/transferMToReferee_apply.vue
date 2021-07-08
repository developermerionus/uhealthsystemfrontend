<template>
		<view class="container" :data-theme="themeStyle">
			<!-- <view class="container"> -->
				<view class="outer-container-wrap">
					<navbar></navbar>
					<view class="container-body-wrap">
						<view class="transfer-wrap">
							<view class="title">{{ $lang('common.transfer_money') }}</view>
							<view class="input-wrap">
								<label class="labelForInput">{{ $lang('common.referrer_ID') }}: </label>
								<input type="text" placeholder-class="input-placeholder" 
								:value="referrerId" disabled
								class="input" />
							</view>
							<view class="input-wrap">
								<label class="labelForInput">{{ $lang('common.referree_name') }}: </label>
								<input type="text" placeholder-class="input-placeholder" 
								class="input" v-model="refereeName"/>
							</view>
							<view class="input-wrap">
								<label class="labelForInput">{{ $lang('common.referree_id') }}: </label>
								<input type="number" placeholder-class="input-placeholder" 
								class="input" v-model="refereeId"/>
							</view>
							<view class="input-wrap">
								<label class="labelForInput">{{ $lang('common.transfer_amount') }}: </label>
								<text class="unit">{{ $lang('common.currencySymbol') }} </text>
								<!-- <input type="number" class="withdraw-money" v-model="withdrawMoney" /> -->
								<input type="number" placeholder-class="input-placeholder" 
								class="transfer-money" :placeholder="this.$lang('common.transfer_amount_tip') + this.balance"
								v-model="transferMoney"/>
							</view>
						</view>
						<!-- <view class="btn withdraw_btn" :class="{ disabled: withdrawMoney == '' || withdrawMoney == 0 }"
							@click="withdraw"> -->
						<view class="btn transfer_btn" :class="{ disabled: transferMoney == '' || transferMoney == 0 }"
							@click="transfer">
							{{ $lang('common.transfer_money') }}
						</view>
<!-- 						<view class="withdraw-list btn"
							@click="$util.redirectTo('/otherpages/fenxiao/withdraw_list/withdraw_list')">
							<view class="color-tip">{{ $lang('withdrawal_details') }}</view>
						</view> -->
					</view>
					<loading-cover ref="loadingCover"></loading-cover>
		
				</view>
		
			</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				
				referrerName: '',
				referrerId: 0,
				refereeName: '',
				refereeId: null,
				transferMoney: '',
				isSub: false, // 提交防重复
				balance: 0,
				
			}
		},
		mixins: [globalConfig],
		onLoad() {
			this.tokenCheck();
			this.getBonus();
		},
		onShow() {
			// 刷新多语言
			// this.$langConfig.refresh();
			// this.$langConfig.title('Transfer To Referee'; // 
			
			
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
			// login token check
			tokenCheck() {
				if (uni.getStorageSync('token')) {
				// 	this.getFenxiaoInfo();
				// 	this.getWithdrawConfig();
				} else {
					this.$util.redirectTo('/pages/login/login/login', {
						back: '/otherpages/fenxiao/withdraw_apply/withdraw_apply'
					});
				 }
			},
			
			// 得到会员值 - ID，奖金值
			getBonus() {
				this.$api.sendRequest({
					url: '/api/member/bonus',
					data: {
						lastweek: 0,
					},
					success: res => {
						if (res.code >= 0) {
							this.balance = res.data[0].epoint_balance;
							this.referrerId = res.data[0].member_id;
							}
					}
				})
				
				// this.loadData(this.referrerId);
				// this.getTheEdge(0);
				// this.getTheEdge(1);
				
			},
			
			// transfer apply
			transfer() {
				if (this.verify()) {
					if (this.isSub) return;
					this.isSub = true;
					console.log('transferring...');
				}
			},
			
			verify() {
				// check transfer amount
				if (this.transferMoney == '' || this.transferMoney == 0 || isNaN(parseFloat(this.transferMoney))) {
					this.$util.showToast({
						title: '请输入提现金额'
					});
					return false;
				}
				if (parseFloat(this.transferMoney) > parseFloat(this.balance)) {
					this.$util.showToast({
						title: '提现金额超出可提现金额'
					});
					return false;
				}
				if (parseFloat(this.withdrawMoney) > 10000) {
					this.$util.showToast({
						title: '提现金额超出限额'
					});
					return false;
				}
				// if (parseFloat(this.withdrawMoney) < parseFloat(this.withdrawConfig.withdraw)) {
				// 	this.$util.showToast({ title: '提现金额小于最低提现金额' });
				// 	return false;
				// }
				
				// check referee ID and Name
				//this.memberInfo = uni.getStorageSync('userInfo');
				
				return true;
			},
			
			loadData(member_id){
				this.list = []
				// console.log('getTeamTree')
				this.$api.sendRequest({
					url: '/api/member/getTeamTree',
					data: {
						member_id,
					},
					success: res => {
						
						//if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						console.log("loaddata",res);
						// if (res.code >= 0) {	
						// 	// this.list = res.data[0];
						// 	console.log(res.data['0']);
						// 	this.list.push(res.data['0']);
						// 	this.width = res.data.width;
						// 	this.height = res.data.height;
						// 	this.prev_member_id = member_id;
							
						// }
					}
				})
			},
			
			getTheEdge(branch){
				this.$api.sendRequest({
					url: '/api/member/getTheEdge',
					data: {
						member_id: this.referrerId,
						branch,
					},
					success: res => {
						console.log('the edge',res);
						this.loadData(res.data[0].member_id);
					}	
				})
			},
			
			
		},
		filters: {
			/**
			 * 金额格式化输出
			 * @param {Object} money
			 */
			moneyFormat(money) {
				return parseInt(money);
			}
		},
		onReady() {
			this.$refs.loadingCover.hide();
		}
		
	}
</script>


<style lang="scss">
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
		box-sizing: border-box;
		
	}
	
	.container-body-wrap {
		display: flex;
		flex-direction: column;
		min-height: 50vh;
		justify-content: center;
		
		.title {
			text-align: center;
			color: $color-sub;
			font-weight: bold;
			font-size: 60rpx;
		}
	}
	
		
	.input-wrap {
		position: relative;
		//border: solid red 3px;
		display: flex;
		flex-wrap: wrap;
		height: 110rpx;
		align-items: center;
		//justify-content: space-around;
		padding: 0 20rpx;
		//border-bottom: 1rpx solid $color-line;
		
		.labelForInput {
			width: 40%;
			color: $color-sub;
			font-weight: bold;
			font-size: $font-size-base;
			//text-align: center;
		}
		.input {
			flex: 1;
			height: 60rpx;
			line-height: 60rpx;
			font-size: $font-size-base;
			border: 5rpx solid #c7c7c7;
			padding: 5rpx 20rpx 5rpx; 
			color: $color-sub;
		}
		
		.input-placeholder {
			font-size: $font-size-base;
			color: #bfbfbf;
			line-height: 60rpx;
			min-height: 60rpx;
			font-size: 40rpx;
			//border: solid blue 2px;
		}
		
		.unit {
			font-size: 60rpx;
			line-height: 1;
		}
			
		.transfer-money {
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
	
	.transfer_btn {
		//border: solid red 2px;
		background: linear-gradient(to right, #10869c 0%, #118ca3 12%, 
		#139fb9 34%, #14a5c0 47%, #139fb9 67%, #118ca3 89%, #10869c 100%);
	}
	
	@media screen and (min-width: 750px) {
		
		.container-body-wrap {
			max-width: 750px;
			margin: 0 auto;
		}
		
	}
</style>

