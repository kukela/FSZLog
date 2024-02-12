<template>
	<view class="box">
		<view class="cxt_list">
			<view class="header_box">
				<view class="num_box">
					<text class="num">预算:3000</text>
					<text class="num big">剩余:1000</text>
				</view>
				<view class="all_bar">
					<view class="h_bar"></view>
				</view>
			</view>
			<view class="cell">
				<view class="main bb" hover-class="def_hover" hover-stay-time="150">
					<text class="title">ABC</text>
					<text class="num big">-1000</text>
				</view>
				<view class="sub bb" hover-class="def_hover" hover-stay-time="150">
					<text class="title">2024-01-01</text>
					<text class="num big">-100</text>
				</view>
				<view class="sub" hover-class="def_hover" hover-stay-time="150">
					<text class="title">2024-01-01</text>
					<text class="num big">-100</text>
				</view>
			</view>
			<view class="cell">
				<view class="main" hover-class="def_hover" hover-stay-time="150">
					<text class="title">ABC</text>
					<text class="num big">-1000</text>
				</view>
			</view>
		</view>

		<movable-area class="bottom_bar">
			<movable-view class="bottom_bar_box">
				<view class="add_btn" hover-class="def_hover" hover-stay-time="150">添 加</view>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '本月',
			pattern: {
				buttonColor: '@submit_bg_color',
				iconColor: '@submit_text_color'
			}
		};
	},
	onLoad() {
		uni.getSystemInfo({
			success: function (res) {
				console.log(res);
			}
		});

		console.log('-2----');
	},
	methods: {
		trigger(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="scss" scoped>
@import url(../global/global.scss);

.header_box {
	height: 160rpx;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	.num_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.all_bar {
		background-color: #292929;
		border-radius: 10rpx;
		height: 40rpx;
		width: 100%;
		font-size: 0;
		line-height: 0;
		margin: 20rpx 0;

		.h_bar {
			background-color: #74a800;
			width: 40%;
			height: 30rpx;
			margin: 5rpx;
			border-radius: 10rpx;
			display: inline-block;
		}
	}
}

.add_btn {
	width: 100%;
	height: 90rpx;
	background-color: #0e0d0d;
	color: #8183ff;
	text-align: center;
	line-height: 90rpx;
	border-radius: 20rpx;
	font-size: 46rpx;
	font-weight: bold;
}
</style>
