<template>
    <!-- v1.1版本的购买vip 2.0版本用不到了 -->
    <div class="vip-dialog">
        <div className="my-dialog">
            <div class="header">
                <img class="exit" @click="cancel()" src="../../assets/img/Gem/cancel.png" alt="" />
                <div class="vip-wrap">
                    <div :class="VIP == 'cvip' ? 'left' : 'right'" @click="changeVip('cvip')">CVIP</div>
                    <div :class="VIP == 'vvip' ? 'left' : 'right'" @click="changeVip('vvip')">VVIP</div>
                </div>
            </div>
            <div class="Vip cVip" v-if="VIP == 'cvip'">
                <div class="page">
                    <div class="in-wrap">
                        <img draggable="false" class="demo1" :src="bgImg || defaultImg" alt="" />
                    </div>
                </div>
                <div class="bottom">
                    <img class="image1" src="@/assets/img/Gem/round1.png" alt="" />
                    <img class="image2" src="@/assets/img/Gem/vipicon.png" alt="" />
                    <div class="interist">
                        <div class="left">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>{{ $t("vipDialog.text1") }}</p>
                        </div>
                        <div class="right">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>
                                {{ $t("vipDialog.text2", { x: objCvip.day_free_pic }) }}
                            </p>
                        </div>
                        <div class="left">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>{{ $t("vipDialog.text3", { x: objCvip.day_free_video }) }}</p>
                        </div>
                    </div>
                    <div class="interist one"></div>
                    <van-button
                        v-if="!aiChatExtInfo.is_cvip"
                        class="year"
                        @click="
                            buyVip('Cvip', objCvip.year_iap_id, objCvip.google_product_id, objCvip.google_year_plan_id, '1', '1')
                        "
                    >
                        <p class="new">${{ $t("vipDialog.text4", { x: objCvip.year_price }) }}</p>
                        <p class="old">${{ $t("vipDialog.text4", { x: objCvip.origin_year_price }) }}</p>
                        <div class="less">{{ $t("vipDialog.text5", { x: objCvip.year_price_discount }) }}</div>
                    </van-button>
                    <van-button
                        v-if="!aiChatExtInfo.is_cvip"
                        class="month"
                        @click="
                            buyVip(
                                'Cvip',
                                objCvip.month_iap_id,
                                objCvip.google_product_id,
                                objCvip.google_month_plan_id,
                                '1',
                                '1'
                            )
                        "
                        >${{ $t("vipDialog.text6", { x: objCvip.month_price }) }}
                    </van-button>
                    <van-button v-if="aiChatExtInfo.is_cvip" class="month"
                        >{{ $t("vipDialog.text7") }}
                        <p class="subscribed">{{ $t("vipDialog.text8") }} {{ formatEn(cvip_expire) }}</p>
                    </van-button>
                    <van-checkbox label-disabled class="check" v-model="checkedCvip"
                        ><p @click.stop="showAgreement()">
                            {{ $t("vipDialog.text14") }}
                            <a class="hr" href="javascript:void(0);"> {{ $t("vipDialog.text16") }}</a>
                        </p></van-checkbox
                    >
                    <div class="description" v-if="isAgent == true">
                        Before subscribing to the service, please be informed that the fee will be officially deducted from the
                        account after confirmation of purchase; Subscription is an automatic renewal service. If you do not intend
                        to renew, please manually close it at least 24 hours before the end of the current billing cycle. The
                        renewal fee will be deducted within 24 hours after the end of the current billing cycle; After subscribing
                        to the service, you can enter the management renewal cycle and other operations through the [Manage
                        Subscription] portal provided by the App settings. More details
                        <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                    </div>
                    <div class="description" v-if="isAgent == false">
                        By tapping Continue, money will be debited from your Google Play account, and your subscription will
                        automatically renew as the price and duration of the previous package until you cancel the subscription in
                        the Google Play settings within 24 hours. By tapping Continue, you agree to our Privacy Policy and
                        <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                    </div>
                </div>
            </div>
            <div class="Vip vVip" v-if="VIP == 'vvip'">
                <div class="page">
                    <div class="in-wrap">
                        <img draggable="false" class="demo1" :src="bgImg || defaultImg" alt="" />
                    </div>
                </div>
                <div class="bottom">
                    <img class="image1" src="@/assets/img/Gem/round2.png" alt="" />
                    <img class="image2" src="@/assets/img/Gem/vipicon2.png" alt="" />
                    <div class="interist">
                        <div class="left">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>{{ $t("vipDialog.text9") }}</p>
                        </div>
                        <div class="right">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>{{ $t("vipDialog.text10", { x: objVvip.day_reward_gem }) }}</p>
                        </div>
                        <div class="left">
                            <img src="@/assets/img/Gem/right.png" alt="" />
                            <p>{{ $t("vipDialog.text11") }}</p>
                        </div>
                    </div>
                    <div class="interist one"></div>
                    <van-button
                        v-if="!aiChatExtInfo.is_vvip"
                        class="month"
                        @click="
                            buyVip('Vvip', objVvip.month_iap_id, objVvip.google_product_id, objVvip.google_month_plan_id, 1, 1)
                        "
                        >${{ $t("vipDialog.text6", { x: objVvip.month_price }) }}</van-button
                    >
                    <van-button v-if="aiChatExtInfo.is_vvip" class="month"
                        >{{ $t("vipDialog.text7") }}
                        <p class="subscribed">{{ $t("vipDialog.text8") }} {{ formatEn(vvip_expire) }}</p>
                    </van-button>
                    <!-- <van-checkbox class="check" v-model="checked"
                        >Confirm the "Automatic Subscription Agreement" before activation</van-checkbox
                    > -->
                    <van-checkbox label-disabled class="check" v-model="checkedVvip">
                        <p @click.stop="showAgreement()">
                            {{ $t("vipDialog.text14") }}
                            <a class="hr" href="javascript:void(0);">{{ $t("vipDialog.text16") }}</a>
                        </p>
                    </van-checkbox>
                    <div class="description" v-if="isAgent == true">
                        Before subscribing to the service, please be informed that the fee will be officially deducted from the
                        account after confirmation of purchase; Subscription is an automatic renewal service. If you do not intend
                        to renew, please manually close it at least 24 hours before the end of the current billing cycle. The
                        renewal fee will be deducted within 24 hours after the end of the current billing cycle; After subscribing
                        to the service, you can enter the management renewal cycle and other operations through the [Manage
                        Subscription] portal provided by the App settings.More details
                        <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                    </div>
                    <div class="description" v-if="isAgent == false">
                        By tapping Continue, money will be debited from your Google Play account, and your subscription will
                        automatically renew as the price and duration of the previous package until you cancel the subscription in
                        the Google Play settings within 24 hours. By tapping Continue, you agree to our Privacy Policy and
                        <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import {
    appGoback,
    appBuyProduct,
    appSubscribeProduct,
    appConnectionGoogle,
    appEndConnectionGoogle,
    appHiddenLoading,
    appPushStaticWeb,
} from "@/utils/webview";
import { formatEn, getRequest } from "@/utils";
import defaultImg from "@/assets/img/Gem/WechatIMG398.jpg";
export default {
    props: [],
    computed: {
        ...mapState(["aiChatGFInfo", "aiChatExtInfo", "aiChatUserInfo", "bgImg"]),
    },
    data() {
        return {
            formatEn,
            VIP: "",
            objCvip: {},
            objVvip: {},
            defaultImg,
            cvip_expire: "", //c_vip的有效期
            vvip_expire: "", //v_vip的有效期
            Gid: "",
            checkedCvip: false,
            checkedVvip: false,
            isAgent: true,
        };
    },
    created() {
        this.VIP = getRequest("vip").vip;
        this.Gid = getRequest("gid").gid;
        let userAgent = navigator.userAgent;
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
            this.isAgent = true;
        } else if (/Android/i.test(userAgent)) {
            this.isAgent = false;
        }
    },
    watch: {},
    mounted() {
        appConnectionGoogle();
        this.$nextTick(() => {
            this.getVipConfig();
        });
        this.$jsBridge.JAMS__H5BuySuccess(this.showBuySuccess);
        this.$jsBridge.JAMS__H5BuyFail(this.showBuyFail);
        this.$jsBridge.JAMS__H5AppViewWillAppear(() => {});
    },
    beforeUnmount() {
        appEndConnectionGoogle();
    },
    methods: {
        cancel() {
            appGoback();
        },
        changeVip(val) {
            if (val == "cvip") {
                this.VIP = "cvip";
            } else if (val == "vvip") {
                this.VIP = "vvip";
            }
        },
        //显示用户协议
        showAgreement() {
            if (process.env.NODE_ENV == "production") {
                appPushStaticWeb("https://bot.supe.ai/html/subscription-en.html", "Terms of Service");
            } else {
                appPushStaticWeb("https://lmq.nihao.com/aiChat/dist/html/subscription-en.html", "Terms of Service");
            }
        },
        //获取数据
        getVipConfig() {
            let params = {
                gid: this.Gid,
            };
            this.$api
                .getVipConfig(params)
                .then((res) => {
                    appHiddenLoading();
                    if (!res.error_code) {
                        this.objCvip = res.data.config.find((item) => {
                            return item.type == "cvip";
                        });
                        this.objVvip = res.data.config.find((item) => {
                            return item.type == "vvip";
                        });
                        this.$store.commit("updateBgImg", res.data.bg_url);
                        // this.bgImg = res.data.bg_url;
                        const common = res.common;
                        this.cvip_expire = res.common.user_info.cvip_expire_at;
                        this.vvip_expire = res.common.user_info.vvip_expire_at;
                        this.$store.commit("updateAiChatUserInfo", common.user_info);
                        this.$store.commit("updateAiChatExtInfo", common.ext_info);
                        if (common.user_info.set_meal.cvip.time_type == 0) {
                            this.checkedCvip = false;
                        } else {
                            this.checkedCvip = true;
                        }
                        if (common.user_info.set_meal.vvip.time_type == 0) {
                            this.checkedVvip = false;
                        } else {
                            this.checkedVvip = true;
                        }
                    } else {
                        this.$Toast({
                            type: "fail",
                            message: this.$t("errorHandleText." + [res.error_code]),
                        });
                    }
                })
                .catch((err) => {
                    appHiddenLoading();
                    console.log(err);
                });
        },
        //购买cvip带订阅
        buyVip(Vip, appleIapId, googleProductId, googlePlanId, num, type) {
            if ((Vip == "Cvip" && this.checkedCvip == false) || (Vip == "Vvip" && this.checkedVvip == false)) {
                this.$Toast({
                    type: "fail",
                    message: this.$t("vipDialog.text15"),
                });
            } else {
                appBuyProduct(appleIapId, num, type);
                appSubscribeProduct(googleProductId, googlePlanId);
            }
        },
        //购买成功
        showBuySuccess() {
            this.$Toast({
                type: "success",
                message: this.$t("vipDialog.text12"),
            });
            this.getVipConfig();
            appGoback();
        },
        //购买失败
        showBuyFail() {
            console.log("购买失败");
            // this.$Toast({
            //     type: "fail",
            //     message: this.$t("vipDialog.text13"),
            // });
        },
    },
};
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.vip-dialog {
    width: 100%;
    height: 100%;
    background: #161820;
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    .mixin-SF-medium;
    &:deep(.my-dialog) {
        background-color: transparent !important;
        border-radius: 0;
        .header {
            width: 100%;
            height: 0.6rem;
            padding: 0 0.16rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .exit {
                position: absolute;
                left: 0.16rem;
                width: 0.32rem;
                height: 0.32rem;
            }
            .only-vvip {
                font-size: 0.16rem;
                color: #ffffff;
                font-weight: 500;
            }
            .vip-wrap {
                width: 1.8rem;
                height: 0.4rem;
                background: #352f33;
                border-radius: 20px 20px 20px 20px;
                line-height: 0.4rem;
                display: flex;
                .left {
                    width: 0.9rem;
                    height: 100%;
                    background: #ffffff;
                    border-radius: 20px 20px 20px 20px;
                    font-size: 0.16rem;
                    color: #161820;
                    font-weight: 500;
                }
                .right {
                    width: 0.9rem;
                    height: 100%;
                    border-radius: 20px 20px 20px 20px;
                    font-size: 0.16rem;
                    color: #ffffff;
                    font-weight: 500;
                }
            }
        }

        .Vip {
            .page {
                margin: 0.24rem 0.12rem;
                min-height: 6.96rem;
                // background: #161820;
                border-radius: 0.39rem;
                background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
                // border: 4px solid #ff992b;
                position: relative;
                .in-wrap {
                    position: absolute;
                    left: 4px;
                    top: 4px;
                    right: 4px;
                    .demo1 {
                        width: 100%;
                        height: 100%;
                        border-radius: 0.38rem;
                        pointer-events: none;
                        user-select: none;
                        -moz-user-select: none;
                        -webkit-user-drag: none;
                        -webkit-user-select: none;
                        -ms-user-select: none;
                    }
                }
            }
            .bottom {
                width: 100%;
                min-height: 2.86rem;
                background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
                border-radius: 0px 0px 0px 0px;
                opacity: 1;
                position: absolute;
                left: 0;
                right: 0;
                top: 50%;
                padding: 0 0.24rem;
                padding-bottom: 0.3rem;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                .image1 {
                    width: 100%;
                    height: 0.4rem;
                    position: absolute;
                    top: -0.39rem;
                    left: 0;
                    right: 0;
                }
                .image2 {
                    width: 1.2rem;
                    height: 0.8rem;
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%);
                    top: -0.4rem;
                }
                .interist {
                    margin-top: 0.4rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-start;

                    .left,
                    .right {
                        flex: 1;
                        display: flex;
                        align-items: flex-start;
                        justify-content: flex-start;
                        & > img {
                            width: 0.14rem;
                            height: 0.14rem;
                            margin-right: 0.08rem;
                            margin-top: 0.03rem;
                        }
                        & > p {
                            font-size: 0.14rem;
                            color: #ffffff;
                            text-align: left;
                        }
                    }
                }
                .one {
                    margin-top: 0.07rem;
                }
                .year {
                    width: 100%;
                    height: 0.52rem;
                    border-radius: 28px 28px 28px 28px;
                    border: 0;
                    margin-top: 0.1rem;

                    .less {
                        width: 0.73rem;
                        height: 0.24rem;
                        border-top-left-radius: 0.12rem;
                        border-top-right-radius: 0.12rem;
                        border-bottom-right-radius: 0.12rem;
                        background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                        position: absolute;
                        right: 0;
                        top: -0.12rem;
                        font-size: 0.14rem;
                        color: #ffffff;
                        font-weight: bold;
                        line-height: 0.24rem;
                    }
                }
                .month {
                    width: 100%;
                    height: 0.52rem;
                    border-radius: 28px 28px 28px 28px;
                    margin-top: 0.2rem;
                    font-size: 0.16rem;
                    font-weight: bold;
                }
                .check {
                    margin-top: 0.2rem;
                    justify-content: center;
                    align-items: flex-start;
                    .van-checkbox__icon .van-icon {
                        font-size: 0.6em;
                        // background-color: #21d072;
                        border-color: #ffffff;
                    }
                    .van-checkbox__icon--checked .van-icon {
                        background-color: #21d072;
                        border-color: #21d072;
                    }
                    .van-checkbox__label {
                        font-size: 0.12rem;
                        font-weight: normal;
                        color: #ffffff;
                        text-align: left;
                        margin-top: -0.02rem;
                        & > p {
                            display: flex;
                        }
                        .hr {
                            color: #ffffff;
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
        .cVip {
            animation: fade-out 0.3s;
            .year {
                background: #161820;
                .new {
                    font-size: 0.16rem;
                    color: #ffffff;
                    font-weight: bold;
                }
                .old {
                    font-size: 0.12rem;
                    color: rgba(255, 255, 255, 0.35);
                    text-decoration: line-through;
                }
            }
            .month {
                background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
                border: 2px solid #161820;
                color: #161820;
                .subscribed {
                    font-size: 0.12rem;
                    font-weight: normal;
                    color: rgba(22, 24, 32, 0.65);
                }
            }
            .description {
                margin-top: 0.12rem;
                width: 100%;
                padding: 0.12rem;
                box-sizing: border-box;
                font-size: 0.14rem;
                color: rgba(255, 255, 255, 0.65);
                background: linear-gradient(90deg, #d0962f 0%, #d28830 100%);
                border-radius: 0.15rem;
                text-align: left;
                .hr {
                    display: inline-block;
                    color: #ffffff;
                    text-decoration: underline;
                }
            }
        }
        .vVip {
            animation: fade-out 0.3s;
            .page {
                background: linear-gradient(90deg, #be34f3 0%, #7152eb 100%);
            }
            .bottom {
                background: linear-gradient(90deg, #be34f3 0%, #7152eb 100%);
            }
            .year {
                background: #ffffff;
                .new {
                    font-size: 0.16rem;
                    color: #9f43ea;
                    font-weight: bold;
                }
                .old {
                    font-size: 0.12rem;
                    color: #e7bcf8;
                    text-decoration: line-through;
                }
            }
            .month {
                background: linear-gradient(90deg, #be34f3 0%, #7152eb 100%);
                border: 2px solid #ffffff;
                color: #ffffff;
                .subscribed {
                    font-size: 0.12rem;
                    font-weight: normal;
                    color: #ffffff;
                }
            }
            .description {
                margin-top: 0.12rem;
                width: 100%;
                padding: 0.12rem;
                box-sizing: border-box;
                font-size: 0.14rem;
                color: rgba(255, 255, 255, 0.65);
                background: linear-gradient(90deg, #952bbe 0%, #613db9 100%);
                border-radius: 0.15rem;
                text-align: left;
                .hr {
                    display: inline-block;
                    color: #ffffff;
                    text-decoration: underline;
                }
            }
        }
        @keyframes fade-out {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    }
}
</style>
