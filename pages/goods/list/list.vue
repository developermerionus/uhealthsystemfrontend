<template>
	<view class="content" :data-theme="themeStyle">
		<view class="head-wrap">
			<!-- 搜索区域 -->
			<view class="search-wrap uni-flex uni-row">
				<view class="flex-item input-wrap">
					<input class="uni-input" maxlength="50" v-model="keyword" confirm-type="search" @confirm="search()" :placeholder="$lang('common.search')" />
					<text class="iconfont iconsousuo1" @click.stop="search()"></text>
				</view>
			</view>

			<!-- 排序 -->
			<view class="sort-wrap">
				<view class="comprehensive-wrap" :class="{ 'color-base-text': orderType === '' }" @click="sortTabClick('')">
					<text :class="{ 'color-base-text': orderType === '' }">{{ $lang('common.general') }}</text>
				</view>
				<view :class="{ 'color-base-text': orderType === 'sale_num' }" @click="sortTabClick('sale_num')">{{ $lang('common.sales_volume') }}</view>
				<view class="price-wrap" @click="sortTabClick('discount_price')">
					<text :class="{ 'color-base-text': orderType === 'discount_price' }">{{$lang('common.price')}}</text>
					<view class="iconfont-wrap">
						<view class="iconfont iconshangsanjiao-copy" :class="{ 'color-base-text': priceOrder === 'asc' && orderType === 'discount_price' }"></view>
						<view class="iconfont iconsanjiao" :class="{ 'color-base-text': priceOrder === 'desc' && orderType === 'discount_price' }"></view>
					</view>
				</view>
				<view :class="{ 'color-base-text': orderType === 'screen' }" class="screen-wrap">
					<view class="iconfont font-size-base" :class="{ iconapps: isList, iconlist1: !isList }" @click="changeListStyle()"></view>
					<text style="padding: 0 14rpx; color: #E3E3E3;">|</text>
					<text @click="sortTabClick('screen')">{{$lang('common.filter')}}</text>
					<view @click="sortTabClick('screen')" class="iconfont-wrap"><view class="iconfont iconshaixuan color-tip"></view></view>
				</view>
			</view>
		</view>

		<mescroll-uni top="180" ref="mescroll" @getData="getGoodsList">
			<block slot="list">
				<view class="goods-list" :class="isList ? 'single-column' : 'double-column'">
					<view class="goods-item margin-bottom" v-for="(item, index) in goodsList" :key="index" @click="toDetail(item)">
						<view class="goods-img">
							<image :src="goodsImg(item.goods_image)" mode="widthFix" @error="imgError(index)"></image>
							<view class="color-base-bg goods-tag" v-if="goodsTag(item) != ''">{{ goodsTag(item) }}</view>
						</view>
						<view class="info-wrap">
							<view class="name-wrap">
								<view class="goods-name">{{ item.goods_name }}</view>
							</view>
							<view class="pro-info">
								<view class="delete-price font-size-activity-tag color-tip">
									<block>
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										{{ item.market_price > 0 ? item.market_price : item.price }}
									</block>
								</view>
								<view class="sale font-size-activity-tag color-tip">{{$lang('common.sold')}} {{ item.sale_num }} {{ item.unit ? item.unit : $lang('common.unit') }}</view>
							</view>
							<view class="lineheight-clear">
								<view class="discount-price">
									<text class="unit color-base-text font-size-tag">{{ $lang('common.currencySymbol') }}</text>
									<text class="price color-base-text font-size-toolbar">{{ showPrice(item) }}</text>
								</view>
								<view class="member-price-tag" v-if="item.member_price && item.member_price == showPrice(item)">
									<image :src="$util.img('upload/uniapp/index/VIP.png')" mode="widthFix"></image>
								</view>
								<view class="member-price-tag" v-else-if="item.promotion_type == 1">
									<image :src="$util.img('upload/uniapp/index/discount.png')" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="goodsList.length == 0 && emptyShow"><ns-empty :text="this.$lang('common.no_product')" ></ns-empty></view>
			</block>
		</mescroll-uni>

		<!-- 筛选弹出框 -->
		<uni-drawer :visible="showScreen" mode="right" @close="showScreen = false" class="screen-wrap">
			<view class="title color-tip">{{$lang('common.filter')}}</view>
			<scroll-view scroll-y>
				<!-- 包邮 -->
				<view class="item-wrap">
					<view class="label"><text>{{$lang('common.exemption_from_postage_or_not')}}</text></view>
					<view class="list"><uni-tag :inverted="true" :text="$lang('common.exemption_from_postage')" :type="isFreeShipping ? 'primary' : 'default'" @click="isFreeShipping = !isFreeShipping" /></view>
				</view>
				<!-- 价格筛选项 -->
				<view class="item-wrap">
					<view class="label"><text>{{$lang('common.price_range')}}({{$lang('common.currencySymbol')}})</text></view>
					<view class="price-wrap">
						<input class="uni-input" type="digit" v-model="minPrice" :placeholder="$lang('common.lowest_price')" />
						<view class="h-line"></view>
						<input class="uni-input" type="digit" v-model="maxPrice" :placeholder="$lang('common.highest_price')" />
					</view>
				</view>
				<!-- 分类筛选项 -->
				<view class="category-list-wrap">
					<text class="first">{{$lang('common.all_categories')}}</text>
					<view class="class-box">
						<view @click="selectedCategory('')" class="list-wrap"><text :class="{ selected: !categoryId, 'color-base-text': !categoryId }">{{$lang('common.all')}}</text></view>
						<view @click="selectedCategory(item.category_id)" v-for="(item, index) in categoryList" :key="index" class="list-wrap">
							<text :class="{ selected: item.category_id == categoryId, 'color-base-text': item.category_id == categoryId }">{{ item.category_name }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="footer" :class="{ 'safe-area': isIphoneX }">
				<button type="default" class="footer-box" @click="resetData">{{$lang('common.reset')}}</button>
				<button type="primary" class="footer-box1" @click="screenData">{{$lang('common.confirm')}}</button>
			</view>
		</uni-drawer>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import uniDrawer from '@/components/uni-drawer/uni-drawer.vue';
import uniTag from '@/components/uni-tag/uni-tag.vue';
import list from '../public/js/list.js';
import globalConfig from '@/common/js/golbalConfig.js';

export default {
	components: {
		uniDrawer,
		uniTag
	},
	data() {
		return {};
	},
	mixins: [globalConfig, list]
};
</script>

<style lang="scss">
@import '../public/css/list.scss';
</style>
<style scoped>
>>> .uni-tag--primary.uni-tag--inverted {
	background-color: #f5f5f5 !important;
}
</style>
