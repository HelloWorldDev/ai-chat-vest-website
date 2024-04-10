<template>
    <my-van-dialog
        className="my-chat-limit-dialog my-dialog-bg"
        :show="isShowDialog"
        width="80%"
        :overlay-style="overlayStyle"
        :show-cancel-button="false"
        :show-confirm-button="false"
    >
        <div class="page">
            <div class="main">
                <p class="title">Free chat</p>
                <p class="text">
                    In view of the fact that the platform has conducted language model training based on a large amount of
                    companion chat interaction content, the number of chats is limited, it only supports
                    {{ chat_free_send_max }} conversations for free, and supports voice functions.
                </p>
                <div class="btns-page">
                    <van-button
                        type="primary"
                        class="btn"
                        round
                        color="linear-gradient(270deg, #55F 0%, #66F 100%)"
                        @click="goToUnlock()"
                    >
                        Get unlimited chats
                    </van-button>
                    <p class="tips">Free chat times 0/{{ chat_free_send_max }}</p>
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
const chat_free_send_max = ref(0);
const chat_send_count = ref(0);

const emits = defineEmits(["sendToParent"]);

function getFlag(item) {
    isShowDialog.value = item.type;
    chat_free_send_max.value = item.chat_free_send_max;
    chat_send_count.value = item.chat_send_count.value;
}
defineExpose({ getFlag });

function cancelClick() {
    isShowDialog.value = false;
}

function goToUnlock() {
    sendMessageToParent(true);
    cancelClick();
}

function sendMessageToParent(status) {
    emits("sendToParent", { status });
}
</script>

<style lang="less" scoped>
.my-chat-limit-dialog {
    .page {
        flex: 1;
        .main {
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0.24rem;
            box-sizing: border-box;
            background: #fff;
            border-radius: 0.16rem;
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
                    color: #fff !important;
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
                .tips {
                    color: rgba(102, 109, 121, 0.65);
                    text-align: center;
                    font-size: 0.14rem;
                    font-weight: 400;
                    line-height: normal;
                    margin-top: 0.12rem;
                }
            }
        }
        .icon-exit {
            margin-top: 0.32rem;
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
