<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		<!-- 选择地址 -->
		<template v-if="orderPaymentData.exchange_info.type == 1 && orderPaymentData.is_virtual == 0">
			<view class="address-box" v-if="orderPaymentData.delivery.delivery_type != 'store'">
				<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
					<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
					<view class="content">
						<text class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
						<text class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
						<text class="cell-more iconfont iconright"></text>
						<view class="desc-wrap">
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
						</view>
					</view>
				</view>
				<view class="empty-wrap" v-else @click="selectAddress">
					<view class="icon-wrap"><view class="iconfont icondizhi empty"></view></view>
					<view class="info">请设置收货地址</view>
					<view class="cell-more"><view class="iconfont iconright"></view></view>
				</view>

				<!-- 外卖配送 -->
				<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
					<view class="order-cell">
						<text class="tit">配送时间</text>
						<view class="box">
							<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
							<text v-if="deliveryWeek">
								<template v-if="timeInfo.showTime">
									（
								</template>
								{{ deliveryWeek }}
								<template v-if="timeInfo.showTime">
									）
								</template>
							</text>
							<text v-if="!canLocalDelicery">（休息中）</text>
						</view>
					</view>
					<picker
						v-if="timeInfo.showTimeBar && orderPaymentData.member_address && canLocalDelicery"
						:value="orderCreateData.buyer_ask_delivery_time"
						mode="time"
						@change="bindTimeChange"
					>
						<view class="pick-block">
							<view class="font-size-base">送达时间</view>
							<view class="time-picker">
								<text>{{ orderCreateData.buyer_ask_delivery_time }}</text>
								<text class="iconfont iconright cell-more"></text>
							</view>
						</view>
					</picker>
				</view>
			</view>

			<view class="mobile-wrap" v-if="orderPaymentData.delivery.delivery_type == 'store' && storeInfo.currStore">
				<view class="form-group">
					<text class="iconfont icondianhua2"></text>
					<text class="text">预留手机</text>
					<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile" />
				</view>
			</view>

			<!-- 配送方式 -->
			<view class="delivery-mode" v-if="orderPaymentData.express_type.length > 1">
				<view class="head">
					<text class="iconfont iconwuliu"></text>
					<text>配送方式</text>
				</view>
				<view class="action">
					<button
						v-for="(deliveryItem, deliveryIndex) in orderPaymentData.express_type"
						:key="deliveryIndex"
						:type="deliveryItem.name == orderPaymentData.delivery.delivery_type ? 'primary' : 'default'"
						@click="selectDeliveryType(deliveryItem)"
						size="mini"
					>
						{{ deliveryItem.title }}
					</button>
				</view>
			</view>

			<!-- 选择门店 -->
			<view class="store-box" v-if="orderPaymentData.delivery.delivery_type == 'store'">
				<view v-if="storeInfo.currStore" @click="openSiteDelivery" class="store-info">
					<view v-if="storeInfo.currStore.store_image" class="icon img"><image :src="$util.img(storeInfo.currStore.store_image)" mode="aspectFill"></image></view>
					<view v-else class="icon"><view class="iconfont iconmendian"></view></view>
					<view class="info-wrap">
						<view class="title">
							<text>{{ storeInfo.currStore.store_name }}</text>
							<view class="cell-more iconfont iconright"></view>
						</view>
						<view class="store-detail">
							<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
							<view>地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
						</view>
					</view>
				</view>
				<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
			</view>
		</template>

		<!-- 虚拟商品展示手机号 -->
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1 && orderCreateData.member_address">
			<view class="tips color-base-text">购买虚拟类商品需填写手机号，方便商家与您联系</view>
			<view class="form-group">
				<text class="iconfont icondianhua2"></text>
				<text class="text">手机号码</text>
				<input
					type="number"
					maxlength="11"
					placeholder="请输入您的手机号码"
					placeholder-class="color-tip placeholder"
					class="input"
					v-model="orderCreateData.member_address.mobile"
				/>
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap" :class="orderPaymentData.exchange_info.type == 2 || orderPaymentData.exchange_info.type == 3 ? 'margin-top' : ''">
			<view class="site-body">
				<view class="goods-wrap">
					<block v-if="orderPaymentData.exchange_info.type == 2">
						<view class="goods-img">
							<image
								:src="orderPaymentData.exchange_info.image ? $util.img(orderPaymentData.exchange_info.image) : $util.img('upload/uniapp/point/coupon.png')"
								@error="imageError()"
								mode="aspectFill"
							></image>
						</view>
					</block>
					<block v-else-if="orderPaymentData.exchange_info.type == 3">
						<view class="goods-img">
							<image
								:src="orderPaymentData.exchange_info.image ? $util.img(orderPaymentData.exchange_info.image) : $util.img('upload/uniapp/point/hongbao.png')"
								@error="imageError()"
								mode="aspectFill"
							></image>
						</view>
					</block>
					<block v-else>
						<view class="goods-img"><image :src="$util.img(orderPaymentData.exchange_info.image)" @error="imageError()" mode="aspectFill"></image></view>
					</block>
					<view class="goods-info">
						<view class="goods-name">{{ orderPaymentData.exchange_info.name }}</view>
						<view class="goods-sub-section">
							<view v-if="orderPaymentData.exchange_info.pay_type == 1" class="color-base-text">
								<text class="goods-price">{{ orderPaymentData.exchange_info.point }}</text>
								<text class="unit">积分</text>
								<template v-if="orderPaymentData.exchange_info.price != '0.00'">
									<text class="unit">+{{ $lang('common.currencySymbol') }}</text>
									<text class="goods-price">{{ orderPaymentData.exchange_info.price }}</text>
								</template>
							</view>
							<view>
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ orderPaymentData.num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="site-footer">
				<view class="order-cell">
					<text class="tit">买家留言</text>
					<view class="box"><input type="text" placeholder="留言前建议先与商家协调一致" placeholder-class="color-tip" v-model="orderCreateData.buyer_message" /></view>
				</view>
			</view>
		</view>

		<!-- 金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">所需积分</text>
				<view class="box">
					<text class="money">{{ orderPaymentData.point }}</text>
					<text class="unit">积分</text>
				</view>
			</view>
		</view>

		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text class="font-size-base color-tip margin-right">共{{ orderPaymentData.goods_num }}件</text>
				<text class="font-size-base">合计：</text>
				<text class="color-base-text money">{{ orderPaymentData.point }}</text>
				<text class="color-base-text unit">积分</text>
				<template v-if="orderPaymentData.exchange_info.pay_type == 1 && orderPaymentData.price != '0.00'">
					<text class="color-base-text unit">+{{ $lang('common.currencySymbol') }}</text>
					<text class="color-base-text money">{{ orderPaymentData.price | moneyFormat }}</text>
				</template>
			</view>
			<view class="submit-btn"><button type="primary" size="mini" @click="openChoosePayment()">提交订单</button></view>
		</view>

		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<text class="tit">已为您甄选出附近所有相关门店</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-content">
						<view class="item-wrap" v-for="(item, index) in storeInfo.storeList" :key="index" @click="selectPickupPoint(item)">
							<view class="detail">
								<view class="name" :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										营业时间：{{ item.open_date }}
									</view>
									<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										地址：{{ item.full_address }}{{ item.address }}
									</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text class="iconfont iconyuan_checked color-base-text"></text></view>
						</view>
						<view v-if="!storeInfo.storeList" class="empty">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 选择支付方式弹窗 -->
		<ns-payment ref="choosePaymentPopup" :payMoney="orderPaymentData.price" @confirm="orderCreate"></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import payment from '../public/js/payment.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import globalConfig from '@/common/js/golbalConfig.js';
import nsPayment from '@/components/payment/payment.vue';

export default {
	components: {
		uniPopup,
		nsPayment
	},
	mixins: [payment, globalConfig]
};
</script>

<style lang="scss">
@import './../../../common/css/order_parment.scss';
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background: none;
	max-height: unset !important;
	overflow-y: hidden !important;
}
>>> .uni-popup__wrapper {
	border-radius: 20rpx 20rpx 0 0;
}
>>> .uni-popup {
	z-index: 8;
}
</style>
