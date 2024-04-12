<template>
    <div class="avatar-component">
        <van-image
            :fit="avatarInfo.fit ? avatarInfo.fit : 'cover'"
            :round="avatarInfo.round"
            lazy-load
            :icon-size="avatarInfo.iconSize"
            :src="avatarInfo.src"
            :alt="avatarInfo.alt ? avatarInfo.alt : 'image'"
        >
        </van-image>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps(["avatarInfo"]);
</script>

<style scoped lang="less">
.avatar-component {
    display: flex;
    border-radius: 50%;
    // background-color: #2a2d39;
    background-color: var(--bg-primary1);
    overflow: hidden;
    &:deep(.van-image) {
        width: 100%;
        height: 100%;
        .van-image__loading,
        .van-image__error {
            background: transparent;
        }
    }
}
</style>
