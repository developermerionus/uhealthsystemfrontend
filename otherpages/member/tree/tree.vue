<template>
	<view class="content">
		<navbar></navbar>
		<view class="tree">
			<view 
				class="tree-content" 
				@touchstart.stop="move"
				@touchmove.stop="moving" 
				:style="{'top':positionX+'px','left':positionY+'px',transform:'scale('+scale+')'}"
				>
				<tree-item :tree-data="list" :tree-first="true" @clickForward='handleclickForward'
				@clickTreeInfoTap="handleclickTreeInfoTap"/>
			
			</view>
		</view>
		<!-- <tree :data="list" :width='width' :height="height" ></tree> -->
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" 
		:vertical="vertical" :direction="direction" @trigger="trigger" @fabClick="fabClick" />
		<topicon class="topicon" :iconWidth="55" :iconHeight="55" :startPostion="3" iconPath="../../../static/zhiding.png"
		 :marginBottom="100" :marginTop="100" :marginLeft="15" :marginRight="15" @tapIcon="tapIcon"
		></topicon>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	// import mixTree from '@/components/mix-tree/mix-tree';
	// import tree from '@/components/tree/tree.vue';
	import treeItem from '@/components/tree-item/tree-item.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import topicon from '@/components/gwh-backTopIcon/gwh-backTopIcon.vue';
	export default {
		
		components: {
			// mixTree
			// tree,
			treeItem,
			uniFab,
			topicon
		},
		data() {
			return {
				// prev_member_id: 0,
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
				],
				
				/*** tree moving parameter ***/
				distance: 0,//手指移动的距离
				scale: 1,//页面的比例
				disX:0,
				disY:0,
				positionX:0,
				positionY:0,
				updata:true,
				/*** end tree moving parameter ***/
			}
		},
		onLoad() {
			this.memberInfo = uni.getStorageSync('userInfo')
			// this.prev_member_id = this.memberInfo.member_id;
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
			tapIcon(e){		
				this.$api.sendRequest({
					url: '/api/member/getPreviousID',
					data: {
						member_id: this.list[0].id,
						top_id: this.memberInfo.member_id
					},
					success: res => {
						this.loadData(res[0].previous_id);
					}	
				})
			},
			forward(item) {
				// this.prev_member_id = this.list[0].id;
				// console.log(this.prev_member_id)
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
				this.list = [];
				this.$api.sendRequest({
					url: '/api/member/getTeamTree',
					data: {
						member_id,
					},
					success: res => {
						
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				
						if (res.code >= 0) {	
							// this.list = res.data[0];
						//	console.log(res.data['0']);
							this.list.push(res.data['0']);
							this.width = res.data.width;
							this.height = res.data.height;
							this.prev_member_id = member_id;
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
			
			handleclickForward(item){
				this.forward(item);
			},
			
			handleclickTreeInfoTap(item) {
				this.treeInfoTap(item);
			},
			
			
			/*** tree moving functions ***/
			// 双指触发开始计算出发时两个手指的坐标距离
			touchstartCallback(e) {
				// 单手指缩放开始，不做任何处理
				if (e.touches.length == 1) return;
				// 当两根手指放上去的时候，将距离(distance)初始化。
				let xMove = e.touches[1].clientX - e.touches[0].clientX;
				let yMove = e.touches[1].clientY - e.touches[0].clientY;
				//计算开始触发两个手指坐标的距离
				this.distance = Math.sqrt(xMove * xMove + yMove * yMove);
			},
			// 双指移动计算两个手指的坐标距离
			touchmoveCallback(e) {
			    // 单手指缩放不做任何操作
			    if (e.touches.length == 1) return;
			    //双手指运动 x移动后的坐标和y移动后的坐标
			    let xMove = e.touches[1].clientX - e.touches[0].clientX;
			    let yMove = e.touches[1].clientY - e.touches[0].clientY;
			    //双手指运动新的 ditance
			    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
			    //计算移动的过程中实际移动了多少的距离
			    let distanceDiff = distance - this.distance;
			    let newScale = this.scale + 0.0001 * distanceDiff
				this.scale = newScale
			    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
			    if (newScale >= 5) {
			      newScale = 5
				  this.distance = distance
				  this.scale = newScale
			    }
			    //为了防止缩放得太小，所以scale需要限制
			    if (newScale <= 0.3) {
			      newScale = 0.3
				  this.distance = distance
				  this.scale = newScale
			    }
				console.log(this.scale)
			},
			// 拖拽移动
			move(e) {
				 const odiv = e.currentTarget // 获取元素
				 // 算出鼠标相对元素的位置
				 if(e.touches.length == 2) return this.touchstartCallback(e);
				 this.disX = e.touches[0].clientX - odiv.offsetLeft;
				 this.disY = e.touches[0].clientY - odiv.offsetTop;
			},
			// 移动中
			moving(e){
				if(e.touches.length == 2) return this.touchmoveCallback(e);
				// console.log(e)
				// 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
				let left = e.touches[0].clientX - this.disX;
				let top = e.touches[0].clientY - this.disY;
							
				// 绑定元素位置到positionX和positionY上面
				this.positionX = top;
				this.positionY = left;
			}
			/*** end tree moving functions ***/ 
		}
	}
</script>

<style lang="scss" scoped>
// .cart-empty {
// 	text-align: center;
// 	padding: 140rpx $padding 80rpx $padding;
// 	image {
// 		width: 63%;
// 		height: 450rpx;
// 	}

	// button {
	// 	min-width: 300rpx;
	// 	margin-top: 100rpx;
	// 	height: 70rpx;
	// 	line-height: 70rpx !important;
	// 	font-size: $font-size-base;
	// }
// }


.tree{
    min-height: 90vh;
	max-width: 90vw;
    position: relative;
	overflow: auto;
	margin: auto;
	
   .tree-content{
		min-height: 100%;
		position: absolute;
		top: 0;
		left: 0;
    }
}
</style>
