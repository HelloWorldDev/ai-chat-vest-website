<template>
    <my-van-dialog className="my-unlock-coin-dialog" :show="isShowDialog" width="80%" :overlay-style="overlayStyle">
        <div class="page">
            <p
                class="text"
                v-if="status === 1"
                v-html="$t('chatDialog.text5', { unlockNeedCoin, typeText: $t('chatDialog.' + [typeText]) })"
            ></p>
            <p class="text" v-if="status === 2">{{ $t("chatDialog.text6") }}</p>
            <p
                class="text"
                v-if="status === 3"
                v-html="$t('chatDialog.text7', { typeText: $t('chatDialog.' + [typeText]), unusedFreeCount, totalFreeCount })"
            ></p>
        </div>
        <template #footer>
            <div class="btns-page">
                <van-button class="btn" square type="primary" @click="onCancel">{{ $t("chatDialog.text8") }}</van-button>
                <van-button class="btn" square type="primary" :loading="confirmLoading" @click="onConfirm">
                    {{
                        $t(
                            "chatDialog." +
                                [status === 1 ? "text9" : status === 2 ? "text10" : status === 3 ? "text11" : "text12"]
                        )
                    }}
                </van-button>
            </div>
        </template>
    </my-van-dialog>
</template>

<script setup>
import { ref, computed, defineExpose, defineEmits, getCurrentInstance } from "vue";
import { appChatUrlInfo, appGemConsumeAction } from "@/utils/webview";
import useUnlockTask from "@/hooks/useUnlockTask.js";
const { $api, $Toast, $store, $t } = getCurrentInstance().proxy;
const overlayStyle = ref({
    background: "rgba(0, 0, 0, 0.65)",
});
// 1花费金币解锁   2余额不足  3使用免费额度看照片视频
const isShowDialog = ref(false);
const status = ref(0);
const confirmLoading = ref(false);
const chatMessage = ref({});
const unlockNeedCoin = ref(0);
const totalFreeCount = ref(0);
const unusedFreeCount = ref(0);
const typeText = ref("");
const emits = defineEmits(["sendToParent"]);

const aiChatUserInfo = computed(() => $store.state.aiChatUserInfo);
const aiChatExtInfo = computed(() => $store.state.aiChatExtInfo);

function getFlag(item) {
    isShowDialog.value = item.type;
    status.value = item.status;
    chatMessage.value = item.chatMessage;
    unlockNeedCoin.value = Number(item.unlockNeedCoin);
    totalFreeCount.value = Number(item.totalFreeCount);
    unusedFreeCount.value = Number(item.unusedFreeCount);
    typeText.value = chatMessage.value.cmd_type == 1 ? "text15" : "text16";
}
defineExpose({ getFlag });

function onConfirm() {
    confirmLoading.value = true;
    if (status.value === 1) {
        // 余额充足支付
        if (aiChatUserInfo.value.gem >= unlockNeedCoin.value) {
            sendAiBotChatUnlock({
                cmd_type: chatMessage.value.cmd_type,
                id: chatMessage.value.id,
                type: 1,
            });
        } else {
            // 余额不足
            status.value = 2;
            confirmLoading.value = false;
        }
    } else if (status.value === 2) {
        confirmLoading.value = false;
        isShowDialog.value = false;
        goToBuyGem();
    } else if (status.value === 3) {
        if ((aiChatExtInfo.value.is_cvip || aiChatExtInfo.value.is_vvip) && unusedFreeCount.value > 0) {
            sendAiBotChatUnlock({
                cmd_type: chatMessage.value.cmd_type,
                id: chatMessage.value.id,
                type: 0,
            });
        } else if ((aiChatExtInfo.value.is_cvip || aiChatExtInfo.value.is_vvip) && unusedFreeCount.value <= 0) {
            confirmLoading.value = false;
            isShowDialog.value = false;
            $Toast({
                message: $t("chatDialog.text13"),
            });
        } else {
            confirmLoading.value = false;
            isShowDialog.value = false;
            $Toast({
                message: $t("chatDialog.text13_1"),
            });
            sendMessageToParent(1701008);
        }
    } else {
        confirmLoading.value = false;
        isShowDialog.value = false;
    }
}

function sendAiBotChatUnlock(params) {
    $api.sendAiBotChatUnlock(params)
        .then((res) => {
            confirmLoading.value = false;
            isShowDialog.value = false;
            if (!res.error_code) {
                const common = res.common;
                const data = res.data;
                $store.commit("updateAiChatUserInfo", common.user_info);
                $store.commit("updateAiChatExtInfo", common.ext_info);
                $store.commit("updateAiChatUnlockResult", data);
                useUnlockTask($t, $Toast, data, true);
                if (params.type) {
                    // 埋点统计-消耗金币
                    const text = params.cmd_type == 1 ? "photo" : params.cmd_type == 2 ? "video" : "";
                    appGemConsumeAction(String(chatMessage.value.gid), text, String(unlockNeedCoin.value));
                }
            } else {
                if (res.error_code === 1701008) {
                    sendMessageToParent(res.error_code);
                } else {
                    $Toast({
                        message: res.error_code + " " + res.message,
                    });
                }
            }
        })
        .catch(() => {
            confirmLoading.value = false;
        });
}

function onCancel() {
    isShowDialog.value = false;
}

function sendMessageToParent(code) {
    emits("sendToParent", { code });
}

function goToBuyGem() {
    appChatUrlInfo(process.env.VUE_APP_GO_TO_URL + "recharge");
}
</script>

<style scoped lang="less">
.my-unlock-coin-dialog {
    background: transparent;
    border-radius: 0.12rem;
    background: blueviolet;
    .page {
        flex: 1;
        background-color: #f8f8fb;
        padding: 0.2rem;
        box-sizing: box-sizing;
        .text {
            color: #000;
            font-size: 0.16rem;
            font-weight: 500;
            line-height: 0.2rem;
            text-align: left;
            span {
                color: #ff9d0a;
            }
        }
    }
    .btns-page {
        width: 100%;
        border-top: 1px solid #ebebf1;
        display: flex;
        align-items: center;
        .btn {
            flex: 1;
            border: none;
            color: #000;
            background-color: #f8f8fb;
            font-size: 0.16rem;
            font-weight: 500;
            color: #161820;
            &:first-child {
                color: #afb2ba;
                border-right: 1px solid #ebebf1;
            }
        }
    }
}
</style>
