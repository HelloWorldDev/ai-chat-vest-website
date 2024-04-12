<template>
    <div class="unlock-photo-video-page">
        <div class="unlock-mask-page" v-if="!chatMessage.unlock_status">
            <svg-icon v-if="chatMessage.cmd_type == 1" icon-class="icon-chat-unlock" class="icon" />
            <svg-icon v-else icon-class="icon-video-play" class="icon" />
            <p>{{ $t("chat.text12") }}</p>
            <div class="unlock vip-unlock" v-if="!aiChatExtInfo.is_cvip && !aiChatExtInfo.is_vvip" @click="unlockHandlers(1)">
                <span class="break-word">{{ $t("chat.text13") }}</span>
            </div>
            <div
                class="unlock vip-free-unlock"
                v-if="(aiChatExtInfo.is_cvip || aiChatExtInfo.is_vvip) && unusedFreeCount > 0"
                @click="unlockHandlers(2)"
            >
                <span class="break-word">{{ $t("chat.text14") }}</span>
            </div>
            <div
                class="unlock gem-unlock"
                v-if="(aiChatExtInfo.is_cvip || aiChatExtInfo.is_vvip) && unusedFreeCount <= 0"
                @click="unlockHandlers(3)"
            >
                <img src="../../assets/img/Chat/gem.png" alt="" />
                <span class="break-word">{{ cmdTypeNeedGem }}</span>
            </div>
        </div>
        <div class="page" @click="chatMessage.unlock_status ? imagePreview(chatMessage) : null">
            <template v-if="chatMessage.owner_type && chatMessage.cmd_type == 1">
                <van-image
                    fit="cover"
                    :src="chatMessage.unlock_status ? chatMessage.content : chatMessage.content_thumb"
                    alt="photo"
                >
                    <template v-slot:loading>
                        <van-loading type="spinner" size="32" />
                    </template>
                </van-image>
            </template>
            <div class="play-page" v-if="chatMessage.owner_type && chatMessage.cmd_type == 2">
                <svg-icon icon-class="icon-video-play" class="icon" />
                <video
                    preload="auto"
                    :poster="chatMessage.unlock_status ? chatMessage.content_cover : chatMessage.content_thumb"
                    :src="chatMessage.unlock_status ? chatMessage.content : null"
                    style="object-fit: cover"
                >
                    {{ $t("chat.text7") }}
                </video>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, getCurrentInstance, defineEmits } from "vue";
const { $store } = getCurrentInstance().proxy;
const propsData = defineProps(["chatMessage"]);
const emits = defineEmits(["sendToParent"]);

const aiChatExtInfo = computed(() => $store.state.aiChatExtInfo);

// 当前解锁类型
const unlockType = propsData.chatMessage.cmd_type == 1 ? 0 : 1;
// 当天总免费额度
const totalFreeCount = computed(() => {
    return aiChatExtInfo.value.today_total_free_count[unlockType];
});
// 剩余免费额度
const unusedFreeCount = computed(() => {
    return totalFreeCount.value - aiChatExtInfo.value.today_used_free_count[unlockType];
});
// 解锁coin count
const cmdTypeNeedGem = computed(() => {
    return aiChatExtInfo.value.unlock_need_gem[unlockType];
});

function unlockHandlers(type) {
    if (type === 1) {
        //  没开cvip 第二版是c和v都可解锁图片视频都是5个，不累加
        sendMessageToParent(1, {
            type: true,
            chatMessage: propsData.chatMessage,
            unlockNeedCoin: cmdTypeNeedGem.value,
        });
    } else if (type === 2) {
        // 开了vip，有免费额度还没有用完
        sendMessageToParent(2, {
            type: true,
            status: 3,
            chatMessage: propsData.chatMessage,
            totalFreeCount: totalFreeCount.value,
            unusedFreeCount: unusedFreeCount.value,
        });
    } else {
        sendMessageToParent(3, {
            type: true,
            status: 1,
            chatMessage: propsData.chatMessage,
            unlockNeedCoin: cmdTypeNeedGem.value,
        });
    }
}

// 点击预览图片或者视频
function imagePreview(message) {
    sendMessageToParent(0, {
        type: true,
        cmd_type: message.cmd_type,
        gid: message.gid,
        list: [message.content],
    });
}
function sendMessageToParent(status, data) {
    emits("sendToParent", { status, data });
}
</script>

<style scoped lang="less">
.unlock-photo-video-page {
    width: 100%;
    height: 100%;
    position: relative;
    .page {
        width: 100%;
        height: 100%;
        &:deep(.van-image) {
            width: 100%;
            height: 100%;
            .van-image__loading,
            .van-image__error {
                background: transparent;
            }
        }
        .play-page {
            display: flex;
            width: 100%;
            height: 100%;
            position: relative;
            .icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0.48rem;
                height: 0.48rem;
                flex-shrink: 0;
            }
            video {
                width: 100%;
                height: auto;
            }
        }
    }
    .unlock-mask-page {
        width: 100%;
        height: 100%;
        border-radius: 0.08rem;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        padding: 0.1rem;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            filter: blur(5px);
        }
        .icon {
            width: 0.48rem;
            height: 0.48rem;
            flex-shrink: 0;
        }
        p {
            font-size: 0.14rem;
            font-weight: 500;
            margin-top: 0.12rem;
            color: #fff;
        }
        .unlock {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 1rem;
            min-height: 0.32rem;
            padding: 0.08rem 0.16rem;
            box-sizing: border-box;
            border-radius: 0.2rem;
            margin-top: 0.12rem;
            // background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
            background: var(--bg-btn-body-action-send);
            img {
                width: 0.16rem;
                height: 0.16rem;
                flex-shrink: 0;
                margin-right: 0.04rem;
            }
            span {
                font-size: 0.14rem;
                line-height: 0.16rem;
                font-weight: 500;
                color: #fff;
            }
        }
        // .vip-unlock {
        // }
        // .vip-free-unlock {
        // }
        // .gem-unlock {
        // }
    }
}
</style>
