<template>
    <my-van-dialog
        className="points-dialog"
        :show="isShowDialog"
        width="80%"
        :overlay-style="overlayStyle"
        :show-cancel-button="false"
        :show-confirm-button="false"
    >
        <div class="page">
            <div class="main">
                <p class="title">{{ $t("detailList.text8") }}</p>
                <p class="text">{{ $t("detailList.text9", { name: webStyle ? $t("webStyleAPPName." + webStyle) : "" }) }}</p>
                <van-button type="primary" class="btn btn1" round @click="cancelClick">
                    {{ $t("detailList.text10") }}
                </van-button>
            </div>
            <svg-icon icon-class="icon-exit" class="icon-exit" @click="cancelClick" />
        </div>
    </my-van-dialog>
</template>

<script setup>
import { ref, defineExpose, computed, getCurrentInstance } from "vue";
const overlayStyle = ref({
    background: "rgba(0, 0, 0, 0.65)",
});
const isShowDialog = ref(false);
const { $store } = getCurrentInstance().proxy;
const webStyle = computed(() => $store.state.webStyle);

function getFlag(item) {
    isShowDialog.value = item;
}
defineExpose({ getFlag });

function cancelClick() {
    isShowDialog.value = false;
}
</script>

<style lang="less">
.points-dialog {
    background: transparent !important;
    border-radius: 0.16rem;
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

            .btn {
                margin-top: 0.32rem;
                width: 2.31rem;
                height: 0.48rem;
                border-radius: 28px;
                background: var(---, linear-gradient(270deg, #55f 0%, #66f 100%));
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
