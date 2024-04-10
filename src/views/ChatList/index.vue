<template>
    <div class="chat-list-index">
        <Header>
            <template v-slot:chatListHeader>
                <div class="header-main">
                    <div class="l">{{ $t("chatList.text1") }}</div>
                    <div class="r" v-if="!aiChatExtInfo.is_cvip || !aiChatExtInfo.is_vvip" @click="goToVip()">
                        <img class="icon" :src="aiChatExtInfo.is_cvip ? vvip : cvip" alt="" />
                        <span :class="[aiChatExtInfo.is_cvip ? 'vvip' : 'cvip']">{{ $t("chatList.text2") }}</span>
                    </div>
                </div>
            </template>
        </Header>
        <section>
            <ul>
                <li v-for="item in girlFriendList" :key="item.gid" @click="goToChat(item.gid)">
                    <AvatarComp
                        class="avatar"
                        :avatarInfo="{
                            round: 'round',
                            iconSize: 25,
                            src: item.character.avatar,
                        }"
                    />
                    <div class="chat-text">
                        <div class="div">
                            <p class="name single-line-ellipsis">{{ item.character.name }}</p>
                            <span class="time" v-if="item.created_at">
                                {{ chatFormat(item.created_at) }}
                            </span>
                        </div>
                        <div class="div">
                            <p class="text single-line-ellipsis">
                                {{
                                    item.cmd_type == 1
                                        ? "[Photo]"
                                        : item.cmd_type == 2
                                        ? "[Video]"
                                        : item.cdm_type == 3
                                        ? "[Audio]"
                                        : item.content
                                }}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance, onBeforeUnmount } from "vue";
import { chatFormat, setCookie } from "@/utils";
import { appChatUrlInfo, appHiddenLoading } from "@/utils/webview";
import Header from "@/components/Header";
import AvatarComp from "@/components/Chat/avatar.vue";
import cvip from "../../assets/img/Header/cvip.png";
import vvip from "../../assets/img/Header/vvip.png";
const { $Toast, $api, $store, $jsBridge } = getCurrentInstance().proxy;

const girlFriendList = ref([]);
const aiChatExtInfo = computed(() => $store.state.aiChatExtInfo);

getAiChatRoleListFun();
onMounted(() => {
    $jsBridge.JAMS__H5AppViewRefresh(appViewRefreshHandler);
    $jsBridge.JAMS__H5AppViewWillAppear(appViewWillAppearHandler);
});
function appViewRefreshHandler(message) {
    const parseMessage = JSON.parse(message);
    setCookie("access_secret", parseMessage.secret);
    setCookie("access_token", parseMessage.token);
}

function appViewWillAppearHandler() {
    getAiChatRoleListFun();
}

function getAiChatRoleListFun() {
    $api.getAiBotChatList({})
        .then((res) => {
            appHiddenLoading();
            if (!res.error_code) {
                const common = res.common;
                $store.commit("updateAiChatUserInfo", common.user_info);
                $store.commit("updateAiChatExtInfo", common.ext_info);
                const data = res.data.list;
                girlFriendList.value = data;
            } else {
                $Toast({
                    message: res.message,
                });
            }
        })
        .catch(() => {
            appHiddenLoading();
        });
}

function goToChat(gid) {
    appChatUrlInfo(process.env.VUE_APP_GO_TO_URL + "chat?gid=" + gid);
}

function goToVip() {
    const isVip = aiChatExtInfo.value.is_cvip ? "vvip" : "cvip";
    appChatUrlInfo(process.env.VUE_APP_GO_TO_URL + "buy-vip?gid=0&vip=" + isVip);
}

onBeforeUnmount(() => {
    $jsBridge.JAMS__H5AppViewRefresh(null);
    $jsBridge.JAMS__H5AppViewWillAppear(null);
});
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.chat-list-index {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background: #161820; //发布正式时注释掉！！！！！！！
    scrollbar-width: thin !important;
    scrollbar-color: transparent !important;
    ::-webkit-scrollbar,
    ::-webkit-scrollbar-thumb {
        width: 0;
        background-color: transparent;
    }
    .header-main {
        flex: 1;
        height: 0.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0 0.16rem;
        box-sizing: border-box;
        .l {
            font-size: 0.26rem;
            color: #fff;
            font-weight: 800;
            .mixin-SF-bold;
        }
        .r {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.16rem;
            min-width: 0.73rem;
            height: 0.28rem;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0.14rem 0 0 0.14rem;
            padding: 0 0.08rem;
            box-sizing: border-box;
            .icon {
                width: 0.2rem;
                height: auto;
                flex-shrink: 0;
            }
            span {
                font-size: 0.14rem;
                margin-left: 0.05rem;
                color: #ffd961;
                font-weight: 500;
                .mixin-SF-medium;
            }
            .cvip {
                color: #ffc89e;
            }
            .vvip {
                color: #99c5ff;
            }
        }
    }
    section {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        padding: 0.12rem 0.12rem 0.3rem;
        box-sizing: border-box;
        ul {
            width: 100%;
            display: flex;
            flex-direction: column;
            li {
                flex: 1 0 0%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 0.12rem;
                background: rgba(106, 119, 141, 0.06);
                padding: 0.12rem;
                box-sizing: border-box;
                margin-bottom: 0.08rem;
                &:last-child {
                    margin-bottom: 0;
                }
                .avatar {
                    width: 0.52rem;
                    height: 0.52rem;
                    margin-right: 0.12rem;
                }
                .chat-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                    overflow: hidden;
                    .div {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        &:last-child {
                            margin-top: 0.08rem;
                        }
                        .name {
                            font-size: 0.16rem;
                            font-weight: 500;
                            color: #fff;
                        }
                        .text {
                            font-size: 0.12rem;
                            line-height: 0.14rem;
                            font-weight: 400;
                            color: #707988;
                        }
                        span {
                            max-width: 1.2rem;
                            margin-left: 0.2rem;
                        }
                        .time {
                            font-size: 0.12rem;
                            line-height: 0.14rem;
                            font-weight: 400;
                            color: #707988;
                        }
                        .unread {
                            margin-top: 0.08rem;
                            font-size: 0.12rem;
                            border-radius: 0.16rem;
                            padding: 0.02rem 0.05rem;
                            box-sizing: border-box;
                            background-color: #ff4d70;
                            font-weight: 500;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>
