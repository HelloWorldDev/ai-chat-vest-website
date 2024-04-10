<template>
    <div class="image-preview-component">
        <van-overlay :show="imagePreviewShow" :custom-style="overlayStyle" @click="cancelClick">
            <div class="image-preview-wrapper">
                <div class="back-page" @click.stop="cancelClick">
                    <svg-icon icon-class="icon-left" class="icon-left" />
                </div>
                <div class="priview-page" @click.stop>
                    <van-image class="image" v-if="imagePreviewType == 1" fit="cover" :src="imagePreviewList[0]" alt="photo">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="35" />
                        </template>
                    </van-image>
                    <div class="video-page" v-if="imagePreviewType == 2">
                        <svg-icon icon-class="icon-video-play" class="icon" v-if="playIconShow" @click="playVideoHandler" />
                        <video
                            :src="imagePreviewList[0]"
                            preload="auto"
                            controls
                            webkit-playsinline="true"
                            playsinline="true"
                            x-webkit-airplay="allow"
                            x5-video-player-type="h5"
                            x5-video-player-fullscreen="true"
                            x5-video-orientation="portraint"
                            ref="videoDom"
                            @pause="showCustomPauseIcon"
                            @play="hideCustomPauseIcon"
                        >
                            {{ $t("chat.text7") }}
                        </video>
                    </div>
                </div>
                <div class="set-page" @click.stop>
                    <van-button v-if="imagePreviewType == 1" @click="setChatBg(imagePreviewList)">
                        {{ $t("chat.text8") }}
                    </van-button>
                    <van-button @click="saveImage(imagePreviewList[0])">
                        {{ $t("chat.text9") }}
                    </van-button>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick, defineExpose, onUnmounted } from "vue";
import { appSaveFile } from "@/utils/webview";
const { $store, $api, $Toast, $t } = getCurrentInstance().proxy;
const overlayStyle = {
    background: "rgba(0, 0, 0, 0.85)",
    zIndex: 99,
};
const videoDom = ref(null);
const imagePreviewShow = ref(false);
const imagePreviewList = ref([]);
const imagePreviewType = ref("");
const gid = ref("");
const playIconShow = ref(true);

onMounted(() => {});
function getFlag(item) {
    imagePreviewShow.value = item.type;
    imagePreviewType.value = item.cmd_type;
    imagePreviewList.value = item.list;
    gid.value = item.gid;
    nextTick(() => {
        imagePreviewType.value == 2 ? playVideoHandler() : null;
    });
}
defineExpose({ getFlag });
// 设置聊天背景图
function setChatBg(imagePreviewList) {
    $api.sendAiBotChatBgSet({
        bg: imagePreviewList[0],
        gid: gid.value,
    }).then((res) => {
        if (!res.error_code) {
            $store.commit("updateAiChatGFInfo", res.data.character);
            $Toast({
                message: $t("chat.text10"),
            });
        } else {
            $Toast({
                message: $t("chat.text11"),
            });
        }
    });
}

function cancelClick() {
    imagePreviewShow.value = false;
    if (imagePreviewType.value == 2) {
        videoDom.value.pause();
        videoDom.value = null;
        // imagePreviewList.value = [];
    }
}

function showCustomPauseIcon() {
    playIconShow.value = true;
}
function hideCustomPauseIcon() {
    playIconShow.value = false;
}
function playVideoHandler() {
    videoDom.value.play();
    playIconShow.value = false;
}
// 调用app下载
function saveImage(url) {
    appSaveFile(url);
}
onUnmounted(() => {});
</script>

<style scoped lang="less">
.image-preview-component {
    .image-preview-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        .back-page {
            display: flex;
            position: absolute;
            top: 0.2rem;
            left: 0;
            z-index: 3;
            padding-left: 0.2rem;
            box-sizing: border-box;
            .icon-left {
                background: #2a2d39;
                border-radius: 50%;
            }
        }
        .set-page {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            bottom: 0.3rem;
            z-index: 3;
            padding: 0 0.2rem;
            box-sizing: border-box;
            &:deep(.van-button) {
                border-radius: 0.08rem;
                background: #2a2d39;
                padding: 0.1rem 0.12rem;
                box-sizing: border-box;
                font-size: 0.14rem;
                color: #fff;
                flex-shrink: 0;
                border: none;
                &:first-child {
                    margin-right: 0.1rem;
                }
            }
        }
        .priview-page {
            display: flex;
            align-items: center;
            justify-content: center;
            &:deep(.image) {
                width: auto;
                height: auto;
                .van-image__loading,
                .van-image__error {
                    background: transparent;
                }
            }
            .video-page {
                display: flex;
                position: relative;
                .icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0.52rem;
                    height: 0.52rem;
                    flex-shrink: 0;
                    z-index: 100;
                }
                video {
                    width: 100%;
                    min-width: 1.5rem;
                    max-width: 100%;
                    height: auto;
                    min-height: auto;
                    max-height: 100%;
                }
            }
        }
    }
}
</style>
