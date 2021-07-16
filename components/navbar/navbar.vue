<template>
	<view>
		<view class="header-main">
				<view class="top-bar">
					<view class="top-bar-content">
						<!-- <view class="iconBackground" @click="modifyInfo('language')"> -->
						<view  class="langSwitch" @click="modifyLanguage()">
							<view class="iconBackground">
								<image class="languageIcon" src="../../static/images/icons/languageIcon.png" mode=""></image>
							</view>
							<view class="langWord">
								<text >{{$lang('common.lang')}}</text>
							</view>
							
						</view>
					</view>
				</view>
				<view class="menu-main" >
					<view>
						<a @click="$util.redirectTo('/pages/member/index/index')">
							<image class="image-logo" src="../../static/images/logo/oldUhealth-logo-g.png" mode=""></image>
						</a>
					</view>
					
				</view>
		</view>
		<view class="occupy-block"></view>
		<view class="dividerline"></view>
	</view>
</template>

<script>
	// import auth from '@/common/js/auth.js';
	// import info from '@/pages/member/public/js/info.js';
	export default {
		name:"navbar",
		data() {
			return {
				langIndex:0,
				langList:[]
			};
		},
		
		methods: {
			modifyLanguage () {
				this.initLang(); 
				let newArray = [];
				let that = this;
				for (let i = 0; i < this.langList.length; i++) {
					newArray.push(that.langList[i].name)
				}
				uni.showActionSheet({
					itemList: newArray,
					success: function(res) {
						if (that.langIndex != res.tapIndex) {
							that.langIndex = res.tapIndex;	
							that.$langConfig.change(that.langList[res.tapIndex].value)
							// that.$forceUpdate();
						}
					}
				});
			},
			initLang() {
				//获取语言列表
				this.langList = this.$langConfig.list();
				if (!uni.getStorageSync("lang")) {
					this.langIndex = 0;
					this.showLang =  this.langList[0].name;
					this.$langConfig.change(this.langList[0].value);
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
		}
	}
</script>

<style lang="scss">
.test {
	color:red;
}
.header-main {
		//width:1000px;
		position:fixed;
		right:0;
		left:0;
		z-index:200;
		background-color: white;
		color: #1767b3;
		font-size: 18px;
		font-weight: 500;
		height: 80px;
			.top-bar {
				//margin-left:-1000px;
				//width:12000px;
				height:30px;
				background-color: #f2f2f2;
				.top-bar-content {
					max-width: 1200px;
					margin:0 auto;
					display:flex;
					justify-content: flex-end;
					align-items: center;
					height:100%;
					.langSwitch {
						display:flex;
						margin-right:10px;
						.iconBackground{
							background-color: rgba(0,0,0,0.07);
							border-radius: 50%;
							background-position: center;
							width: 28px;
							height: 28px;
							display: inline-block;
							display:flex;
							place-content: center;
							align-items: center;
							.languageIcon{
								width:20px;
								height:20px;
							}
						}
						.langWord{
							margin-top: 2px;
							color:$color-sub;
						}
					}
				}
			}
			a {
				outline: none;
				color: #30aae7;
				text-decoration: none;
				cursor: pointer;
			}
			
			.menu-main {
				background-color: white;
				height: 100%;
				width: 100%;
				max-width: 1200px;
				padding: 0 8px;
				margin: 0 auto;
				flex-direction: row;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height:63px;
				a {
					height:50px;
					.image-logo {
						height: 50px;
						    aspect-ratio: auto 50 / 50;
						    width: 50px;
					}
				}
			}
		
	}	
	.occupy-block {
		height:93.5px;
	}
	.dividerline {
		position: relative;
		border-top-color: rgba(0,0,0,.12);
		display: block;
		margin: 0;
		border-top-width: 1px;
		border-top-style: solid;
		width:90%;
		margin:0 auto;
		z-index:0;
		max-width:1200px;
		
	}
	
	.header-content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	@media screen and (min-width: 1200px){
					.dividerline {
						width:100%!important;
					}
				}
</style>
