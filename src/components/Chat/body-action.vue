<template>
    <div class="body-action-component">
        <div class="select-action-page">
            <van-tabs
                class="my-van-tabs"
                background="transparent"
                color="transparent"
                title-active-color="#fff"
                title-inactive-color="#fff"
                @click-tab="bodySheetHandlers"
            >
                <van-tab
                    v-for="(item, index) in bodyActionList"
                    :name="index"
                    :title="lang === 'zh-CN' ? item.type_cn : capitalizeFirstLetter(item.type)"
                    :key="item.id"
                    :title-class="item.type"
                ></van-tab>
            </van-tabs>
        </div>
        <van-action-sheet v-model:show="isShowSheet" :closeable="false" :overlayStyle="overlayStyle" @close="cancelClick">
            <div class="header">
                <p>{{ bodyActionName }}</p>
                <div class="showVip">
                    <img class="icon" v-if="aiChatExtInfo.is_cvip" src="../../assets/img/Header/cvip.png" alt="" />
                    <img class="icon" v-if="aiChatExtInfo.is_vvip" src="../../assets/img/Header/vvip.png" alt="" />
                </div>
            </div>
            <div class="page">
                <p class="title">{{ $t("chat.text4", { bodyActionName }) }}</p>
                <van-field
                    v-model="bodyPartsName"
                    maxlength="50"
                    :border="false"
                    :placeholder="lang === 'zh-CN' ? partsList[0] : capitalizeFirstLetter(partsList[0])"
                />
                <ul class="body-name-page">
                    <li v-for="(item, index) in partsList" @click="checkParts(item)" :key="index">
                        <span>{{ lang === "zh-CN" ? item : capitalizeFirstLetter(item) }}</span>
                    </li>
                </ul>
                <div class="btns-page">
                    <button class="btn" @click="cancelClick">{{ $t("chat.text5") }}</button>
                    <button class="btn" @click="sendMessage">{{ $t("chat.text6") }}</button>
                </div>
            </div>
        </van-action-sheet>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, getCurrentInstance, defineEmits } from "vue";
import { capitalizeFirstLetter, toLowerCase } from "@/utils";
const { $store, $Toast, $t } = getCurrentInstance().proxy;
const overlayStyle = {
    background: "rgba(0, 0, 0, 0.35)",
};
const props = defineProps(["bodyActionList"]);
// sheet出现
const isShowSheet = ref(false);
// 动作名称
const bodyActionName = ref("");
// 输入部位
const bodyPartsName = ref("");
// 默认部位list
const partsList = ref([]);
// 动作名称英文
const bodyActionNameEn = ref("");

const emits = defineEmits(["sendToParent"]);

const aiChatExtInfo = computed(() => $store.state.aiChatExtInfo);
const lang = computed(() => $store.state.lang);

function bodySheetHandlers(clickItem) {
    const name = toLowerCase(props.bodyActionList[clickItem.name].type);
    if (name === "photo" || name === "video") {
        sendMessageToParent({ title: name });
    } else {
        bodyActionNameEn.value = name;
        bodyActionName.value = clickItem.title;
        partsList.value = props.bodyActionList[clickItem.name][lang.value === "zh-CN" ? "parts_cn" : "parts"];
        isShowSheet.value = true;
    }
}
function checkParts(item) {
    bodyPartsName.value = capitalizeFirstLetter(item);
}
function cancelClick() {
    isShowSheet.value = false;
    bodyPartsName.value = "";
}
function sendMessage() {
    if (bodyPartsName.value.trim() === "") {
        bodyPartsName.value = "";
        $Toast({
            message: $t("chat.inputText.text2"),
        });
    } else {
        sendMessageToParent({ title: bodyActionNameEn.value, bodyPartsName: bodyPartsName.value });
        cancelClick();
    }
}
function sendMessageToParent(data) {
    emits("sendToParent", data);
}
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.body-action-component {
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0.56rem;
    .select-action-page {
        width: 100%;
        padding: 0.12rem 0;
        box-sizing: border-box;
        &:deep(.my-van-tabs) {
            .van-tabs__wrap {
                height: auto;
            }
            .van-tabs__nav {
                padding: 0 0.08rem 0 0.16rem;
                box-sizing: border-box;
            }
            .van-tab {
                height: 0.32rem;
                padding: 0 0.12rem;
                box-sizing: border-box;
                margin-right: 0.08rem;
                border-radius: 0.2rem;
                // background: #404352;
                background: var(--bg-btn-body-action);
                font-size: 0.14rem;
                font-weight: 500;
                line-height: normal;
            }
            .photo {
                // background: linear-gradient(270deg, #5555ff 0%, #6666ff 100%);
                background: var(--bg-btn-body-action-photo);
            }
            .video {
                // background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                background: var(--bg-btn-body-action-video);
            }
        }
    }
    &:deep(.van-popup) {
        // background-color: #1f212b;
        background-color: var(--bg-input-box);
        .header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.16rem 0;
            // border-bottom: 1px solid #161820;
            border-bottom: 1px solid var(--bg-chat-primary);
            p {
                font-size: 0.18rem;
                font-weight: 500;
                color: #ffffff;
                .mixin-SF-medium;
                line-height: 0.21rem;
            }
            .showVip {
                display: flex;
                align-items: center;
                img {
                    width: 0.2rem;
                    height: auto;
                    flex-shrink: 0;
                    margin-left: 0.04rem;
                }
            }
        }
        .page {
            width: 100%;
            padding: 0.2rem 0.2rem 0.3rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            .title {
                font-size: 0.16rem;
                font-weight: 400;
                color: #b2b9c6;
                line-height: 0.19rem;
            }
            .van-cell {
                width: 100%;
                height: 0.52rem;
                // background: #161820;
                background: var(--bg-chat-primary);
                border-radius: 0.12rem;
                margin-top: 0.16rem;
                margin-bottom: 0.08rem;
                .van-field__body {
                    height: 100%;
                    .van-field__control {
                        color: #fff;
                        font-size: 0.16rem;
                        font-weight: bold;
                        line-height: 0.18rem;
                        .mixin-SF-bold;
                        text-align: center;
                        &::placeholder {
                            color: #707988;
                        }
                    }
                }
            }

            .body-name-page {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                li {
                    display: flex;
                    flex: 0 1 25%;
                    margin-top: 0.12rem;
                    span {
                        margin: 0 0.06rem;
                        width: 100%;
                        font-size: 0.14rem;
                        .mixin-SF-medium;
                        font-weight: 500;
                        color: #ffffff;
                        line-height: 0.16rem;
                        padding: 0.12rem 0.12rem;
                        box-sizing: border-box;
                        // background: #2a2d39;
                        background: var(--bg-primary1);
                        border-radius: 0.2rem;
                        white-space: nowrap;
                    }
                }
            }
            .btns-page {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 0.4rem;
                .btn {
                    flex: 1;
                    height: 0.48rem;
                    border-radius: 0.24rem;
                    font-size: 0.16rem;
                    .mixin-SF-medium;
                    font-weight: 500;
                    line-height: 0.19rem;
                    &:nth-child(1) {
                        margin-right: 0.12rem;
                        color: #707988;
                        // background: #2a2d39;
                        background: var(--bg-primary1);
                    }
                    &:nth-child(2) {
                        color: #fff;
                        // background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                        background: var(--bg-btn-body-action-send);
                    }
                }
            }
        }
    }
}
</style>
