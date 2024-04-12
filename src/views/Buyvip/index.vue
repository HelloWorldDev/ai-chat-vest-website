<template>
    <div class="vip-dialog">
        <Header1 class="header" :headerId="6" :iconId="0"></Header1>
        <div className="my-dialog">
            <div class="s-wraper">
                <van-swipe
                    ref="mySwipe"
                    class="swip"
                    touchable
                    circular="true"
                    :loop="false"
                    :width="300"
                    @change="handleSwipeChange"
                >
                    <van-swipe-item>
                        <div class="swip-l">
                            <div class="t-wrap">
                                <p class="sp1">SUPE PLUS</p>
                                <p class="sp2">Privileges not activated yet</p>
                            </div>
                            <img class="power" src="@/assets/img/Gem/g-power.png" alt="" />
                        </div>
                    </van-swipe-item>
                    <van-swipe-item>
                        <div class="swipe1">
                            <div class="t-wrap">
                                <p class="sp1">SUPE PREMIUM</p>
                                <p class="sp2">Privileges not activated yet</p>
                            </div>
                            <img class="power" src="@/assets/img/Gem/b-power.png" alt="" />
                        </div>
                    </van-swipe-item>
                </van-swipe>
            </div>

            <div class="Vip cVip" v-if="VIP == 'cvip'">
                <div class="page">
                    <div class="in-wrap">
                        <img draggable="false" class="demo1" :src="bgImg || defaultImg" alt="" />
                    </div>

                    <div class="bottom">
                        <div class="inter">
                            <div class="line-w">
                                <p class="t t1">Service Content</p>
                                <p class="t2 t1">Plus</p>
                                <p class="t2 t1">Premium</p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock all paid characters</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock {{ objCvip.day_free_video }} paid videos pre day</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock {{ objCvip.day_free_pic }} paid photos pre day</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock 2x income from sign-in</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock speaking ability</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock 18+ mode</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock card drawing mode</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                            </div>
                        </div>
                        <div class="button-w">
                            <van-button
                                :class="selectedLow == '1' ? 'month selected l-month' : 'month'"
                                @click="
                                    buyVip(
                                        'year',
                                        'Cvip',
                                        objCvip.year_iap_id,
                                        objCvip.google_product_id,
                                        objCvip.google_year_plan_id,
                                        '1',
                                        '1'
                                    )
                                "
                            >
                                <p class="big">${{ objCvip.year_price }}/12 <span>Months</span></p>
                                <p class="little">${{ (objCvip.year_price / 12).toFixed(1) }}/Month</p>
                                <div class="less">{{ $t("vipDialog.text5", { x: objCvip.year_price_discount }) }}</div>
                            </van-button>
                            <van-button
                                :class="selectedLow == '2' ? 'month selected l-month' : 'month'"
                                @click="
                                    buyVip(
                                        'month',
                                        'Cvip',
                                        objCvip.month_iap_id,
                                        objCvip.google_product_id,
                                        objCvip.google_month_plan_id,
                                        '1',
                                        '1'
                                    )
                                "
                            >
                                <p class="big">${{ objCvip.month_price }}/1 <span>Month</span></p>
                                <p class="little">${{ objCvip.month_price }}/Month</p>
                            </van-button>
                        </div>
                        <van-button @click="pay()" v-if="!aiChatExtInfo.is_cvip" class="continue">
                            <p class="subscribed">Continue</p>
                        </van-button>
                        <van-button v-if="aiChatExtInfo.is_cvip" class="continue"
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
                            Before subscribing to the service, please be informed that the fee will be officially deducted from
                            the account after confirmation of purchase; Subscription is an automatic renewal service. If you do
                            not intend to renew, please manually close it at least 24 hours before the end of the current billing
                            cycle. The renewal fee will be deducted within 24 hours after the end of the current billing cycle;
                            After subscribing to the service, you can enter the management renewal cycle and other operations
                            through the [Manage Subscription] portal provided by the App settings. More details
                            <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                        </div>
                        <div class="description" v-if="isAgent == false">
                            By tapping Continue, money will be debited from your Google Play account, and your subscription will
                            automatically renew as the price and duration of the previous package until you cancel the
                            subscription in the Google Play settings within 24 hours. By tapping Continue, you agree to our
                            Privacy Policy and
                            <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Vip vVip" v-if="VIP == 'vvip'">
                <div class="page">
                    <div class="in-wrap">
                        <img draggable="false" class="demo1" :src="bgImg || defaultImg" alt="" />
                    </div>

                    <div class="bottom">
                        <div class="inter">
                            <div class="line-w">
                                <p class="t t1">Service Content</p>
                                <p class="t2 t1">Plus</p>
                                <p class="t2 t1">Premium</p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock all paid characters</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock {{ objCvip.day_free_video }} paid videos pre day</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock {{ objCvip.day_free_pic }} paid photos pre day</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock 2x income from sign-in</p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right2.png" alt="" />
                                </p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock speaking ability</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock 18+ mode</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                            <div class="line">
                                <p class="t1">Unlock card drawing mode</p>
                                <p class="t2 t"></p>
                                <p class="t2 t">
                                    <img src="@/assets/img/Gem/right1.png" alt="" />
                                </p>
                            </div>
                        </div>
                        <div class="button-w">
                            <van-button
                                :class="selectedHigh == '1' ? 'month selectedHigh l-month' : 'month'"
                                @click="
                                    buyVip(
                                        'year',
                                        'Vvip',
                                        objVvip.year_iap_id,
                                        objVvip.google_product_id,
                                        objVvip.google_year_plan_id,
                                        '1',
                                        '1'
                                    )
                                "
                            >
                                <p class="big">${{ objVvip.year_price }}/12 <span>Months</span></p>
                                <p class="little">${{ (objVvip.year_price / 12).toFixed(1) }}/Month</p>
                                <div class="lessHigh">{{ $t("vipDialog.text5", { x: objVvip.year_price_discount }) }}</div>
                            </van-button>
                            <van-button
                                :class="selectedHigh == '2' ? 'month selectedHigh l-month' : 'month'"
                                @click="
                                    buyVip(
                                        'month',
                                        'Vvip',
                                        objVvip.month_iap_id,
                                        objVvip.google_product_id,
                                        objVvip.google_month_plan_id,
                                        '1',
                                        '1'
                                    )
                                "
                            >
                                <p class="big">
                                    ${{ isAgent ? objVvip.month_price : objVvip.month_price_andriod }}/1 <span>Month</span>
                                </p>
                                <p class="little">${{ isAgent ? objVvip.month_price : objVvip.month_price_andriod }}/Month</p>
                            </van-button>
                        </div>
                        <van-button @click="pay" v-if="!aiChatExtInfo.is_vvip" class="continue">
                            <p class="subscribed">Continue</p>
                        </van-button>
                        <van-button v-if="aiChatExtInfo.is_vvip" class="continue"
                            >{{ $t("vipDialog.text7") }}
                            <p class="subscribed">{{ $t("vipDialog.text8") }} {{ formatEn(vvip_expire) }}</p>
                        </van-button>

                        <van-checkbox label-disabled class="check" v-model="checkedVvip">
                            <p @click.stop="showAgreement()">
                                {{ $t("vipDialog.text14") }}
                                <a class="hr" href="javascript:void(0);">{{ $t("vipDialog.text16") }}</a>
                            </p>
                        </van-checkbox>
                        <div class="description" v-if="isAgent == true">
                            Before subscribing to the service, please be informed that the fee will be officially deducted from
                            the account after confirmation of purchase; Subscription is an automatic renewal service. If you do
                            not intend to renew, please manually close it at least 24 hours before the end of the current billing
                            cycle. The renewal fee will be deducted within 24 hours after the end of the current billing cycle;
                            After subscribing to the service, you can enter the management renewal cycle and other operations
                            through the [Manage Subscription] portal provided by the App settings.More details
                            <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                        </div>
                        <div class="description" v-if="isAgent == false">
                            By tapping Continue, money will be debited from your Google Play account, and your subscription will
                            automatically renew as the price and duration of the previous package until you cancel the
                            subscription in the Google Play settings within 24 hours. By tapping Continue, you agree to our
                            Privacy Policy and
                            <a class="hr" href="javascript:void(0);" @click.stop="showAgreement()">'Terms of service'</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header1 from "@/components/Header1/index.vue";
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
        swipeStyle() {
            const leftPadding = this.swipeIndex === 0 ? "0" : "12px";
            const rightPadding = this.swipeIndex === 1 ? "0" : "12px";
            return {
                marginLeft: leftPadding,
                marginRight: rightPadding,
            };
        },
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
            swipeIndex: 0, // 初始化索引为 0
            selectedLow: "1",
            selectedHigh: "1",
            appleIapId: "",
            googleProductId: "",
            googlePlanId: "",
            appleIapId2: "",
            googleProductId2: "",
            googlePlanId2: "",
            num: "1",
            type: "1",
            selectType: "Cvip",
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
    components: {
        Header1,
    },
    mounted() {
        appConnectionGoogle();
        this.$nextTick(() => {
            this.getVipConfig();
            this.handleInitialSwipe();
        });
        this.$jsBridge.JAMS__H5BuySuccess(this.showBuySuccess);
        this.$jsBridge.JAMS__H5BuyFail(this.showBuyFail);
        this.$jsBridge.JAMS__H5AppViewWillAppear(() => {});
    },
    beforeUnmount() {
        appEndConnectionGoogle();
    },
    methods: {
        handleInitialSwipe() {
            const swipeInstance = this.$refs.mySwipe;
            if (this.VIP == "vvip") {
                // 获取 swipe 实例
                // 确保 swipe 实例存在
                if (swipeInstance) {
                    // 执行滑动操作，例如滑动到第二个索引
                    swipeInstance.swipeTo(1);
                }
            } else if (this.VIP == "cvip") {
                swipeInstance.swipeTo(0);
            }
        },
        handleSwipeChange(index) {
            console.log("zhixing", index);
            this.swipeIndex = index;
            if (index == 0) {
                this.VIP = "cvip";
            } else {
                this.VIP = "vvip";
            }
            const swipeTrack = document.querySelector(".van-swipe__track");
            if (swipeTrack) {
                swipeTrack.style.transform = "translateX(-279)";
            }
        },
        cancel() {
            appGoback();
        },

        //显示用户协议
        showAgreement() {
            appPushStaticWeb(process.env.VUE_APP_GO_TO_URL + "html/subscription-en.html", "Terms of Service");
            // 代码内不要写死域名，配置里面都有，拼接！！
            // if (process.env.NODE_ENV == "production") {
            //     appPushStaticWeb("https://bot.supe.ai/html/subscription-en.html", "Terms of Service");
            // } else {
            //     appPushStaticWeb("https://lmq.nihao.com/aiChat/dist/html/subscription-en.html", "Terms of Service");
            // }
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
                        this.appleIapId = this.objCvip.year_iap_id;
                        this.googleProductId = this.objCvip.google_product_id;
                        this.googlePlanId = this.objCvip.google_year_plan_id;
                        this.appleIapId2 = this.objVvip.year_iap_id;
                        this.googleProductId2 = this.objVvip.google_product_id;
                        this.googlePlanId2 = this.objVvip.google_year_plan_id;
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
        buyVip(time, Vip, appleIapId, googleProductId, googlePlanId, num, type) {
            if (Vip == "Cvip") {
                this.appleIapId = appleIapId;
                this.googleProductId = googleProductId;
                this.googlePlanId = googlePlanId;
            } else {
                this.appleIapId2 = appleIapId;
                this.googleProductId2 = googleProductId;
                this.googlePlanId2 = googlePlanId;
            }
            this.num = num;
            this.type = type;
            this.selectType = Vip;
            if (time == "year" && Vip == "Cvip") {
                console.log("年会员低");
                this.selectedLow = "1";
                return;
            } else if (time == "month" && Vip == "Cvip") {
                console.log("月会员低");
                this.selectedLow = "2";
                return;
            } else if (time == "year" && Vip == "Vvip") {
                console.log("年会员高");
                this.selectedHigh = "1";
                return;
            } else if (time == "month" && Vip == "Vvip") {
                console.log("月会员高");
                this.selectedHigh = "2";
                return;
            }
        },
        //支付
        pay() {
            if (
                (this.selectType == "Cvip" && this.checkedCvip == false) ||
                (this.selectType == "Vvip" && this.checkedVvip == false)
            ) {
                this.$Toast({
                    type: "fail",
                    message: this.$t("vipDialog.text15"),
                });
            } else {
                if (this.VIP == "cvip") {
                    console.log("支付1", this.appleIapId, this.googleProductId, this.googlePlanId);
                    appBuyProduct(this.appleIapId, this.num, this.type);
                    appSubscribeProduct(this.googleProductId, this.googlePlanId);
                } else {
                    console.log("支付2", this.appleIapId2, this.googleProductId2, this.googlePlanId2);
                    appBuyProduct(this.appleIapId2, this.num, this.type);
                    appSubscribeProduct(this.googleProductId2, this.googlePlanId2);
                }
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
    // background: #161820;
    background: var(--bg-chat-primary);
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    .mixin-SF-medium;
    &:deep(.my-dialog) {
        background-color: transparent !important;
        border-radius: 0;
        .s-wraper {
            width: 100%;
            padding: 0 0.2rem;
            box-sizing: border-box;
            .swip {
                margin-top: 0.64rem;
                box-sizing: border-box;
                .van-swipe__indicators {
                    display: none;
                }
                // .van-swipe__track {
                //     width: 6.24rem !important;
                //     // transform: translate(-279px) !important;
                // }
                .van-swipe-item {
                    background-size: cover;

                    .swip-l {
                        width: 2.89rem;
                        height: 1rem;
                        border-radius: 12px;
                        border: 2px solid rgba(255, 255, 255, 0.35);
                        background: url("@/assets/img/Gem/supe-plus.png");
                        background-position: center center;
                        padding: 0.2rem 0.16rem;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-right: 0.07rem !important;
                    }
                    .swipe1 {
                        width: 2.89rem;
                        height: 1rem;
                        border-radius: 12px;
                        border: 2px solid rgba(255, 255, 255, 0.35);
                        background: url("@/assets/img/Gem/supe-plus2.png");
                        background-position: center center;
                        padding: 0.2rem 0.16rem;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-left: 0.07rem !important;
                    }
                    .t-wrap {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;
                        .sp1 {
                            color: #fff;
                            font-size: 22px;
                            font-style: italic;
                            font-weight: 800;
                            line-height: normal;
                            letter-spacing: -0.3px;
                        }
                        .sp2 {
                            color: rgba(255, 255, 255, 0.65);
                            font-size: 12px;
                            font-style: italic;
                            font-weight: 400;
                            line-height: normal;
                        }
                    }
                    .power {
                        width: 0.8rem;
                        height: 0.8rem;
                    }
                }
            }
        }
        .Vip {
            .page {
                min-height: 6.04rem;
                position: relative;
                .in-wrap {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    .demo1 {
                        opacity: 0.1;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        user-select: none;
                        -moz-user-select: none;
                        -webkit-user-drag: none;
                        -webkit-user-select: none;
                        -ms-user-select: none;
                    }
                }
                .bottom {
                    width: 100%;
                    min-height: 2.86rem;
                    border-radius: 0px 0px 0px 0px;
                    opacity: 1;
                    padding: 0 0.2rem;
                    padding-bottom: 0.3rem;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    .inter {
                        margin-top: 0.16rem;
                        width: 100%;
                        height: 3.11rem;
                        border-radius: 12px;
                        background: rgba(0, 0, 0, 0.35);
                        padding: 0.16rem;
                        box-sizing: border-box;
                        .line-w {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 0.36rem;
                            .t {
                                text-align: left;
                            }
                            .t1 {
                                flex: 4;
                                color: var(---, #fff);
                                opacity: 0.35;
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                                letter-spacing: -0.3px;
                            }
                            .t2 {
                                flex: 1;
                            }
                        }
                        .line {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 0.36rem;
                            color: var(---, #fff);
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            letter-spacing: -0.3px;
                            .t {
                                & > img {
                                    width: 0.24rem;
                                    height: 0.24rem;
                                }
                            }
                            .t1 {
                                text-align: left;
                                flex: 4;
                            }
                            .t2 {
                                flex: 1;
                            }
                        }
                    }
                    .button-w {
                        margin-top: 0.16rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .month {
                            width: 1.67rem;
                            height: 0.75rem;
                            border-radius: 12px;
                            border-radius: 12px;
                            border: 2px solid #2a2d39;
                            background: rgba(22, 24, 32, 0.85);
                            .big {
                                color: var(---, #fff);
                                text-align: center;
                                font-size: 18px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: normal;
                                letter-spacing: -0.3px;
                                & > span {
                                    font-size: 0.12rem;
                                }
                            }
                            .little {
                                color: rgba(255, 255, 255, 0.65);
                                text-align: center;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                                letter-spacing: -0.3px;
                            }
                            .less {
                                position: absolute;
                                top: -0.1rem;
                                right: 0.1rem;
                                width: 0.64rem;
                                height: 0.2rem;
                                line-height: 0.2rem;
                                color: var(---, #fff);
                                text-align: center;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                letter-spacing: -0.3px;
                                border-radius: 40px;
                                background: linear-gradient(90deg, #ffaa1d 0%, #ff850c 100%);
                            }
                            .lessHigh {
                                position: absolute;
                                top: -0.1rem;
                                right: 0.1rem;
                                width: 0.64rem;
                                height: 0.2rem;
                                line-height: 0.2rem;
                                color: var(---, #fff);
                                text-align: center;
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                letter-spacing: -0.3px;
                                border-radius: 40px;
                                background: linear-gradient(90deg, #33b5ff 0%, #3a85ff 100%);
                            }
                        }
                        .l-month {
                            margin-right: 0;
                        }
                        .selected {
                            border: 2px solid #ffdf35;
                            box-sizing: border-box;
                        }
                        .selectedHigh {
                            border: 2px solid #2be6ff;
                            box-sizing: border-box;
                        }
                    }
                    .continue {
                        width: 100%;
                        height: 0.52rem;
                        border-radius: 12px;
                        background: #fff;
                        margin: 0.24rem 0 0.16rem 0;
                        color: #161820;
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        letter-spacing: -0.3px;
                    }
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

                    .check {
                        z-index: 999;
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
                            color: #b2b9c6;
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
        }
        .cVip {
            animation: fade-out 0.3s;
            .description {
                margin-top: 0.12rem;
                width: 100%;
                padding: 0.12rem;
                box-sizing: border-box;
                font-size: 0.14rem;
                color: rgba(255, 255, 255, 0.35);
                background: rgba(0, 0, 0, 0.35);
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
            .description {
                margin-top: 0.12rem;
                width: 100%;
                padding: 0.12rem;
                box-sizing: border-box;
                font-size: 0.14rem;
                color: rgba(255, 255, 255, 0.35);
                background: rgba(0, 0, 0, 0.35);
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
