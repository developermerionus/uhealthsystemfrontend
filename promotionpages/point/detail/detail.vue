<template>
	<view :data-theme="themeStyle">
		<view scroll-y="true" class="goods-detail" :class="isIphoneX ? 'active' : ''">
			<view class="goods-container">
				<view class="goods-media">
					<view class="goods-img show">
						<swiper class="swiper">
							<swiper-item :item-id="'goods_id_' + pointInfo.type">
								<view class="item" v-if="pointInfo.type == 2">
									<image
										class="adv-pic"
										:src="pointInfo.image ? $util.img(pointInfo.image) : $util.img('upload/uniapp/point/coupon.png')"
										@error="imageError($util.img('upload/uniapp/point/coupon.png'))"
										mode="aspectFit"
									></image>
								</view>
								<view class="item" v-else-if="pointInfo.type == 3">
									<image
										class="adv-pic"
										:src="pointInfo.image ? $util.img(pointInfo.image) : $util.img('upload/uniapp/point/hongbao.png')"
										@error="imageError($util.img('upload/uniapp/point/hongbao.png'))"
										mode="aspectFit"
									></image>
								</view>
								<view class="item" v-else><image class="adv-pic" :src="$util.img(pointInfo.image)" @error="imageError()" mode="aspectFit"></image></view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="group-wrap padding-top">
					<view class="goods-module-wrap">
						<text class="price-symbol color-base-text">{{ pointInfo.point }}积分</text>
						<template v-if="pointInfo.exchange_price != '0.00' && pointInfo.pay_type > 0">
							<text class="price-symbol color-base-text">+{{ $lang('common.currencySymbol') }}{{ pointInfo.exchange_price }}</text>
						</template>

						<view class="market-price-wrap" v-if="pointInfo.price">
							<text class="unit">{{ $lang('common.currencySymbol') }}</text>
							<text class="money">{{ pointInfo.price }}</text>
						</view>
						<view class="follow-and-share">
							<text class="color-tip">库存:{{ pointInfo.stock }}{{ pointInfo.unit }}</text>
						</view>
					</view>
					<view class="goods-module-wrap info">
						<text class="sku-name-wrap" v-if="pointInfo.type == 1">{{ pointInfo.goods_name }}</text>
						<text class="sku-name-wrap" v-else>{{ pointInfo.name }}</text>
					</view>
					<view class="coupon-desc">
						<view v-if="pointInfo.balance && pointInfo.balance > 0" class="color-tip">内含{{ pointInfo.balance }}元</view>
						<view v-if="pointInfo.coupon_type == 'random'" class="color-tip">无门槛优惠券</view>
						<view v-if="pointInfo.coupon_type == 'reward'" class="color-tip">{{ '满' + pointInfo.at_least + '减' + pointInfo.money }}</view>
						<view v-if="pointInfo.coupon_type == 'discount'" class="color-tip">
							满{{ pointInfo.at_least }}元
							<text>{{ pointInfo.discount }}折</text>
						</view>
						<view v-if="pointInfo.coupon_type == 'discount'" class="color-tip">最多优惠{{ pointInfo.discount_limit }}元</view>
						<view class="time color-tip" v-if="pointInfo.coupon_type">
							{{ pointInfo.validity_type == 1 ? '领取之日起' + pointInfo.fixed_term + '天内有效' : $util.timeStampTurnTime(pointInfo.end_time) + '到期' }}
						</view>
					</view>
				</view>
				<block v-if="pointInfo.type == 1">
					<view class="newdetail margin-bottom">
						<!-- 已选规格 -->
						<view class="item selected-sku-spec" v-if="pointInfo.sku_spec_format" @click="exchange">
							<view class="label">选择</view>
							<view class="box">
								<text v-for="(item, index) in pointInfo.sku_spec_format" :key="index">{{ item.spec_name }}/{{ item.spec_value_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</view>

						<view class="item goods-attribute" @click="openAttributePopup()" v-if="pointInfo.goods_attr_format && pointInfo.goods_attr_format.length > 0">
							<view class="label">属性</view>
							<view class="box">
								<text v-for="(item, index) in pointInfo.goods_attr_format" :key="index" v-if="index < 2">{{ item.attr_name }}: {{ item.attr_value_name }}</text>
							</view>
							<text class="iconfont iconright"></text>
						</view>

						<view class="item service" @click="openMerchantsServicePopup()" v-if="pointInfo.goods_service && pointInfo.goods_service.length">
							<view class="label">服务</view>
							<view class="list-wrap">
								<view class="item-wrap" v-for="(item, index) in pointInfo.goods_service" :key="index" v-if="index < 3">
									<text class="iconfont icondui color-base-text"></text>
									<text>{{ item.service_name }}</text>
								</view>
							</view>
							<text class="iconfont iconright"></text>
						</view>
					</view>

					<!-- 商品属性 -->
					<view @touchmove.prevent.stop>
						<uni-popup ref="attributePopup" type="bottom">
							<view class="goods-attribute-popup-layer popup-layer">
								<view class="head-wrap" @click="closeAttributePopup()">
									<text>商品属性</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y class="goods-attribute-body">
									<view class="item" v-for="(item, index) in pointInfo.goods_attr_format" :key="index">
										<text class="attr-name">{{ item.attr_name }}</text>
										<text class="value-name">{{ item.attr_value_name }}</text>
									</view>
								</scroll-view>
								<view class="button-box"><button type="primary" @click="closeAttributePopup()">确定</button></view>
							</view>
						</uni-popup>
					</view>
					<!-- 商品服务 -->
					<view @touchmove.prevent.stop>
						<uni-popup ref="merchantsServicePopup" type="bottom">
							<view class="goods-merchants-service-popup-layer popup-layer">
								<view class="head-wrap" @click="closeMerchantsServicePopup()">
									<text>商品服务</text>
									<text class="iconfont iconclose"></text>
								</view>
								<scroll-view scroll-y>
									<view class="item" :class="{ 'empty-desc': !item.desc }" v-for="(item, index) in pointInfo.goods_service" :key="index">
										<view class="iconfont icondui color-base-text"></view>
										<view class="info-wrap">
											<text class="title">{{ item.service_name }}</text>
											<text class="describe" v-if="item.desc">{{ item.desc }}</text>
										</view>
									</view>
								</scroll-view>
								<view class="button-box"><button type="primary" @click="closeMerchantsServicePopup()">确定</button></view>
							</view>
						</uni-popup>
					</view>
				</block>

				<!-- 详情 -->
				<view class="goods-detail-tab">
					<view class="detail-tab"><view class="tab-item">兑换详情</view></view>

					<view class="detail-content">
						<view class="detail-content-item">
							<view class="goods-details" v-if="pointInfo.content"><rich-text :nodes="pointInfo.content"></rich-text></view>
							<view class="goods-details active" v-else>暂无兑换详情！</view>
						</view>
					</view>
				</view>

				<!-- SKU选择 -->
				<ns-goods-sku
					ref="goodsSku"
					@refresh="refreshGoodsSkuDetail"
					:goods-detail="pointInfo"
					:max-buy="pointInfo.max_buy"
					:min-buy="pointInfo.min_buy"
					source="point"
				></ns-goods-sku>
			</view>
		</view>
		<view class="detail-swap" @click="exchange" :class="{ 'position-bottom': isIphoneX }"><button type="primary">兑换</button></view>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-login ref="login"></ns-login>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import htmlParser from '@/common/js/html-parser';
import globalConfig from '@/common/js/golbalConfig.js';
import nsGoodsSku from '@/components/ns-goods-sku/ns-goods-sku.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
export default {
	components: {
		uniPopup,
		uniNumberBox,
		nsGoodsSku,
		toTop
	},
	data() {
		return {
			id: 0,
			pointInfo: {
				image: ''
			},
			isIphoneX: false, //判断手机是否是iphoneX以上
			isLogin: false,
			memberPoint: 0
		};
	},
	mixins: [globalConfig, scroll],
	onLoad(options) {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (options.id) {
			this.id = options.id;
			this.getPointInfo();
		} else {
			this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
		}
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
	},
	computed: {
		storeToken() {
			return this.$store.state.token;
		},
		enough() {
			return parseInt(this.pointInfo.point) > parseInt(this.memberPoint);
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			if (nVal) {
				this.isLogin = true;
				this.getPointInfo();
			}
		}
	},
	methods: {
		//获取个人积分信息
		getAccountInfo(e, f) {
			if (uni.getStorageSync('token')) {
				this.$api.sendRequest({
					url: '/api/memberaccount/info',
					data: {
						account_type: 'point'
					},
					success: res => {
						if (res.code == 0 && res.data) {
							this.isLogin = true;
							this.memberPoint = res.data.point;
							let point_num = Math.floor(parseInt(res.data.point) / f);
							this.Max = e >= point_num ? point_num : e;
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			} else {
				this.isLogin = false;
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},

		//获取详情
		getPointInfo() {
			this.$api.sendRequest({
				url: '/pointexchange/api/goods/detail',
				data: {
					id: this.id
				},
				success: res => {
					if (res.code >= 0 && res.data.length !== 0) {
						this.pointInfo = res.data;

						this.$langConfig.title(this.pointInfo.name);
						let save = this.pointInfo.type == 2 ? this.pointInfo.count : this.pointInfo.stock;

						if (this.pointInfo.type == 1) {
							this.pointInfo.image = this.pointInfo['sku_image'];

							// 当前商品SKU规格
							if (this.pointInfo.sku_spec_format) this.pointInfo.sku_spec_format = JSON.parse(this.pointInfo.sku_spec_format);

							// 商品属性
							if (this.pointInfo.goods_attr_format) {
								let goods_attr_format = JSON.parse(this.pointInfo.goods_attr_format);
								this.pointInfo.goods_attr_format = this.$util.unique(goods_attr_format, 'attr_id');
								for (var i = 0; i < this.pointInfo.goods_attr_format.length; i++) {
									for (var j = 0; j < goods_attr_format.length; j++) {
										if (
											this.pointInfo.goods_attr_format[i].attr_id == goods_attr_format[j].attr_id &&
											this.pointInfo.goods_attr_format[i].attr_value_id != goods_attr_format[j].attr_value_id
										) {
											this.pointInfo.goods_attr_format[i].attr_value_name += '、' + goods_attr_format[j].attr_value_name;
										}
									}
								}
							}
							if (this.pointInfo.goods_spec_format) this.pointInfo.goods_spec_format = JSON.parse(this.pointInfo.goods_spec_format);
						}

						this.pointInfo.unit = this.pointInfo.unit || '件';

						// 商品详情
						if (this.pointInfo.content) this.pointInfo.content = htmlParser(this.pointInfo.content);

						this.getAccountInfo(save, this.pointInfo.point);
					} else {
						this.$util.showToast({
							title: res.message
						});
						setTimeout(() => {
							this.$util.redirectTo('/promotionpages/point/list/list', {}, 'redirectTo');
						}, 1000);
					}
				}
			});
		},

		// 立即购买
		exchange() {
			if (!uni.getStorageSync('token')) {
				this.$refs.login.open('/promotionpages/point/detail/detail?id=' + this.id);
				return;
			}
			this.$refs.goodsSku.show('point');
		},

		/**
		 * 刷新商品详情数据
		 * @param {Object} goodsSkuDetail
		 */
		refreshGoodsSkuDetail(pointInfo) {
			Object.assign(this.pointInfo, pointInfo);
			this.pointInfo.unit = this.pointInfo.unit || '件';
		},
		//服务
		openMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.open();
		},
		closeMerchantsServicePopup() {
			this.$refs.merchantsServicePopup.close();
		},
		//属性
		openAttributePopup() {
			this.$refs.attributePopup.open();
		},
		closeAttributePopup() {
			this.$refs.attributePopup.close();
		},
		imageError() {
			this.pointInfo.image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
@import './../../../common/css/goods_detail.scss';
@import '../public/css/detail.scss';
.group-wrap .goods-module-wrap.info{
	padding-bottom: 10rpx;
}
.group-wrap{
	padding-bottom: 20rpx;
}

.detail-swap {
	box-sizing: border-box;
	background: #ffffff;
	position: fixed;
	left: 0;
	bottom: 0rpx;
	width: 100%;
	padding: 20rpx 0;
	padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)) !important;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom)) !important;

	button {
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 80rpx;
	}
}
</style>
<style scoped>
/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	max-height: unset !important;
}
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
