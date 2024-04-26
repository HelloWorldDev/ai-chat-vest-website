import { createApp } from "vue";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";

import "./plugins/adaptive";
import "./styles/common.less";
import "./styles/vant.less";

import api from "./service/api";
import { myVanToast, myDialog } from "./plugins/vant";
import SvgIcon from "@/icons";
import Bridge from "@/utils/jsBridge.js";
import { appGetUserInfo } from "@/utils/webview";
appGetUserInfo();
// 存储风格
const webStyle = process.env.VUE_APP_WEB_STYLE;
store.commit("updateWebStyle", webStyle ? webStyle : "");
console.log(process.env.VUE_APP_WEB_STYLE, "process.env.VUE_APP_WEB_STYLE");
console.log(webStyle, "webStyle");
console.log(!!webStyle, "webStyle11111");
if (webStyle) {
    console.log("到我");
    require(`./assets/theme/style-${webStyle}.less`);
    console.log(require(`./assets/theme/style-${webStyle}.less`), "look");
} else {
    console.log("到默认");
    // require(`./assets/theme/style.less`);
}

const app = createApp(App);
app.config.globalProperties.$Toast = myVanToast;
app.config.globalProperties.$api = api;
app.config.globalProperties.$jsBridge = Bridge;

app.use(myDialog());
app.component("svg-icon", SvgIcon);
app.use(store).use(i18n).use(router).use(VueLazyload).mount("#app");
