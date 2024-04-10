import { userAgent, getRequest } from "@/utils";
import { showDialog } from "vant";
import i18n from "../plugins/i18n";
import store from "../store";
function dialog(type) {
    showDialog({
        width: "80%",
        confirmButtonColor: "RGBA(241, 31, 48, 1)",
        overlayStyle: {
            background: "rgba(0, 0, 0, 0.85)",
        },
        allowHtml: true,
        confirmButtonText: i18n.global.t("public.button.text"),
        message:
            "<p style='font-size:.16rem;line-height:.23rem;'>" +
            i18n.global.t(type ? "public.networkError.errorMethodsNotDefine" : "public.networkError.errorProcess") +
            "</p >",
    });
}

// 获取用户信息+登录信息+设备信息
export function appGetUserInfo() {
    var lang = getRequest("lang").lang || false;
    store.commit("updateLang", lang ? lang : "en-US");
    if (userAgent()) {
        try {
            userAgent() === "iOSAIGirlfriends"
                ? window.webkit.messageHandlers.appGetUserInfo.postMessage("")
                : window.messageHandlers.appGetUserInfo();
        } catch (err) {
            dialog(1);
        }
    } else {
        dialog();
    }
}

// 登录过期，通知app退出登录
export const goToAppTokenError = () => {
    if (userAgent()) {
        try {
            userAgent() === "iOSAIGirlfriends"
                ? window.webkit.messageHandlers.appTokenError.postMessage("")
                : window.messageHandlers.appTokenError();
        } catch (err) {
            dialog(1);
        }
    } else {
        dialog();
    }
};

// 返回上一个页面
export const appGoback = () => {
    if (userAgent()) {
        try {
            userAgent() === "iOSAIGirlfriends"
                ? window.webkit.messageHandlers.appGoback.postMessage("")
                : window.messageHandlers.appGoback();
        } catch (err) {
            dialog(1);
        }
    } else {
        dialog();
    }
};

// 跳转到另一个聊天页面
export const appChatUrlInfo = (url) => {
    if (userAgent()) {
        try {
            userAgent() === "iOSAIGirlfriends"
                ? window.webkit.messageHandlers.appChatUrlInfo.postMessage({ url })
                : window.messageHandlers.appChatUrlInfo(url);
        } catch (err) {
            dialog(1);
        }
    } else {
        dialog();
    }
};

// 下载图片
export const appSaveFile = (url) => {
    if (userAgent()) {
        try {
            userAgent() === "iOSAIGirlfriends"
                ? window.webkit.messageHandlers.appSaveFile.postMessage({ url })
                : window.messageHandlers.appSaveFile(url);
        } catch (err) {
            dialog(1);
        }
    } else {
        dialog();
    }
};

// 清除当前页面之前所有router history
export const clearRouterHistory = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appWebClearFrontPage.postMessage("");
        } else {
            window.messageHandlers.appWebClearFrontPage();
        }
    } else {
        dialog();
    }
};

//购买商品
export const appBuyProduct = (id, num, type) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appBuyProduct.postMessage({
                productId: id,
                productNum: num,
                isSubscription: type,
            });
        } else {
            window.messageHandlers.appBuyProduct(id, num, type);
        }
    } else {
        dialog();
    }
};

//购买订阅(安卓)
export const appSubscribeProduct = (productGroupId, productId) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            console.log("ios");
        } else {
            window.messageHandlers.appSubscribeProduct(productGroupId, productId);
        }
    } else {
        dialog();
    }
};
// 显示帮助弹窗
export const appContactUS = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appContactUS.postMessage("");
        } else {
            window.messageHandlers.appContactUS();
        }
    } else {
        dialog();
    }
};
// 调安卓进支付先链接
export const appConnectionGoogle = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            console.log("111");
            // window.webkit.messageHandlers.appConnectionGoogle.postMessage("");
        } else {
            window.messageHandlers.appConnectionGoogle();
        }
    } else {
        dialog();
    }
};

// 调安卓出支付先链接
export const appEndConnectionGoogle = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            console.log("111");
            // window.webkit.messageHandlers.appEndConnectionGoogle.postMessage("");
        } else {
            window.messageHandlers.appEndConnectionGoogle();
        }
    } else {
        dialog();
    }
};

// 展示loading
export const appShowLoading = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appShowLoading.postMessage("");
        } else {
            window.messageHandlers.appShowLoading();
        }
    } else {
        dialog();
    }
};
// 隐藏loading
export const appHiddenLoading = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appHiddenLoading.postMessage("");
        } else {
            window.messageHandlers.appHiddenLoading();
        }
    } else {
        dialog();
    }
};
// 隐藏loading
export const appPushStaticWeb = (url, title) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appPushStaticWeb.postMessage({
                url: url,
                title: title,
            });
        } else {
            window.messageHandlers.appPushStaticWeb(url, title);
        }
    } else {
        dialog();
    }
};

// 消耗金币埋点统计 id:人物id,type: 消耗类型如视频,num:消耗数量
export const appGemConsumeAction = (id, type, num) => {
    if (userAgent()) {
        try {
            if (userAgent() === "iOSAIGirlfriends") {
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGemConsumeAction) {
                    window.webkit.messageHandlers.appGemConsumeAction.postMessage({
                        id,
                        type,
                        num,
                    });
                }
            } else {
                if (window.messageHandlers && window.messageHandlers.appGemConsumeAction) {
                    window.messageHandlers.appGemConsumeAction(id, type, num);
                }
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        dialog();
    }
};

// 自由埋点统计
export const appFreeBuryAction = (actionName, actionInfo) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appFreeBuryAction.postMessage({
                actionName,
                actionInfo,
            });
        } else {
            window.messageHandlers.appFreeBuryAction(actionName, actionInfo);
        }
    } else {
        dialog();
    }
};

//跳转到聊天列表页
export const appPushChatList = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appPushChatList.postMessage("");
        } else {
            window.messageHandlers.appPushChatList();
        }
    } else {
        dialog();
    }
};

//跳转到手机浏览器
export const appOpenBrowser = (url) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appOpenBrowser.postMessage({
                url: url,
            });
        } else {
            window.messageHandlers.appOpenBrowser(url);
        }
    } else {
        dialog();
    }
};

//跳转嵌到
export const appDailyReward = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appDailyReward.postMessage("");
        } else {
            window.messageHandlers.appDailyReward();
        }
    } else {
        dialog();
    }
};

//app 提示
export const appToast = (text) => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appToast.postMessage({
                text: text,
            });
        } else {
            window.messageHandlers.appToast(text);
        }
    } else {
        dialog();
    }
};

//回到web首页
export const appDismiss = () => {
    if (userAgent()) {
        if (userAgent() === "iOSAIGirlfriends") {
            window.webkit.messageHandlers.appDismiss.postMessage("");
        } else {
            window.messageHandlers.appDismiss();
        }
    } else {
        dialog();
    }
};
