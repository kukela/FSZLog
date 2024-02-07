import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

uni.setNavStyle = () => {
	const theme = uni.getTheme()
	// App端
	// #ifdef APP-PLUS
	plus.navigator.setStatusBarStyle(theme === 'dark' ? 'light' : 'dark') // 只支持dark和light
	// #endif

	// 小程序端
	// #ifdef MP-WEIXIN
	uni.setNavigationBarColor({
		frontColor: theme === 'dark' ? '#fff' : '#000',
		backgroundColor: theme === 'dark' ? '#000' : '#fff'
	})
	// #endif
}