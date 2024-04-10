import { myVanToast } from "@/plugins/vant.js";
import i18n from "@/plugins/i18n.js";

export const copyText = (item) => {
    var input = document.createElement("textarea"); // js创建一个input输入框
    input.value = item; // 将需要复制的文本赋值到创建的input输入框中
    document.body.appendChild(input); // 将输入框暂时创建到实例里面
    input.select(); // 选中输入框中的内容
    document.execCommand("Copy"); // 执行复制操作
    document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
    myVanToast({
        type: "success",
        message: i18n.global.t("public.copy_success"),
    });
};

export const isH5 = () => {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsUcBrowser = sUserAgent.match(/ucbrowser/i) == "ucbrowser";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsUcBrowser) {
        return true;
    } else {
        return false;
    }
};

//获取url中的参数
export const getRequest = () => {
    var a = decodeURI(location.href).split("&last")[0]; //获取url中"?"符后的字串
    var url = "?" + a.split("?")[1];
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = [];
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};

export const getCookie = (cname) => {
    var aCookie = document.cookie.split("; ");
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (cname === aCrumb[0]) return aCrumb[1];
    }
    return "";
};

export const setCookie = (cname, cvalue) => {
    //cookie过期时间1年
    var Days = 365;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = cname + "=" + cvalue + ";expires=" + exp.toGMTString();
};

export const userAgent = function () {
    var ua = window.navigator.userAgent;
    if (ua.indexOf("iOSAIGirlfriends") > -1 || ua.search("iOSAIGirlfriends") > -1) {
        // 执行你的APP打开 html 页面逻辑
        return "iOS" + ua.split("iOS")[1];
    } else if (ua.indexOf("AndroidAIGirlfriendsApp") > -1 || ua.search("AndroidAIGirlfriendsApp") > -1) {
        return "Android" + ua.split("Android")[1];
    } else {
        return false;
    }
};

function add0(m) {
    return m < 10 ? "0" + m : m;
}
export const format = (time) => {
    //shijianchuo是整数，否则要parseInt转换
    if (time == "" || time == 0) {
        return "...";
    } else {
        var timer = new Date(time * 1000);
        var y = timer.getFullYear();
        var m = timer.getMonth() + 1;
        var d = timer.getDate();
        var h = timer.getHours();
        var mm = timer.getMinutes();
        var s = timer.getSeconds();
        return y + "/" + add0(m) + "/" + add0(d) + " " + add0(h) + ":" + add0(mm) + ":" + add0(s);
    }
};
// 聊天时间专属
export const chatFormat = (timestamp) => {
    const currentDate = new Date();
    const inputDate = new Date(timestamp * 1000);
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    if (timestamp == "" || timestamp == 0) {
        return "...";
    } else {
        var y = inputDate.getFullYear();
        var m = inputDate.getMonth() + 1;
        var d = inputDate.getDate();
        var h = inputDate.getHours();
        var mm = inputDate.getMinutes();
        if (inputDate >= today) {
            // 当天内的时间只显示时分
            return add0(h) + ":" + add0(mm);
        } else if (inputDate >= oneYearAgo) {
            // 当年日期显示：月日时分
            return add0(m) + "/" + add0(d) + " " + add0(h) + ":" + add0(mm);
        } else {
            // 往年日期显示年月日时分
            return y + "/" + add0(m) + "/" + add0(d) + " " + add0(h) + ":" + add0(mm);
        }
    }
};

export const capitalizeFirstLetter = (string) => {
    // 检查输入是否为字符串
    if (typeof string !== "string") {
        return string;
    }
    // 将字符串的第一个字符转换为大写，然后将其与剩余部分拼接
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const toLowerCase = (string) => {
    // 检查输入是否为字符串
    if (typeof string !== "string") {
        return string;
    }
    // 使用toLowerCase()方法将字符串中的大写字母转换为小写
    return string.toLowerCase();
};

export const copyText1 = (item, type) => {
    var input = document.createElement("textarea"); // js创建一个input输入框
    input.value = item; // 将需要复制的文本赋值到创建的input输入框中
    document.body.appendChild(input); // 将输入框暂时创建到实例里面
    input.select(); // 选中输入框中的内容
    document.execCommand("Copy"); // 执行复制操作
    document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作

    if (type == 1) {
        myVanToast({
            type: "success",
            message: i18n.global.t("public.copy_success_1"),
        });
    }
    if (type == 2) {
        myVanToast({
            type: "success",
            message: "Email address copied!",
        });
    } else {
        myVanToast({
            type: "success",
            message: "Copy succeeded",
        });
    }
};
export const goToApp = function (url) {
    copyText1(url, 1);
    window.location.href = url;
};
//返回月日年时分秒格式
export const formatEn = (time) => {
    //shijianchuo是整数，否则要parseInt转换
    if (time == "" || time == 0) {
        return "...";
    } else {
        var timer = new Date(time * 1000);
        var y = timer.getFullYear();
        var m = timer.getMonth() + 1;
        var d = timer.getDate();
        var h = timer.getHours();
        var mm = timer.getMinutes();
        var s = timer.getSeconds();
        return m + "/" + add0(d) + "/" + add0(y) + " " + add0(h) + ":" + add0(mm) + ":" + add0(s);
    }
};
// 语音时间计发转换
export const formatAudieDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (min > 0) {
        return `${min}′${sec}″`;
    } else {
        return `${sec}″`;
    }
};
