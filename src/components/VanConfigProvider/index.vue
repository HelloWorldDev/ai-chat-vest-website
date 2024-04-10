<template>
    <van-config-provider :theme-vars="themeVars">
        <slot></slot>
    </van-config-provider>
</template>

<script>
export default {
    props: ["themeVars"],
    components: {},
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {},
};
</script>

<style scoped lang="less"></style>
