<template>
	<view class="page" :data-theme="themeStyle">
		<view class="agreement-title">{{ title }}</view>
		<view class="agreement-content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/js/html-parser';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		data() {
			return {
				title: '',
				content: ''
			};
		},
		mixins: [globalConfig],
		onLoad() {
			this.getAgreement();
		},
		onShow() {
			this.$langConfig.refresh();
		},
		methods:{
			getAgreement(){
				this.$api.sendRequest({
					url: '/supermember/api/membercard/agreement',
					success: res => {
						if (res.data && res.code == 0) {
							this.title = res.data.title;
							this.content = htmlParser(res.data.content);
							uni.setNavigationBarTitle({
							    title: this.title
							});
						} 
					}
				});
			}
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.$util.redirectTo('/otherpages/member/card_buy/card_buy', {}, 'redirectTo');
			return true;
		}
	};
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.agreement-title {
		font-size: $font-size-toolbar;
		text-align: center;
	}

	.agreement-content {
		margin-top: $margin-updown;
		word-break: break-all;
		font-size: $font-size-base;
	}
</style>
