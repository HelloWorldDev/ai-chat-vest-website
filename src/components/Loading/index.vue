<template>
    <div class="loading_screen">
        <div class="mask-supe">
            <img src="../../assets/img/other/loading.png" alt="" class="loading" />
            <span>Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    computed: {},
};
</script>

<style lang="less" scoped>
.loading_screen {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: rgba(18, 19, 24, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    .mask-supe {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0.12rem;
        padding: 0.16rem;
        box-sizing: border-box;
        background: #1f212b;
        .loading {
            width: 0.42rem;
            height: 0.42rem;
            flex-shrink: 0;
            animation: myRotate 0.8s linear infinite;
        }
        span {
            color: #707988;
            font-size: 0.14rem;
            font-weight: 400;
            line-height: 0.14rem;
            margin-top: 0.08rem;
        }
    }
}

@keyframes myRotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>
