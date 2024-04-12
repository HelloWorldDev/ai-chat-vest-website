<template>
    <div class="chat-index">
        <Header>
            <template v-slot:chatHeader>
                <div class="header-main">
                    <div class="l" @click="goToBack()">
                        <svg-icon icon-class="icon-left" class="icon-left" />
                    </div>
                    <div class="c">
                        <p class="single-line-ellipsis">{{ girlFriendInfo.name }}</p>
                        <img class="icon-vip" v-if="aiChatExtInfo.is_cvip" src="../../assets/img/Header/cvip.png" alt="" />
                        <img class="icon-vip" v-if="aiChatExtInfo.is_vvip" src="../../assets/img/Header/vvip.png" alt="" />
                    </div>
                    <div class="r" @click="showSounds()">
                        <svg-icon icon-class="icon-audio" class="icon" />
                    </div>
                </div>
            </template>
        </Header>
        <section
            :style="{
                background: aiChatGFInfoBg
                    ? `linear-gradient(to top,rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 0.7) 15% ,rgba(0, 0, 0, 0.5) 20%,rgba(0, 0, 0, 0.5) 100%),url(${aiChatGFInfoBg}) no-repeat top center/cover`
                    : 'none',
            }"
        >
            <div class="chat-box-main" ref="chatBoxRefs">
                <audio class="audio-dom" ref="myselfAudioRefs"></audio>
                <VanConfigProvider class="my-chat-MyVanConfigProvider">
                    <van-pull-refresh
                        v-model="refreshing"
                        :pulling-text="$t('public.refresh.text1')"
                        :loosing-text="$t('public.refresh.text2')"
                        :loading-text="$t('public.refresh.text3')"
                        :success-text="refreshingComplate ? $t('public.refresh.text5') : $t('public.refresh.text4')"
                        @refresh="onRefresh"
                    >
                        <div class="chat-box-page">
                            <div v-for="message in chatMessages" :key="message.id" class="message">
                                <p class="message-item-time" v-if="message.group_id">{{ chatFormat(message.group_id) }}</p>

                                <div :class="['message-item', 'sender_' + message.owner_type]">
                                    <AvatarComp
                                        class="avatar"
                                        :avatarInfo="{
                                            round: 'round',
                                            iconSize: 20,
                                            src: message.owner_type ? girlFriendInfo.avatar : aiChatUserInfo.avatar,
                                            alt: 'sender_' + message.owner_type,
                                        }"
                                    />
                                    <div class="msg">
                                        <svg-icon
                                            icon-class="icon-chat-arrow"
                                            class="icon-msg-arrow"
                                            v-if="
                                                !message.owner_type ||
                                                (message.owner_type && message.cmd_type == 0) ||
                                                (message.owner_type && message.cmd_type == 3)
                                            "
                                        />
                                        <div
                                            class="audio-msg"
                                            v-if="message.owner_type && (message.cmd_type == 0 || message.cmd_type == 3)"
                                            :style="{ marginBottom: message.cmd_type == 0 ? '.04rem' : '0' }"
                                            @click="
                                                message.iosType && currentAudioMessage.id == message.id
                                                    ? onAudioPlay(message)
                                                    : playAudioHandler(message)
                                            "
                                        >
                                            <div
                                                :class="[
                                                    'icon-play',
                                                    {
                                                        'loader-play':
                                                            message.isPlayAudio == 1 && currentAudioMessage.id == message.id,
                                                    },
                                                ]"
                                            >
                                                <span class="loader-62"></span>
                                                <span class="loader-62 loader-63"></span>
                                            </div>
                                            <div class="playAudioLoading">
                                                <van-loading size="18" v-if="message.isPlayAudioLoading" />
                                                <template v-else>
                                                    <b v-if="message.isPlayError && currentAudioMessage.id == message.id">
                                                        {{ $t("chat.text1") }}
                                                    </b>
                                                    <b v-else-if="message.iosType && currentAudioMessage.id == message.id">
                                                        {{ $t("chat.text2") }}
                                                    </b>
                                                    <b
                                                        v-else-if="
                                                            message.isPlayAudio == 2 && currentAudioMessage.id == message.id
                                                        "
                                                    >
                                                        {{ $t("chat.text3") }}
                                                    </b>
                                                    <span v-if="message.timeCount">
                                                        {{ formatAudieDuration(message.timeCount) }}
                                                    </span>
                                                </template>
                                            </div>
                                            <i v-if="!message.audio_readable"></i>
                                        </div>
                                        <div
                                            class="text-msg"
                                            v-if="(message.owner_type && message.cmd_type == 0) || !message.owner_type"
                                        >
                                            <template v-if="message.owner_type">
                                                <p
                                                    :class="['word-break-word2 preserve-whitespace', 'text-' + item.type]"
                                                    v-for="item in formatText(message)"
                                                    :key="message.id + '_' + item.id"
                                                >
                                                    {{ item.text }}
                                                </p>
                                            </template>
                                            <p v-else class="word-break-word2 preserve-whitespace">
                                                {{ message.content }}
                                            </p>
                                        </div>
                                        <div
                                            class="photo-video-msg"
                                            v-if="message.owner_type && (message.cmd_type == 1 || message.cmd_type == 2)"
                                        >
                                            <UnlockImageVideoComp
                                                :chatMessage="
                                                    !message.unlock_status && message.id == aiChatUnlockResult.id
                                                        ? aiChatUnlockResultFun(aiChatUnlockResult, message)
                                                        : message
                                                "
                                                @sendToParent="unlockImageVideoComFromChild"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-pull-refresh>
                </VanConfigProvider>
            </div>
            <div class="other-page">
                <BodyActionComp
                    v-if="bodyActionList.length > 0"
                    :bodyActionList="bodyActionList"
                    @sendToParent="bodyActionCompFromChild"
                />
                <div class="input-box">
                    <div :class="['bg', checked18 ? 'activeColor' : 'inactiveColor']">
                        <VanConfigProvider :themeVars="themeVars">
                            <van-switch
                                :class="['my-van-switch', { justifyContentEnd: !checked18 }]"
                                :model-value="checked18"
                                @update:model-value="onVanSwitchUpdate"
                                size="32"
                                active-color="#00CB5D"
                            >
                                <template #background>
                                    <div class="text">
                                        <span>18+</span>
                                        <span>NSFW</span>
                                    </div>
                                </template>
                            </van-switch>
                        </VanConfigProvider>
                    </div>
                    <van-form class="my-van-form" @submit="onSubmit" @failed="onFailed">
                        <van-cell-group>
                            <van-field
                                v-model="chatText"
                                name="chat"
                                ref="chatInputRefs"
                                :placeholder="$t('chat.text15')"
                                maxlength="150"
                                :border="false"
                                :rules="[{ trigger: onSubmit, validator: checkEmptyInput }]"
                            >
                                <template #button v-if="chatText ? true : false">
                                    <van-button size="small" type="primary" native-type="submit">
                                        <svg-icon icon-class="icon-send" class="icon" @click="onSubmit" />
                                    </van-button>
                                </template>
                            </van-field>
                        </van-cell-group>
                    </van-form>
                </div>
            </div>
        </section>
        <ImagePreviewComp ref="imagePreviewCompRefs" />
        <UnlockVipCom ref="unlockVipComRefs" @sendToParent="unlockVipComFromChild" />
        <UnlockCoinCom ref="unlockCoinComRefs" @sendToParent="unlockCoinComFromChild" />
        <FreeLimitCom ref="freeLimitComRefs" @sendToParent="freeLimitComFromChild" />
        <ShowSoundsDialog :isShowSounds="isShowSounds" @closeshowSounds="closeshowSounds" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, getCurrentInstance, onBeforeUnmount } from "vue";
import VanConfigProvider from "@/components/VanConfigProvider";
import { chatFormat, formatAudieDuration } from "@/utils";
import { getVoiceDuration } from "@/utils/textTospeech";
import { appGoback, appHiddenLoading, appChatUrlInfo } from "@/utils/webview";
import Header from "@/components/Header";
import AvatarComp from "@/components/Chat/avatar.vue";
import BodyActionComp from "@/components/Chat/body-action";
import UnlockImageVideoComp from "@/components/Chat/unlock-image-video";
import ShowSoundsDialog from "@/components/ShowSoundsDialog";
// 弹窗
import ImagePreviewComp from "@/components/Chat/image-preview";
import UnlockVipCom from "@/components/ChatDialog/unlock-vip";
import UnlockCoinCom from "@/components/ChatDialog/unlock-coin";
import FreeLimitCom from "@/components/ChatDialog/free-limit";
import useUnlockTask from "@/hooks/useUnlockTask.js";

const { $route, $store, $t, $api, $Toast, $jsBridge } = getCurrentInstance().proxy;
const myselfAudioRefs = ref(null);
const gid = ref(0);
// 列表带来的女友信息
const girlFriendInfo = ref({});
// 聊天框实时下移
const chatBoxRefs = ref(null);
// body数组
const bodyActionList = ref([]);
// 语音条
const currentAudioMessage = ref({});
const oldAudioMessage = ref({});
// 18+开启按钮配置
const themeVars = ref({
    switchWidth: "calc(77px + 4px)",
    switchHeight: "calc(32px + 4px)",
});
// 聊天框输入内容
const chatText = ref("");
// 维护一个最后的聊天时间
const lastChatTime = ref(0);
// 聊天记录
const chatMessages = ref([]);
// 聊天条数，五条之后结束
const chatTotal = ref(0);
const chatTotalTs = ref(0);
//是否等待ai 响应中
const myChatStatus = ref(0);
// 输入框ref
const chatInputRefs = ref(null);
// 轮询
let timer = null;
// 下拉历史记录
const refreshing = ref(false);
const refreshingComplate = ref(false);
const pageObj = ref({
    pageSize: 20,
    start_id: 0,
    min_id: 0,
});
// 记录上次滚动高度
const scrollH = ref(0);
// 声音类型弹窗
const isShowSounds = ref(false);

// 预览组件
const imagePreviewCompRefs = ref(null);
const unlockVipComRefs = ref(null);
const unlockCoinComRefs = ref(null);
const freeLimitComRefs = ref(null);

// 免费聊10条
const pay_type = ref(0); //1付费  0免费
const chat_free_send_max = ref(0);
const chat_send_count = ref(0);
const chat_free_audio_max = ref(0);
const chat_audio_read_count = ref(0);

const aiChatExtInfo = computed(() => $store.state.aiChatExtInfo);
const aiChatUserInfo = computed(() => $store.state.aiChatUserInfo);
const aiChatGFInfo = computed(() => $store.state.aiChatGFInfo);
const aiChatUnlockResult = computed(() => $store.state.aiChatUnlockResult);
const aiChatGFInfoBg = computed(() => aiChatGFInfo.value.bg);
// 18+开关
const checked18 = computed(() => {
    if (aiChatExtInfo.value.is_vvip) {
        return aiChatGFInfo.value.plus18 ? true : false;
    } else {
        return false;
    }
});
const voiceType = computed(() => $store.state.voiceType);

gid.value = $route.query.gid;
onMounted(() => {
    // 获取 GF Info
    getAiBotChatEnter(gid.value);
    //商品购买成功
    $jsBridge.JAMS__H5BuySuccess(buySuccessHandler);
    $jsBridge.JAMS__H5ChatWatchBuyVipSuccess(buySuccessHandler);
    //商品购买失败
    $jsBridge.JAMS__H5BuyFail(buyFailHandler);
    $jsBridge.JAMS__H5ChatWatchBuyVipFail(buyFailHandler);
});

function aiChatUnlockResultFun(newMessage, message) {
    message.content = newMessage.content;
    message.unlock_status = newMessage.unlock_status;
    message.content_cover = newMessage.content_cover;
    return message;
}

function getAiBotChatEnter(gid) {
    $store
        .dispatch("store_getAiBotChatEnter", { gid })
        .then((res) => {
            if (!res.error_code) {
                setTimeout(() => {
                    appHiddenLoading();
                    useUnlockTask($t, $Toast, res.data, false);
                }, 900);
                girlFriendInfo.value = res.data.character;
                bodyActionList.value = res.data.action_list;
                lastChatTime.value = girlFriendInfo.value.created_at;
                // 免费用户存储条数
                pay_type.value = res.data.pay_type;
                chat_free_send_max.value = res.data.chat_free_send_max;
                chat_send_count.value = res.data.chat_send_count;
                chat_free_audio_max.value = res.data.chat_free_audio_max;
                chat_audio_read_count.value = res.data.chat_audio_read_count;
                // 一进页面拿记录
                onRefresh(1);
            } else {
                appHiddenLoading();
                $Toast({ message: res.error_code + " " + res.message });
            }
        })
        .catch(() => {
            appHiddenLoading();
        });
}

const onSubmit = (value, type) => {
    // content type
    let cmd_type = "";
    // 点击默认展示动作list,回出固定格式。
    if (type === "default") {
        if (value.title === "video") {
            $Toast({ message: $t("chat.text16") });
            return;
        } else {
            cmd_type = value.title === "photo" ? 1 : value.title === "video" ? 2 : value.title === "audio" ? 3 : 0;
            chatText.value = $t(`bodyActionListText.action_${value.title}`, {
                myName: aiChatUserInfo.value.nick_name,
                gfName: girlFriendInfo.value.name,
                parts: value.bodyPartsName,
            });
        }
    } else if (type === "first") {
        chatText.value = value;
        cmd_type = 0;
    } else {
        cmd_type = 0;
    }
    // 如果免费角色只能聊10次，如果付费角色并且开了vip的可以无限畅聊
    if (
        !pay_type.value &&
        !aiChatExtInfo.value.is_cvip &&
        !aiChatExtInfo.value.is_vvip &&
        chat_send_count.value >= chat_free_send_max.value
    ) {
        freeLimitComRefs.value.getFlag({
            type: true,
            chat_free_send_max: chat_free_send_max.value,
            chat_send_count: chat_send_count.value,
        });
    } else {
        if (chatText.value) {
            // 回答时间
            let currentTime = 0;
            if (lastChatTime.value > 0) {
                var c_t = Date.parse(new Date()) / 1000;
                if (c_t - lastChatTime.value > 300) {
                    currentTime = Date.parse(new Date()) / 1000;
                } else {
                    currentTime = 0;
                }
            } else {
                currentTime = Date.parse(new Date()) / 1000;
            }
            // 维护最后聊天时间
            lastChatTime.value = Date.parse(new Date()) / 1000;
            chatMessages.value.push({
                owner_type: 0,
                cmd_type: 0,
                content: chatText.value,
                audio_readable: 0, //0未读
                group_id: currentTime,
            });
            setTimeout(() => {
                chatBoxRefs.value.scrollTop = chatBoxRefs.value.scrollHeight; //用户说话后滚动条自动滚动
            }, 0);

            if (girlFriendInfo.value.enable) {
                // 维护sid,5条新起一个
                if (chatTotal.value >= 5 || chatTotal.value <= 0) {
                    chatTotal.value = 0;
                    chatTotalTs.value = Date.parse(new Date()) / 1000;
                }
                Promise.all([
                    sendAiBotChatAsync({
                        msg: chatText.value, //自己发出去的
                        sid: aiChatUserInfo.value.id + girlFriendInfo.value.gid + chatTotalTs.value, //消息 id
                        gid: girlFriendInfo.value.gid, //gf id  gid我们自己维护的唯一id
                        cmd_type,
                        msg_type: myChatStatus.value, //0:需要调用第三方api相应，1:不需要第三方直接存储为用户消息
                        group_id: currentTime,
                    }),
                ])
                    .then((result) => {
                        const transIdData = result[0];
                        if (!transIdData.error_code) {
                            // 存储聊天次数
                            pay_type.value = transIdData.data.pay_type;
                            chat_free_send_max.value = transIdData.data.chat_free_send_max;
                            chat_send_count.value = transIdData.data.chat_send_count;
                            chat_free_audio_max.value = transIdData.data.chat_free_audio_max;
                            chat_audio_read_count.value = transIdData.data.chat_audio_read_count;
                            // 发送成功，sid条数++
                            chatTotal.value++;
                            if (transIdData.data.trans_id) {
                                // myChatStatus 等待响应中
                                myChatStatus.value = 1;
                                // 然后定时器刷新，直到刷到值停止
                                timer = setTimeout(() => {
                                    getAiBotChatAsyncQuery(transIdData.data);
                                }, 2000);
                            }
                        } else {
                            if (transIdData.error_code == 1701003) {
                                //vip到期或者金币解锁时间到期，弹出vip购买框
                                getAiBotNewEnter(gid.value);
                                goToBuyVip();
                            } else {
                                $Toast({
                                    message: transIdData.error_code + " " + transIdData.message,
                                    duration: 3000,
                                });
                            }
                        }
                    })
                    .catch(() => {});

                type == "default" || type == "first" ? sendedOnBlur() : sendedOnFocus();
            } else {
                setTimeout(() => {
                    goToBuyVip();
                }, 500);
            }
            // 输入框清空
            chatText.value = "";
        } else {
            $Toast({
                message: $t("chat.inputText.text1"),
            });
        }
    }
};
// 输入值错误或者不合规时
const onFailed = (errorInfo) => {
    console.log(errorInfo, "onFailed");
};
// 输入框正则
function checkEmptyInput(value) {
    if (value.trim() === "") {
        chatText.value = "";
        $Toast({
            message: $t("chat.inputText.text2"),
        });
        return false;
    } else if (value.length < 2) {
        $Toast({
            message: $t("chat.inputText.text3"),
        });
        return false;
    } else if (value.length > 150) {
        $Toast({
            message: $t("chat.inputText.text4"),
        });
        return false;
    }
}
// 发送消息后，直接输入框再次聚焦
const sendedOnFocus = () => {
    chatInputRefs.value.focus();
};
const sendedOnBlur = () => {
    chatInputRefs.value.blur();
};

// ai 发送消息
function sendAiBotChatAsync(params) {
    return new Promise((resolve, reject) => {
        $api.sendAiBotChatAsync(params)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
function getAiBotChatAsyncQuery(chatAsnycData) {
    $api.getAiBotChatAsyncQuery({
        trans_id: chatAsnycData.trans_id,
    })
        .then((res) => {
            if (!res.error_code) {
                const aiData = res.data;
                if (aiData.trans_status == 1) {
                    //轮询
                    timer = setTimeout(() => {
                        getAiBotChatAsyncQuery(chatAsnycData);
                    }, 2000);
                } else if (aiData.trans_status == 2) {
                    clearTimeout(timer);
                    // 轮询结束，下次可以通知调取ai
                    myChatStatus.value = 0;
                    if (Object.keys(aiData).length > 0) {
                        // 维护最后聊天时间
                        lastChatTime.value = aiData.created_at;
                        chatMessages.value.push({
                            ...aiData,
                        });
                        setTimeout(() => {
                            chatBoxRefs.value.scrollTop = chatBoxRefs.value.scrollHeight; //用户说话后滚动条自动滚动
                        }, 0);
                    }
                } else {
                    clearTimeout(timer);
                    // query失败，直接归0，不再等待。
                    myChatStatus.value = 0;
                }
            } else {
                clearTimeout(timer);
                // query失败，直接归0，不再等待。
                myChatStatus.value = 0;
                if (res.error_code === 1701003) {
                    //vip到期或者金币解锁时间到期，弹出vip购买框
                    getAiBotNewEnter(gid.value);
                    goToBuyVip();
                } else {
                    $Toast({
                        message: res.error_code + " " + res.message,
                        duration: 3000,
                    });
                }
            }
        })
        .catch(() => {
            // query失败，直接归0，不再等待。
            clearTimeout(timer);
            myChatStatus.value = 0;
        });
}

//下拉加载
const onRefresh = (type) => {
    if (type == 1 || pageObj.value.start_id > pageObj.value.min_id) {
        nextTick(() => {
            scrollH.value = chatBoxRefs.value.scrollHeight;
        });
        refreshing.value = true;
        getAiBotChatHistory(type);
    } else {
        refreshing.value = false;
        refreshingComplate.value = true;
    }
};
function getAiBotChatHistory(type) {
    $api.getAiBotChatHistory({
        gid: gid.value,
        size: pageObj.value.pageSize, //要几条聊天记录
        start_id: pageObj.value.start_id, //从哪个id开始获取
    })
        .then((res) => {
            if (!res.error_code) {
                if (res.data.list.length > 0) {
                    pageObj.value.min_id = res.data.min_id;
                    const list = res.data.list.reverse();
                    chatMessages.value.unshift(...list);
                    pageObj.value.start_id = list[0].id;

                    nextTick(() => {
                        setTimeout(() => {
                            refreshing.value = false;
                            scrollToPosition(
                                type ? chatBoxRefs.value.scrollHeight : chatBoxRefs.value.scrollHeight - scrollH.value - 20
                            );
                        }, 300);
                    });
                } else {
                    refreshing.value = false;
                }
            } else {
                refreshing.value = false;
            }
        })
        .catch(() => {
            refreshing.value = false;
        });
}
// 滚动到指定位置
function scrollToPosition(position) {
    setTimeout(() => {
        chatBoxRefs.value.scrollTop = position;
    }, 0);
}
// 判断vvip，如果是点击读语音条点击已读，并且掉azure
function playAudioHandler(message) {
    const ts = Date.parse(new Date()) / 1000;
    if (
        (!pay_type.value && chat_audio_read_count.value < chat_free_audio_max.value) ||
        (aiChatExtInfo.value.is_vvip && ts <= aiChatUserInfo.value.vvip_expire_at)
    ) {
        if (Object.keys(oldAudioMessage.value).length <= 0) {
            oldAudioMessage.value = message;
        }
        if (oldAudioMessage.value.isPlayAudioLoading) {
            return false;
        } else {
            currentAudioMessage.value = message;
            if (message.id == oldAudioMessage.value.id) {
                // 0第一次播  1正在播放   2播放暂停
                message.isPlayAudio = message.isPlayAudio ? message.isPlayAudio : 0;
            } else {
                message.isPlayAudio = 0;
                oldAudioMessage.value = message;
            }
            if (message.isPlayAudio == 1) {
                myselfAudioRefs.value.pause();
                message.isPlayAudio = 2;
            } else if (message.isPlayAudio == 2) {
                myselfAudioRefs.value.play();
                message.isPlayAudio = 1;
            } else {
                nextTick(() => {
                    myselfAudioRefs.value.src = "";
                });
                message.isPlayAudioLoading = true;
                message.isPlayError = false; //显示播放失败文字，true显示
                message.timeCount = message.timeCount || 0; //语音时长11
                if (message.voiceType === voiceType.value && message.blobUrl) {
                    nextTick(() => {
                        setTimeout(() => {
                            onAudio(message);
                        }, 500);
                    });
                } else {
                    sendAiBotChatAudioReadable(message);
                }
            }
        }
    } else {
        if (aiChatExtInfo.value.is_vvip && ts > aiChatUserInfo.value.vvip_expire_at) {
            getAiBotNewEnter(gid.value);
            goToBuyVip("vvip");
        } else {
            goToBuyVip("vvip");
        }
    }
}
// 接口标记语音已读
function sendAiBotChatAudioReadable(message) {
    if (message.audio_readable) {
        getVoiceDurationHandler(message, 1);
    } else {
        $api.sendAiBotChatAudioReadable({ id: message.id })
            .then((res) => {
                if (!res.error_code) {
                    message.audio_readable = 1;
                    chat_free_audio_max.value = res.data.chat_free_audio_max;
                    chat_audio_read_count.value = res.data.chat_audio_read_count;
                    getVoiceDurationHandler(message, 0);
                } else {
                    message.isPlayAudioLoading = false;
                    message.isPlayError = false;
                    message.timeCount = 0;
                    if (res.error_code === 1701008) {
                        // vvip过期，需要调个接口，刷新下数据
                        getAiBotNewEnter(gid.value);
                        goToBuyVip();
                    } else {
                        $Toast({
                            message: res.error_code + " " + res.message,
                        });
                    }
                }
            })
            .catch(() => {
                message.isPlayAudioLoading = false;
            });
    }
}
// 开始处理url播放
async function getVoiceDurationHandler(message, type) {
    await getVoiceDuration(type, message.content, message.id, message.uid)
        .then((res) => {
            message.blobUrl = res.blobUrl;
            message.timeCount = res.lastAudioDuration;
            message.voiceType = res.voiceType;
            onAudio(message);
        })
        .catch(() => {
            // 合成失败或下载失败
            message.isPlayError = true;
            message.isPlayAudio = 0;
            message.isPlayAudioLoading = false;
        });
}
function onAudio(message) {
    myselfAudioRefs.value.src = message.blobUrl;
    myselfAudioRefs.value.controls = true;
    myselfAudioRefs.value
        .play()
        .then(() => {
            message.isPlayAudio = 1;
            message.iosType = false;
            message.isPlayAudioLoading = false;
        })
        .catch(() => {
            message.iosType = true;
            message.isPlayAudioLoading = false;
        });
    myselfAudioRefs.value.addEventListener("pause", () => {
        message.isPlayAudio = 2;
        message.isPlayAudioLoading = false;
    });
    myselfAudioRefs.value.addEventListener("ended", () => {
        message.isPlayAudio = 0;
        message.isPlayAudioLoading = false;
    });
}
// 处理ios第一次播放
function onAudioPlay(message) {
    myselfAudioRefs.value
        .play()
        .then(() => {
            message.iosType = false;
            message.isPlayAudio = 1;
        })
        .catch(() => {
            message.iosType = false;
            message.isPlayError = true;
            message.isPlayAudio = 0;
        });
}
// 设置18+,先判断是否开启cvip,没有点击唤起购买vip,有的话就开始或者关闭
// 改版vip,18+是Premium（vvip） 的功能
function onVanSwitchUpdate(value) {
    if (aiChatExtInfo.value.is_vvip) {
        $api.sendAiBotChatPlus18Set({
            plus18: Number(value),
            gid: girlFriendInfo.value.gid,
        }).then((res) => {
            if (!res.error_code) {
                $store.commit("updateAiChatGFInfo", res.data.character);
            } else {
                if (res.error_code === 1701008) {
                    // cvip过期，需要调个接口，刷新下数据
                    getAiBotNewEnter(gid.value);
                    goToBuyVip("vvip");
                } else {
                    $Toast({
                        message: res.error_code + " " + res.message,
                    });
                }
            }
        });
    } else {
        goToBuyVip("vvip");
    }
}
// 监听动作部位组件返回数据
function bodyActionCompFromChild(message) {
    onSubmit(message, "default");
}
// 解锁图片视频组件返回数据
function unlockImageVideoComFromChild(message) {
    if (message.status == 0) {
        imagePreviewCompRefs.value.getFlag(message.data);
    } else if (message.status == 1) {
        unlockVipComRefs.value.getFlag(message.data);
    } else if (message.status == 2 || message.status == 3) {
        unlockCoinComRefs.value.getFlag(message.data);
    } else {
        $Toast({ type: "fail", message: "Wrong operation!" });
    }
}
// vip询问弹窗返回数据
function unlockVipComFromChild(message) {
    if (message.status == 1) {
        goToBuyVip();
    } else {
        unlockCoinComRefs.value.getFlag(message.data);
    }
}
// coin解锁询问弹窗返回数据
function unlockCoinComFromChild(message) {
    if (message.code === 1701008) {
        getAiBotNewEnter(gid.value);
        goToBuyVip();
    }
}
// 免费角色聊10条
function freeLimitComFromChild(message) {
    if (message.status) {
        goToBuyVip();
    }
}

// 显示声音选择组件
const showSounds = () => {
    isShowSounds.value = true;
};
const closeshowSounds = () => {
    isShowSounds.value = false;
};

function getAiBotNewEnter(gid) {
    $store.dispatch("store_getAiBotChatEnter", { gid }).then((res) => {
        if (!res.error_code) {
            girlFriendInfo.value = res.data.character;
        }
    });
}
// 监听app购买成功
function buySuccessHandler(message) {
    console.log(message, "商品购买成功====》");
    getAiBotNewEnter(gid.value);
}
function buyFailHandler(message) {
    console.log(message, "商品购买失败====》");
}

function formatText(message) {
    if (message.formatContent && message.formatContent.length > 0) {
        return message.formatContent;
    } else {
        let text = message.content;
        if (text) {
            text = text.trim();
            const regex = /(\*{1,}[^*]*\*{1,}|[^*]+)/g;
            const matches = text.match(regex);
            const arr = matches.map((match, index) => {
                if (match.startsWith("***")) {
                    return { id: index, type: 1, text: match.substring(3, match.length - 3) };
                } else if (match.startsWith("**")) {
                    return { id: index, type: 1, text: match.substring(2, match.length - 2) };
                } else if (match.startsWith("*")) {
                    return { id: index, type: 1, text: match.substring(1, match.length - 1) };
                } else {
                    return { id: index, type: 0, text: match.trim() };
                }
            });
            message.formatContent = arr;
            return arr;
        } else {
            message.formatContent = [];
            return [];
        }
    }
}

function goToBack() {
    appGoback();
}
function goToBuyVip(type) {
    const isVip = type ? type : "cvip";
    appChatUrlInfo(process.env.VUE_APP_GO_TO_URL + "buy-vip?gid=" + gid.value + "&vip=" + isVip);
}

onBeforeUnmount(() => {
    myselfAudioRefs.value = null;
    clearTimeout(timer);
    //商品购买成功
    $jsBridge.JAMS__H5BuySuccess(null);
    $jsBridge.JAMS__H5ChatWatchBuyVipSuccess(null);
    //商品购买失败
    $jsBridge.JAMS__H5BuyFail(null);
    $jsBridge.JAMS__H5ChatWatchBuyVipFail(null);
});
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.chat-index {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background: #161820;
    background: var(--bg-chat-primary);
    overflow: hidden;
    .header-main {
        flex: 1;
        height: 0.59rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.16rem;
        box-sizing: border-box;
        // border-bottom: 1px solid #1f212b;
        border-bottom: 1px solid var(--bg-input-box);
        .l,
        .r {
            display: flex;
            width: 0.32rem;
            height: 0.32rem;
            flex-shrink: 0;
        }
        .c {
            flex: 1;
            padding: 0 0.3rem;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            p {
                font-size: 0.18rem;
                font-weight: 500;
                color: #fff;
            }
            .icon-vip {
                width: 0.2rem;
                height: auto;
                flex-shrink: 0;
                margin-left: 0.04rem;
                line-height: 0;
            }
        }
    }
    section {
        flex: 1 0 0%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        transition: background-image 600ms ease-in-out;
        scrollbar-width: thin !important;
        scrollbar-color: transparent !important;
        ::-webkit-scrollbar,
        ::-webkit-scrollbar-thumb {
            width: 0 !important;
            background-color: transparent !important;
        }
        .chat-box-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            .audio-dom {
                opacity: 0;
                position: fixed;
                top: 0;
                left: -100%;
            }
            &:deep(.van-pull-refresh) {
                overflow: inherit;
            }
            .chat-box-page {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 0.12rem 0.16rem 0;
                box-sizing: border-box;
                .message {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 0.12rem;
                    .message-item-time {
                        width: auto;
                        color: rgba(255, 255, 255, 0.65);
                        background: rgba(0, 0, 0, 0.35);
                        border-radius: 0.1rem;
                        padding: 0.04rem 0.08rem;
                        box-sizing: border-box;
                        font-size: 0.12rem;
                        font-weight: 400;
                        margin-bottom: 0.2rem;
                        margin-top: 0.08rem;
                    }
                    .message-item {
                        width: 100%;
                        display: flex;
                        .avatar {
                            width: 0.4rem;
                            height: 0.4rem;
                            flex-shrink: 0;
                        }
                        .msg {
                            max-width: 68%;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            .icon-msg-arrow {
                                width: 0.08rem;
                                height: 0.12rem;
                                flex-shrink: 0;
                            }
                            .audio-msg {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                border-radius: 0.08rem;
                                position: relative;
                                width: 70%;
                                min-width: 1.1rem;
                                height: 0.4rem;
                                padding: 0 0.12rem;
                                box-sizing: border-box;
                                .icon-play {
                                    display: flex;
                                    align-items: center;
                                    .loader-62 {
                                        width: 0.02rem;
                                        height: 0.08rem;
                                        border-radius: 0.04rem;
                                        display: flex;
                                        position: relative;
                                        background: currentColor;
                                        color: #fff;
                                        &::after,
                                        &::before {
                                            content: "";
                                            width: 0.02rem;
                                            border-radius: 0.04rem;
                                            background: #fff;
                                            position: absolute;
                                            top: 50%;
                                            transform: translateY(-50%);
                                            left: 0.1rem;
                                        }
                                        &::before {
                                            height: 0.14rem;
                                            left: 0.05rem;
                                            animation-delay: 0s;
                                        }
                                        &::after {
                                            height: 0.1rem;
                                        }
                                    }
                                    .loader-63 {
                                        margin-left: 0.13rem;
                                        height: 0.12rem;
                                        &::before {
                                            height: 0.08rem;
                                        }
                                        &::after {
                                            display: none;
                                        }
                                    }
                                }
                                .loader-play {
                                    .loader-62 {
                                        animation: audioKeyframes 0.3s 0.45s linear infinite alternate;
                                        &::before,
                                        &::after {
                                            animation: audioKeyframes 0.3s 0.45s linear infinite alternate;
                                        }
                                    }
                                }
                                .playAudioLoading {
                                    display: flex;
                                    align-items: center;
                                    span {
                                        color: #fff;
                                        font-size: 0.16rem;
                                        font-weight: 400;
                                    }
                                    b {
                                        font-size: 0.12rem;
                                        color: #fff;
                                        font-weight: 400;
                                        transform: scale(0.9);
                                    }
                                }
                                i {
                                    width: 0.08rem;
                                    height: 0.08rem;
                                    border-radius: 50%;
                                    flex-shrink: 0;
                                    background-color: #ff4d70;
                                    top: 50%;
                                    transform: translate(0, -50%);
                                }
                            }
                            .text-msg {
                                display: flex;
                                flex-direction: column;
                                align-items: flex-start;
                                p {
                                    text-align: left;
                                    font-size: 0.16rem;
                                    font-weight: 400;
                                    line-height: 0.19rem;
                                    color: #ffffff;
                                    padding: 0.1rem 0.12rem;
                                    box-sizing: border-box;
                                    min-height: 0.39rem;
                                    min-width: 0.2rem;
                                    border-radius: 0.08rem;
                                    margin-bottom: 0.04rem;
                                    &:last-child {
                                        margin-bottom: 0;
                                    }
                                }
                                .text-1 {
                                    font-style: italic;
                                    color: rgba(255, 255, 255, 0.6);
                                }
                            }
                            .photo-video-msg {
                                display: flex;
                                width: 1.5rem;
                                height: 2rem;
                                border-radius: 0.08rem;
                                overflow: hidden;
                                // background-color: #2a2d39;
                                background-color: var(--bg-primary1);
                            }
                        }
                    }
                    .sender_0 {
                        justify-content: flex-end;
                        .msg {
                            order: -1;
                            margin-right: 0.12rem;
                            .icon-msg-arrow {
                                position: absolute;
                                top: 0.12rem;
                                right: -0.07rem;
                                // color: #5555ff;
                                color: var(--bg-primary);
                            }
                            .audio-msg {
                                // background: #5555ff;
                                background: var(--bg-primary);
                                .playAudioLoading {
                                    span {
                                        order: -1;
                                    }
                                }
                                i {
                                    position: absolute;
                                    left: -0.16rem;
                                }
                            }
                            .text-msg {
                                p {
                                    // background: #5555ff;
                                    background: var(--bg-primary);
                                }
                            }
                        }
                    }
                    .sender_1 {
                        justify-content: flex-start;
                        .msg {
                            margin-left: 0.12rem;
                            .icon-msg-arrow {
                                position: absolute;
                                top: 0.12rem;
                                left: -0.07rem;
                                // color: #2a2d39;
                                color: var(--bg-primary1);
                                transform: rotateY(180deg);
                            }
                            .audio-msg {
                                // background: #2a2d39;
                                background: var(--bg-primary1);
                                i {
                                    position: absolute;
                                    right: -0.16rem;
                                }
                            }
                            .text-msg {
                                p {
                                    // background: #2a2d39;
                                    background: var(--bg-primary1);
                                }
                            }
                        }
                    }
                }
            }
        }

        .other-page {
            width: 100%;
            display: flex;
            flex-direction: column;
            .input-box {
                width: 100%;
                display: flex;
                // background: #1f212b;
                background: var(--bg-input-box);
                padding: 0.08rem 0.16rem 0.22rem;
                box-sizing: border-box;
                .activeColor {
                    background-color: #00cb5d;
                }
                .inactiveColor {
                    // background-color: #161820;
                    background-color: var(--bg-input);
                }
                .bg {
                    width: 85px;
                    height: 40px;
                    border-radius: 20px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s;
                    .justifyContentEnd {
                        justify-content: flex-end;
                    }
                    &:deep(.my-van-switch) {
                        display: flex;
                        // background-color: #161820;
                        background-color: var(--bg-input);
                        .text {
                            width: 0.53rem;
                            font-size: 0.12rem;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            span {
                                &:nth-child(1) {
                                    font-size: 0.16rem;
                                    .mixin-SF-medium;
                                    font-weight: 500;
                                    color: #ffffff;
                                }
                                &:nth-child(2) {
                                    font-size: 0.12rem;
                                    font-weight: 400;
                                    color: rgba(255, 255, 255, 0.65);
                                }
                            }
                        }
                    }
                }
                &:deep(.my-van-form) {
                    flex: 1;
                    padding-left: 0.12rem;
                    box-sizing: border-box;
                    .van-cell-group {
                        &::after {
                            display: none;
                        }
                    }
                    .van-cell-group,
                    .van-cell {
                        background: transparent;
                    }
                    .van-cell {
                        padding: 0;
                        height: 0.4rem;
                        // background: #161820;
                        background: var(--bg-input);
                        border-radius: 0.2rem;
                        .van-field__control {
                            height: 0.4rem;
                            padding: 0.2rem;
                            box-sizing: border-box;
                            color: #fff;
                            font-weight: 400;
                            font-size: 0.16rem;
                            &::placeholder {
                                color: #666d79;
                            }
                        }
                        .van-field__button {
                            padding: 0 0.04rem 0 0;
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;
                            .van-button,
                            .van-button__text {
                                background: transparent;
                                border: none;
                                display: flex;
                                align-items: center;
                                padding: 0;
                            }
                            .icon {
                                width: 0.32rem;
                                height: 0.32rem;
                                flex-shrink: 0;
                                color: var(--color-btn-send-mes);
                            }
                        }
                    }
                }
            }
        }
    }
}

@keyframes audioKeyframes {
    0% {
        height: 0.06rem;
    }
    100% {
        height: 1;
    }
}
</style>
