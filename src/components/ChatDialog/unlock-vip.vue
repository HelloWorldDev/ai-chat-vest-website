<template>
    <my-van-dialog
        className="my-chat-unlock-vip-dialog my-dialog-bg"
        :show="isShowDialog"
        width="80%"
        :overlay-style="overlayStyle"
        :show-cancel-button="false"
        :show-confirm-button="false"
    >
        <div class="page">
            <div class="main">
                <p class="title">{{ $t("chatDialog.text1") }}</p>
                <p class="text">
                    {{ $t("chatDialog.text2", { typeText: $t("chatDialog." + [typeText]) }) }}
                </p>
                <div class="btns-page">
                    <van-button
                        type="primary"
                        class="btn btn1"
                        round
                        color="linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%)"
                        @click="goToUnlock(1)"
                    >
                        {{ $t("chatDialog.text3") }}
                    </van-button>
                    <van-button type="primary" class="btn btn2" round plain color="#161820" @click="goToUnlock(0)">
                        {{ $t("chatDialog.text4") }} <img src="../../assets/img/Chat/gem.png" alt="" /> {{ unlockNeedCoin }}
                    </van-button>
                </div>
            </div>
            <svg-icon icon-class="icon-exit" class="icon-exit" @click="cancelClick" />
        </div>
    </my-van-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
const overlayStyle = ref({
    background: "rgba(0, 0, 0, 0.65)",
});
const isShowDialog = ref(false);
const chatMessage = ref({});
const unlockNeedCoin = ref(0);
const typeText = ref("");
const emits = defineEmits(["sendToParent"]);

function getFlag(item) {
    isShowDialog.value = item.type;
    chatMessage.value = item.chatMessage;
    unlockNeedCoin.value = item.unlockNeedCoin;
    typeText.value = chatMessage.value.cmd_type == 1 ? "text15" : "text16";
}
defineExpose({ getFlag });
function goToUnlock(type) {
    isShowDialog.value = false;
    if (type) {
        //唤起 buy vip
        sendMessageToParent(1, {});
    } else {
        sendMessageToParent(0, {
            type: true,
            status: 1,
            chatMessage: chatMessage.value,
            unlockNeedCoin: unlockNeedCoin.value,
        });
    }
}

function cancelClick() {
    isShowDialog.value = false;
}

function sendMessageToParent(status, data) {
    emits("sendToParent", { status, data });
}
</script>

<style lang="less" scoped>
.my-chat-unlock-vip-dialog {
    .page {
        flex: 1;
        .main {
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0.24rem;
            box-sizing: border-box;
            background-color: #f6f7f8;
            border-radius: 0.16rem;
            background: #fff url(../../assets/img/ChatDialog/unlock-bg.png) no-repeat top center/100% auto;
            .title {
                color: #161820;
                text-align: center;
                font-size: 0.18rem;
                font-weight: 700;
                line-height: normal;
            }
            .text {
                color: #666d79;
                text-align: center;
                font-size: 0.14rem;
                font-weight: 400;
                line-height: normal;
                margin-top: 0.12rem;
            }
            .btns-page {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 0.3rem;
                .btn {
                    width: 100%;
                    height: auto;
                    padding: 0.14rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-size: 0.16rem;
                    font-weight: 500;
                    line-height: normal;
                    color: #161820 !important;
                    .van-button__text {
                        display: flex;
                        align-items: center;
                        img {
                            width: 0.16rem;
                            height: 0.16rem;
                            flex-shrink: 0;
                            margin: 0 0.05rem;
                        }
                    }
                }

                .btn2 {
                    margin-top: 0.16rem;
                }
            }
        }
        .icon-exit {
            margin-top: 0.4rem;
            width: 0.36rem;
            height: 0.36rem;
            flex-shrink: 0;
            z-index: 2;
        }
    }
}
</style>
<style lang="less">
.my-dialog-bg {
    background: transparent !important;
}
</style>
