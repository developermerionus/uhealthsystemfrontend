<template>
	<view class="detail-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<navbar></navbar>
		<!-- 订单状态 -->
		<view class="status-wrap color-base-bg" :style="{ backgroundImage: 'url(' + $util.img('upload/uniapp/order/status-wrap-bg.png') + ')' }">
			<view class="order-status-left">
				<image :src="$util.img(action.icon)"></image>
				<view class="status-name">
					<view>{{ orderData.order_status_name }}</view>
				</view>
			</view>
		</view>

		<!-- 地址信息 -->
		<view class="address-wrap">
			<view class="icon"><view class="iconfont iconlocation"></view></view>
			<view class="address-info">
				<view class="info">
					<text class="font-size-base">{{ orderData.name }}; {{ orderData.mobile }} {{ orderData.member_id}}</text>
				</view>
				<view class="detail">
					<view v-if = 'orderData.country_id == 172'>
						<text class="font-size-base" >收货地址：{{ orderData.full_address }} {{ orderData.address }}</text>
						<text class="font-size-base" >身份证号码：{{ orderData.receiver_official_id}}</text>
					</view>
					<text class="font-size-base" v-else>Shipping Address：{{ orderData.address }}, {{ orderData.full_address }} </text>
				</view>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<!-- <view class="site-header">
				<view class="iconfont icondianpu"></view>
				<text class="site-name">{{ orderData.site_name }}</text>
				<view class="iconfont iconright"></view>
			</view> -->
			<view class="site-body">
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderData.order_goods" :key="goodsIndex">
					<view class="goods-img" @click="goDetail(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="goDetail(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="sku" v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{ (goodsItem.sku_spec_format.length - 1) > i ? '; ' : '' }}
								</block>
							</view>
						</view>
						<view class="goods-sub-section">
							<view>
								<text class="goods-price color-base-text">
									<text class="unit">{{ $lang('common.currencySymbol') }}</text>
									<text class="font-size-base">{{ goodsItem.price }}</text>
								</text>
							</view>
							<view>
								<text class="font-size-base">
									<text class="iconfont iconclose"></text>
									{{ goodsItem.num }}
								</text>
							</view>
						</view>
						<!-- <view class="goods-action" v-if="orderData.is_enable_refund">
							<view @click="goRefund(goodsItem.order_goods_id)" v-if="goodsItem.refund_status == 0 || goodsItem.refund_status == -1">
								<view class="order-box-btn">退款</view>
							</view>
							<view @click="goRefundDetail(goodsItem.order_goods_id)" v-else><view class="order-box-btn">查看退款</view></view>
						</view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 订单概况 -->
		<view class="order-summary">
			<view class="order-cell">
				<text class="tit">{{$lang('order_no')}}：</text>
				<view class="box">
					<text class="color-title">{{ orderData.order_no }}</text>
					<view class="copy" @click="$util.copy(orderData.order_no)">{{$lang('copy')}}</view>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">{{$lang('order_trans')}}：</text>
				<view class="box">
					<text class="color-title">{{ orderData.out_trade_no }}</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">{{$lang('create_time')}}：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.create_time) }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.close_time > 0">
				<text class="tit">{{$lang('close_time')}}：</text>
				<view class="box">
					<text class="color-title">{{ $util.timeStampTurnTime(orderData.close_time) }}</text>
				</view>
			</view>
			<block v-if="orderData.pay_status > 0">
				<view class="hr"></view>
				<view class="order-cell">
					<text class="tit">{{$lang('common.pay_method')}}：</text>
					<view class="box">
						<text class="color-title">{{ $lang('common.'+ orderData.pay_type_name) }}</text>
					</view>
				</view>
				<view class="order-cell">
					<text class="tit">{{$lang('common.pay_time')}}：</text>
					<view class="box">
						<text class="color-title">{{ $util.timeStampTurnTime(orderData.pay_time) }}</text>
					</view>
				</view>
			</block>
			<!-- <view class="order-cell" v-if="orderData.delivery_type_name">
				<text class="tit">{{$lang('delivery_type')}}：</text>
				<view class="box">
					<text class="color-title">{{ orderData.delivery_type_name }}</text>
				</view>
			</view> -->
			<view class="order-cell" v-if="orderData.buyer_message != ''">
				<text class="tit">买家留言：</text>
				<view class="box">
					<text class="color-title">{{ orderData.buyer_message }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_type_name != ''">
				<text class="tit">活动优惠：</text>
				<view class="box">
					<text class="color-title">{{ orderData.promotion_type_name }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.waybillno != ''">
				<text class="tit">物流追踪号：</text>
				<view class="box">
					<text class="color-title">{{ orderData.waybillno }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.remark">
				<text class="tit">{{$lang('orderComments')}}:</text>
				<view class="box">
					<text>{{ orderData.remark }}</text>
				</view>
			</view>
			<!-- 联系客服 -->
			<view class="kefu">
				<!-- #ifdef MP -->
				<!-- <button type="default" hover-class="none" open-type="contact" v-if="kefuConfig.weapp == 1">
					<text class="iconfont iconziyuan"></text>
					<text>{{$lang('customer_service')}}</text>
				</button>
				<view v-else-if="kefuConfig.system == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>{{$lang('customer_service')}}</text>
				</view> -->
				<!-- #endif -->
				<!-- #ifndef MP -->
				<!-- <view v-if="kefuConfig.open == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>{{$lang('customer_service')}}</text>
				</view>
				<view v-else-if="kefuConfig.system == 1" @click="goConnect">
					<text class="iconfont iconziyuan"></text>
					<text>{{$lang('customer_service')}}</text>
				</view> -->
				<!-- #endif -->
			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">{{$lang('common.amount')}}</text>
				<view class="box align-right">
					<text class="color-title">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						{{ orderData.goods_money }}
					</text>
				</view>
			</view>
			<view class="order-cell">
				<text class="tit">{{$lang('common.fare')}}</text>
				<view class="box align-right">
					<text class="color-base-text">
						<!-- <text class="operator">+</text> -->
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.delivery_money }}</text>
					</text>
				</view>
			</view>
			<!-- <view class="order-cell" v-if="orderData.member_card_money">
				<text class="tit">会员卡</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.member_card_money }}</text>
					</text>
				</view>
			</view> -->
			<view class="order-cell" v-if="orderData.invoice_money > 0">
				<text class="tit">
					{{$lang('common.tax')}}
					<!-- <text class="color-base-text">({{ orderData.invoice_rate }}%)</text> -->
				</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.invoice_delivery_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.adjust_money != 0">
				<text class="tit">订单调整</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator" v-if="orderData.adjust_money < 0">-</text>
						<text class="operator" v-else>+</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.adjust_money | abs }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.promotion_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.coupon_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.new_coupon_cost > 0">
				<text class="tit">{{$lang('common.use_coupon')}}</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.new_coupon_cost }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.balance_money > 0">
				<text class="tit">{{$lang('common.use_account_balance')}}</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.balance_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderData.point_money > 0">
				<text class="tit">积分抵扣</text>
				<view class="box align-right">
					<text class="color-base-text">
						<text class="operator">-</text>
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text>{{ orderData.point_money }}</text>
					</text>
				</view>
			</view>
			<view class="order-cell">
				<view class="box align-right">
					<text>{{$lang('common.total_amount')}}：</text>
					<text class="color-base-text">
						<text class="font-size-goods-tag">{{ $lang('common.currencySymbol') }}</text>
						<text class="font-size-base">{{ orderData.pay_money }}</text>
					</text>
				</view>
			</view>

			<view class="order-action" :class="{ 'bottom-safe-area': isIphoneX }" v-if="orderData.action.length > 0">
				<view class="order-box-btn white" v-if="evaluateConfig.evaluate_status == 1 && orderData.is_evaluate == 1" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
				<view
					class="order-box-btn"
					:class="operationItem.action == 'orderPay' ? 'color-base-bg color-base-border' : 'white'"
					v-for="(operationItem, operationIndex) in orderData.action"
					:key="operationIndex"
					@click="operation(operationItem.action)"
				>
					{{ operationItem.title }}
				</view>
			</view>
			<view
				class="order-action"
				:class="{ 'bottom-safe-area': isIphoneX }"
				v-else-if="orderData.action.length == 0 && orderData.is_evaluate == 1 && evaluateConfig.evaluate_status == 1"
			>
				<view class="order-box-btn white" @click="operation('memberOrderEvaluation')">
					<text v-if="orderData.evaluate_status == 0">评价</text>
					<text v-else-if="orderData.evaluate_status == 1">追评</text>
				</view>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderData.pay_money" @confirm="pay"></ns-payment>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import orderMethod from '../public/js/orderMethod.js';
import nsPayment from '@/components/payment/payment.vue';

export default {
	data() {
		return {
			isIphoneX: false,
			orderId: 0,
			orderData: {
				action: []
			},
			action: {
				icon: ''
			},
			kefuConfig: {
				weapp: '',
				system: '',
				open: '',
				open_url: ''
			},
			evaluateConfig: {
				evaluate_audit: 1,
				evaluate_show: 0,
				evaluate_status: 1
			},
			member: {},
			member_name: '',
		};
	},
	mixins: [globalConfig, orderMethod],
	components: {
		nsPayment
	},
	computed: {

	},
	onLoad(option) {
		if (option.order_id) this.orderId = option.order_id;
		// this.getOrderData();
		this.getMemberInfo();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();

		this.isIphoneX = this.$util.uniappIsIPhoneX();

		if (uni.getStorageSync('token')) {
			this.getEvaluateConfig();
			// console.log('onshow')
			this.getOrderData();
		} else {
			this.$util.redirectTo('/pages/login/login/login', { back: '/pages/order/detail/detail?order_id=' + this.orderId });
		}
		this.getKekuConfig();
	},
	methods: {
		getMemberInfo() {
			this.$api.sendRequest({
				url: '/api/member/info',
				success: res => {
					if (res.code == 0) {
						this.member.firstname = res.data.firstname
						this.member.lastname = res.data.surname
						this.member.firstnamePY = res.data.firstnamePY
						this.member.lastnamePY = res.data.surnamePY
						this.member.country_id = res.data.marketCountryId
						this.member.id_number = res.data.id_number
						this.member_name = this.member.country_id == 172 ? this.member.lastname+this.member.firstname+' '+this.member.lastnamePY+this.member.firstnamePY: this.member.lastname+','+this.member.firstname;
						// console.log(this.member_name);
					}
				},
			})
		},
		//联系客服
		goConnect() {
			if (uni.getStorageSync('token')) {
				let data = {
					order_id: this.orderId
				};
				// #ifdef MP
				if (this.kefuConfig.system == 1) {
					this.$util.redirectTo('/otherpages/chat/room/room', data);
					return false;
				}
				// #endif
				// #ifndef MP

				if (this.kefuConfig.open == 1) {
					this.$util.redirectTo('/otherpages/webview/webview', { link: encodeURIComponent(this.kefuConfig.open_url) });
					return false;
				}
				if (this.kefuConfig.system == 1) {
					this.$util.redirectTo('/otherpages/chat/room/room', data);
					return false;
				}
				// #endif
			} else {
				this.$refs.login.open('/pages/goods/detail/detail?sku_id=' + this.orderData.sku_id);
				return;
			}
		},
		getKekuConfig() {
			this.$api.sendRequest({
				url: '/api/config/servicer',
				success: res => {
					if (res.code == 0) {
						this.kefuConfig = res.data;
						if (this.kefuConfig.system && !this.addonIsExit.servicer) this.kefuConfig.system = 0;
					}
				}
			});
		},
		goDetail(id) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: id });
		},
		goRefund(id) {
			this.$util.redirectTo('/pages/order/refund/refund', { order_goods_id: id });
		},
		goRefundDetail(id) {
			this.$util.redirectTo('/pages/order/refund_detail/refund_detail', { order_goods_id: id });
		},
		getOrderData() {
			this.$api.sendRequest({
				url: '/api/order/detail',
				data: {
					order_id: this.orderId
				},
				
				success: res => {
					//console.log(res);
					uni.stopPullDownRefresh();
					if (res.code >= 0) {
						this.orderData = res.data;
						this.orderData.order_goods.forEach(v => {
							if (v.sku_spec_format) {
								v.sku_spec_format = JSON.parse(v.sku_spec_format);
							} else {
								v.sku_spec_format = [];
							}
						});
						this.action = JSON.parse(res.data.order_status_action);
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list/list');
						}, 1500);
					}
				},
				fail: res => {
					uni.stopPullDownRefresh();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 下拉刷新
		 */
		onPullDownRefresh() {
			this.getOrderData();
		},
		operation(action) {
			switch (action) {
				case 'orderPay': // 支付
					this.orderPay(this.orderData);
					break;
				case 'orderClose': //关闭
					this.orderClose(this.orderData.order_id, () => {
						this.getOrderData();
					});
					break;
				case 'memberTakeDelivery': //收货
					this.orderDelivery(this.orderData.order_id, () => {
						this.getOrderData();
					});
					break;
				case 'trace': //查看物流
					this.$util.redirectTo('/pages/order/logistics/logistics', { order_id: this.orderData.order_id });
					break;
				case 'memberOrderEvaluation': //评价
					this.$util.redirectTo('/pages/order/evaluate/evaluate', { order_id: this.orderData.order_id });
					break;
			}
		},
		imageError(index) {
			this.orderData.order_goods[index].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		getEvaluateConfig() {
			this.$api.sendRequest({
				url: '/api/goodsevaluate/config',
				success: res => {
					if (res.code == 0) {
						var data = res.data;
						this.evaluateConfig = data;
					}
				}
			});
		},
		// 显示选择支付方式弹框
		openChoosePayment() {
			this.$refs.choosePaymentPopup.open();
		}
	},
	filters: {
		abs(value) {
			return Math.abs(parseFloat(value)).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/detail.scss';
</style>
