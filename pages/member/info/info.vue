<template>
	<view :data-theme="themeStyle">
		<view class="outer-container-wrap">
			<navbar></navbar>
			<view v-if="indent == 'all'" class="info-wrap">
				<!-- 头像 -->
				<view @click="headImage" class="info-list-cell info-item info-list-con" hover-class="cell-hover">
					<text class="cell-tit">{{ $lang('headImg') }}</text>
					<view class="info-list-head cell-tip">
						<image
							:src="memberInfo.headimg ? $util.img(memberInfo.headimg) : $util.getDefaultImage().default_headimg"
							@error="memberInfo.headimg = $util.getDefaultImage().default_headimg" mode="aspectFill" />
					</view>
					<text class="cell-more"></text>
				</view>
				<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('language')">
					<text class="cell-tit">{{ $lang('language')}}</text>
					<!-- <text class="cell-tip ">{{memberInfo.language}}</text> -->
					<text class="cell-tip ">{{showLang}}</text>
					<!-- <text> {{language}}</text> -->
					<text class="cell-more"></text>
				</view>
				<block v-for="(item, index) in infoList" :key="index">
					<view class="info-list-cell info-list-con" hover-class="cell-hover">
						<text class="cell-tit">{{ $lang( item.name) }}</text>
						<text class="cell-tip" v-if="!item.arrow">{{ item.value }}</text>
					</view>
				</block>
				<block v-for="(item, index) in form" :key='index+100'>
					<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo(item.name)">
						<text class="cell-tit">{{ $lang( item.name) }}
							<text style='color: #FF0000;' v-if="item.name!='joint_applicant'&&item.name!='company'&&item.name!='nickname'">*</text></text>
						<input v-if="item.name!='birthdate'" :disabled='locked(item.name)' class="cell-tip"
							style="text-align:end; font-size: 24rpx;  width:350rpx; color:#606266;" maxlength="500px"
							:placeholder="$lang(item.name)" v-model="item.value" />

						<picker v-if="item.name=='birthdate'" mode="date" :value="item.value" :start="startDate"
							:end="endDate" @change="bindDateChange">
							<view class="uni-input" style='text-align: end;'>{{ item.value ? 
						item.value : $lang('input') +$lang('birthdate') }}</view>
						</picker>
					</view>
				</block>
				<view class="info-list-cell info-list-con" hover-class="cell-hover" @click="modifyInfo('password')">
					<text class="cell-tit">{{ $lang('password')}}</text>
					<!-- <text  class="cell-tip ">{{memberInfo.password}}</text> -->
					<text class="cell-more"></text>
				</view>
				<!-- @click="modifyInfo(item.name)" -->
				<!-- <view class="body-wrap">
				<view class="form-wrap">
					<view class="input-wrap" v-show="registerMode == 'account'" @click='selectCountry'>
						<view class="content">{{$lang('marketRegion')}}<text style='color: #FF0000;'>*</text>
						<input style="margin-left: 20rpx;" disabled type="text" :placeholder="$lang('marketRegionPlaceholoder')" placeholder-class="input-placeholder" class="input" v-model="formData.market" @click='selectCountry'/></view>
					</view>
				<view>
			</view> -->

				<view class="info-list-cell info-btn_view">
					<button size="mini" type="primary" :disabled=disabled @click="saveData">{{ $lang('save') }}</button>
					<view v-if='memberInfo.member_level == 1'>
						<button size="mini" type="primary" :disabled=disabled
							@click="goHome">{{ $lang('goHome') }}</button>
					</view>
					<button type="primary" @click="goCenter" v-else>{{ $lang('goCenter') }}</button>
				</view>
				<!-- <view style='height: 50rpx;'></view> -->
			</view>

			<!-- 修改生日 -->
			<!-- <view v-if="indent == 'birthdate'" class="edit-info edit-birthdate-list">
			<view class="edit-info-box">
				<text class="info-name">{{ $lang('birthdate') }}</text>
				<picker mode="date" :value="formData.birthdate" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="uni-input">{{ formData.birthdate ? formData.birthdate : this.$lang('input') +$lang('birthdate') }}</view>
				</picker>
			</view>
			<view class="opec">
				<button size="mini" type="primary" @click="save(indent)">{{ $lang('save') }}</button>
				<button size="mini" type="primary" @click="cancel()">{{ $lang('cancel') }}</button>
			</view>
		</view> -->
			<!-- 修改密码 -->
			<view v-else-if="indent == 'password'" class="edit-info">
				<view class="edit-info-box" v-if="memberInfo.password">
					<text class="info-name">{{ $lang('nowPassword') }}</text>
					<input class="uni-input info-content input-len" type="password" maxlength="30" :placeholder="$lang('nowPassword')" v-model="formData.currentPassword" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('newPassword') }}</text>
					<input class="uni-input info-content input-len" maxlength="30" :placeholder="$lang('newPassword')"
						v-model="formData.newPassword" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{ $lang('confirmPassword') }}</text>
					<input class="uni-input info-content input-len" maxlength="30" :placeholder="$lang('confirmPassword')" v-model="formData.confirmPassword" />
				</view>

				<view class="opec">
					<button size="mini" type="primary" @click="modifyPassword()">{{ $lang('save') }}</button>
					<button size="mini" type="primary" @click="cancel()">{{ $lang('cancel') }}</button>
				</view>
			</view>
			<!-- 	<view v-else-if="exist(indent)" >
			<view class="edit-info-box">
				<text class="info-name">{{ $lang(indent) }}</text> 
				<input style='width: 600rpx;' type="text" maxlength="500" :placeholder="$lang('input')+$lang(indent)" v-model="vmodel" />
			</view>
			<view class="opec">
				<button size="mini" type="primary" @click="save(indent)">{{ $lang('save') }}</button>
				<button size="mini" type="primary" @click="cancel()">{{ $lang('cancel') }}</button>
			</view>
			</view> -->
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import info from '../public/js/info.js';
	import globalConfig from '@/common/js/golbalConfig.js';

	export default {
		components: {
			uniNavBar
		},
		data() {
			return {};
			FormData: {

			}
		},
		mixins: [info, globalConfig],
		onShow() {
			if (!uni.getStorageSync('token')) {
				this.$util.redirectTo('/pages/login/login/login', {
					back: '/pages/member/info/info'
				}, 'redirectTo');
			}
		},
		onLoad(e) {
			if (e.browse) {
				this.browse = e.browse;
				this.browse_member_id = e.member_id;
			}
			// this.getCountryList();
		},
		filters: {
			mobile(mobile) {
				return mobile.substring(0, 4 - 1) + '****' + mobile.substring(6 + 1);
			}
		},
		methods: {
			goHome() {
				this.saveData();
				this.$util.redirectTo('/pages/index/index/index');
			},
			goCenter() {
				this.$util.redirectTo('/pages/member/index/index');
			},
		}
	};
</script>

<style lang="scss">
	@import '../public/css/index.scss';

	.info-head {
		.head-nav {
			width: 100%;
			height: var(--status-bar-height);
			background: #ffffff;
		}

		.head-nav.active {
			padding-top: 40rpx;
		}
	}

	.tit {
		width: 148rpx;

		text {
			margin-left: 10rpx;
			color: #ff4544;
		}

		&.margin_tit {
			align-self: flex-start;
			margin-top: 24rpx;
		}
	}

	.captcha {
		width: 170rpx;
		height: 50rpx;
	}


	.info-wrap {
		box-sizing: border-box;
		// border: solid 1rpx;
		display: flex;
		flex-direction: column;
		font-size: $font-size-tag;
		flex: 1;
		color: $color-sub;

	}

	.info-list-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		padding: 24rpx 30rpx 5rpx 16rpx;
		position: relative;
		line-height: 60rpx;
		background-color: #fff;
		border-bottom: 1rpx solid $color-line;
		color: $color-title;

		&:first-child {
			padding-top: 28rpx;
			padding-bottom: 10rpx;
		}

		// .cell-tip1 {
		// 	margin-right: 40rpx;
		// }

		&.log-out-btn {
			margin-top: 40rpx;

			.cell-tit {
				margin: auto;
			}
		}

		.info-list-head {
			// image-border
			border: 1rpx solid $color-line;
			width: 82rpx;
			height: 82rpx;
			border-radius: 50%;
		}

		.info-list-head image {
			max-width: 100%;
			max-height: 100%;
		}

		// #ifdef MP
		&.info-item {
			margin-top: 16rpx;
		}

		// #endif

		// &.info-list-con ~ &.info-list-con:after {
		// 	content: '';
		// 	position: absolute;
		// 	left: 30rpx;
		// 	right: 30rpx;
		// 	top: 0;
		// 	border-bottom: 1rpx solid $color-line;
		// }

		.cell-tip {
			margin-left: auto;
			color: $color-sub;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 470rpx;
		}

		.cell-more {
			// ">"
			margin-left: 10rpx;
			width: 32rpx;
			height: 100%;
		}

		.cell-more:after {
			// ">"
			content: '';
			display: block;
			width: 12rpx;
			height: 12rpx;

			border: 2rpx solid darken($color-line, 20%) {
				right-color: transparent;
				bottom-color: transparent;
			}

			transform: rotate(135deg);
		}


		&.info-btn_view {
			padding: 20rpx 15rpx 40rpx;

			button {
				height: 80rpx;
				line-height: 80rpx;
				color: #fff;
				// text-align: center;
				border-radius: 10rpx;
				// width: 100%;
				margin: 5rpx 5rpx;
				background: linear-gradient(to right, #10869c 0%, #118ca3 12%, #139fb9 34%, #14a5c0 47%, #139fb9 67%, #118ca3 89%, #10869c 100%);

			}

		}


	}

	/** edit password **/
	.edit-info {

		display: flex;
		flex-direction: column;
		justify-content: center;
		//padding: 20px 50px;
		margin-top: 20px;
	}

	.edit-info-box {
		margin: auto 5%;
		// margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 20rpx;

		// min-height: 50rpx;
		// background-color: #fff;

		.info-name {
			//width: 150rpx;
			width: 25%;
			font-size: $font-size-base;
			text-align: left;
		}

		.info-content {
			// &:first-of-type {
			// 	width: auto !important;
			// }

			// 	margin-right: auto;
			width: 70%;
			//width: 1600rpx;
			font-size: $font-size-base;
			// 	padding: 0;
		}

		// .dynacode {
		// 	margin: 0;
		// 	padding: 0 10rpx;
		// 	width: 250rpx;
		// 	height: 60rpx;
		// 	font-size: $font-size-base;
		// 	line-height: 60rpx;
		// 	color: #fff;
		// 	word-break: break-all;
		// }
		// .edit-sex-list {
		// 	display: flex;
		// 	label {
		// 		display: flex;
		// 		margin-left: 30rpx;
		// 		align-items: center;
		// 	}
		// }
		uni-radio .uni-radio-input {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.set-pass-tips {
		padding: 20rpx 20rpx 0 20rpx;
	}


	.input-len {
		// width: 1000rpx !important;
		//width: auto;
	}

	// .save-item {
	// 	// margin-top: 50rpx;

	// 	button {
	// 		border-radius: 94rpx;
	// 		font-size: 30rpx;
	// 	}
	// }

	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $padding;
		box-sizing: border-box;
		justify-content: center;
		padding-top: 80rpx;

		.empty_img {
			width: 63%;
			height: 450rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.iconfont {
			font-size: 190rpx;
			color: $color-tip;
			line-height: 1.2;
		}

		button {
			min-width: 300rpx;
			margin-top: 100rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: $font-size-base;
		}
	}

	.opec {
		margin-top: 100rpx;
		width: 100%;
		padding: 0 20%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}


	@media screen and (min-width: 750px) {
		.info-wrap {
			max-width: 750px;
			margin: 0 auto;
		}
	}
</style>
