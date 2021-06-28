<template>
	<view>
		<view class="header-main">
			<view class="top-bar">
			</view>
			<view class="menu-main" @click="$util.redirectTo('/pages/member/index/index')">
				<a>
					<image class="image-logo" src="../../static/images/logo/oldUhealth-logo-g.png" mode=""></image>
				</a>
			</view>
		</view>
		<view class="occupy-block"></view>
		<view class="dividerline"></view>
	</view>
</template>

<script>
	export default {
		name:"navbar",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.test {
	color:red;
}
.header-main {
		width:1000px;
		position:fixed;
		z-index:200;
		background-color: white;
		color: #1767b3;
		font-size: 18px;
		font-weight: 500;
		height: 80px;
			.top-bar {
				margin-left:-1000px;
				width:12000px;
				height:30px;
				background-color: #f2f2f2;
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
				max-width: 1280px;
				padding: 0 8px;
				margin: 0 auto;
				flex-direction: row;
				box-sizing: border-box;
				display: flex;
				place-content: flex-start;
				align-items: center;
				height:63px;
				width:12000px;
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
		z-index:800;
	}
	@media screen and (min-width: 1200px){
					.dividerline {
						width:100%!important;
					}
				}
</style>
