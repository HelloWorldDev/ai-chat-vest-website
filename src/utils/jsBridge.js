export default {
    // 全局存储登录信息
    JAMS__H5AppUserInfo(callback) {
        window.JAMS__H5AppUserInfo = callback;
    },
    // 页面每次出现调会用此方法刷新数据
    JAMS__H5AppViewWillAppear(callback) {
        window.JAMS__H5AppViewWillAppear = callback;
    },
    // 退出后重进获取登录信息存储
    JAMS__H5AppViewRefresh(callback) {
        window.JAMS__H5AppViewRefresh = callback;
    },
    //商品购买成功
    JAMS__H5BuySuccess(callback) {
        window.JAMS__H5BuySuccess = callback;
    },
    //商品购买失败
    JAMS__H5BuyFail(callback) {
        window.JAMS__H5BuyFail = callback;
    },
    // chat部分页面监听，支付成功或失败
    JAMS__H5ChatWatchBuyVipSuccess(callback) {
        window.JAMS__H5ChatWatchBuyVipSuccess = callback;
    },
    // chat部分页面监听，支付成功或失败
    JAMS__H5ChatWatchBuyVipFail(callback) {
        window.JAMS__H5ChatWatchBuyVipFail = callback;
    },
    /// 签到 签到成功的话会调用
    JAMS__H5AppDailySuccess(callback) {
        window.JAMS__H5AppDailySuccess = callback;
    },
};
