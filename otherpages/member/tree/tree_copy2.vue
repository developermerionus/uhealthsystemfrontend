<template>
	<view class="content">
		<!-- <mix-tree :list="list" @treeUsernameTap="treeUsernameClick" @treeAddTap="treeAddClick"></mix-tree> -->
		<tree :data="list" :width='width' :height="height" ></tree>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" @fabClick="fabClick" />
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	// import mixTree from '@/components/mix-tree/mix-tree';
	// import tree from '@/components/tree/tree.vue';
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	export default {
		
		components: {
			// mixTree
			tree,
			uniFab
		},
		data() {
			return {
				list: [],
				treeList: [],
				width: 0,
				height: 0,
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
				},
				content: [{
						iconPath: '@/static/component.png',
						selectedIconPath: '/static/componentHL.png',
						text: '最左',
						active: false
					},
					{
						iconPath: '@/static/api.png',
						selectedIconPath: '/static/apiHL.png',
						text: '顶点',
						active: false
					},
					{
						iconPath: '@/static/template.png',
						selectedIconPath: '/static/templateHL.png',
						text: '最右',
						active: false
					}
				]
			}
		},
		onLoad() {
			this.memberInfo = uni.getStorageSync('userInfo')
			this.loadData(this.memberInfo.member_id);
			uni.$on('treeInfoTap', e=>{
				this.treeInfoTap(e);
			});
			uni.$on('forward', e=>{
				this.forward(e);
			});
		},
		
		onUnload() {
			console.log('onUnload');
			uni.$off('treeInfoTap');
			uni.$off('forward');
		},
		methods: {
			forward(item) {
				this.loadData(item.id);
			},
			trigger(e) {
			
				this.content[e.index].active = !e.item.active
	
				switch (e.index){
					case 0:
						this.goLeft();
						break;
					case 1:
						this.goTop();
						break;
					case 2:
						this.goRight();
						break;
					default:
						break;
				}
			},
			fabClick() {
			},
			goTop() {
				this.loadData(this.memberInfo.member_id)
			},
			getTheEdge(branch){
				this.$api.sendRequest({
					url: '/api/member/getTheEdge',
					data: {
						member_id: this.memberInfo.member_id,
						branch,
					},
					success: res => {
						this.loadData(res.data[0].member_id);
					}	
				})
			},
			goLeft() {
				this.getTheEdge(0);
			},
			goRight(){
				this.getTheEdge(1);
			},
			loadData(member_id){
				this.list = []
				// console.log('getTeamTree')
				this.$api.sendRequest({
					url: '/api/member/getTeamTree2',
					data: {
						member_id,
					},
					success: res => {
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					//	console.log(res);
						if (res.code >= 0) {	
							// this.list = res.data[0];
							// console.log(this.list);
							this.list.push(res.data['0']);
							this.width = res.data.width;
							this.height = res.data.height;
							
						}
					}
				})
			},
			treeInfoTap(item) {
				let {
					id,
				} = item;
				item['referrer'] = this.memberInfo.username;
				item['source_member'] = this.memberInfo.member_id;
				if (!id) {
					this.$util.redirectTo(`/pages/login/register/register?option=${JSON.stringify(item)}`);
				}
			},
		}
	}
</script>

<style>
.cart-empty {
	text-align: center;
	padding: 140rpx $padding 80rpx $padding;
	image {
		width: 63%;
		height: 450rpx;
	}

	button {
		min-width: 300rpx;
		margin-top: 100rpx;
		height: 70rpx;
		line-height: 70rpx !important;
		font-size: $font-size-base;
	}
}
</style>
