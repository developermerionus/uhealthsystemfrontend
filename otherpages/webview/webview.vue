<template>
	<view>
		<web-view :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: ''
			};
		},
		onLoad(options) {
			// console.log(link);
			// alert(JSON.stringify(options));
			if (options.url) {
				this.link = decodeURIComponent(options.url);
				//this.link = options.url;
			}
			
		}
	};
</script>