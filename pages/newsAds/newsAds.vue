<template>
	<view :data-theme="themeStyle">
		<view class="container">
			<navbar></navbar>
			<view class="newsAds-container">
				<h1>公告</h1>
				<p class="indent-0">亲爱的优康会员大家好,</p>
				<p>优康国际以“提供优质的产品，分享健康与快乐，和用心服务顾客”为经营理念，致力于提供优质的产品和服务。
				因而，优康一直以来允许换货来满足不同人群的不同需要。</p>
				<p>但近半年来，因通货膨胀而导致物价上涨，大量的市场需求和换货已给公司造成巨大的影响，
				对公司生产和物流带来了难以承受的压力，造成脑能源的货源紧张。</p>
				<p>因此，特此通知，自<strong>2021年10月28日</strong>起，<strong>所有订单不可以换成脑能源</strong>。
				对此，希望得到各位会员的谅解。</p>
				<p>另外，一如既往，所有赠品一概不能够换。</p>
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
