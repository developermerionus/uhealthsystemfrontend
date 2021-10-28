<template>
	<view class="container">
		<view v-if="setCard">
			<!-- <view class="empty-bar-view"></view> -->
			<view class="edit-info-box out-focus">
				<text class="info-name">{{$lang('common.credit_card_no')}}</text>
				<input :focus="focusFlag" class="focus uni-input info-content input-len" type="number" maxlength="30"
					:placeholder="$lang('common.input_card_no')" v-model="formData.number" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.credit_card_valid')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30"
					:placeholder="$lang('common.card_valid')" v-model="formData.exp_date" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">CVC</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30"
					:placeholder="$lang('common.last_3_digit')" v-model="formData.cvc" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.last_name')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30"
					:placeholder="$lang('common.last_name')" v-model="formData.first_name" />
			</view>
			<view class="edit-info-box">
				<text class="info-name">{{$lang('common.first_name')}}</text>
				<input class="uni-input info-content input-len" type="text" maxlength="30"
					:placeholder="$lang('common.first_name')" v-model="formData.last_name" />
			</view>


			<view class="credit-card-icon-box">
				<text>{{$lang('common.creditCardRequirement')}}:</text>
				<br>
				<img src="https://img.icons8.com/color/48/000000/visa.png" />
				<img src="https://img.icons8.com/color/48/000000/mastercard.png" />
				<img src="https://img.icons8.com/color/48/000000/amex.png" />
				<img src="https://img.icons8.com/color/48/000000/discover.png" />
			</view>
			<!-- <br> -->
			<view v-show="billingAddressShow">
				<view class="edit-info-box">
					<text>{{$lang('common.billingaddress')}}:</text>
				</view>
				<view class="fillingInfo">
					<ns-switch class="balance-switch" @change="changeFillingInfo" :checked="fillingInfo">
						<view></view>
					</ns-switch>
					<text class="fillingInfoName">{{$lang('common.fillingInfo')}}</text>
				</view>
				<view class="edit-info-box" style='justify-content: flex-start;'>
					<text class="info-name">{{$lang('common.country')}}<!-- <text>*</text> --></text>
					<picker mode = "selector" @change="bindPickerChange" :value="index" :range="tempCountryList" class="picker"
						range-key="name">
						<!-- 	<text class="desc uni-input">{{ $lang(`common.${countryList[index].name}`)?  $lang(`common.${countryList[index].name}`):countryList[index].name}}</text>
				 -->
						<text v-show="index!=='nothing'" class="desc uni-input">{{tempCountryList[index]}}</text>
						<input v-show="index=='nothing'" class="uni-input  info-content input-len" type="text" placeholder-class="placeholder-class"
						:placeholder="$lang('common.defaultCountry')" maxlength="100" />
					</picker>
				</view>
				<view class="edit-info-box">
					<text class="info-name">
						{{$lang('common.state')}}
					</text>
					<input class="uni-input  info-content input-len" type="text" placeholder-class="placeholder-class"
						:placeholder="$lang('common.state')" maxlength="100" v-model="formData.state" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{$lang('common.city')}}</text>
					<input class="uni-input info-content input-len" type="text" maxlength="30"
						:placeholder="$lang('common.city')" v-model="formData.city" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{$lang('common.street')}}</text>
					<input class="uni-input info-content input-len" type="text" maxlength="30"
						:placeholder="$lang('common.street')" v-model="formData.address" />
				</view>


				<view class="edit-info-box">
					<text class="info-name">{{$lang('common.zipcode')}}</text>
					<input class="uni-input info-content input-len" type="number" maxlength="30"
						:placeholder="$lang('common.zipcode')" v-model="formData.zip" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{$lang('common.phonenumber')}}</text>
					<input class="uni-input info-content input-len" type="text" maxlength="30"
						:placeholder="$lang('common.phonenumber')" v-model="formData.phone" />
				</view>
				<view class="edit-info-box">
					<text class="info-name">{{$lang('common.email')}}</text>
					<input class="uni-input info-content input-len" type="email" maxlength="30"
						:placeholder="$lang('common.email')" v-model="formData.email" />
				</view>
				<view  v-show="group_id=='1'">
					<view class="agreeContract">
					<checkbox @click="checkboxChange" :checked="checkboxChecked" />
					{{$lang('common.agree')}}<button @click="readContract">{{$lang('common.credit_card_agreement')}}</button>
					</view>
				
				<view v-show="showContract">
					<view class="textContent">
						<text>{{$lang('common.agreement')}}</text>
						<button type="primary" @click="agreeHandler">{{$lang('common.agree')}}</button> <button @click="cancelHandler()">{{$lang('common.disagree')}}</button>
					</view>
				</view>
				<!-- 照片上传 -->
				<!-- <view>
					<block v-for="(item, index) in imageArr" :key="index">
						<view class="id-card">
						<text>{{item.title}}</text>
						<view class="modify">
							<view>
								
								<image v-if="item.newImg == ''"
									:src="item.memberImg ? $util.img(item.memberImg) : $util.img(item.defaultImgPath)"
									mode="aspectFill"></image>
								<image v-else :src="$util.img(item.newImg)"
									 mode="aspectFill" />
							</view>
						</view>
						<view class="opection-box">
							<block v-if="item.newImg == ''"><button type="primary"
									@click="chooseImage(index)">{{$lang('common.click_to_upload')}}</button></block>
							<block v-else>
								<view class="opec">
								
									<button size="mini" type="primary" @click="chooseImage(index)">{{$lang('common.reupload')}}</button>
								</view>
							</block>
						</view>
					</view>
						
					</block>
					<img-cropping selWidth="400" selHeight="300" @upload="myUpload" ref="imgCropping"></img-cropping>
				</view> -->
                </view>
			</view>
			<br>
			<view class="save-item" @click="confirm(2)">
				<button type="primary">{{$lang('common.confirm')}}</button>
			</view>
			<br>
			<view class="save-item" @click="cancelHandler()">
				<button type="default">{{$lang('common.cancel')}}</button>
			</view>
		</view>

		<!-- 选择支付方式弹窗 -->
		<uni-popup ref="choosePaymentPopup" type="center">
			<view class="choose-payment-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">{{$lang('common.pay_method')}}</text>
					<text class="iconfont iconclose" @click="close()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="pay-money">
						<!-- <text class="unit">{{ $lang('common.currencySymbol') }}</text> -->
						<text class="money">{{$lang('common.pay_amount')}}{{ payMoney | moneyFormat }}</text>
					</view>

					<view class="payment-item" v-if="balanceDeduct > 0">
						<view class="iconfont iconyue"></view>
						<view class="info-wrap">
							<text class="name">余额抵扣</text>
							<view class="money">可用${{ balanceDeduct }}</view>
						</view>
						<ns-switch class="balance-switch" @change="useBalance" :checked="isBalance == 1"></ns-switch>
					</view>
					<block v-if="payMoney > 0">
						<block v-if="payTypeList.length">
							<view class="payment-item" v-for="(item, index) in payTypeList" :key="index"
								@click="payIndex = index">
								<view class="iconfont" :class="item.icon"></view>
								<text class="name">{{ item.name }}</text>
								<text class="iconfont"
									:class="payIndex == index ? 'iconyuan_checked color-base-text' : 'iconcheckboxblank'"></text>
							</view>

						</block>
						<block v-else>
							<view class="empty">平台尚未配置支付方式！</view>
						</block>
					</block>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="confirm(1)">{{$lang('common.confirm')}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import nsSwitch from '@/components/ns-switch/ns-switch.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import imgCropping from '@/components/img-cropping/cropping.vue';

	// #ifdef H5
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';
	// #endif
	var self;
	export default {

		components: {
			uniPopup,
			nsSwitch,
			imgCropping
		},
		mixins: [globalConfig],
		props: {
			balanceDeduct: {
				type: [Number, String],
				default: ''
			},
			isBalance: {
				type: Number,
				default: 0
			},
			payMoney: {
				type: [Number, String],
				default: 0
			},
			cardFormData: {
				type: Object,
				default: function() {
					return {
						state: ''
					}
				}

			}
		},
		data() {
			return {
				image_index: 0,
				imageArr: [{
					newImg: '',
					memberImg: '',
					title: this.$lang('common.input_card_front_page'),
					defaultImgPath:'upload/1/idphoto/defaultImg/frontcard.png'
				}, {
					newImg: '',
					memberImg: '',
					title: this.$lang('common.input_card_back_page'),
					defaultImgPath:'upload/1/idphoto/defaultImg/backcard.png'
				}, {
					newImg: '',
					memberImg: '',
					title: this.$lang('common.input_photo_id'),
					defaultImgPath:'upload/1/idphoto/defaultImg/idphoto.png'
				}],
				member_id: '',
				showContract: '',
				name: 'payment',
				group_id: '0',
				showContract: false,
				checkboxChecked: false,
				memberInfo: {},
				fillingInfo: false,
				tempCountryList: [],
				name: '',
				countryList: [{
					"id": 0,
					"name": "China"
				}, ],
				index: 'nothing',
				setCard: false,
				focusFlag: false,
				isIphoneX: false,
				payIndex: 0,
				// #ifdef H5
				payTypeList:[], 
				timer: null,
				// #endif
				// #ifdef MP-WEIXIN
				// payTypeList: [{
				// 	name: '微信支付',
				// 	provider: 'wxpay',
				// 	icon: 'iconweixin1',
				// 	type: 'wechatpay',
				// }],
				// #endif
				billingAddressShow: true,
				payInfo: {},
				showCountry: [1, 153],
				is_save: false,
				formData: {
					number: '',
					exp_date: '',
					cvc: '',
					first_name: '',
					last_name: '',
					address: '',
					city: '',
					state: '',
					zip: '',
					country: 'United State',
					phone: '',
					email: ''
				},
			};
		},


		created() {
			this.isIphoneX = this.$util.uniappIsIPhoneX();
			this.getPayType();
			this.memberInfo = uni.getStorageSync('userInfo');
			this.member_id = this.memberInfo.member_id;
			this.group_id = this.memberInfo.group_id;
			this.payTypeList= this.group_id =='0'?[
				// {
				// 	name: '支付宝支付',
				// 	icon: 'iconzhifubaozhifu-',
				// 	type: 'alipay'
				// },
				// {
				// 	name: '微信支付',
				// 	icon: 'iconweixin1',
				// 	type: 'wechatpay'
				// },
				
				{
					name: this.$lang('common.alipay'),
					icon: 'iconzhifubaozhifu-',
					type: 'alioverseaspay'
				},
				{
					name: this.$lang('common.credit_card'),
					icon: '2',
					type: 'authorizenetpay'
				},
				
			]:[{
					name: this.$lang('common.credit_card'),
					icon: '2',
					type: 'wechatpay'
				}];
			//console.log('this.group_id', this.group_id);
			//this.getCardInfo();

			this.getCountryList();
			this.initGetHeading();
			self = this;
		},
		methods: {
			initGetHeading() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						const temp_photo_path = res.data.photo_path? JSON.parse(res.data.photo_path).data : '';
						if (res.code == 0) {
							this.imageArr = (temp_photo_path ? temp_photo_path : this.imageArr);
							//console.log('ff temp_photo_path', temp_photo_path);
							//console.log('ff this.imageArr', this.imageArr);

						} else {
							this.$util.showToast({
								title: res.message
							});
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			chooseImage(index) {
				this.image_index = index;
				this.$refs.imgCropping.fSelect();
				//console.log('cccc this.imageArr', this.imageArr);
			},
			//上传返回图片
			myUpload(rsp) {
				uni.request({
					url: this.$config.baseUrl + '/api/upload/idPhotoSaved',
					method: 'POST',
					data: {
						app_type: 'h5',
						app_type_name: 'H5',
						images: rsp.base64,
						member_id: this.member_id
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded;application/json'
					},
					dataType: 'json',
					responseType: 'text',
					success: res => {
						if (res.data.code == 0) {
							//console.log('res.data.data.pic_path',res.data.data.pic_path);
							self.imageArr[self.image_index].newImg = res.data.data.pic_path;
							self.save();
						}
					},
					fail: () => {
						this.$util.showToast({
							title: '上传失败'
						});
					}
				});
			},
			previewImage() {
				uni.previewImage({
					current: 0,
					urls: this.images
				});
			},
			save() {
				this.$api.sendRequest({
					url: '/api/member/modifyPhotoPaths',
					data: {
						photo_path: JSON.stringify({
							data: this.imageArr
						}),
						member_id: this.member_id
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: '上传成功'
							});
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},






			readContract() {
				this.showContract = !this.showContract;
			},
			agreeHandler() {
				this.showContract = false;
				this.checkboxChecked = true;
			},
			checkboxChange() {
				this.checkboxChecked = !this.checkboxChecked;
				this.showContract = false;
				//console.log('this.checkboxChecked', this.checkboxChecked);
			},
			changeFillingInfo() {

				this.fillingInfo = !this.fillingInfo;
				//console.log('this.fillingInfo',this.fillingInfo);


				if (this.fillingInfo) {
					this.formData.city = this.memberInfo.city;
					this.formData.state = this.memberInfo.state;
					this.formData.zip = this.memberInfo.zipcode;
					
					this.formData.phone = this.memberInfo.mobile;
					this.formData.email = this.memberInfo.email;
					this.formData.address = this.memberInfo.address;
					this.findCountryIndex(this.memberInfo.marketCountryId);
				} else {
					this.formData.city = '';
					this.formData.state = '';
					this.formData.zip = '';
					this.index = "nothing";
					this.formData.country='';
					this.formData.phone = '';
					this.formData.email = '';
					this.formData.address = '';
				}

			},
			bindPickerChange(e) {
				this.index = e.detail.value;
				//console.log('index',e.detail.value);
				this.fillingInfo = false;
				this.formData.country = this.countryList[this.index].name;
				if (this.showCountry.indexOf(this.countryList[this.index].id) < 0) {
					//	this.billingAddressShow = false;
					this.formData.address = '';
					this.formData.city = '';
					//this.cardFormData.state='';
					this.formData.state = '';
					this.formData.zip = '';
					this.formData.phone = '';
					this.formData.email = '';
				} else {

					//	this.billingAddressShow = true;
					this.formData.address = '';
					this.formData.city = '';
					//this.cardFormData.state='';
					this.formData.state = '';
					this.formData.zip = '';
					this.formData.phone = '';
					this.formData.email = '';
				}
			},
			findCountryIndex(countryId) {
				console.log('this.countryList',this.countryList);
				this.index = this.countryList.findIndex(x => x.id === countryId);
				//console.log('this.index',this.index);

			},
			goState() {
				uni.navigateTo({
					url: `/otherpages/member/indexed-list/indexed-list?country=${this.countryList[this.index].id}&from=1`
				});
			},
			getCountryList() {
				this.$api.sendRequest({
					url: '/api/address/country',
					success: res => {
						if (res.code >= 0 && res.data) {
							console.log('res.data',res.data);
							this.countryList = res.data.filter(item => item.id != 0);
							//this.countryList.unshift({id:0})
							for (let v in this.countryList) {
								this.tempCountryList.push(this.$lang(`common.${this.countryList[v].id}`));
							}
							//console.log(this.tempCountryList);

						}
					}
				});
			},
			getUsStates() {
				this.$api.sendRequest({
					url: '/api/member/getUsStates',
					data: {
						pid: 1, // if USA, pid = 1
					},
					success: res => {
						//	console.log(res);
						let usStateListTemp = [];
						this.usStateList = [];
						if (res.code == 0) {
							usStateListTemp = res.data;
							for (var i = 0; i < usStateListTemp.length; i++) {
								for (var j = 0; j < usStateListTemp[i].data.length; j++) {
									this.usStateList.push(usStateListTemp[i].data[j]);
								}
							}
						}
						//console.log(this.usStateList);
					},
				})
			},
			cancelHandler() {
				this.setCard = false;
				this.$emit('showHandler');
				this.$emit('cancelorder');
			},
			but() {

				uni.createSelectorQuery().select('.focus').boundingClientRect(data => {
					//目标位置的节点：类class或者id
					uni.createSelectorQuery().select(".out-focus").boundingClientRect(res => {
						//最外层盒子的节点：类class或者id
						uni.pageScrollTo({

							duration: 100, //过渡时间
							//scrollTop:data.top+590 - res.top,//到达距离顶部的top值
							scrollTop: data.top - res.top, //如果置顶
						})
					}).exec()
				}).exec();
			},
			open() {
				this.$refs.choosePaymentPopup.open();
			},
			close() {
				this.$refs.choosePaymentPopup.close();
			},
			// 使用余额
			useBalance() {
				this.$emit('useBalance');
			},
			confirm(num) {
				if (this.payTypeList.length == 0 && this.payMoney > 0) {
					this.$util.showToast({
						title: '请选择支付方式！'
					});
					return;
				}

				var payType = this.payTypeList[this.payIndex];

				if (payType.type == 'authorizenetpay' && num == 1) {
					this.setCard = true;
					this.focusFlag = false;
					this.$nextTick(function() {
						this.focusFlag = true;
						this.but();
						this.$emit('showHandler');
					});
					this.close()
					return false;
				}

				if (payType.type == 'authorizenetpay' && num == 2) {
					if (this.formData.number == '') {
						this.$util.showToast({
							title: this.$lang('common.input_card_no')
						});
						return;
					}
					if (this.formData.exp_date == '') {
						this.$util.showToast({
							title: this.$lang('common.card_valid')
						});
						return;
					}
					if (this.formData.cvc == '') {
						this.$util.showToast({
							title: this.$lang('common.input_cvc')
						});
						return;
					}
					if (this.formData.first_name == '') {
						this.$util.showToast({
							title: this.$lang('common.input_first_name')
						});
						return;
					}
					if (this.formData.last_name == '') {
						this.$util.showToast({
							title: this.$lang('common.input_last_name')
						});
						return;
					}
					// if (this.formData.country == '') {
						if(this.index == "nothing"){
						this.$util.showToast({
							title: this.$lang('common.input_country')
						});
						return;
					}
					if (this.billingAddressShow) {
						if (this.formData.state == '') {
							this.$util.showToast({
								title: this.$lang('common.input_state')
							});
							return;
						}
						if (this.formData.city == '') {
							this.$util.showToast({
								title: this.$lang('common.input_city')
							});
							return;
						}
						if (this.formData.address == '') {
							this.$util.showToast({
								title: this.$lang('common.input_street')
							});
							return;
						}
						if (this.formData.phone == '') {
							this.$util.showToast({
								title: this.$lang('common.input_phone')
							});
							return;
						}
						if (this.formData.email == '') {
							this.$util.showToast({
								title: this.$lang('common.input_email')
							});
							return;
						}
						if (this.formData.zip == '') {
							this.$util.showToast({
								title: this.$lang('common.input_zipcode')
							});
							return;
						}
						if (this.group_id == '1' && this.checkboxChecked == false) {
							this.$util.showToast({
								title: this.$lang('common.check_agree_contract')
							});
							return;
						}
						// if (this.group_id == '1') {
						// 	let index = this.imageArr.findIndex(x => x.newImg === '');
						// 	if(index==0) {
						// 		this.$util.showToast({
						// 			title: this.$lang('common.uploadfrontpage')
						// 		});
						// 		return;
						// 	}
						// 	else if (index==1) {
						// 		this.$util.showToast({
						// 			title: this.$lang('common.uploadbackpage')
						// 		});
						// 		return;
						// 	}
						// 	else if (index==2) {
						// 		this.$util.showToast({
						// 			title: this.$lang('common.uploadidphoto')
						// 		});
						// 		return;
						// 	}
							
						// }
					}

				}

				uni.showLoading({
					title: this.$lang('common.paying'),
					mask: true
				});
				this.$refs.choosePaymentPopup.close();
				this.$emit('confirm');
				uni.setStorageSync('pay_flag', 1);
			},
			getPayInfo(out_trade_no) {
				this.$api.sendRequest({
					url: '/api/pay/info',
					data: {
						out_trade_no
					},
					success: res => {
						if (res.code >= 0 && res.data) {
							this.payInfo = res.data;
							this.pay();
						} else {
							this.$util.showToast({
								title: '未获取到支付信息！'
							});
							setTimeout(() => {
								this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
							}, 1500);
						}
					}
				});
			},
			getPayType() {

				this.$api.sendRequest({
					url: '/api/pay/type',
					success: res => {
						if (res.code == 0) {
							if (res.data.pay_type == '') {
								this.payTypeList = [];
							} else {
								var payTypeList = [];
								for (let i in this.payTypeList) {

									if (res.data.pay_type.indexOf(this.payTypeList[i]['type']) !== -1) {

										payTypeList.push(this.payTypeList[i]);
									}
								}
								//dwfood yuansfer creditcard
								// payTypeList.push({
								// 	name: this.$lang('common.credit_card'),
								// 	icon: '2',
								// 	type: 'wechatpay'
								// });
								this.payTypeList = payTypeList;
							}
						}
					}
				});
			},
			// getCardInfo() {
			// 	this.$api.sendRequest({
			// 		url: '/api/member/getCard',
			// 		success: res => {
			// 			if (res.code == 0) {
			// 				this.formData = res.data;
			// 			}
			// 		}
			// 	});
			// },
			// #ifdef H5

			pay() {
				console.log('this.formData',this.formData);
				var payType = this.payTypeList[this.payIndex];
				if (!payType) return;
				let self = this;
				if (payType.type == 'authorizenetpay') {
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no: this.payInfo.out_trade_no,
							pay_type: payType.type,
							authorizenetpay_param: JSON.stringify(this.formData)
						},
						success: res => {
							uni.hideLoading();
							if (res.code >= 0) {
								this.checkPayStatus();
							} else {
								uni.showModal({
									title: this.$lang('common.failed_pay'),
									content: this.$lang('common.try_again'),
									success: function(res) {
										if (res.confirm) {
											console.log('继续试');
										} else if (res.cancel) {
											self.$emit('cancelorder');
										}
									}
								})

							}
						}
					})

				} else {
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no: this.payInfo.out_trade_no,
							pay_type: payType.type,
							return_url: encodeURIComponent(this.$config.h5Domain +
								'/pages/pay/result/result?code=' + this.payInfo.out_trade_no)
						},
						success: res => {
							uni.hideLoading();
							if (res.code >= 0) {
								switch (payType.type) {
									case 'alipay':
										location.href = res.data.data;
										this.checkPayStatus();
										break;
									case 'alioverseaspay':
										 location.href = res.data;
										this.checkPayStatus();
										break;
									case 'wechatpay':
										 location.href = res.data;
										this.checkPayStatus();
										break;
									case 'authorizenetpay':
										this.checkPayStatus();


										break;

									case 'wechatpay':
										if (this.$util.isWeiXin()) {
											if (uni.getSystemInfoSync().platform == 'ios') {
												var url = uni.getStorageSync('initUrl');
											} else {
												var url = location.href;
											}
											// 获取jssdk配置
											this.$api.sendRequest({
												url: '/wechat/api/wechat/jssdkconfig',
												data: {
													url: url
												},
												success: jssdkRes => {
													var wxJS = new Weixin(),
														payData = res.data.data;
													wxJS.init(jssdkRes.data);
													wxJS.pay({
															timestamp: payData.timestamp,
															nonceStr: payData.nonceStr,
															package: payData.package,
															signType: payData.signType,
															paySign: payData.paySign
														},
														res => {
															if (res.errMsg ==
																'chooseWXPay:ok') {
																this.$util.redirectTo(
																	'/pages/pay/result/result', {
																		code: this.payInfo
																			.out_trade_no
																	}, '', 'redirectTo');
															} else {
																this.$util.showToast({
																	title: res.errMsg
																});
															}
														}
													);
												}
											});
										} else {
											location.href = res.data.url;
											this.checkPayStatus();
										}
										break;
								}
							} else {
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							uni.hideLoading();
							this.$util.showToast({
								title: 'request:fail'
							});
						}
					});
				}
			},
			checkPayStatus() {
				this.timer = setInterval(() => {
					this.$api.sendRequest({
						url: '/api/pay/status',
						data: {
							out_trade_no: this.payInfo.out_trade_no
						},
						success: res => {
							if (res.code == 0) {
								if (res.data.pay_status == 2) {
									clearInterval(this.timer);
									this.$util.redirectTo('/pages/pay/result/result', {
										code: this.payInfo.out_trade_no
									}, '', 'redirectTo');
								}
							} else {
								clearInterval(this.timer);
							}
						}
					});
				}, 1000);
			},
			// #endif
			// #ifdef MP-WEIXIN
			pay() {
				var payType = this.payTypeList[this.payIndex];
				if (!payType) return;
				if (payType.provider == 'wxpay') {
					this.$api.sendRequest({
						url: '/api/pay/pay',
						data: {
							out_trade_no: this.payInfo.out_trade_no,
							pay_type: payType.type
						},
						success: res => {
							//console.log(res)
							uni.hideLoading();
							if (res.code >= 0) {
								var payData = res.data.data;
								uni.requestPayment({
									provider: payType.provider,
									timeStamp: payData.timeStamp,
									nonceStr: payData.nonceStr,
									package: payData.package,
									signType: payData.signType,
									paySign: payData.paySign,
									success: res => {
										this.$util.redirectTo('/pages/pay/result/result', {
											code: this.payInfo.out_trade_no
										}, '', 'redirectTo');
									},
									fail: res => {
										this.flag = false;
										if (res.errMsg == 'requestPayment:fail cancel') {
											this.$util.showToast({
												title: '您已取消支付'
											});
										} else {
											uni.showModal({
												content: '支付失败,失败原因: ' + res.errMsg,
												showCancel: false
											});
										}
										setTimeout(() => {
											this.$util.redirectTo(
												'/pages/pay/result/result', {
													code: this.payInfo.out_trade_no
												}, 'redirectTo');
										}, 2000);
									}
								});
							} else {
								this.$util.showToast({
									title: res.message
								});
								setTimeout(() => {
									this.$util.redirectTo('/pages/pay/result/result', {
										code: this.payInfo.out_trade_no
									}, 'redirectTo');
								}, 2000);
							}
						},
						fail: res => {
							uni.hideLoading();
							this.$util.showToast({
								title: 'request:fail'
							});
						}
					});
				}
			}
			// #endif
		},
		// #ifdef H5
		deactivated() {
			clearInterval(this.timer);
		},
		// #endif
		filters: {
			/**
			 * 金额格式化输出
			 * @param {Object} money
			 */
			moneyFormat(money) {
				return parseFloat(money).toFixed(2);
			}
		}
	};
</script>

<style lang="scss">
	.container {
		margin:25px auto 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 900rpx;
	}
	//上传照片
	.id-card {
		margin:25px auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align:center;
		max-width: 900rpx;
	}
	.modify {
		position: relative;
		//padding-top: 50rpx;

		view {
			width: 700rpx;
			height: 500rpx;
			margin: 0 auto;
			overflow: hidden;
			background-color: #ffffff;
			border: 4rpx solid #ffffff;
			border-radius: 10%;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.opection-box {
		margin-top: 50rpx;
	}

	.opec {
		width: 100%;
		padding: 0 10%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}



	.textContent {
		width: 80%;
		margin: 0 auto;
		button{
			margin-top:15px;
			}
	}

	.agreeContract {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 40rpx;
		min-height: 50rpx;
		background-color: #fff;
		justify-content: flex-start;
	}

	.fillingInfo {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 40rpx;
		min-height: 50rpx;
		background-color: #fff;
		justify-content: flex-start;
	}

	.fillingInfoName {
		margin-left: 10px;
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
			width: 150rpx;
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

	.set-card {
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
