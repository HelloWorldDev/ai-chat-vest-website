<template>
    <div class="home-index">
        <Header1 class="header" :headerId="1" :iconId="1" :type="type"></Header1>
        <!-- <Loading /> -->
        <section>
            <div class="gem">
                <div class="l">
                    <p>{{ $t("recharge.text1") }}</p>
                    <span>{{ totalGem }}</span>
                </div>
                <div class="b"></div>
            </div>
            <div class="get-gem">{{ $t("recharge.text2") }}</div>
            <div class="gem-list">
                <div class="list" v-for="(item, index) in list" :key="index">
                    <div class="l">
                        <img :src="item.iconAdd" alt />
                        <p>{{ item.amount }}</p>
                        <div class="discount" v-if="item.discount != 0">{{ $t("recharge.text3", { x: item.discount }) }}</div>
                    </div>
                    <div class="r" @click="buyProduct(item.iap_id, 1, 0)">${{ item.price }}</div>
                </div>
            </div>
            <p class="problem">
                {{ $t("recharge.text4") }}<a @click="showProblem()" href="javascript:void(0)">{{ $t("recharge.text5") }}</a>
            </p>
        </section>
    </div>
</template>

<script setup>
import Header1 from "@/components/Header1/index.vue";
import Icon from "@/assets/img/Gem/icon.png";
import { ref, nextTick, onMounted, onUnmounted, getCurrentInstance } from "vue";
// import Loading from "@/components/Loading";
import {
    appBuyProduct,
    appContactUS,
    appConnectionGoogle,
    appEndConnectionGoogle,
    appShowLoading,
    appHiddenLoading,
} from "@/utils/webview";
const { $route, $Toast, $jsBridge, $store, $api } = getCurrentInstance().proxy;
const list = ref([]);
const totalGem = ref("0");
const type = ref("");
onMounted(() => {
    appShowLoading();
    appConnectionGoogle();
    nextTick(() => {
        getGemConfig();
    });
    $jsBridge.JAMS__H5BuySuccess(showBuySuccess);
    $jsBridge.JAMS__H5BuyFail(showBuyFail);
    $jsBridge.JAMS__H5AppViewWillAppear(() => {});
    type.value = $route.query.type;
});
onUnmounted(() => {
    appEndConnectionGoogle();
});
const showProblem = () => {
    appContactUS();
};
const getGemConfig = () => {
    $api.getGemConfig({})
        .then((res) => {
            appHiddenLoading();
            if (!res.error_code) {
                totalGem.value = res.common.user_info.gem;
                list.value = [...res.data];
                list.value.map((item) => {
                    item.iconAdd = Icon;
                });
                const common = res.common;
                $store.commit("updateAiChatUserInfo", common.user_info);
                $store.commit("updateAiChatExtInfo", common.ext_info);
            } else {
                $Toast({
                    type: "fail",
                    message: this.$t("errorHandleText." + [res.error_code]),
                });
            }
        })
        .catch((err) => {
            appHiddenLoading();
            console.log(err);
        });
};
//购买
const buyProduct = (id, num, type) => {
    appBuyProduct(id, num, type);
};
//购买成功
const showBuySuccess = () => {
    $Toast({
        type: "success",
        message: "Purchase successful",
    });
    getGemConfig();
};
//购买失败
const showBuyFail = () => {
    console.log("购买失败");
    // $Toast({
    //     type: "fail",
    //     message: "Failed purchase",
    // });
};
</script>
<style scoped lang="less">
@import "../../styles/mixin.less";
.home-index {
    flex: 1 1 100%;
    // min-width: 1440px;
    display: flex;
    flex-direction: column;
    section {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        background: #161820;
        padding: 0.57rem 0.12rem 0.12rem;
        box-sizing: border-box;
        .gem {
            width: 100%;
            height: 0.82rem;
            background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
            border-radius: 12px 12px 12px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            display: flex;
            padding: 0.16rem;
            box-sizing: border-box;
            position: relative;
            .l {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                display: flex;
                .mixin-SF-medium;
                & > p {
                    font-size: 0.14rem;
                    color: #ffffff;
                    opacity: 0.65;
                }
                & > span {
                    font-size: 0.24rem;
                    font-family: "DIN";
                    font-weight: bold;
                    color: #ffffff;
                }
            }
            .b {
                width: 0.88rem;
                height: 0.72rem;
                background: url("@/assets/img/Gem/gem-banner.png") no-repeat center;
                background-size: cover;
                position: absolute;
                right: 0;
                bottom: 0;
                border-bottom-right-radius: 0.12rem;
            }
        }
        .get-gem {
            margin-top: 0.12rem;
            width: 100%;
            height: 0.52rem;
            line-height: 0.52rem;
            padding: 0 0.2rem;
            box-sizing: border-box;
            font-size: 0.16rem;
            color: #707988;
            font-weight: bold;
            text-align: left;
            .mixin-SF-medium;
        }
        .gem-list {
            width: 100%;
            min-height: 0.64rem;
            background: #1f212b;
            border-radius: 0.15rem;
            .list {
                width: 100%;
                height: 0.64rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 0.16rem;
                box-sizing: border-box;
                .l {
                    display: flex;
                    align-items: center;
                    & > img {
                        width: 0.24rem;
                        height: 0.24rem;
                        margin-right: 0.04rem;
                    }
                    & > p {
                        font-size: 0.2rem;
                        font-weight: bold;
                        color: #ffffff;
                        font-family: "DIN";
                    }
                    .discount {
                        min-width: 0.56rem;
                        height: 0.2rem;
                        line-height: 0.2rem;
                        background: #ff4d70;
                        color: #fff;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 500;
                        letter-spacing: -0.3px;
                        margin-left: 0.12rem;
                        border-top-left-radius: 0.12rem;
                        border-top-right-radius: 0.12rem;
                        border-bottom-right-radius: 0.12rem;
                        padding: 0 0.05rem;
                        box-sizing: border-box;
                    }
                }
                .r {
                    min-width: 0.8rem;
                    height: 0.32rem;
                    background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
                    border-radius: 22px 22px 22px 22px;
                    opacity: 1;
                    font-size: 0.14rem;
                    color: #ffffff;
                    font-family: "DIN";
                    line-height: 0.32rem;
                    padding: 0 0.16rem;
                    box-sizing: border-box;
                    .mixin-SF-medium;
                }
            }
        }
        .problem {
            font-size: 0.14rem;
            font-weight: 400;
            color: #666d79;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.24rem;
            .mixin-SF-medium;
            & > a {
                color: #666d79;
                text-decoration: underline;
            }
        }
    }
}
</style>
