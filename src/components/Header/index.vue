<template>
    <div class="header-index">
        <slot name="chatListHeader"></slot>
        <slot name="chatHeader"></slot>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => {});
</script>

<style scoped lang="less">
.header-index {
    width: 100%;
}
</style>
