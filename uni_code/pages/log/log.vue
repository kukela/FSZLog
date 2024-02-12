<template>
	<view class="box">
		<view class="cxt_list">
			<picker mode="date" fields="year" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">{{ date }}</view>
			</picker>
			<view class="cell">
				<view class="main bb" hover-class="def_hover" hover-stay-time="150">
					<text class="title">1月</text>
					<view class="num_box">
						<text class="num big p">+1000</text>
						<text class="num">总预算：3000</text>
					</view>
				</view>
				<view class="sub bb" hover-class="def_hover" hover-stay-time="150">
					<text class="title">Abc</text>
					<text class="num big">-100</text>
				</view>
				<view class="sub" hover-class="def_hover" hover-stay-time="150">
					<text class="title">Abc</text>
					<text class="num big">-100</text>
				</view>
			</view>
			<view class="cell">
				<view class="main" hover-class="def_hover" hover-stay-time="150">
					<text class="title">2月</text>
					<text class="num big l">-1000</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		const currentDate = this.getDate();
		return {
			date: currentDate
		};
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods: {
		bindDateChange: function (e) {
			this.date = e.detail.value;
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			if (type === 'start') {
				year = year - 2;
			}
			return `${year}`;
		}
	}
};
</script>

<style lang="scss" scoped>
@import url(../global/global.scss);
</style>
