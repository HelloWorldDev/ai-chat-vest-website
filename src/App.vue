<template>
    <div :class="['app', 'app-theme', 'app-' + lang]">
        <router-view />
        <Loading v-if="aiChatLoading" />
    </div>
</template>

<script setup>
import { onMounted, computed, getCurrentInstance, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { setCookie } from "@/utils";
import Loading from "@/components/Loading";
const { $jsBridge } = getCurrentInstance().proxy;
const store = useStore();
const lang = computed(() => store.state.lang);
const aiChatLoading = computed(() => store.state.aiChatLoading);

onMounted(() => {
    store.commit("updateAiChatLoading", false);
    $jsBridge.JAMS__H5AppUserInfo(appUserInfoHandler);
});
function appUserInfoHandler(message) {
    const parseMessage = JSON.parse(message);
    setCookie("access_secret", parseMessage.secret);
    setCookie("access_token", parseMessage.token);
    store.commit("updateLang", parseMessage.lang ? parseMessage.lang : "en-US");
}

onBeforeUnmount(() => {
    $jsBridge.JAMS__H5AppUserInfo(null);
});
</script>

<style>
.app {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-family: "SF Pro Display", "PingFang SC", "Microsoft YaHei", "微软雅黑", Avenir, Helvetica, Arial, "Heiti SC",
        "sans-serif";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    --font-medium: "SF Pro Display Medium", "PingFangSC-Medium", "Microsoft YaHei Semibold", "PingFang SC", "Microsoft YaHei",
        "sans-serif";
    --font-bold: "SF Pro Display Bold", "PingFangSC-Semibold", "Microsoft YaHei Bold", "PingFang SC", "Microsoft YaHei",
        "sans-serif";
}
</style>
