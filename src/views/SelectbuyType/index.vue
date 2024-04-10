<template>
    <div class="buy-type">
        <div class="unlock-buytype">
            <p class="header">Unlock Barbie</p>
            <p class="sub">
                You can subscribe to a VIP and use all characters for free, or you can unlock the characters separately
            </p>
            <van-button class="vip" @click="unlock()">Unlock with VIP</van-button>
            <van-button class="Gem1" @click="buyGem()"
                >Unlock with <img class="imggem" src="@/assets/img/Gem/icon.png" alt="" /> 200</van-button
            >
            <img @click="cloeseDialog()" class="cancel" src="@/assets/img/Gem/cancel2.png" alt="" />
        </div>
    </div>
</template>

<script>
export default {
    props: [],
    components: {},
    data() {
        return {
            price: 20,
        };
    },
    created() {},
    mounted() {},
    methods: {
        cloeseDialog() {
            this.$router.go(-1);
        },
        unlock() {
            this.$router.push("/buy-vip");
        },
        buyGem() {
            if (this.price <= 200) {
                this.$router.push("/recharge");
            } else {
                console.log("gem余额充足，直接用gem解锁");
            }
        },
    },
};
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.buy-type {
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: #0b0c0f;
    // opacity: 0.65;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .mixin-SF-medium;
    .unlock-buytype {
        width: 2.79rem;
        height: 2.76rem;
        background: #ffffff;
        border-radius: 0.16rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0.2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .header {
            font-size: 0.18rem;
            color: #000000;
            font-weight: bold;
            margin-bottom: 0.1rem;
        }
        .sub {
            font-size: 0.14rem;
            color: #666d79;
        }
        .vip {
            width: 2.31rem;
            height: 0.48rem;
            background: linear-gradient(90deg, #ffbf1b 0%, #ffa724 100%);
            border-radius: 0.48rem;
            border: 0;
            margin-top: 0.2rem;
            margin-bottom: 0.2rem;
            font-size: 0.16rem;
            font-weight: bold;
        }
        .Gem1 {
            width: 2.31rem;
            height: 0.48rem;
            background: #ffffff;
            border-radius: 0.48rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.16rem;
            font-weight: bold;
            border: 1px solid #000000;
            .imggem {
                width: 0.18rem;
                height: 0.18rem;
                vertical-align: middle;
            }
        }
        .cancel {
            width: 0.36rem;
            height: 0.36rem;
            position: absolute;
            bottom: -0.6rem;
            left: 50%;
            transform: translate(-50%);
        }
    }
}
</style>
