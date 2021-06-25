import validate from '@/common/js/validate.js';
export default {
	data() {
		return {
			registerConfig: {},
			indent: 'all',
			customNavTitle: "",
			memberInfo: {
				headimg: '',
				language: '',
			},
			formData: {
				birthdateChange: false,
				birthdate: '', //生日
				currentPassword: '', //当前密码
				newPassword: '', //新密码
				confirmPassword: '', //确认密码
			},
			infoList: [],
			vmodel: '',
			langList: [],
			langIndex: 0,
			seconds: 120,
			timer: null,
			isSend: false,
			captcha: {
				id: '',
				img: ''
			},
			isIphoneX: false,
			browse: false,
			browse_member_id: 0,
			current: 0,
			memberConfig: {
				is_audit: 0,
				is_enable: 0
			},
			
			// market: ['中国-China', 'USA-美国', '台湾-Taiwan', '香港-Hongkong', '澳门-Macao'],
			// marketIndex: 0,
			branch: ['左区-left', '右区-right'],
			// id_which: ['EIN', 'SSN', 'TAXID'],
			countryList: [
				{
					"id":172,
					"name":"China"
				}
			],
			country: {},
			form: [],
			showLang:''
		};
	},
	onLoad(option) {
		// console.log(option);
		this.customNavTitle = this.$lang('title');
		if (option.back) {
			this.back = option.back;
		}
		this.getCaptcha();
		this.getRegisterConfig();
		this.getCountryList();
		// this.pushAddresss = !disabled;
		this.initLang();
	},
	onShow() {
		this.getMemberConfig();
	},
	onHide() {
		this.seconds = 120;
		// this.memberInfoformData.mobileCodeText = '获取动态码';
		this.isSend = false;
		clearInterval(this.timer);
	},
	watch: {
		seconds(value) {
			if (value == 0) {
				this.seconds = 120;
				// this.memberInfoformData.mobileCodeText = '获取动态码';
				this.isSend = false;
				clearInterval(this.timer);
			}
		}
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		},
		disabled() {
			return false;
			// return this.form.some((item)=>{return item.name !='joint_applicant'&& item.name!='company'&&item.name!='email'&&item.name!='mobile'&&!item.value})
		},

	},
	
	methods: {
		locked(item) {
			return (this.memberInfo.member_level > 1) && (item=='email' ||item=='mobile' ||item == 'firstname' || item =='surname'||item =='joint_applicant'||item =='company'||item =='id_number'||item=='birthdate')
		},
		saveData() {
			let data = {
				firstname: this.form.find((item)=>{return item.name=='firstname'}).value,
				surname: this.form.find((item)=>{return item.name=='surname'}).value,
				joint_applicant: this.form.find((item)=>{return item.name=='joint_applicant'}).value,
				company: this.form.find((item)=>{return item.name=='company'}).value,
				
				birthdate: this.form.find((item)=>{return item.name=='birthdate'}).value,
				email: this.form.find((item)=>{return item.name=='email'}).value,
				mobile: this.form.find((item)=>{return item.name=='mobile'}).value,
				state: this.form.find((item)=>{return item.name=='state'}).value,
				city: this.form.find((item)=>{return item.name=='city'}).value,
				address: this.form.find((item)=>{return item.name=='address'}).value,
				zipcode: this.form.find((item)=>{return item.name=='zipcode'}).value,
				nickname: this.form.find((item)=>{return item.name=='nickname'}).value,
				// surname: this.form[13].value,
			}
			if (this.memberInfo.member_level == 1) {
				data.id_number = this.form.find((item)=>{return item.name=='id_number'}).value;
			} else {
				data.id_number = this.memberInfo.id_number;
			}
			
			
			if('Taiwan,China,Hong Kong Area,Macau'.includes(this.country.name)){
				data.firstnamePY = this.form.find((item)=>{return item.name=='firstnamePY'}).value;
				data.surnamePY = this.form.find((item)=>{return item.name=='surnamePY'}).value;
			}
			// console.log(data);
			this.$api.sendRequest({
				url: '/api/member/modifyMember',
				data,
				success: res => {
					// console.log(res)
					if (res.code >= 0) {
						this.$util.msg('修改成功')
					}
				},
			})
			
		},
		/**
		 * 获取国家
		 */
		
		updateStateProvince(state, country_id) {
		
			this.form.forEach((item)=>{if (item.name=='state') {
				item.value = state;
			} })
		},
		async getCountryList() {
			let res= await this.$api.sendRequest({
					url: '/api/address/country',
					async: false,
			});
				
			if (res.code >= 0 && res.data) {
				this.countryList = res.data;
				// console.log(this.countryList);
				this.getInfo();
				if (!this.formData.country_id && this.$refs.loadingCover) this.$refs.loadingCover.hide();
				
				// console.log(this.countryList);
			}
			
		},
		// 初始化语言
		initLang() {
			//获取语言列表
			this.langList = this.$langConfig.list();
			if (!uni.getStorageSync("lang")) {
				this.langIndex = 0;
				this.showLang =  this.langList[0].name;
			} else {
				this.langList.forEach((el,index) => {
					if(el.value==uni.getStorageSync("lang")){
						this.showLang = this.langList[index].name;
					}
				})
			    
				for (let i = 0; i < this.langList.length; i++) {
					if (this.langList[i].value == uni.getStorageSync("lang")) {
						this.langIndex = i;
						break;
					}
				}
			}
			this.$langConfig.refresh();
		},
		infoListPush(name, arrow, value, init_value){
			this.infoList.push({value, name, arrow, init_value});
		},
		// 初始化用户信息
		getInfo() {
			// console.log('get info...')
			let member_id = this.browse ? this.browse_member_id : 0;
			this.$api.sendRequest({
				url: '/api/member/info',
				// data: {
				// 	member_id,
				// },
				success: res => {
					// console.log(res.data);
					if (res.code == 0) {
						let input = this.$lang('input');
						this.indent = 'all';
						this.memberInfo = res.data;
						// console.log(this.memberInfo.member_level)
						this.$language = this.memberInfo.language;
						this.infoList = [];
						this.infoListPush('member_id', false, this.memberInfo.member_id)
						this.infoListPush('username', false, this.memberInfo.username)
						this.country = this.countryList.find((item)=>{return item.id === this.memberInfo.marketCountryId });
						this.infoListPush('market', false, this.country.name);
						this.infoListPush('referrer', false, this.memberInfo.referrer)
						this.infoListPush('superiors', false, this.memberInfo.superiors)
						this.infoListPush('branch', false, this.memberInfo.branch)
						this.form.push({name:'firstname', value: this.memberInfo.firstname});
						this.form.push({name:'surname', value: this.memberInfo.surname});
						if('Taiwan,China,Hong Kong Area,Macau'.includes(this.country.name)){
							this.form.push({name:'firstnamePY', value: this.memberInfo.firstnamePY});
							this.form.push({name:'surnamePY', value: this.memberInfo.surnamePY});
						}
						this.form.push({name:'joint_applicant', value: this.memberInfo.joint_applicant});
						this.form.push({name:'company', value: this.memberInfo.company});
						if(this.memberInfo.member_level > 1){
							this.form.push({name:'id_number', value: this.replaceStart(this.memberInfo.id_number, 0, 4)});
						} else {
							this.form.push({name:'id_number', value: this.memberInfo.id_number});
						}
						this.form.push({name:'birthdate', value: this.memberInfo.birthdate?this.memberInfo.birthdate.substr(0, 10):''});
						this.form.push({name:'email', value: this.memberInfo.email});
						this.form.push({name:'mobile', value: this.memberInfo.mobile});
						this.form.push({name:'state', value: this.memberInfo.state});
						this.form.push({name:'city', value: this.memberInfo.city});
						this.form.push({name:'address', value: this.memberInfo.address});
						this.form.push({name:'zipcode', value: this.memberInfo.zipcode});
						this.form.push({name:'nickname', value: this.memberInfo.nickname});
						// console.log(this.form)
					}
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		exist(indent){
			// console.log(indent);
			const str = "stateProvinceId, state, address,city,zipcode,qq,referrer,superiors,firstname,surname,firstnamePY,surnamePY,joint_applicant,company,email,mobile,id_number,nickname,password";
			return str.includes(indent);
		},
		replaceStart(str,frontLen,endLen){
		      // str：字符串，frontLen：前面保留位数，endLen：后面保留位数。
		      var len = str.length-frontLen-endLen;
		      var start = '';
		      for (var i=0;i<len;i++) {
		        start+='*';
		      }
		      return str.substring(0,frontLen)+start+str.substring(str.length-endLen);
		},
		// 切换编辑项
		modifyInfo(item) {
			// if (!item.arrow) return;
			// this.vmodel = item.init_value;
			let that = this;
			switch (item){
				case 'language':
					let newArray = [];
					for (let i = 0; i < that.langList.length; i++) {
						newArray.push(that.langList[i].name)
					}
					uni.showActionSheet({
						itemList: newArray,
						success: function(res) {
							if (that.langIndex != res.tapIndex) {
								that.langIndex = res.tapIndex;	
								if (this.showLang === that.langList[res.tapIndex].name) {return}
								this.showLang = that.langList[that.langIndex].name;
								that.save(item, that.langList[res.tapIndex].name);
								that.$langConfig.change(that.langList[res.tapIndex].value)
								// that.$forceUpdate();
							}
						}
					});
					
					break;
				case "state":
					uni.navigateTo({
						url: `/otherpages/member/indexed-list/indexed-list?country=${this.country.id}`
					})
					break;
				case 'birthdate':
				
				    break;
				case "password":
					this.indent = item;
					this.customNavTitle = this.$lang(item);
					break;
				default:
					break;
			}
		},
		
		getCancelStatus() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/info',
				success: res => {
					if (res.code >= 0) {
						if (res.data) {
							if (res.data.status == 0) {
								this.$util.redirectTo('/otherpages/member/cancelstatus/cancelstatus', {
									back: '/pages/member/info/info'
								});
							} else if (res.data.status == 1) {
								this.$util.redirectTo('/otherpages/member/cancelsuccess/cancelsuccess', {
									back: '/pages/member/info/info'
								});
							} else {
								this.$util.redirectTo('/otherpages/member/cancelrefuse/cancelrefuse', {
									back: '/pages/member/info/info'
								});
							}
						} else {
							this.$util.redirectTo('/otherpages/member/cancellation/cancellation', {
								back: '/pages/member/info/info'
							});
						}
					}
				}
			});
		},
		// 导航返回
		NavReturn() {
			if (this.indent == 'all') {
				if (this.back) {
					this.$util.redirectTo(this.back, {}, 'redirectTo');
				} else {
					this.$util.redirectTo('/pages/member/index/index', {}, 'reLaunch');
				}
			} else {
				this.indent = 'all';
				this.customNavTitle = this.$lang('title');
				// this.initFormData();
			}
		},
		// 获取验证码
		getCaptcha() {
			this.$api.sendRequest({
				url: '/api/captcha/captcha',
				data: {
					captcha_id: this.captcha.id
				},
				success: res => {
					if (res.code >= 0) {
						this.captcha = res.data;
						this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
					}
				}
			});
		},
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorage({
							key: 'token',
							success: res => {
								uni.setStorageSync('loginLock', 1);
								//购物车数量
								uni.removeStorageSync('userInfo')
								this.$store.dispatch('getCartNumber').then((e) => {})
								uni.reLaunch({
									url: '/pages/member/index/index',
									// success: ()=>{
									// 	this.$util.redirectTo(decodeURIComponent('/pages/member/index/index'), {}, this.redirect);
									// }
								})
								// this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
							}
						});
					}
				}
			});
		},
		headImage() {
			this.$util.redirectTo("/otherpages/member/modify_face/modify_face");
		},
		// // 检测手机是否已绑定
		// async testBinding(type) {
		// 	var res = await this.checkMobile();
		// 	return res;
		// },
		//获取注销的配置信息
		getMemberConfig() {
			this.$api.sendRequest({
				url: '/membercancel/api/membercancel/config',
				success: res => {
					if (res.code >= 0) {
						this.memberConfig = res.data
					}
				}
			});
		},

		save(item, value) {
			// console.log(item, value);
			
			if (!value) {
				value = this.vmodel;
				// if (this.infoList.find((i)=>{return i.name==item && i.value == this.vmodel})) 
				// 	return this.$util.msg(this.$lang("SAMEVALUE"))
				if (item=='birthdate'){
				  if (!this.formData.birthdateChange && this.memberInfo.birthdate==0) 
					return this.$util.msg(this.$lang("CANTBEEMPTY"))
				  value = this.formData.birthdate
				  if (value == this.memberInfo.birthdate)
				    return this.$util.msg(this.$lang("SAMEVALUE"))
				} else if (!this.vmodel) {
					return this.$util.msg(this.$lang("CANTBEEMPTY"))
				} 
			}
			if (item == 'email'){
				var rule = [{
					name: 'email',
					checkType: 'email',
					errorMsg: '请输入正确的email账号'
				}];
				this.formData['email'] = value;
				var checkRes = validate.check(this.formData, rule);
				if (!checkRes) return this.$util.msg(validate.error);
			}
			// console.log(item, value);
			// 提交修改
			this.$api.sendRequest({
				url: '/api/member/modifyinfo',
				data: {
					item,
					value,
				},
				success: res => {
					if (res.code == 0) {
						this.getInfo();
						this.$util.showToast({
							title: this.$lang("updateSuccess")
						});
						if (!value) {
							this.NavReturn();
						}
					} else {
						// console.log(res)
						if(item !='language') {
							this.$util.showToast({
								title: this.$lang(res.message)
							});
						}
						
					}
				}
			});
		},
		cancel(){
			this.NavReturn();
		},
	
		// ------------------------修改生日------------------------------

		bindDateChange(e) {
			// console.log(e)
			if (this.memberInfo.member_level > 1) return;
			this.formData.birthdateChange = true
			this.formData.birthdate = e.target.value
			this.form.forEach((item)=>{if (item.name=='birthdate') {
				item.value = e.target.value;
			} })
			// this.form. = e.target.value
		},

		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 90;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},

	

		// ------------------------修改密码------------------------------
		/**
		 * 获取注册配置
		 */
		getRegisterConfig() {
			this.$api.sendRequest({
				url: '/api/register/config',
				success: res => {
					if (res.code >= 0) {
						this.registerConfig = res.data.value;
					}
				}
			});
		},
		modifyPassword() {
			// console.log(this.formData);
			if (this.memberInfo.password) {
				var rule = [{
						name: 'currentPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputOldPassword")
					},
					{
						name: 'newPassword',
						checkType: 'required',
						errorMsg: this.$lang("pleaseInputNewPassword")
					}
				];
			} 

			let regConfig = this.registerConfig;
			if (regConfig.pwd_len > 0) {
				rule.push({
					name: 'newPassword',
					checkType: 'lengthMin',
					checkRule: regConfig.pwd_len,
					errorMsg: '新密码长度不能小于' + regConfig.pwd_len + '位'
				});
			}
			if (regConfig.pwd_complexity) {
				let passwordErrorMsg = '密码需包含',
					reg = '';
				if (regConfig.pwd_complexity.indexOf('number') != -1) {
					reg += '(?=.*?[0-9])';
					passwordErrorMsg += '数字';
				}
				if (regConfig.pwd_complexity.indexOf('letter') != -1) {
					reg += '(?=.*?[a-z])';
					passwordErrorMsg += '、小写字母';
				}
				if (regConfig.pwd_complexity.indexOf('upper_case') != -1) {
					reg += '(?=.*?[A-Z])';
					passwordErrorMsg += '、大写字母';
				}
				if (regConfig.pwd_complexity.indexOf('symbol') != -1) {
					reg += '(?=.*?[#?!@$%^&*-])';
					passwordErrorMsg += '、特殊字符';
				}
				rule.push({
					name: 'newPassword',
					checkType: 'reg',
					checkRule: reg,
					errorMsg: passwordErrorMsg
				});
			}
			var checkRes = validate.check(this.formData, rule);
			// console.log(checkRes, this.memberInfo.password, this.formData.newPassword)
			if (checkRes) {
				if (this.formData.currentPassword == this.formData.newPassword) {
					this.$util.showToast({
						title: '新密码不能与原密码相同'
					});
					return;
				}
				if (this.formData.newPassword != this.formData.confirmPassword) {
					this.$util.showToast({
						title: '两次密码不一致'
					});
					return;
				}
				this.$api.sendRequest({
					url: '/api/member/modifypassword',
					data: {
						new_password: this.formData.newPassword,
						old_password: this.formData.currentPassword,
						code: this.formData.mobileDynacode,
						key: uni.getStorageSync("password_mobile_key"),
					},
					success: res => {
						if (res.code == 0) {
							this.$util.showToast({
								title: this.$lang('updateSuccess')
							});
							this.formData.newPassword = ''
							this.formData.currentPassword = ''
							this.formData.confirmPassword = ''
							this.NavReturn();
							this.getInfo();
							uni.removeStorageSync('password_mobile_key');
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			} else {
				this.$util.showToast({
					title: validate.error
				});
			}
		},
	}
};
