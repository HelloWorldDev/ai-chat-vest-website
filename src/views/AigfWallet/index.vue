<template>
    <div class="wallet-page">
        <Header1 class="header" :headerId="8" :iconId="1" :from="1"></Header1>
        <section>
            <div class="wallet-wrap">
                <div class="ai">
                    <div class="ai-l">
                        <p class="t1">$AIGF Balance</p>
                        <p class="t2">2800990</p>
                    </div>
                    <img src="@/assets/img/Gem/wallet.png" alt="" />
                </div>
                <div class="ai-b">
                    <p class="t1">24.99 USDT</p>
                    <p class="t2">+120% APY</p>
                </div>
            </div>
            <div class="withdraw" @click="withdraw">Withdraw</div>
        </section>
    </div>
</template>

<script setup>
import Header1 from "@/components/Header1/index.vue";
import { getCurrentInstance } from "vue";
const { $router } = getCurrentInstance().proxy;
const withdraw = () => {
    $router.push("/withdraw");
};
</script>

<style scoped lang="less">
.wallet-page {
    flex: 1;
    box-sizing: border-box;
    // background: #161820;
    background: var(--bg-chat-primary);
    width: 100%;
    section {
        flex: 1;
        display: flex;
        flex-direction: column;
        // background: #161820;
        background: var(--bg-chat-primary);
        padding: 0.57rem 0.2rem;
        box-sizing: border-box;
        .wallet-wrap {
            width: 100%;
            height: 1.23rem;
            border-radius: 12px;
            // background: #2a2d39;
            background: var(--bg-primary1);
            margin-top: 0.12rem;
            .ai {
                width: 100%;
                height: 0.82rem;
                border-radius: 12px;
                // background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                background: var(--bg-btn-body-action-send);
                display: flex;
                justify-content: space-between;
                align-items: center;
                .ai-l {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding-left: 0.16rem;
                    box-sizing: border-box;
                    .t1 {
                        color: var(---, #fff);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        letter-spacing: -0.3px;
                    }
                    .t2 {
                        color: var(---, #fff);
                        font-family: DIN;
                        font-size: 24px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: normal;
                    }
                }
                & > img {
                    width: 0.82rem;
                    height: 0.82rem;
                }
            }
            .ai-b {
                width: 100%;
                height: 0.41rem;
                line-height: 0.41rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 0.16rem;
                box-sizing: border-box;
                .t1 {
                    color: #fff;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.3px;
                }
                .t2 {
                    color: #00c371;
                    text-align: right;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.3px;
                }
            }
        }
        .withdraw {
            width: 100%;
            height: 0.52rem;
            line-height: 0.52rem;
            border-radius: 0.52rem;
            color: #fff;
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: bold;
            letter-spacing: -0.3px;
            border: 1px solid #fff;
            margin-top: 0.24rem;
        }
    }
}
</style>
