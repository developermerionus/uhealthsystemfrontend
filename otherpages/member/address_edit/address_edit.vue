<template>
	<view class="address-edit-content" :data-theme="themeStyle">
		<view class="outer-container-wrap">
		
				<view class="edit-wrap">
			<view class="tip">{{$lang('address')}}</view>
			<view class="edit-item">
				<text class="tit">
					{{ $lang('consignee') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('consignee')"
				 maxlength="30" name="name" v-model="formData.name" />
			</view>
		<!-- 	<view class="edit-item">
				<text class="tit">
					{{ $lang('lastname') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('lastname')"
				 maxlength="30" name="name" v-model="formData.lastname" />
			</view> -->
			<view class="edit-item">
				<text class="tit">
					{{ $lang('mobile') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="number" placeholder-class="placeholder-class" :placeholder="$lang('mobilePlaceholder')"
				 maxlength="12" v-model="formData.mobile" />
			</view>

			<view class="edit-item">
				<text class="tit" style='width: 235rpx;'>{{$lang('country')}}<text>*</text></text>
				<picker @change="bindPickerChange" :value="index" :range="countryList" class="picker" range-key="name">
					<text class="desc uni-input">{{ countryList[index].name }}</text>
				</picker>
			</view>
			<!--  外卖地址区分 -->
			<!-- <block v-if="localType == 2"> -->
			<view class="edit-item"  v-show="localType == 2">
				<text class="tit" >
					{{$lang('state')}}
					<text>*</text>
				</text>
				<input v-if="!checkSelfPickUp" class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('state')"
				 maxlength="100" v-model="formData.state" @click="goState()"/>
				 
				 <input v-if="checkSelfPickUp" type="text" placeholder-class="placeholder-class selfPickUp" :placeholder="selfPickUpState" />
			</view>
			<view class="edit-item"  v-show="localType == 2">
				<text class="tit" >
					{{$lang('city')}}
					<text>*</text>
				</text>
				<input v-if="!checkSelfPickUp" class="uni-input" type="text" placeholder-class="placeholder-class" placeholder="请输入城市"
				 maxlength="100" v-model="formData.city" /> 
				  <input v-if="checkSelfPickUp" type="text" placeholder-class="placeholder-class selfPickUp" :placeholder="selfPickUpCity" />
			</view>
			<view class="edit-item" v-show="localType != 2">
				<text class="tit">
					{{ $lang('provinceCity') }}
					<text>*</text>
				</text>
				<pick-regions ref="pickregions" :default-regions="defaultRegions" @getRegions="handleGetRegions" :countryid="formData.country_id">
					<text class="select-address " :class="{ empty: !formData.full_address, 'color-tip': !formData.full_address }">
						{{ formData.full_address ? formData.full_address :$lang('provinceCity') }}
					</text>
					
				</pick-regions>
			</view>
			<view class="edit-item">
				<text class="tit" style="">
					{{ $lang('address') }}
					<text>*</text>
				</text>
				<input v-if="!checkSelfPickUp" class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('addressPlaceholder')"
				 maxlength="50" v-model="formData.address" />
				  <input v-if="checkSelfPickUp" type="text" placeholder-class="placeholder-class selfPickUp" :placeholder="selfPickUpStreet" />
			</view>
			<view class="edit-item" v-show="localType != 2">
				<text class="tit" style="">
					{{ $lang('idNumber') }}
					<text>*</text>
				</text>
				<input class="uni-input" type="text" placeholder-class="placeholder-class" :placeholder="$lang('idNumberPlaceholder')"
				 maxlength="50" v-model="formData.idNumber" />
			</view>
			<block v-if="localType == 2">
				<view class="edit-item">
					<text class="tit" >
						{{$lang('zipcode')}}
						<text>*</text>
					</text>
						<input v-if="!checkSelfPickUp" class="uni-input" type="text" placeholder-class="placeholder-class" placeholder="请输入邮政编码"
						 maxlength="20" v-model="formData.zipcode" />
						  <input v-if="checkSelfPickUp" type="text" placeholder-class="placeholder-class selfPickUp" :placeholder="selfPickUpZipCode" />
				</view>
			</block>
		</view>
		<view class="btn">
			<button type="primary" class="add" @click="saveAddress">{{ $lang('save') }}</button>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue';
	import validate from 'common/js/validate.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	import Config from '@/common/js/config.js';
	var self;
	export default {
		components: {
			pickRegions
		},
		data() {
			return {
				formData: {
					id: 0,
					name: '',
					mobile: '',
					telephone: '',
					country_id:172,
					province_id: '',
					state: '',
					city_id: '',
					city: '',
					district_id: '',
					community_id: '',
					address: '',
					zipcode: '',
					full_address: '',
					latitude: 0,
					longitude: 0,
					is_default: 1,
					idNumber:'',
					firstname: '',
					lastname: '',
				},
				address: '',
				addressValue: '',
				back: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				flag: false, //防重复标识
				defaultRegions: [],
				localType: 1,
				goflag:'',
				
				countryList: [
					{
						"id":0,
						"name":"China"
					}
				],
				tempCountryList:[],
				index: 0,
				memberInfo: {},
				addressLength: 1,
				checkSelfPickUp:false,
				selfPickUpState:"California",
				selfPickUpCity:"West Covina",
				selfPickUpStreet:"100 N Barranca St. #100",
				selfPickUpZipCode:"91791",
				avoidRepeatClick:[]
				
			};
		},
		onLoad(option) {
			// console.log(option)
			if (option.back) this.back = option.back;
			if (option.redirect) this.redirect = option.redirect;
			if (option.type) this.localType = option.type;
			if (option.id && !option.name) {
				this.formData.id = option.id;
				this.getAddressDetail();
			} else if (option.name) {
				if (uni.getStorageSync('addressInfo')) this.formData = uni.getStorageSync('addressInfo');
				this.formData.address = option.name;
				this.localType = 2;
				this.getAddress(option.latng);
				//给formData复制
				var tempArr = this.getQueryVariable('latng').split(',');
				this.formData.latitude = tempArr[0];
				this.formData.longitude = tempArr[1];
			} else {
				this.getCountryList();
				if (option.addressLength == 0){
					this.addressLength = 0;
					this.getMemberInfo();
				}
				if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
			}
		},
		onBackPress() {
			uni.setStorageSync('addressInfo', '');
		},
		onShow() {
			self = this;
			this.getWrongChineseIdInfo();
			this.$langConfig.refresh();
			if (this.formData.id) {
				uni.setNavigationBarTitle({
					title: '编辑收货地址'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '新增收货地址'
				});
			}
		},
		onReady() {
			this.$refs.loadingCover.hide();
		},
		onHide() {
			this.flag = false;
		},
		mixins: [globalConfig],
		methods: {
			getWrongChineseIdInfo(){
				console.log('getWrongChineseIdInfo');
				//self.avoidRepeatClick = uni.getStorage('wrongChineseIdInfo');
				uni.getStorage({
				    key: 'wrongChineseIdInfo',
				    success: function (res) {
						console.log('get wrongChineseIdInfo',res.data)
				       self.avoidRepeatClick=res.data;
				    }
				});
			},
			setWrongChineseIdInfo(wrongIdInfoArr){
				uni.setStorage({
				    key: 'wrongChineseIdInfo',
				    data: wrongIdInfoArr,
				    success: function () {
				        console.log('wrong chinese id infor get saved success');
				    }
				});
			},
			
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.formData.idNumber = res.data.id_number;
							this.formData.state = res.data.state;
							this.formData.city = res.data.city;
							this.formData.zipcode = res.data.zipcode;
							this.formData.name = res.data.surname + '.' + res.data.firstname;
							this.formData.mobile = res.data.mobile;
							this.formData.telephone = '';
							this.formData.address = res.data.address;
							this.formData.latitude = 0;
							this.formData.longitude = 0;
							this.formData.is_default = 1;
							this.formData.country_id = res.data.marketCountryId;
							
							this.formData.full_address = '';
							this.index = this.countryList.findIndex((item)=>{return item.id==res.data.marketCountryId});
							
							// if (this.index == 0 || this.index != ''){
								this.formData.country_id = res.data.marketCountryId;
								this.setLocalType();
							// }
							//刷新子组件的内容
							if (this.index == 8)
								this.$refs.pickregions.refreshAddress(this.formData.country_id);
						}
					},
				})
			},
			goState() {
				uni.navigateTo({
					url: `/otherpages/member/indexed-list/indexed-list?country=${this.countryList[this.index].id}&from=1`
				})
			},
			loadAddressFromMemberInfo() {
				
			},
			// 获取地址信息
			getAddressDetail() {
				// console.log('getAddressDetail')
				this.$api.sendRequest({
					url: '/api/memberaddress/info',
					data: {
						id: this.formData.id
					},
					success: res => {
						let data = res.data;
						if (data != null) {
							this.formData.idNumber = data.idNumber;
							this.formData.state = data.state;
							this.formData.city = data.city;
							this.formData.zipcode = data.zipcode;
							this.formData.name = data.name;
							this.formData.mobile = data.mobile;
							this.formData.telephone = data.telephone;
							this.formData.address = data.address;
							//处理国家问题
							if (data.country_id == 172){
								let handleAddress = data.full_address.split('-');
								handleAddress.shift();
								this.formData.full_address = handleAddress.join("-");
							} else {
								let handleAddress = data.full_address.split(',');
								handleAddress.pop();
								this.formData.full_address = handleAddress.join(",");
							}
							
							this.formData.latitude = data.latitude;
							this.formData.longitude = data.longitude;
							this.formData.is_default = data.is_default;
							this.formData.country_id = data.country_id;
							
							this.localType = data.type;
							this.defaultRegions = [data.province_id, data.city_id, data.district_id];
							this.getCountryList();
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},			
		
			//获取详细地址
			getAddress(value) {
				// console.log('getAddress')
				this.$api.sendRequest({
					url: '/api/memberaddress/tranAddressInfo',
					data: {
						latlng: value
					},
					success: res => {
						if (res.code == 0) {
							this.formData.full_address = '';
							if (this.formData.country_id == 172){
								this.formData.full_address += res.data.province != undefined ? res.data.province : '';
								this.formData.full_address += res.data.city != undefined ? '-' + res.data.city : '';
								this.formData.full_address += res.data.district != undefined ? '-' + res.data.district : '';
							} else {
								this.formData.full_address += res.data.state;
								this.formData.full_address += res.data.city;
								this.formData.full_address += res.data.zipcode;
							}
							this.addressValue = '';
							this.addressValue += res.data.province_id != undefined ? res.data.province_id : '';
							this.addressValue += res.data.city_id != undefined ? '-' + res.data.city_id : '';
							this.addressValue += res.data.district_id != undefined ? '-' + res.data.district_id : '';
						} else {
							this.showToast({
								title: '数据有误'
							});
						}
					}
				});
			},
			// 获取选择的地区
			handleGetRegions(regions) {
				this.formData.full_address = '';
				this.formData.full_address += regions[0] != undefined ? regions[0].label : '';
				this.formData.full_address += regions[1] != undefined ? '-' + regions[1].label : '';
				this.formData.full_address += regions[2] != undefined ? '-' + regions[2].label : '';
				this.addressValue = '';
				this.addressValue += regions[0] != undefined ? regions[0].value : '';
				this.addressValue += regions[1] != undefined ? '-' + regions[1].value : '';
				this.addressValue += regions[2] != undefined ? '-' + regions[2].value : '';
			},

			selectAddress() {
				// #ifdef MP
				uni.chooseLocation({
					success: res => {
						this.formData.latitude = res.latitude;
						this.formData.longitude = res.longitude;
						this.formData.address = res.name;
						this.getAddress(res.latitude + ',' + res.longitude);
					},
					fail(res) {
						uni.getSetting({
							success: function(res) {
								var statu = res.authSetting;
								if (!statu['scope.userLocation']) {
									uni.showModal({
										title: '是否授权当前位置',
										content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
										success(tip) {
											if (tip.confirm) {
												uni.openSetting({
													success: function(data) {
														if (data.authSetting['scope.userLocation'] === true) {
															this.$util.showToast({
																title: '授权成功'
															});
															//授权成功之后，再调用chooseLocation选择地方
															setTimeout(function() {
																uni.chooseLocation({
																	success: data => {
																		this.formData.latitude = res.latitude;
																		this.formData.longitude = res.longitude;
																		this.formData.address = res.name;
																		this.getAddress(res.latitude + ',' + res.longitude);
																	}
																});
															}, 1000);
														}
													}
												});
											} else {
												this.$util.showToast({
													title: '授权失败'
												});
											}
										}
									});
								}
							}
						});
					}
				});
				// #endif
				// #ifdef H5
				var urlencode = this.formData;
				uni.setStorageSync('addressInfo', urlencode);
				let backurl = Config.h5Domain + '/otherpages/member/address_edit/address_edit?type=' + this.localType;
				if (this.formData.id) backurl += '&id=' + this.formData.id;
				if (this.back) backurl += '&back=' + this.back;

				window.location.href = 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=' + encodeURIComponent(
					backurl) + '&key=' + Config.mpKey + '&referer=myapp';
				// #endif
			},

			getQueryVariable(variable) {
				var query = window.location.search.substring(1);
				var vars = query.split('&');
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split('=');
					if (pair[0] == variable) {
						return pair[1];
					}
				}
				return false;
			},
			verify() {
				this.formData.name = this.formData.name.trim();
				this.formData.mobile = this.formData.mobile.trim();
				this.formData.address = this.formData.address.trim();
				let rule =[];
				if (this.formData.country_id == 172){
					rule = [
						{
							name: 'name',
							checkType: 'required',
							errorMsg: '请输入姓名'
						},
						{
							name: 'mobile',
							checkType: 'required',
							errorMsg: '请输入手机号'
						},
						{
							name: 'full_address',
							checkType: 'required',
							errorMsg: '请选择省市区县'
						},
						{
							name: 'address',
							checkType: 'required',
							errorMsg: '详细地址不能为空'
						},
						{
							name: 'idNumber',
							checkType: 'required',
							errorMsg: '身份证号码不能为空'
						},
						{
							name: 'idNumber',
							checkType: 'idnumbercheck',
							errorMsg: '您的身份证号码不是18位'
						}
					];
					
				} else {
					rule = [{
							name: 'name',
							checkType: 'required',
							errorMsg: '请输入姓名'
						},
						{
							name: 'mobile',
							checkType: 'required',
							errorMsg: '请输入手机号'
						},
						{
							name: 'state',
							checkType: 'required',
							errorMsg: '请选择州省'
						},
						{
							name: 'city',
							checkType: 'required',
							errorMsg: '请输入城市'
						},
						{
							name: 'zipcode',
							checkType: 'required',
							errorMsg: '请输入邮政编码'
						},
						{
							name: 'address',
							checkType: 'required',
							errorMsg: '详细地址不能为空'
						},
					];
				}
				
				var checkRes = validate.check(this.formData, rule, this.$api);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					this.flag = false;
					return false;
				}
			},
			
			saveAddress() {
				if (this.flag) return;
				this.flag = true;
				this.gocheck();
			},
			gocheck() {
				
				let result = this.verify();
				if(result&&this.formData.country_id===172) {
					this.checkChineseIdInDatabase(this.formData.idNumber,this.formData.name);
				}
				else if(result&&this.formData.country_id!==172) {
					this.processSaveAdress()
				}
				else {
					this.flag = false;
				}
			},
			checkChineseIdInDatabase (idNumber, idName) {
				//console.log(idNumber,idName);
				this.$refs.loadingCover.show();
				this.$api.sendRequest({
					url: '/api/member/checkChineseIdInDatabase',
					data: {
						idNumber: idNumber,
						idName: idName
					},
					success: res => {
						//console.log('res', res);
						if(res.data && res.data.length === 1&& res.data[0].idName===idName) {
							console.log('Chinese name and id in database');
							this.processSaveAdress(); 
						}
						else if (res.data && res.data.length === 0){
							console.log('self.avoidRepeatClick',self.avoidRepeatClick);
							if(this.checkConstantClickWrongIdName(idName,idNumber)){
								console.log('this is a new chinese id and name. check if it is real')
								this.checkIdNameReal (idNumber, idName)
							}
						}
						else if (res.data && res.data.length === 1&& res.data[0].idName!==idName) {
							this.$refs.loadingCover.hide();
							console.log('the name is not right for this chinese id');
							this.$util.showToast({
								title: "你的名字不匹配你的身份证号码。 The name is not match the Chinese ID",
							});
						}
						else {
							this.$refs.loadingCover.hide();
							this.$util.showToast({
								title: "请核对你的名字和你的身份证号码。 Please Check Your Chinese Name and Your Chinese ID ",
							});
						}
						this.flag=false;
					},
				})
			},
			checkConstantClickWrongIdName(idName,idNumber){
				console.log('this is repeated mistakes');
				for(let item of self.avoidRepeatClick) {
					if(item.idName===idName && item.idNumber===idNumber){
						this.$refs.loadingCover.hide();
						this.$util.showToast({
							title: "请核对你的名字和你的身份证号码。"
						});
						return false
					}
				}
				return true;
			},
			checkIdNameReal (idNumber, idName) {
			 this.$api.sendRequest({
					url: '/api/member/checkIdNameReal',
					data: {
						idNumber: idNumber,
						idName: idName
					},
					success: res => {
						//console.log('res',res, res.code, res.message);
						
						if(res.code !=="0") {
							self.avoidRepeatClick.push({idName:idName,idNumber:idNumber, message:res.message})
							this.setWrongChineseIdInfo(self.avoidRepeatClick);
							this.$refs.loadingCover.hide();
							console.log('chinese id and name did not pass alibaba check');
							this.$util.showToast({
								title: res.message
							});
						}
						else if(res.code === "0" && res.result && res.result.description==="一致") {
							console.log('name and chinese id pass alibaba  check');
							this.addChineseIdNameInDatabase(idNumber, idName);
							this.processSaveAdress();
						}
						else if(res.code === "0" && res.result && res.result.description!=="一致") {
							self.avoidRepeatClick.push({idName:idName,idNumber:idNumber, message:res.result.description})
							this.setWrongChineseIdInfo(self.avoidRepeatClick);
							console.log('hee',res.result.description!=="一致");
							this.$refs.loadingCover.hide();
							this.$util.showToast({
								title: "身份证号码和名字不一致"
							});
						}
						else {
							this.$refs.loadingCover.hide();
							this.$util.showToast({
								title: res.message
							});
						}
						this.flag=false;
					},
				})
			},
			
			processSaveAdress () {
				let full_address ='';
				if (this.countryList[this.index].id == 172){
					full_address = this.countryList[this.index].name +'-'+this.formData.full_address;
				}
				else {
					full_address = this.formData.city +', '+this.formData.state
										+ ' ' + this.formData.zipcode + ', ' + this.countryList[this.index].name;
				}
					let addressValueArr = this.addressValue.split('-'),
						data = {},
						url = '';
					data = {
						name: this.formData.name,
						mobile: this.formData.mobile,
						telephone: this.formData.telephone,
						country_id: this.formData.country_id,
						province_id: addressValueArr[0],
						city_id: addressValueArr[1] != undefined ? addressValueArr[1] : 0,
						district_id: addressValueArr[2] != undefined ? addressValueArr[0] : 0,
						community_id: 0,
						address: this.formData.address,
						full_address,
						latitude: this.formData.latitude,
						longitude: this.formData.longitude,
						is_default: this.formData.is_default,
						type: this.localType,
						idNumber: this.formData.idNumber
					};
					if(this.formData.country_id != 172){
						data['city'] = this.formData.city;
						data['state'] = this.formData.state;
						data['zipcode'] = this.formData.zipcode;
					}
				
					url = 'add';
					if (this.formData.id) {
						url = 'edit';
						data.id = this.formData.id;
						if (this.back != '') data.is_default = 1;
					}
					
					this.$api.sendRequest({
						url: '/api/memberaddress/' + url,
						data: data,
						success: res => {
							this.$refs.loadingCover.hide();
							this.flag = false;
							//console.log(res);
							if (res.code == 0) {
								if (this.back != '') {
									let jump = true;
									let arr = getCurrentPages().reverse();
									for (let i = 0; i < arr.length; i++) {
										if (this.back.indexOf(arr[i].route) != -1) {
											jump = false;
											uni.navigateBack({
												delta: i
											});
											break;
										}
									}
									if (jump) {
										this.$util.redirectTo(this.back, {}, 'redirectTo');
									}
								} else {
									this.$util.showToast({
										title: res.message
									});
									uni.navigateBack({
										delta: 1
									});
								}
								uni.removeStorageSync('addressInfo');
							}
						},
						fail: res => {
							this.flag = false;
						}
					});
			},
			addChineseIdNameInDatabase (idNumber, idName) {
				console.log('save ',idNumber,idName);
				this.$api.sendRequest({
					url: '/api/member/addChineseIdNameInDatabase',
					data: {
						idNumber: idNumber,
						idName: idName
					},
					success: res => {
						if(res.code ===0) {
							console.log('Chinese Id Number and Chinese Name get saved');
						}
						else {
							console.log('Chinese Id Number and Chinese Name did not get saved');
						}
					},
				})
			},
			
 			/**
			 * 获取国家
			 */
			getCountryList() {
				this.$api.sendRequest({
					url: '/api/address/country',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.countryList = res.data;
							//console.log('this.countryList',this.countryList);
							if (!this.formData.country_id && this.$refs.loadingCover) this.$refs.loadingCover.hide();
							for (let v in this.countryList) {
								this.tempCountryList.push(this.countryList[v].id);
							}
							
							if (this.tempCountryList.length) {
								this.index = this.$util.inArray(this.formData.country_id, this.tempCountryList);
								this.setLocalType()
							}
						}
					}
				});
			},
			setLocalType() {
				this.localType = this.formData.country_id == 172 ? 1 : 2;
			},
			bindPickerChange(e) {
				// console.log(e);
				this.formData.full_address = '';
				this.index = e.detail.value;
				//console.log('this.index',this.index);
				this.formData.country_id = this.countryList[this.index].id;
				if(this.countryList[this.index].id===0) {
					this.checkSelfPickUp = true;
					//console.log('this.formData',this.formData);
					this.formData.city = this.selfPickUpCity;
					 this.formData.zipcode = this.selfPickUpZipCode;
					 this.formData.state = this.selfPickUpState;
					 this.formData.address = this.selfPickUpStreet;
				}
				else {
					this.checkSelfPickUp = false;
				}
				//刷新子组件的内容
				this.setLocalType();
				if (this.formData.country_id == 172)
					// console.log(this.$refs.pickRegions);
					this.$refs.pickregions.refreshAddress(this.formData.country_id);
			},
		}
	};
</script>

<style lang="scss">
	/deep/ pick-regions,
	.pick-regions {
		flex: 1;
	}

	.edit-wrap {
		background: #fff;
		overflow: hidden;

		.tip {
			padding: 20rpx 30rpx 10rpx;
			background-color: #f8f8f8;
			color: $color-tip;
		}
	}

	.edit-item {
		display: flex;
		align-items: center;
		margin: 0 30rpx;
		min-height: 100rpx;
		background-color: #fff;

		.text_inp {
			margin-left: $margin-updown;
			flex: 1;
		}

		.tit {
			width: 220rpx;

			text {
				margin-left: 10rpx;
				color: #ff4544;
			}

			&.margin_tit {
				align-self: flex-start;
				margin-top: 24rpx;
			}
		}

		.iconlocation {
			color: #606266;
			align-self: flex-start;
			margin-top: 20rpx;
		}

		.select-address {
			display: block;
			margin-left: 10rpx;

			&.empty {
				color: #808080;
			}
		}

		textarea,
		input {
			flex: 1;
			font-size: $font-size-base;
			margin-left: 20rpx;
			padding: 0;
		}

		textarea {
			margin-top: 6rpx;
			height: 100rpx;
			padding-bottom: 20rpx;
			padding-top: 20rpx;
			line-height: 50rpx;
		}
	}

	.edit-wrap>.edit-item+.edit-item {
		border-top: 2rpx solid #ebedf0;
	}

	.add {
		margin-top: 60rpx;
		height: 80rpx;
		line-height: 80rpx !important;
		border-radius: 80rpx;
		font-weight: 500;
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
	}

	.btn {
		position: fixed;
		width: 100%;
		bottom: 30rpx;
		height: auto;
		padding-bottom: constant(safe-area-inset-bottom);
		/*兼容 IOS<11.2*/
		padding-bottom: env(safe-area-inset-bottom);
		/*兼容 IOS>11.2*/
		
		button {
			border-radius: 10rpx;
			background: linear-gradient(to right,#10869c 0%,#118ca3 12%,
			#139fb9 34%,#14a5c0 47%,#139fb9 67%,#118ca3 89%,#10869c 100%);
		}
		
		max-width: 1200px;
	}
	
	
	.outer-container-wrap {
		max-width: 1200px;
		margin: 0 auto;
	
	}
	.selfPickUp{
		font-size:15px;
		color:#303133;
	}
</style>
