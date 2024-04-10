import { createI18n } from "vue-i18n";
import store from "../store";
const i18n = createI18n({
    legacy: false, // 使用CompotitionAPI必须添加这条.
    locale: store.state.lang || "en-US",
    fallbackLocale: store.state.lang || "en-US",
    messages: {
        "en-US": require("../locals/en.js").default,
        "zh-CN": require("../locals/zh.js").default,
    },
});

export default i18n;
