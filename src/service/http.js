import axios from "axios";
import store from "../store";
import i18n from "../plugins/i18n";
import { goToAppTokenError } from "../utils/webview";
import { showDialog } from "vant";
import warning from "../assets/img/other/warning.png";
window.msgFlag = true;

/**
 * 提示函数
 * 禁止点击蒙层、显示2秒后关闭
 */
const msgBox = (message, callback) => {
    showDialog({
        width: "80%",
        confirmButtonColor: "RGBA(241, 31, 48, 1)",
        overlayStyle: {
            background: "rgba(0, 0, 0, 0.85)",
        },
        allowHtml: true,
        confirmButtonText: i18n.global.t("public.button.text"),
        message:
            "<img style='width: .44rem;height: .44rem;margin-bottom: 20px;' src=" +
            warning +
            "><p style='font-size:.16rem;'>" +
            message +
            "</p>",
    }).then(() => {
        window.msgFlag = true;
        callback();
    });
};
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

/**
 * 请求失败后的错误统一处理
 */

const errorHandle = (status, other) => {
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            if (window.msgFlag) {
                window.msgFlag = false;
                msgBox(i18n.global.t("public.networkError.text1"), goToAppTokenError);
            }
            break;
        // 403 token过期 清除token并跳转登录页
        case 403:
            if (window.msgFlag) {
                window.msgFlag = false;
                msgBox(i18n.global.t("public.networkError.text2"), goToAppTokenError);
            }
            break;
        // 404请求不存在
        case 404:
            if (window.msgFlag) {
                window.msgFlag = false;
                msgBox(i18n.global.t("public.networkError.text3"), null);
            }
            break;
        default:
            if (window.msgFlag) {
                window.msgFlag = false;
                msgBox(other, null);
            }
    }
};

// 创建axios实例
var instance = axios.create({
    timeout: 60000,
});
// // 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
    (config) => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        // ai专属token,我们用了就报错
        const token = store.state.token;
        token && (config.headers.Authorization = "Bearer " + token);
        return config;
    },
    (error) => Promise.error(error)
);

// 响应拦截器
instance.interceptors.response.use(
    // 请求成功
    (res) => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
    // 请求失败
    (error) => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // store.commit('changeNetwork', false);
        }
    }
);

export default instance;
