<template>
	<view class="bill" :data-theme="themeStyle">
		<mescroll-uni ref="mescroll" @getData="getData" class="member-point" :size="10" top="10px">
			<block slot="list">
				<view class="balances" v-if="accountList.length" v-for="item in accountList" :key="item.id">
					<image v-if="item.type == 'order'" :src="$util.img('upload/uniapp/fenxiao/bill/jiesuan.png')" mode="widthFix"></image>
					<image v-else :src="$util.img('upload/uniapp/fenxiao/bill/withdraw.png')" mode="widthFix"></image>
					<view class="balances-info" v-if="showClass!=='recommend' && showClass!='UFP10'">
						<text v-if="showClass=='cv'">{{ item.type }} </text>
						<text v-if="item.type < 3">订单号: {{ item.order_no }}</text>
						<text v-if="showClass !=='past_n_week_qv'">{{$lang('common.member')}}ID: {{item.member_id}}</text>
						<text v-if="showClass !=='past_n_week_qv'">{{$lang('common.membername')}}: {{item.surname}}{{item.firstname}}</text>
						<text v-if="item.type == 3">左区总CV: {{item.lcv}}  右区总CV: {{item.rcv}}</text>
						<text v-if="showClass=='past_n_week_qv'">{{ item.yearweek }}周 </text>
						<text v-if="showClass=='past_n_week_qv' && item.lqv_past6weeks">左区过去8周总和 {{ item.lqv_past6weeks }} </text>
						<text v-if="showClass=='past_n_week_qv' && item.rqv_past6weeks">右区过去8周总和 {{ item.rqv_past6weeks }} </text>
					</view>
					<view class="balances-num" v-if="showClass!='recommend' && showClass!='past_n_week_qv' && showClass!='UFP10' ">
						<text :class="item.bonus > 0 ? 'color-base-text' : ''">{{ item.bonus > 0 ? '+' + item.bonus :(item.bonus==0 ? '': '-'+item.bonus) }}</text>
					</view>
					<view class="balances-num" v-if="showClass =='past_n_week_qv' ">
						<text class= "color-norm-text" v-if="showClass=='past_n_week_qv' && item.LQV_WEEK>=0 ">{{ item.LQV_WEEK }}</text>
						<text class= "color-norm-text" v-if="showClass=='past_n_week_qv' && item.RQV_WEEK>=0 ">{{ item.RQV_WEEK }}</text>
					</view>
					<view class="balances-info" v-if="showClass=='recommend'">
						<text>{{$lang('common.member')}}ID: {{item.member_id}}</text>
						<text>{{$lang('common.membername')}}: {{item.surname}}{{item.firstname}}</text>
						<text :isActive="item.actived">{{ item.actived==1 ? $lang('common.active') : $lang('common.inactive')}} </text>
					</view>
					<view class="balances-info" v-if="showClass=='UFP10'">
						<text>{{$lang('common.member')}}ID: {{item.member_id}}</text>
						<text>{{$lang('common.membername')}}: {{item.surname}}{{item.firstname}}</text>
						<text>{{ item.source_member_branch }}</text>
					</view>
				</view>
				<ns-empty v-if="!accountList.length && showEmpty" text="暂无信息" :isIndex="!1"></ns-empty>
			</block>
			<loading-cover ref="loadingCover"></loading-cover>
		</mescroll-uni>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				accountList: [],
				showEmpty: true,
				bonusType: 1,
				lastweek: 0,
				showClass: 'bonus',
				branch: '',
			};
		},
		onLoad(e) {
			// console.log(e)
			this.showClass = e.class
			this.branch = e.branch == 'L' ?  '左区-left' :  '右区-right'
			this.bonusType = e.type
			this.lastweek = e.lastweek
		},
		onShow() {
			// this.getData(this.mescroll);
		},
		mixins: [globalConfig],
		methods: {
			getData(mescroll) {
				if (mescroll.num == 1) {
					this.accountList = [];
				}
				this.$api.sendRequest({
					// url: '/api/member/getBonusPageList',
					url: '/api/member/getBonusPageList',
					data: {
						class: this.showClass,
						bonusType: this.bonusType,
						lastweek: this.lastweek,
						branch: this.branch,
						page: mescroll.num,
						page_size: mescroll.size
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data ) {
							newArr = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.accountList = []; //如果是第一页需手动制空列表
						this.accountList = this.accountList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						this.showEmpty = true;
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	/deep/ .empty {
		margin-top: 0 !important;
	}

	/deep/ .member-point .mescroll-uni-content {
		overflow: hidden;
	}
	.color-norm-text {
		font-size: $font-size-tag;
		color: $color-tip;
	}
	.bill {
		max-width: 1200px;
		margin: 0 auto;
	}

	.balances {
		width: calc(100% - 60rpx);
		max-width: 1200px;
		border-radius: 10rpx;
		margin: 0 auto;
		padding: 27rpx 27rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		background: #fff;
		margin-bottom: 18rpx;
		margin-top: 18rpx;

		image {
			width: 54rpx;
			height: 54rpx;
			border-radius: 50%;
		}

		.balances-info {
			flex: 1;
			margin-left: 16rpx;
			display: flex;
			flex-direction: column;

			text {
				line-height: 1;

				&:last-child {
					font-size: $font-size-base;
				}

				&:nth-child(2) {
					margin-top: 18rpx;
					font-size: $font-size-tag;
					color: $color-tip;
				}

				&:nth-child(3) {
					font-size: $font-size-tag;
					margin-top: 19rpx;
					color: $color-tip;
				}
			}
			text[isActive='1'] {
				color: #1767b3;
			}
			text[isActive='0'] {
				color: #fc354f;
			}
		}

		.balances-num {
			text {
				line-height: 1;
				font-size: $font-size-toolbar;
				color: #000;
			}
		}
	}
</style>
