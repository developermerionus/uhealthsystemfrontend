<template>
	<!-- <view class= "container">
		<view ref="input" class="input">
			<text>物流上传  CSV file</text> 
		</view> -->
		<view class= "container">
		<h2>Delivery Department File Upload</h2>	
		<!-- Upload  -->
		<form id="file-upload-form" class="uploader">
		  <input id="file-upload" type="file" name="fileUpload" accept="image/*" />
		
		  <label for="file-upload" id="file-drag">
		    <img id="file-image" src="#" alt="Preview" class="hidden">
		    <div id="start">
		      <i class="fa fa-download" aria-hidden="true"></i>
		      <div>Select a file</div>
		      <div id="notimage" class="hidden">Please select an image</div>
		    <!-- <view id="file-upload-btn" class="btn btn-primary input" ref="input" >Select a file</view> -->
			 <view ref="input" class="btn btn-primary input">
			  
			  </view>
		    </div>
		    <div id="response" class="hidden">
		      <div id="messages"></div>
		      <progress class="progress" id="file-progress" value="0">
		        <span>0</span>%
		      </progress>
		    </div>
		  </label>
		</form>
		<view class="comment">
			<view><span class="star">*</span> 第一栏 名字 必须是 deliverynum <text class="copy" @click="$util.copy('deliverynum')">copy{{$lang('copy')}}</text></view>
			<view><span class="star">*</span> 第二栏 名字 必须是 ordernum <text class="copy" @click="$util.copy('ordernum')">copy{{$lang('copy')}}</text></view>
			<view><span class="star">*</span> 第三栏 名字 必须是 companyName <text class="copy" @click="$util.copy('companyName')">copy{{$lang('copy')}}</text></view>
			<view><span >快递公司名称：</span> 
			shundaexpress <text class="copy" @click="$util.copy('shundaexpress')">copy{{$lang('copy')}}</text>
			shundaexpress_nmn <text class="copy" @click="$util.copy('shundaexpress_nmn')">copy{{$lang('copy')}}</text>
			ups <text class="copy" @click="$util.copy('ups')">copy{{$lang('copy')}}</text>
			ezgo <text class="copy" @click="$util.copy('ezgo')">copy{{$lang('copy')}}</text>
			baitong <text class="copy" @click="$util.copy('baitong')">copy{{$lang('copy')}}</text>
			fedex <text class="copy" @click="$util.copy('fedex')">copy{{$lang('copy')}}</text>
			</view>
			<view>
			shunfeng <text class="copy" @click="$util.copy('shunfeng')">copy{{$lang('copy')}}</text>
			bangde <text class="copy" @click="$util.copy('bangde')">copy{{$lang('copy')}}</text>
			zhongtong <text class="copy" @click="$util.copy('zhongtong')">copy{{$lang('copy')}}</text>
			sanqianli <text class="copy" @click="$util.copy('sanqianli')">copy{{$lang('copy')}}</text>
			mingtong <text class="copy" @click="$util.copy('mingtong')">copy{{$lang('copy')}}</text>
			</view>
		</view>
			</view>
		</view>
	<!-- </view> -->
	
</template>

<script>
	let _self;
	export default {
		data() {
			return {
                token:''
			}
		},
		// uni-app input does not support type="file" type so it needs to be created by js
		mounted() {
			// Create attachment upload
			var _self = this;
			var input = document.createElement('input'); //Create element
			input.type = 'file' //Add file type
			//input.className = "btn btn-primary input"
			input.onchange = (event) => {
				_self.upFile(input, event)
			}
			this.$refs.input.$el.appendChild(input)
		},
		onShow() {
			_self = this;
			this.checkToken();
		},
		//Upload
		methods: {
			checkToken() {		
				_self.token = uni.getStorageSync('token');
				console.log('self token ',_self.token);
				if (!_self.token) {
					console.log('call token');
					uni.redirectTo({
						url: '/pages/login/login/login'
					});
				}
			},
			upFile(input, event) {
				//console.log('ffff', this.$config.baseUrl);
				let url = this.$config.baseUrl + '/api/upload/uploadCsvFile';
				var _self = this;
				uni.uploadFile({
					url: url,
					files: [{
						file: input.files[0],
						uri: event.srcElement.value
					}],
					success: (uploadFileRes) => {
					//	console.log('success', uploadFileRes, JSON.parse(uploadFileRes.data));
						let res = JSON.parse(uploadFileRes.data);
						//console.log('res',res);
						if (res.code == 10066) {
							this.updateDatabase();
							console.log('csv file get uploaded successfully');
							_self.$util.showToastLonger({
								title: res.message
							}, 3000);
						}
						else {
							console.log(res.errMsg);
							_self.$util.showToastLonger({
								title: res.message
							}, 3000);
						}	
					},
					fail: (err) => {
						console.log('error', err);
					}
				});
				//this.$util.upload_file_server(tempFilePath, data, path, url = "")

			},
			updateDatabase() {
				this.$api.sendRequest({
					url: '/api/order/scanDeliveryTable',
					success(res) {
						console.log('数据更新', res);
						if (res === 'success') {
							_self.$util.showToastLonger({
								title: '数据更新成功'
							}, 3000);
						}
						else {
							_self.$util.showToastLonger({
								title: '数据更新失败'
							}, 3000);
						}
					},
					fail: (err) => {
						// alert("关闭2")
					}
				});
			},
			upload_file_server(tempFilePath, data, path, url = "") {
				if (url) {
					var uploadUrl = Config.baseUrl + url
				} else {
					var uploadUrl = Config.baseUrl + '/api/upload/' + path
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: uploadUrl,
						filePath: tempFilePath,
						name: 'file',
						formData: data,
						success: function(res) {
							var path_str = JSON.parse(res.data);
							if (path_str.code >= 0) {
								resolve(path_str.data.pic_path);
							} else {
								reject("error");
							}
						}
					});

				});

			},
		}

	}
</script>

<style lang="scss">
 .container {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	 text-align: center;
	 margin: 0 auto;
 }
 .copy {
 	font-size: 15px;
 	display: inline-block;
 	color: #666;
 	background: #f7f7f7;
 	line-height: 1;
 	padding: 3px 10px;
 	margin: 0 15px 0 10px;
 	border-radius: 18px;
 	border: 0.5px solid #666;
	
 }
 .star {
	 color:red;
 }
 .comment {
	 margin-top: 20px;
 }
 // Imports
 // 
 @import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);
 @import url('https://fonts.googleapis.com/css?family=Roboto');
 
 // Vars and Reset
 // 
 $theme:       #454cad;
 $dark-text:   #5f6982;
 
 html,body,* { box-sizing: border-box; font-size: 16px;}
 html,body   { height: 100%; text-align: center;}
 body        { padding: 2rem; background: #f8f8f8;}
 
 h2 {
   font-family: "Roboto", sans-serif;
   font-size: 26px;
   line-height: 1;
   color: $theme;
   margin-bottom: 0;
 }
 p {
   font-family: "Roboto", sans-serif;
   font-size: 18px;
   color: $dark-text;
 }
 // Upload Demo
 // 
 .uploader {
   display: block;
   clear: both;
   margin: 0 auto;
   width: 100%;
   max-width: 600px;
 
   label {
     float: left;
     clear: both;
     width: 100%;
     padding: 2rem 1.5rem;
     text-align: center;
     background: #fff;
     border-radius: 7px;
     border: 3px solid #eee;
     transition: all .2s ease;
     user-select: none;
 
     &:hover {
       border-color: $theme;
     }
     &.hover {
       border: 3px solid $theme;
       box-shadow: inset 0 0 0 6px #eee;
       
       #start {
         i.fa {
           transform: scale(0.8);
           opacity: 0.3;
         }
       }
     }
   }
 
   #start {
     float: left;
     clear: both;
     width: 100%;
     &.hidden {
       display: none;
     }
     i.fa {
       font-size: 50px;
       margin-bottom: 1rem;
       transition: all .2s ease-in-out;
     }
   }
   #response {
     float: left;
     clear: both;
     width: 100%;
     &.hidden {
       display: none;
     }
     #messages {
       margin-bottom: .5rem;
     }
   }
 
   #file-image {
     display: inline;
     margin: 0 auto .5rem auto;
     width: auto;
     height: auto;
     max-width: 180px;
     &.hidden {
       display: none;
     }
   }
   
   #notimage {
     display: block;
     float: left;
     clear: both;
     width: 100%;
     &.hidden {
       display: none;
     }
   }
 
   progress,
   .progress {
     // appearance: none;
     display: inline;
     clear: both;
     margin: 0 auto;
     width: 100%;
     max-width: 180px;
     height: 8px;
     border: 0;
     border-radius: 4px;
     background-color: #eee;
     overflow: hidden;
   }
 
   .progress[value]::-webkit-progress-bar {
     border-radius: 4px;
     background-color: #eee;
   }
 
   .progress[value]::-webkit-progress-value {
     background: linear-gradient(to right, darken($theme,8%) 0%, $theme 50%);
     border-radius: 4px; 
   }
   .progress[value]::-moz-progress-bar {
     background: linear-gradient(to right, darken($theme,8%) 0%, $theme 50%);
     border-radius: 4px; 
   }
 
   input[type="file"] {
     display: none;
   }
 
   div {
     margin: 0 0 .5rem 0;
     color: $dark-text;
   }
   .btn {
     display: inline-block;
     margin: .5rem .5rem 1rem .5rem;
     clear: both;
     font-family: inherit;
     font-weight: 700;
     font-size: 14px;
     text-decoration: none;
     text-transform: initial;
     border: none;
     border-radius: .2rem;
     outline: none;
     padding: 0 1rem;
     height: 36px;
     line-height: 36px;
     color: #fff;
     transition: all 0.2s ease-in-out;
     box-sizing: border-box;
     background: $theme;
     border-color: $theme;
     cursor: pointer;
   }
 }
</style>