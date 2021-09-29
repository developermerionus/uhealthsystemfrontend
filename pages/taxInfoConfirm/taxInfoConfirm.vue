<template>
	<view>
	   <navbar></navbar>
		<view class="content">
			<!-- <view class="empty-bar-view"></view> -->
			<view class="title">{{$lang("common.taxinfo")}}</view>
			<radio-group @change="radioChange" class="radioGroup">
				<label class="selfPickup">
					<view>
						<radio value="personal" :checked="current==='personal'" />
					</view>
					<view class="radioWord">{{$lang("common.personal")}}</view>
				</label>
				<label class="selfPickup">
					<view>
						<radio value="company" :checked="current==='company'" />
					</view>
					<view class="radioWord">{{$lang("common.company")}}</view>
				</label>
			</radio-group>
			<view v-show = "switchInfo">
				<view class="edit-info-box" >
					<text class="info-name">{{$lang('common.first_name')}}</text>
					<input  class=" uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.first_name')" v-model="formData.firstname" />
				</view>
				<view class="edit-info-box" >
					<text class="info-name">{{$lang('common.last_name')}}</text>
					<input  class=" uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.last_name')" v-model="formData.surname" />
				</view>
				<view class="edit-info-box" >
					<text class="info-name">{{$lang('common.social_id')}}</text>
					<input  class=" uni-input info-content input-len" type="number" maxlength="30" :placeholder="$lang('common.social_id')" v-model="formData.id_number" />
				</view>
			</view>
			<view v-show = "!switchInfo">
				<view class="edit-info-box" >
					<text class="info-name">{{$lang('common.company_name')}}</text>
					<input  class=" uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.company_name')" v-model="formData.company" />
				</view>
				<view class="edit-info-box" >
					<text class="info-name">{{$lang('common.ein_id')}}</text>
					<input  class=" uni-input info-content input-len" type="nummber" maxlength="30" :placeholder="$lang('common.ein_id')" v-model="formData.ein_number" />
				</view>
			</view>
			<view class="edit-info-box" >
				<text class="info-name" >
					{{$lang('common.state')}}
				<!-- 	<text>*</text> -->
				</text>
				<input class="uni-input  info-content input-len" type="text" placeholder-class="placeholder-class" :placeholder="$lang('common.state')"
				 maxlength="30" v-model="formData.state" @click="goState()"/>
			</view>
			
			<view class="edit-info-box" style='justify-content:flex-start ;' v-show="switchCityTag">
				<text class="info-name">{{$lang('common.city_county')}}</text>
				<!-- <input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.city_county')" v-model="formData.city" /> -->
			<str-autocomplete 
			  :importvalue="formData.city" :list="cityListCA_string" @select="selectOneCity" 
			  :placeholderValue="$lang('common.city_county')" 
			  highlightColor="#FF0000" style='min-width: 100px; margin-left: 10px;'>
			  </str-autocomplete>
			</view>
			<view class="edit-info-box" v-show="!switchCityTag">
				<text class="info-name">{{$lang('common.city')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.city')" v-model="formData.city" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.street')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30" :placeholder="$lang('common.street')" v-model="formData.address" />
			</view>
			
			
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.zipcode')}}</text>
				<input class="uni-input info-content input-len" type="number" maxlength="30" :placeholder="$lang('common.zipcode')" v-model="formData.zipcode" />
			
				
			</view>
			<view class="save-item" @click="submit">
				<button type="primary">{{$lang('common.confirm')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			id_number_container:'',
			ein_number_container:'',
			switchCityTag: false,
			current: 'personal',
			switchInfo: true,
			cityListCA_string: [],
			formData: {
				firstname:'',
				surname:'',
				id_number:'',
				address:'',
				city:'',
				state:'',
				company:'',
				zip: '',
				ein_number:'',
			}
			}
		},
		
		onLoad() {
			this.getMemberInfo();
		},
		onShow() {
			this.checkState();
			this.getCityListCA();
		},
		methods: {
			selectOneCity(opt) {
			  this.formData.city = opt;
			},
			getCityListCA() {
				uni.request({
				    url: 'https://www.cdtfa.ca.gov/dataportal/api/odata/Effective_Sales_Tax_Rates',
					success: res => {
						if (res.data.value) {
							this.cityListCA_string = [];
							for ( var i=0; i<res.data.value.length; i++) {
								this.cityListCA_string.push(res.data.value[i].City + ", " + res.data.value[i].County);
							}
							//this.cityListCA = res.data.value;
						}
					}
				});
			},
			async getMemberInfo() {
				let res = await this.$api.sendRequest({
					url: '/api/member/info',
					async: false
				});
				if (res.code >= 0 && res.data) {
					this.formData = {...res.data};
					this.id_number_container = this.formData.id_number;
					this.ein_number_container = this.formData.ein_number;
					this.formData.id_number = '';
					this.formData.ein_number = '';
					if(this.formData.state==="California") {
						this.switchCityTag = true;
					}
					else {
						this.switchCityTag = false;
					}
				}
			
			},
			checkState() {
				if(this.formData.state==="California") {
					this.switchCityTag = true;
				}
				else {
					this.switchCityTag = false;
				}
			},
			verify() {
				if (this.current==="company") {
					if (this.formData.ein_number=='' ) {
						this.$util.showToast({
							title: this.$lang('common.input_ein_number')
						});
						return;
					}
					if (this.formData.company== '') {
						this.$util.showToast({
							title: this.$lang('common.input_company')
						});
						return;
					}
				}
				else {
				if (this.formData.firstname == '') {
					this.$util.showToast({
						title: this.$lang('common.input_first_name')
					});
					return;
				}
				if (this.formData.surname== '') {
					this.$util.showToast({
						title: this.$lang('common.input_last_name')
					});
					return;
				}
				if (this.formData.id_number== '') {
					this.$util.showToast({
						title: this.$lang('common.input_id_number')
					});
					return;
				}
				if (this.formData.address== '') {
					this.$util.showToast({
						title: this.$lang('common.input_address')
					});
					return;
				}
				if (this.formData.city== '') {
					this.$util.showToast({
						title: this.$lang('common.input_city')
					});
					return;
				}
				if (this.formData.state== '') {
					this.$util.showToast({
						title: this.$lang('common.input_state')
					});
					return;
				}
				
				if (this.formData.zipcode== '') {
					this.$util.showToast({
						title: this.$lang('common.input_zipcode')
					});
					return;
				}
				}
				
				return true;
				
			},
			submit() {
				if(this.verify()) {
				this.formData.tax_info_check = 1;
				if(this.formData.id_number =='') {
					this.formData.id_number = this.id_number_container;
				}
				if(this.formData.ein_number =='') {
					this.formData.ein_number = this.ein_number_container;
				}
				this.$api.sendRequest({
					url: '/api/member/modifyMemberTest',
					data: this.formData,
					success: res => {
						if (res.code >= 0) {
						 this.$util.redirectTo('/pages/member/index/index',{},'reLaunch');
						 }
					},
				})
				}
			},
			radioChange(evt) {	
				this.current = evt.detail.value;
				console.log('current',this.current);
				if (this.current === 'personal') {
					this.switchInfo = true;
				}
				else {
					this.switchInfo = false;
				}
			},
			goState() {
				uni.navigateTo({
					url: `/otherpages/member/indexed-list/indexed-list?country=1&from=1`
				});
			},
			}
	}
	
</script>

<style lang="scss">
	.save-item{
		
		
		margin:40px auto;
		max-width:500px;
	}
	.title {
		font-size: 40rpx;
		margin: 20px, 0;
	}
	.selfPickup {
		display: flex;
		margin: 15px 10px;
	}
	
	.radioWord {
		margin-left: 10px;
	}
.radioGroup {
			display: flex;
			flex-direction: row;
		}
.content {
	width:90%;
	margin: 20px auto;
	max-width:400px;
}
.popup {
	width: 75vw;
	max-width: 700px;
	background: #fff;
	border-top-left-radius: $border-radius;
	border-top-right-radius: $border-radius;

	.popup-header {
		display: flex;
		border-bottom: 2rpx solid $color-line;
		position: relative;
		padding: 40rpx;

		.tit {
			flex: 1;
			font-size: $font-size-toolbar;
			line-height: 1;
			text-align: center;
		}
		.iconfont {
			line-height: 1;
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translate(0, -50%);
			color: $color-tip;
			font-size: $font-size-toolbar;
		}
	}

	.popup-body {
		height: calc(100% - 250rpx);
		&.safe-area {
			height: calc(100% - 270rpx);
		}
	}

	.popup-footer {
		height: 100rpx;

		.confirm-btn {
			height: 72rpx;
			line-height: 72rpx;
			color: #fff;
			text-align: center;
			margin: 20rpx 30rpx 0;
			border-radius: 40rpx;
		}

		&.bottom-safe-area {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
}
.choose-payment-popup {
	.payment-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 90rpx;
		margin: 0 30rpx;
		border-bottom: 1px solid $color-line;
		padding: 20rpx 0;
		&:nth-child(2) {
			padding-top: 0;
		}
		&:last-child {
			border-bottom: none;
		}
		.iconfont {
			font-size: 64rpx;
		}
		.iconyue {
			color: #faa218;
		}
		.iconweixin1 {
			color: #24af41;
		}
		.iconzhifubaozhifu- {
			color: #00a0e9;
		}
		.iconcheckboxblank {
			font-size: 40rpx;
			color: $color-line;
		}
		.iconyuan_checked {
			font-size: 40rpx;
		}
		.name {
			margin-left: 20rpx;
			font-size: $font-size-base;
			flex: 1;
		}
		.info-wrap {
			flex: 1;
			margin-left: 20rpx;
			.name {
				margin-left: 0;
				font-size: $font-size-base;
				flex: 1;
			}
			.money {
				color: $color-tip;
				font-size: $font-size-tag;
			}
		}

		.box {
			flex: 1;
			padding: 0 10rpx;
			line-height: inherit;
			text-align: right;

			input {
				font-size: $font-size-tag !important;
			}
		}
		&.set-pay-password {
			height: initial;
			.box {
				font-size: $font-size-tag !important;
			}
		}
	}
	.pay-money {
		text-align: center;
		padding: 20rpx 0 40rpx 0;
		background-color: #fff;
		font-weight: bold;
		margin-top: 30rpx;
		line-height: 1;
		.unit {
			margin-right: 4rpx;
			font-size: $font-size-tag;
		}
		.money {
			font-size: $font-size-toolbar;
		}
	}
}
.empty {
	width: 100%;
	text-align: center;
	padding: 40rpx 0;
	color: $color-sub;
	font-size: $font-size-tag;
}

.edit-info-box {
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 40rpx;
	min-height: 50rpx;
	background-color: #fff;

	.info-name {
		width: 200rpx;
		font-size: $font-size-base;
		text-align: left;
	}

	.info-content {
		&:first-of-type {
			// width: auto !important;
		}

		margin-right: auto;
		width: 500rpx;
		font-size: $font-size-base;
		padding: 0;
	}

	.dynacode {
		margin: 0;
		padding: 0 10rpx;
		width: 250rpx;
		height: 60rpx;
		font-size: $font-size-base;
		line-height: 60rpx;
		color: #fff;
		word-break: break-all;
	}
	.edit-sex-list {
		display: flex;
		label {
			display: flex;
			margin-left: 30rpx;
			align-items: center;
		}
	}
	uni-radio .uni-radio-input {
		width: 32rpx;
		height: 32rpx;
	}
}

.credit-card-icon-box {
	margin: 15px;
}

.set-card{
	background-color: #ffffff;
	position: fixed;
	width: 100vw;
	min-height: 100vh;
	max-width: 1200px;
	right: 0;
	left: 0;
	margin: 0 auto;
	z-index: 100;
	top: 0;
	left: 0;
}

.empty-bar-view {
	//width: 100vw;
	width: 100%;
	//height: 10vh;
	min-height: 200rpx;
}


</style>

