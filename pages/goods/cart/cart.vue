<template>
	<view :data-theme="themeStyle" class="allPage" :class="{ bottom: hasData }" >
		<navbar></navbar>
		<view class="cart-header fixed" v-if="cartData.length">
			<view class="num-wrap font-size-toolbar">
				{{ $lang('common.total')}}
				<text class="color-base-text">{{ cartData[0].cartList.length }}</text>
				{{$lang ('common.product_in_cart')}}
			</view>
			<view class="cart-action" @click="changeAction">{{ isAction ? $lang('complete') : $lang('edit') }}</view>
		</view>
		<scroll-view class="container" :scroll-x="true" :show-scrollbar="false">
			<block v-if="hasData">
				<view class="cart-wrap" v-for="(siteItem, siteIndex) in cartData" :key="siteIndex">
					<view class="fixed-wrap"></view>
					<block v-for="(item, cartIndex) in siteItem.cartList" :key="cartIndex">
						<view class="cart-goods" @touchstart="touchS($event)" @touchend="touchE($event, item)">
							<view class="goods-wrap" :class="{ edit: item.edit }">
								<view
									class="iconfont"
									:class="item.checked ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"
									@click="singleElection(siteIndex, cartIndex)"
								></view>
								<view @click="toGoodsDetail(item)" class="goods-img">
									<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(siteIndex, cartIndex)" mode="aspectFill"></image>
								</view>
								<view class="goods-info">
									<view @click="toGoodsDetail(item)" class="goods-name">{{ item.goods_name }}</view>
									<view class="sku" v-if="item.sku_spec_format">
										<view class="goods-spec">
											<block v-for="(x, i) in item.sku_spec_format" :key="i">
												{{ x.spec_value_name }} {{  (item.sku_spec_format.length - 1)>i ? ';' : '' }}
											</block>
										</view>
									</view>
									<view class="goods-sub-section">
										<block v-if="item.promotion_type == 1">
											<block v-if="Number(item.member_price) > 0 && Number(item.member_price) < Number(item.discount_price)">
												<view class="goods-price color-base-text">
													<view class="bottom-price color-base-text">
														<text class="unit">{{ $lang('common.currencySymbol') }}</text>
														{{ item.member_price }}
														<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
													</view>
												</view>
											</block>
											<block v-else>
												<view class="goods-price color-base-text">
													<view class="bottom-price color-base-text">
														<text class="unit">{{ $lang('common.currencySymbol') }}</text>
														{{ item.discount_price }}
														<image :src="$util.img('upload/uniapp/index/discount.png')"></image>
													</view>
												</view>
											</block>
										</block>
										<block v-else>
											<block v-if="Number(item.member_price) > 0">
												<view class="goods-price color-base-text">
													<view class="bottom-price color-base-text">
														<text class="unit">{{ $lang('common.currencySymbol') }}</text>
														{{ item.member_price }}
														<image :src="$util.img('upload/uniapp/index/VIP.png')"></image>
													</view>
												</view>
											</block>
											<block v-else>
												<view class="goods-price color-base-text">
													<view class="bottom-price color-base-text">
														<text class="unit">{{ $lang('common.currencySymbol') }}</text>
														{{ item.price }}
													</view>
												</view>
											</block>
										</block>
										<uni-number-box
											:min="item.min_buy > 1 ? item.min_buy : 1"
											:max="item.max_buy > 0 && item.max_buy < item.stock ? item.max_buy : item.stock"
											:value="initNum(item)"
											size="small"
											:modifyFlag="modifyFlag"
											@change="cartNumChange($event, { siteIndex, cartIndex })"
											@limit="goodsLimit($event, cartIndex)"
										/>
									</view>
								</view>
							</view>
							<view class="item-del color-base-bg" :class="{ show: item.edit }" @click="deleteCart('single', siteIndex, cartIndex)">{{ $lang('del') }}</view>
						</view>
					</block>
				</view>

				<view class="cart-wrap invalid" v-if="invalidGoods.length">
					<view class="cart-header">
						<view class="num-wrap">
							<text class="font-size-base">失效商品{{ invalidGoods.length }}件</text>
						</view>
						<view class="cart-action color-base-text font-size-goods-tag" @click="clearInvalidGoods">清空</view>
					</view>
					<block v-for="(goodsItem, goodsIndex) in invalidGoods" :key="goodsIndex">
						<view class="cart-goods invalid-goods">
							<view class="goods-wrap">
								<view class="iconfont iconyuan_checked color-tip"></view>
								<view class="goods-img"><image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" mode="aspectFill"></image></view>
								<view class="goods-info">
									<view class="goods-name">{{ goodsItem.sku_name }}</view>
									<view class="sku" v-if="goodsItem.sku_spec_format">
										<view class="goods-spec">
											<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
												{{ x.spec_value_name }} {{ (goodsItem.sku_spec_format.length - 1)>i ? '; ' : '' }}
											</block>
										</view>
									</view>
									<view class="goods-sub-section">
										<text class="goods-price color-base-text">
											<text class="unit">{{ $lang('common.currencySymbol') }}</text>
											<template v-if="goodsItem.member_price > 0 && goodsItem.member_price < goodsItem.discount_price">
												{{ goodsItem.member_price }}
											</template>
											<template v-else>
												{{ goodsItem.discount_price }}
											</template>
										</text>
										<text class="invalid-mark">已失效</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
			<block v-else>
				<view class="cart-empty">
					<image :src="$util.img('upload/uniapp/common-empty.png')" mode="aspectFit"></image>
					<view class="color-tip margin-top margin-bottom">{{ $lang('emptyTips') }}</view>
					<button type="primary" size="mini" class="button" v-if="token != ''" @click="$util.redirectTo('/pages/index/index/index', {}, 'reLaunch')">{{$lang('common.go_index')}}</button>
					<button type="primary" size="mini" class="button" v-else @click="toLogin">{{$lang('common.logon')}}</button>
				</view>
			</block>
		</scroll-view>
		<nsGoodsRecommend ref="goodrecommend"></nsGoodsRecommend>
		<view class="cart-bottom" :class="{ active: isIphoneX }" v-if="hasData" :style="{ bottom: cartBottom }">
			<view class="all-election" @click="allElection">
				<view class="iconfont" :class="checkAll ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></view>
				<text>{{ $lang('allElection') }}</text>
			</view>
			<view class="settlement-info" :style="{ visibility: isAction ? 'hidden' : 'visible' }">
				{{ $lang('total') }}：
				<text class="color-base-text font-size-toolbar">{{ $lang('common.currencySymbol') }} {{ totalPrice }}</text>
			</view>
			<view class="action-btn" v-if="isAction">
				<button type="primary" size="mini" @click="deleteCart('all')" plain class="delete">{{ $lang('del') }}</button>
			</view>
			<view class="action-btn" v-else>
				<button type="primary" size="mini" @click="settlement" v-if="totalCount != 0">{{ $lang('settlement') }}({{ totalCount }})</button>
				<button type="primary" size="mini" @click="settlement" disabled v-else>{{ $lang('settlement') }}({{ totalCount }})</button>
			</view>
		</view>
		<!-- 加载动画 -->
		<loading-cover ref="loadingCover"></loading-cover>
		<!-- 底部tabBar -->
		<diy-bottom-nav type="shop"></diy-bottom-nav>
		<!-- 返回顶部 -->
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>

		<ns-login ref="login"></ns-login>
	</view>
</template>

<script>
import nsGoodsRecommend from '@/components/ns-goods-recommend/ns-goods-recommend.vue';
import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		nsGoodsRecommend,
		uniNumberBox,
		diyBottomNav,
		toTop
	},
	mixins: [scroll, globalConfig],
	data() {
		return {
			token: '',
			cartData: [], // 购物车
			checkAll: true,
			totalPrice: '0.00',
			totalWeight: '0.00',
			totalCount: 0,
			modifyFlag: false,
			isSub: false,
			invalidGoods: [], // 失效商品集合
			isIphoneX: false, //判断手机是否是iphoneX以上,
			cartBottom: '56px',

			isAction: false, // 是否操作删除
			startX: '', // 触摸开始位置
			endX: '' // 触摸结束位置
		};
	},
	onLoad() {
		uni.hideTabBar();
	},
	onShow() {
		// 刷新多语言
		this.$langConfig.refresh();
		if (uni.getStorageSync('token')) {
			this.getCartData();
		} else {
			this.token = '';
			this.cartData = [];
			this.calculationTotalPrice();
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		if (this.$util.uniappIsIPhone11()) {
			this.cartBottom = '90px';
		}
	},
	onReady() {
		if (!uni.getStorageSync('token')) {
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		}
	},
	computed: {
		hasData() {
			return this.cartData.length > 0 || this.invalidGoods.length > 0;
		},
		storeToken() {
			return this.$store.state.token;
		}
	},
	watch: {
		storeToken: function(nVal, oVal) {
			this.getCartData();
		}
	},
	methods: {
		initNum(item) {
			let max_buy = item.max_buy > 0 && item.max_buy < item.stock ? item.max_buy : item.stock;
			max_buy = max_buy == 0 ? 1 : max_buy;
			if (item.num > max_buy) return max_buy;
			return item.num;
		},
		/**
		 * 获取购物车数据
		 */
		getCartData() {
			this.$api.sendRequest({
				url: '/api/cart/goodslists',
				success: res => {
					if (res.code >= 0) {
						this.token = uni.getStorageSync('token');
						if (res.data.length) this.handleCartData(res.data);
						else this.cartData = [];
					} else {
						this.token = '';
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		/**
		 * 处理购物车数据结构
		 */
		handleCartData(data) {
			this.invalidGoods = [];
			this.cartData = [];
			var temp = {};
			data.forEach((item, index) => {
				if (item.goods_state == 1) {
					// 如果最小限购超出库存则该商品失效
					if (item.min_buy > 0 && item.min_buy > item.stock) {
						this.invalidGoods.push(item);
					} else {
						item.checked = true;
						item.edit = false;
						if (temp['site_' + item.site_id] != undefined) {
							temp['site_' + item.site_id].cartList.push(item);
						} else {
							temp['site_' + item.site_id] = {
								siteId: item.site_id,
								siteName: item.site_name,
								edit: false,
								checked: true,
								cartList: [item]
							};
						}
					}
				} else {
					this.invalidGoods.push(item);
				}
			});

			this.cartData = [];
			Object.keys(temp).forEach(key => {
				this.cartData.push(temp[key]);
			});
			this.calculationTotalPrice();
			if (this.cartData.length) {
				this.cartData[0].cartList.forEach(v => {
					if (v.sku_spec_format) {
						v.sku_spec_format = JSON.parse(v.sku_spec_format);
					} else {
						v.sku_spec_format = [];
					}
				});
			}
			if (this.invalidGoods.length) {
				this.invalidGoods.forEach(v => {
					if (v.sku_spec_format) {
						v.sku_spec_format = JSON.parse(v.sku_spec_format);
					} else {
						v.sku_spec_format = [];
					}
				});
			}
		},
		/**
		 * 单选
		 * @param {Object} index
		 */
		singleElection(siteIndex, index) {
			this.cartData[siteIndex].cartList[index].checked = !this.cartData[siteIndex].cartList[index].checked;
			this.calculationTotalPrice();
		},
		/**
		 * 店铺全选
		 * @param {Object} checked
		 */
		siteAllElection(checked, index) {
			this.cartData[index].checked = checked;
			this.cartData[index].cartList.forEach(item => {
				item.checked = checked;
			});
			this.calculationTotalPrice();
		},
		/**
		 * 全选
		 */
		allElection(checked) {
			if (typeof checked == 'boolean') {
				this.checkAll = checked;
			} else {
				this.checkAll = !this.checkAll;
			}
			if (this.cartData.length) {
				this.cartData.forEach(siteItem => {
					siteItem.checked = this.checkAll;
					siteItem.cartList.forEach(item => {
						item.checked = this.checkAll;
					});
				});
			}
			this.calculationTotalPrice();
		},
		/**
		 * 计算购物车总价
		 */
		calculationTotalPrice() {
			if (this.cartData.length) {
				let totalPrice = 0,
					totalWeight = 0,
					totalCount = 0,
					siteAllElectionCount = 0;
				this.cartData.forEach(siteItem => {
					let siteGoodsCount = 0;
					siteItem.cartList.forEach(item => {
						if (item.checked) {
							siteGoodsCount += 1;
							totalCount += parseInt(item.num);
							if (Number(item.member_price) > 0 && Number(item.member_price) < Number(item.discount_price)) {
								totalPrice += item.member_price * item.num;
							} else {
								totalPrice += item.discount_price * item.num;
							}
							totalWeight += item.weight * item.num;
						}
					});
					if (siteItem.cartList.length == siteGoodsCount) {
						siteItem.checked = true;
						siteAllElectionCount += 1;
					} else {
						siteItem.checked = false;
					}
				});
				this.totalPrice = totalPrice.toFixed(2);
				this.totalWeight = totalWeight;
				this.totalCount = totalCount;
				this.checkAll = this.cartData.length == siteAllElectionCount;
			} else {
				this.totalPrice = '0.00';
				this.totalWeight = '0.00';
				this.totalCount = 0;
			}
			this.modifyFlag = false;
		},
		/**
		 * 删除购物车
		 * @param {Object} siteIndex
		 * @param {Object} cartIndex
		 */
		deleteCart(tag, siteIndex, cartIndex) {
			var cart_id = [];
			if (tag == 'all') {
				for (let i = 0; i < this.cartData.length; i++) {
					for (let j = 0; j < this.cartData[i].cartList.length; j++) {
						if (this.cartData[i].cartList[j].checked) cart_id.push(this.cartData[i].cartList[j].cart_id);
					}
				}
			} else {
				cart_id.push(this.cartData[siteIndex].cartList[cartIndex].cart_id);
			}
			if (cart_id.length == 0) {
				this.$util.showToast({ title: '请选择要删除的商品' });
				return;
			}

			uni.showModal({
				title: '提示',
				content: '确定要删除这些商品吗？',
				success: res => {
					if (res.confirm) {
						cart_id = cart_id.toString();
						this.calculationTotalPrice();
						this.getCartNumber();
						this.$api.sendRequest({
							url: '/api/cart/delete',
							data: { cart_id },
							success: res => {
								if (res.code >= 0) {
									if (tag == 'all') {
										for (var i = 0; i < this.cartData.length; i++) {
											for (var j = 0; j < this.cartData[i].cartList.length; j++) {
												var item = this.cartData[i].cartList[j];
												if (item.checked) {
													this.cartData[i].cartList.splice(j, 1);
													j = -1;
												}
											}
											if (this.cartData[i].cartList.length == 0) {
												this.cartData.splice(i, 1);
												i = -1;
											}
										}
									} else {
										this.cartData[siteIndex].cartList.splice(cartIndex, 1);
										if (this.cartData[siteIndex].cartList.length == 0) this.cartData.splice(siteIndex, 1);
									}
									this.calculationTotalPrice();
									this.getCartNumber();
								} else {
									this.$util.showToast({ title: res.message });
								}
							}
						});
					}
				}
			});
		},
		/**
		 * 变更购物车数量
		 * @param {Object} params
		 */
		cartNumChange(num, params) {
			if (isNaN(num)) return;
			let data = this.cartData[params.siteIndex].cartList[params.cartIndex],
				max_buy = data.max_buy > 0 && data.max_buy < data.stock ? data.max_buy : data.stock,
				min_buy = data.min_buy > 0 ? data.min_buy : 1;
			if (num > max_buy) num = max_buy;
			if (num < min_buy) num = min_buy;

			this.modifyFlag = true;
			this.$api.sendRequest({
				url: '/api/cart/edit',
				data: {
					num,
					cart_id: this.cartData[params.siteIndex].cartList[params.cartIndex].cart_id
				},
				success: res => {
					if (res.code >= 0) {
						this.cartData[params.siteIndex].cartList[params.cartIndex].num = num;
						this.calculationTotalPrice();
						this.getCartNumber();
					} else {
						this.$util.showToast({ title: res.message });
					}
				}
			});
		},
		/**
		 * 结算
		 */
		settlement() {
			if (this.totalCount > 0) {
				let cart_ids = [];
				this.cartData.forEach(siteItem => {
					siteItem.cartList.forEach(item => {
						if (item.checked) {
							cart_ids.push(item.cart_id);
						}
					});
				});

				if (this.isSub) return;
				this.isSub = true;

				uni.setStorage({
					key: 'orderCreateData',
					data: {
						cart_ids: cart_ids.toString(),
						// cart_total_weight: this.totalWeight,
					},
					success: () => {
						this.$util.redirectTo('/pages/order/payment/payment');
						this.isSub = false;
					}
				});
			}
		},
		/**
		 * 清空失效商品
		 */
		clearInvalidGoods() {
			uni.showModal({
				title: '提示',
				content: '确定要清空这些商品吗？',
				success: res => {
					if (res.confirm) {
						var cart_ids = [];
						this.invalidGoods.forEach(goodsItem => {
							cart_ids.push(goodsItem.cart_id);
						});
						if (cart_ids.length) {
							this.$api.sendRequest({
								url: '/api/cart/delete',
								data: { cart_id: cart_ids.toString() },
								success: res => {
									if (res.code >= 0) {
										this.invalidGoods = [];
										this.getCartNumber();
									} else {
										this.$util.showToast({ title: res.message });
									}
								}
							});
						}
					}
				}
			});
		},
		imageError(siteIndex, cartIndex) {
			this.cartData[siteIndex].cartList[cartIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		},
		toGoodsDetail(item) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: item.sku_id });
		},
		// 购物车数量
		getCartNumber() {
			if (uni.getStorageSync('token')) {
				this.$store.dispatch('getCartNumber');
				this.resetEditStatus();
			}
		},
		goodsLimit(event, index) {
			let data = this.cartData[0].cartList[index];
			if (event.type == 'plus') {
				if (data.max_buy > 0 && data.max_buy < data.stock) {
					this.$util.showToast({ title: '该商品每人限购' + data.max_buy + '件' });
				} else {
					this.$util.showToast({ title: '库存不足' });
				}
			} else {
				this.$util.showToast({ title: this.$lang('common.least_buy') + event.value + this.$lang('common.num_of_buy')});
			}
		},
		toLogin() {
			this.$refs.login.open();
		},
		// 手指触摸事件 用于菜单左滑
		touchS(e) {
			this.startX = e.touches[0].clientX;
			// console.log('开始' + e.touches[0].clientX);
		},
		touchE(e, cartIndex) {
			this.endX = e.changedTouches[0].clientX;
			// 触摸开始到停止的差值，小于0左滑，大于0右滑
			var disX = this.startX - this.endX;
			// cartIndex.edit = disX > 50;
			if (disX > 50) cartIndex.edit = true;
			else if (disX < 0) cartIndex.edit = false;
			this.$forceUpdate();
		},
		// 重置编辑状态
		resetEditStatus() {
			if (this.cartData[0]) {
				for (var i = 0; i < this.cartData[0].cartList.length; i++) {
					this.cartData[0].cartList[i].edit = false;
				}
			}
			this.$forceUpdate();
		},
		changeAction() {
			this.isAction = !this.isAction;
			this.resetEditStatus();
		}
	}
};
</script>

<style lang="scss">
.allPage {
	height: calc(100vh - 110rpx);
	padding-bottom: 110rpx;
	overflow-y: auto;
	max-width: 1200px;
	margin: 0 auto;
	&.bottom {
		height: calc(100vh - 210rpx);
		padding-bottom: 210rpx;
	}
}
.cart-header {
	padding: 20rpx 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	line-height: 40rpx;
	background: #fff;
	max-width:1200px;
	&.fixed {
		height: 28px;
		position: absolute;
		width: 100%;
		margin-bottom: 48px;
		z-index: 100;
	}
	.num-wrap {
		margin-left: $margin-both;
		text {
			padding: 0 8rpx;
		}
	}

	.cart-action {
		line-height: inherit;
		margin-right: $margin-both;
	}

	&.invalid {
		margin-left: $margin-both;
		margin-top: $margin-updown;
		flex: 1;
		line-height: inherit;
	}
}

.cart-wrap {
	margin-bottom: $margin-updown;

	.fixed-wrap {
		height: 116rpx;
	}
	&.invalid {
		.cart-header {
			margin: 0 $margin-both;
		}
	}

	.cart-goods {
		margin: 0 $margin-both;
		background: #fff;
		box-sizing: border-box;
		position: relative;
		padding: 30rpx 30rpx 0;
		&:nth-of-type(2) {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
		&:last-child {
			border-bottom-left-radius: $border-radius;
			border-bottom-right-radius: $border-radius;
			padding-bottom: 30rpx;
		}

		.goods-wrap {
			display: flex;
			position: relative;
			padding-left: 64rpx;
			transition: all 0.1s;
			& > .iconfont {
				font-size: 40rpx;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				transition: all 0.2s;
			}
			& > .iconyuan_checkbox {
				color: $color-disabled;
			}

			&.edit {
				transform: translateX(-70rpx);
				> .iconfont {
					opacity: 0;
				}
			}

			.goods-img {
				width: 180rpx;
				height: 180rpx;
				margin-right: 20rpx;
				border-radius: $border-radius;

				image {
					width: 100%;
					height: 100%;
					border-radius: $border-radius;
				}
			}

			.goods-info {
				flex: 1;
				position: relative;
				width: calc(100% - 220rpx);
				margin-top: -4rpx;

				.goods-name {
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					line-height: 1.5;
					font-size: $font-size-base;
				}

				.sku {
					display: flex;
					line-height: 1;
					margin-top: 8rpx;

					.goods-spec {
						color: $color-tip;
						font-size: $font-size-tag;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						flex: 1;
						// text {
						// 	margin-right: 20rpx;
						// 	&:last-child {
						// 		margin-right: 0;
						// 	}
						// }
					}
				}

				.goods-sub-section {
					position: absolute;
					left: 0;
					bottom: 0;
					display: flex;
					justify-content: space-between;
					width: 100%;

					.unit {
						font-size: $font-size-tag;
						margin-right: 4rpx;
					}

					.uni-numbox {
						position: absolute;
						right: 0;
						bottom: 8rpx;
					}
					.goods-price {
						display: flex;
						flex-direction: row;
						font-weight: bold;
						.bottom-price {
							width: 100%;
							font-size: $font-size-toolbar;
							image {
								width: 56rpx;
								height: 22rpx;
								margin-left: 6rpx;
							}
						}
					}
				}
			}
		}

		.item-del {
			position: absolute;
			width: 0;
			height: 90%;
			color: #fff;
			right: 0;
			top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s;
			overflow: hidden;
			white-space: nowrap;
			font-size: $font-size-tag;
			&.show {
				width: 90rpx;
			}
		}
	}

	.invalid-goods {
		.invalid-mark {
			color: $color-tip;
			padding: 6rpx 16rpx;
			display: inline-block;
			font-size: $font-size-goods-tag;
		}
	}
}
.cart-bottom {
	max-width:1200px;
	margin: 0 auto;
	position: fixed;
	z-index: 5;
	width: 100%;
	height: 100rpx;
	background: #fff;
	bottom: var(--window-bottom);
	overflow: hidden;
	display: flex;
	justify-content: space-between;
	bottom: 56px;
	z-index: 9;

	.all-election {
		height: 100rpx;
		position: relative;
		display: inline-block;

		& > .iconfont {
			font-size: 40rpx;
			position: absolute;
			top: 50%;
			left: 30rpx;
			transform: translateY(-50%);
		}
		& > .iconyuan_checkbox {
			color: $color-disabled;
		}

		& > text {
			margin-left: 56rpx;
			line-height: 100rpx;
			padding-left: 30rpx;
		}
	}

	.settlement-info {
		flex: 1;
		text-align: right;
		padding-right: 10rpx;
		line-height: 100rpx;
		text {
			font-weight: bold;
		}
	}

	.action-btn {
		width: 200rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
		button {
			height: 70rpx;
			line-height: 70rpx;
			font-size: $font-size-base;
			&.delete {
				height: 50rpx;
				line-height: 46rpx;
			}
		}
	}
}
.cart-bottom.active {
	bottom: calc(constant(safe-area-inset-bottom) + 55px) !important;
	bottom: calc(env(safe-area-inset-bottom) + 55px) !important;
}
.cart-empty {
	text-align: center;
	padding: 140rpx $padding 80rpx $padding;
	image {
		width: 63%;
		height: 450rpx;
	}

	button {
		min-width: 300rpx;
		margin-top: 100rpx;
		height: 70rpx;
		line-height: 70rpx !important;
		font-size: $font-size-base;
	}
	
}
</style>
<style scoped>
/deep/ .reward-popup .uni-popup__wrapper-box {
	background: none !important;
	max-width: unset !important;
	max-height: unset !important;
}
</style>
