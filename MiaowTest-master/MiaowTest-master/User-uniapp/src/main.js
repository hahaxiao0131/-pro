import {createSSRApp} from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus'
//导入pinia
import pinia from "./stores/index";
// 引入PC端样式文件
import './styles/pc.scss'

export function createApp() {
	const app = createSSRApp(App);

	//注册pinia
	app.use(pinia);
	//注册uview-plus
	app.use(uviewPlus);
	return {
		app,
	};
}