<template>
	<view :data-theme="themeStyle">
		<view class="container">
			<navbar></navbar>
			<view class="newsAds-container">
				<h1>公告</h1>
				<p class="indent-0">亲爱的优康会员大家好,</p>
				<p>优康国际以“提供优质的产品，分享健康与快乐，和用心服务顾客”为经营理念，致力于提供优质的产品和服务。</p>
				<p>近半年来，因通货膨胀而导致物价上涨，公司的邮费价格已经难以承受成本上涨的压力。同时，受承运商全球燃油附加费及旺季附加费的上涨，
				优康将于<strong>2021年10月4日</strong>起调整邮寄的费用。对此给你带来不便，非常感谢得到各位会员的谅解.</p>
				<h2>中国地区公告</h2>
				<p>由于疫情反复,中国大陆地区疫情防控正处于关键时期，疫情防控形势依然严峻复杂。中国海关限制了海外的航班，
				把原本可搭载客机邮寄的包裹改为货机渠道，导致所有货物都拥挤在海关港口，因此海关清关速度非常缓慢。 
				同时海关严格执行"包包消毒检验"更影响了邮寄的时效。</p>
				<p>另外，10月1日-10月7日为中国大陆的法定节假期,大陆地区物流时效会收到进一步严重影响。</p>
				<button type="button" @click="$util.redirectTo('/pages/index/index/index')"
					class="color-base-border color-base-bg newsAds-btn">{{ $lang('common.confirm')}} </button>
			</view>
			
			<!-- 底部tabBar -->
			<diy-bottom-nav type="shop"></diy-bottom-nav>
		</view>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
import toTop from '@/components/toTop/toTop.vue';
import scroll from '@/common/js/scroll-view.js';
import globalConfig from '@/common/js/golbalConfig.js';
import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';

export default {
	components: {
		toTop,
	},
	data() {
		return {
			
		}
	},
	mixins: [scroll, globalConfig],
	methods: {
		
	}
}
</script>

<style lang="scss">
.container {
	max-width: 1200px;
	min-height: 90vh;
	overflow-y: auto;
	overflow-x: hidden;
	padding-bottom: 112rpx;
	background-color: white;
	position:relative;
	margin: 0 auto;
	
	.newsAds-container {
		margin: 15px;
	}
	
	h1, h2 {
		text-align:center;
		color: red;
	}
	
	h1 {
		font-size: 40rpx;
	}
	h2 {
		font-size: 36rpx;
	}
	
	p {
		text-indent: 2rem;
		font-size: 28rpx;
	}
	
	p.indent-0 {
		text-indent: 0rem;	
	} 
	
	.newsAds-btn {
		margin:40rpx auto 10px;
		width: 30%;
		max-width:200px;
		color: #fff;
		font-size: 28rpx;
	}
}
</style>
