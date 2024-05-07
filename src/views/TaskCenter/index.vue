<template>
    <div class="points-index">
        <Header1 class="header" :headerId="4" :iconId="1" :type="type"></Header1>
        <!-- <Loading /> -->
        <section>
            <div class="gem">
                <div class="l">
                    <p>{{ $t("points.text1") }} <img @click="showPoints()" src="@/assets/img/Gem/wenhao.png" alt="" /></p>
                    <span>{{ totalPoints }}</span>
                </div>
                <div class="b"></div>
                <!-- <div class="exchange" @click="exchange">Exchange</div> -->
            </div>

            <!-- Daily Task -->
            <div class="get-gem">{{ $t("points.text2") }}</div>
            <div class="list-li" v-for="(item, index) in dailyList" :key="index">
                <img class="task1" :src="item.iconAdd" alt="" />
                <div class="li-c">
                    <p class="text">
                        {{ item.name }}
                        <span v-if="item.goal != 0">({{ item.progress }}/{{ item.goal == 0 ? "∞" : item.goal }})</span>
                    </p>
                    <div class="points-b">
                        <img v-if="item.reward_supe_point != '0'" src="@/assets/img/Gem/points1.png" alt="" />
                        <span v-if="item.reward_supe_point != '0'" class="count1">+{{ item.reward_supe_point }}</span
                        ><img v-if="item.reward_gem != '0'" src="@/assets/img/Gem/points2.png" alt="" />
                        <span v-if="item.reward_gem != '0'" class="count2">+{{ item.reward_gem }}</span>
                    </div>
                </div>
                <div class="go" v-if="item.status == 0" @click="clickEvents(item.id)">
                    {{ $t("points.text4") }}
                </div>
                <div
                    class="claim"
                    v-if="item.id == 2 && item.status == 1"
                    @click="claimPoint(item.id, item.reward_supe_point, item.reward_gem)"
                >
                    {{ $t("points.text4_1") }}
                </div>
                <div class="done" v-if="item.status == 2">
                    {{ $t("points.text4_2") }}
                </div>
            </div>

            <!-- Refer Task -->
            <div class="get-gem">{{ $t("points.text6") }}</div>
            <div class="list-li invest" v-for="(item, index) in referList" :key="index">
                <div class="top">
                    <img class="task1" :src="item.iconAdd" alt="" />
                    <div class="li-c">
                        <p class="text">{{ item.name }} ({{ item.progress }}/{{ item.goal == 0 ? "∞" : item.goal }})</p>
                        <div class="points-b">
                            <img v-if="item.reward_supe_point != '0'" src="@/assets/img/Gem/points1.png" alt="" />
                            <span v-if="item.reward_supe_point != '0'" class="count1">+{{ item.reward_supe_point }}</span
                            ><img v-if="item.reward_gem != '0'" src="@/assets/img/Gem/points2.png" alt="" />
                            <span v-if="item.reward_gem != '0'" class="count2">+{{ item.reward_gem }}</span>
                            <p>{{ $t("points.text8") }}</p>
                        </div>
                    </div>
                    <!-- <div class="go" v-if="item.status == 0">
                        {{ $t("points.text4") }}
                    </div>
                    <div class="claim" v-if="item.status == 1">
                        {{ $t("points.text4_1") }}
                    </div>
                    <div class="done" v-if="item.status == 2">
                        {{ $t("points.text4_2") }}
                    </div> -->
                </div>
                <div class="bottom-wrap">
                    <div class="sanjiao">{{ $t("points.text9") }}</div>
                    <div class="bottom">
                        <p>{{ url }}</p>
                        <div @click="copyUrl()">{{ $t("points.text10") }}</div>
                    </div>
                </div>
            </div>

            <!-- Advanced Task -->
            <div class="get-gem">{{ $t("points.text11") }}</div>
            <div class="list-li" v-for="(item, index) in advancedList" :key="index">
                <img class="task1" :src="item.iconAdd" alt="" />
                <div class="li-c">
                    <p class="text">{{ item.name }}</p>
                    <!-- <p class="text">{{ item.name }} ({{ item.progress }}/{{ item.goal == 0 ? "∞" : item.goal }})</p> -->
                    <div class="points-b">
                        <img v-if="item.reward_supe_point != '0'" src="@/assets/img/Gem/points1.png" alt="" />
                        <span v-if="item.reward_supe_point != '0'" class="count1">+{{ item.reward_supe_point }}</span
                        ><img v-if="item.reward_gem != '0'" src="@/assets/img/Gem/points2.png" alt="" />
                        <span v-if="item.reward_gem != '0'" class="count2">+{{ item.reward_gem }}</span>
                    </div>
                </div>
                <div class="go" v-if="item.status == 0" @click="pushChat(item.id)">
                    {{ $t("points.text4") }}
                </div>
                <div class="claim" v-if="item.status == 1" @click="claimPoint(item.id, item.reward_supe_point, item.reward_gem)">
                    {{ $t("points.text4_1") }}
                </div>
                <div class="done" v-if="item.status == 2">
                    {{ $t("points.text4_2") }}
                </div>
            </div>

            <!-- Social Media Task -->
            <div class="get-gem">{{ $t("points.text15") }}</div>
            <div class="list-li" v-for="(item, index) in socialList" :key="index" @click="goBrowser(item, 2)">
                <img class="task1" :src="item.iconAdd" alt="" />
                <div class="li-c">
                    <p class="text">{{ item.name }}</p>
                    <div class="points-b">
                        <img v-if="item.reward_supe_point != '0'" src="@/assets/img/Gem/points1.png" alt="" />
                        <span v-if="item.reward_supe_point != '0'" class="count1">+{{ item.reward_supe_point }}</span
                        ><img v-if="item.reward_gem != '0'" src="@/assets/img/Gem/points2.png" alt="" />
                        <span v-if="item.reward_gem != '0'" class="count2">+{{ item.reward_gem }}</span>
                    </div>
                </div>
                <div class="go" v-if="item.status == 0 && !item.isFollowed" @click.stop="goBrowser(item, 1)">
                    {{ $t("points.text4") }}
                </div>
                <div
                    class="claim"
                    v-if="item.isFollowed && item.status != 2"
                    @click="claimPoint(item.id, item.reward_supe_point, item.reward_gem)"
                >
                    {{ $t("points.text4_1") }}
                </div>
                <div class="done1" v-if="item.status == 2">
                    <img src="@/assets/img/Gem/right3.png" alt="" />
                </div>
            </div>
            <p class="text3" v-if="isAgent == true">The in-app activity is not associated with Apple Inc.</p>
        </section>
        <PointsDialog ref="pointsDialogRefs" />
    </div>
</template>

<script setup>
import PointsDialog from "@/components/PointsDialog/index.vue";
import Header1 from "@/components/Header1/index.vue";
import taskIcon1 from "@/assets/img/Gem/task1.png";
import taskIcon2 from "@/assets/img/Gem/task2.png";
import taskIcon3 from "@/assets/img/Gem/task3.png";
import taskIcon4 from "@/assets/img/Gem/task4.png";
import taskIcon5 from "@/assets/img/Gem/task5.png";
import taskIcon6 from "@/assets/img/Gem/task6.png";
import taskIcon7 from "@/assets/img/Gem/task7.png";
import { computed, ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
// import Loading from "@/components/Loading";
import { copyText1 } from "@/utils";
import {
    appShowLoading,
    appHiddenLoading,
    appDailyReward,
    appPushChatList,
    appOpenBrowser,
    appDismiss,
    appToast,
} from "@/utils/webview";
const { $Toast, $store, $api, $jsBridge } = getCurrentInstance().proxy;
const totalPoints = ref("0");
const type = ref("");
const pointsDialogRefs = ref(null);
// const socialListVx = computed(() => $store.state.socialListVx);
const isFollowed = computed(() => $store.state.isFollowed);
const isDiscorded = computed(() => $store.state.isDiscorded);
const url = ref("");
const dailyList = ref([]);
const referList = ref([]);
const advancedList = ref([]);
const socialList = ref([]);
const isAgent = ref(true);
onMounted(() => {
    let userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        isAgent.value = true;
    } else if (/Android/i.test(userAgent)) {
        isAgent.value = false;
    }
    appShowLoading();
    getTaskList();
    $jsBridge.JAMS__H5AppDailySuccess(dailySuccess);
});
onUnmounted(() => {});
//复制粘贴下载地址
const copyUrl = () => {
    copyText1(url.value, 1);
};
//跳转到兑换
// const exchange = () => {
//     $router.push("/exchange");
// };
//签到成功回调
const dailySuccess = () => {
    getTaskList();
};
//获取列表
const getTaskList = () => {
    $api.getTaskList({})
        .then((res) => {
            appHiddenLoading();
            if (!res.error_code) {
                url.value = `${process.env.VUE_APP_INTERFACE_UTL}/home?inviteCode=${res.common.invite_info.invite_code}`;
                dailyList.value = [...res.data.daily];
                dailyList.value.map((item) => {
                    if (item.id == 1) {
                        item.iconAdd = taskIcon1;
                    } else if (item.id == 2) {
                        item.iconAdd = taskIcon2;
                    }
                });
                referList.value = [...res.data.refer];
                referList.value.map((item) => {
                    if (item.id == 3) {
                        item.iconAdd = taskIcon3;
                    }
                });
                advancedList.value = [...res.data.advanced];
                advancedList.value.map((item) => {
                    if (item.id == 4) {
                        item.iconAdd = taskIcon4;
                    } else if (item.id == 5) {
                        item.iconAdd = taskIcon5;
                    }
                });
                socialList.value = [...res.data.social];
                socialList.value.map((item) => {
                    if (item.id == 6) {
                        item.iconAdd = taskIcon6;
                        if (isFollowed.value == true) {
                            item.isFollowed = true;
                        } else {
                            item.isFollowed = false;
                        }
                    } else if (item.id == 7) {
                        item.iconAdd = taskIcon7;
                        if (isDiscorded.value == true) {
                            item.isFollowed = true;
                        } else {
                            item.isFollowed = false;
                        }
                    }
                });
                // $store.commit("updateSocialListVx", socialList);
                totalPoints.value = res.common.user_info.supe_point;
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
//daily task点击事件
const clickEvents = (val) => {
    if (val == 1) {
        appDailyReward();
    } else if (val == 2) {
        appPushChatList();
    }
};
//跳转原生chat页面
const pushChat = (val) => {
    if (val == 4) {
        appDismiss();
    } else if (val == 5) {
        appPushChatList();
    }
};
//领取积分
const claimPoint = (val, point, gem) => {
    let params = {
        id: val,
    };
    $api.taskClaim(params)
        .then((res) => {
            if (!res.error_code) {
                let text = `Claim success Get ${point} Points & ${gem} Gems`;
                appToast(text);
                setTimeout(() => {
                    getTaskList();
                }, 500);
                // $Toast({
                //     type: "success",
                //     message: `Claim success Get ${point} Points & ${gem} Gems`,
                // });
            } else {
                $Toast({
                    type: "fail",
                    message: this.$t("errorHandleText." + [res.error_code]),
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
//跳转到浏览器关注
const goBrowser = (val, type) => {
    console.log(val.status);
    if (val.status == 2 || type == 1) {
        const selectedItem = socialList.value.find((item) => item.id === val.id);
        if (selectedItem) {
            if (val.id == 6) {
                const url = "https://twitter.com/ai_supe_darling";
                appOpenBrowser(url);
                setTimeout(() => {
                    selectedItem.isFollowed = true;
                    $store.commit("updateFollowT", true);
                }, 500);
            } else if (val.id == 7) {
                const dis = "https://discord.gg/pNZr8A3kaD";
                appOpenBrowser(dis);
                setTimeout(() => {
                    $store.commit("updateJoinD", true);
                    selectedItem.isFollowed = true;
                }, 500);
            }
        }
    } else {
        console.log("1111");
    }
};
//显示积分规则弹窗
const showPoints = () => {
    pointsDialogRefs.value.getFlag(true);
};
</script>
<style scoped lang="less">
@import "../../styles/mixin.less";
.points-index {
    flex: 1 1 100%;
    // min-width: 1440px;
    display: flex;
    flex-direction: column;
    section {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        // background: #161820;
        background: var(--bg-chat-primary);
        padding: 0.57rem 0.12rem;
        box-sizing: border-box;
        .gem {
            width: 100%;
            height: 0.82rem;
            background: var(---, linear-gradient(270deg, #55f 0%, #66f 100%));
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
                    display: flex;
                    align-items: center;
                    & > img {
                        width: 0.14rem;
                        height: 0.14rem;
                        margin-left: 0.05rem;
                    }
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
                background: url("@/assets/img/Gem/points.png") no-repeat center;
                background-size: cover;
                position: absolute;
                right: 0;
                bottom: 0;
                border-bottom-right-radius: 0.12rem;
            }
            .exchange {
                z-index: 99;
                width: 0.92rem;
                height: 0.33rem;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 0.33rem;
                border: 1px solid #fff;
                color: #fff;
                text-align: center;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 0.33rem;
            }
        }
        .get-gem {
            margin-top: 0.12rem;
            width: 100%;
            height: 0.52rem;
            line-height: 0.52rem;
            padding: 0 0.1rem;
            box-sizing: border-box;
            font-size: 0.16rem;
            color: #707988;
            font-weight: bold;
            text-align: left;
            .mixin-SF-medium;
        }
        .list-li {
            width: 100%;
            height: 0.76rem;
            border-radius: 12px;
            // background: var(--2, #1f212b);
            background: var(--bg-input-box);
            margin-top: 0.08rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.12rem;
            box-sizing: border-box;
            .mixin-SF-medium;
            .task1 {
                width: 0.44rem;
                height: 0.44rem;
            }
            .li-c {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                padding: 0.12rem;
                box-sizing: border-box;
                .text {
                    font-size: 0.16rem;
                    font-weight: bold;
                    color: #ffffff;
                    margin-bottom: 0.05rem;
                    text-align: left;
                }
                .points-b {
                    display: flex;
                    align-items: center;
                    & > img {
                        width: 0.16rem;
                        height: 0.16rem;
                        margin-right: 0.03rem;
                    }
                    .count1 {
                        font-size: 0.12rem;
                        font-weight: bold;
                        color: var(---, #4098ff);
                        font-family: "DIN";
                        margin-right: 0.11rem;
                    }
                    .count2 {
                        font-family: "DIN";
                        font-size: 0.12rem;
                        font-weight: bold;
                        color: var(---, #ffd961);
                    }
                }
            }
            .go {
                width: 0.67rem;
                height: 0.32rem;
                line-height: 0.32rem;
                border-radius: 22px;
                background: var(---, linear-gradient(270deg, #55f 0%, #66f 100%));
                font-size: 0.14rem;
                font-weight: bold;
                color: #ffffff;
            }
            .claim {
                width: 0.67rem;
                height: 0.32rem;
                line-height: 0.32rem;
                border-radius: 22px;
                background: var(---, linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%));
                font-size: 0.14rem;
                font-weight: bold;
                color: #ffffff;
            }
            .done {
                width: 0.67rem;
                height: 0.32rem;
                line-height: 0.32rem;
                border-radius: 22px;
                // background: #2a2d39;
                background: var(--bg-primary1);
                font-size: 0.14rem;
                font-weight: bold;
                color: #707988;
            }
            .done1 {
                width: 0.2rem;
                height: 0.2rem;
                line-height: 0.32rem;
                border-radius: 22px;
                // background: #2a2d39;
                font-size: 0.14rem;
                font-weight: bold;
                color: #707988;
                & > img {
                    width: 0.2rem;
                    height: 0.2rem;
                }
            }
        }
        .text3 {
            font-weight: bold;
            margin-top: 0.2rem;
            color: #ffd961;
            font-size: 0.14rem;
            text-align: center;
        }
        .invest {
            height: 1.8rem;
            flex-direction: column;
            padding: 0.12rem;
            box-sizing: border-box;
            .top {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .task1 {
                    width: 0.44rem;
                    height: 0.44rem;
                }
                .li-c {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    padding: 0.12rem;
                    box-sizing: border-box;
                    .text {
                        font-size: 0.16rem;
                        font-weight: bold;
                        color: #ffffff;
                        margin-bottom: 0.05rem;
                    }
                    .points-b {
                        display: flex;
                        align-items: center;
                        & > img {
                            width: 0.16rem;
                            height: 0.16rem;
                            margin-right: 0.03rem;
                        }
                        .count1 {
                            font-size: 0.12rem;
                            font-weight: bold;
                            color: var(---, #4098ff);
                            font-family: "DIN";
                            margin-right: 0.11rem;
                        }
                        .count2 {
                            font-family: "DIN";
                            font-size: 0.12rem;
                            font-weight: bold;
                            color: var(---, #ffd961);
                        }
                        & > p {
                            margin-left: 0.15rem;
                            font-size: 0.14rem;
                            color: var(--5-, #b2b9c6);
                        }
                    }
                }
                .go {
                    width: 0.67rem;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    border-radius: 22px;
                    background: var(---, linear-gradient(270deg, #55f 0%, #66f 100%));
                    font-size: 0.14rem;
                    font-weight: bold;
                    color: #ffffff;
                }
                .claim {
                    width: 0.67rem;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    border-radius: 22px;
                    background: var(---, linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%));
                    font-size: 0.14rem;
                    font-weight: bold;
                    color: #ffffff;
                }
                .done {
                    width: 0.67rem;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    border-radius: 22px;
                    // background: #2a2d39;
                    background: var(--bg-primary1);
                    font-size: 0.14rem;
                    font-weight: bold;
                    color: #707988;
                }
            }
            .bottom-wrap {
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 2;
                margin-top: 0.3rem;
                .sanjiao {
                    background-image: url("@/assets/img/Gem/sanjiao.png");
                    background-size: cover;
                    width: 1.07rem;
                    height: 0.52rem;
                    position: absolute;
                    left: 0;
                    top: -0.26rem;
                    z-index: -1;
                    font-size: 0.12rem;
                    color: rgba(255, 255, 255, 0.35);
                    text-align: left;
                    line-height: 0.25rem;
                    padding-left: 0.07rem;
                    box-sizing: border-box;
                }
                .bottom {
                    width: 100%;
                    height: 0.52rem;
                    border-radius: 12px;
                    // background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                    background: var(--bg-btn-body-action-send);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 0.12rem;
                    box-sizing: border-box;
                    & > p {
                        flex: 3;
                        font-size: 0.16rem;
                        color: #fff;
                        white-space: nowrap; /* 防止文本换行 */
                        overflow: hidden; /* 隐藏超出部分 */
                        text-overflow: ellipsis; /* 显示省略号 */
                    }
                    & > div {
                        width: 0.8rem;
                        height: 0.32rem;
                        line-height: 0.32rem;
                        border-radius: 8px;
                        background: var(---, #fff);
                        font-size: 0.14rem;
                        color: var(--1-, #161820);
                    }
                }
            }
        }
    }
}
</style>
