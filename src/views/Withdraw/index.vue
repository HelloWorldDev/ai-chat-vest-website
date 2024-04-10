<template>
    <div class="withdraw-page">
        <Header1 class="header" :headerId="8" :iconId="1" :from="1"></Header1>
        <section>
            <div class="wrap">
                <div class="l-wrap">
                    <p class="title">Token</p>
                    <div class="supe">
                        <img class="coin" src="@/assets/img/Gem/icon.png" alt="" />
                        <div class="supePoints">{{ token }}</div>
                    </div>
                </div>
                <div class="l-wrap">
                    <p class="title">Chain</p>
                    <div class="supe">
                        <img class="coin" src="@/assets/img/Gem/icon.png" alt="" />
                        <div class="supePoints">{{ chain }}</div>
                        <img class="wr" src="@/assets/img/Gem/w-right.png" alt="" />
                    </div>
                </div>
            </div>

            <p class="title">Solcna wallet address</p>
            <div class="supe2">
                <input
                    placeholder="Enter withdraw wallet address"
                    readonly="readonly"
                    type="number"
                    class="supePoints"
                    v-model="aigfPoints"
                    @input="validatePhone"
                />
            </div>
            <p class="title">Amount</p>
            <div class="supe2">
                <input placeholder="0.00" type="number" class="supePoints" v-model="supePoints" @input="validatePhone" />
                <p class="max">{{ $t("exchange.text3") }}</p>
            </div>
            <p class="title title2">
                {{ $t("exchange.text4") }}
            </p>
            <van-button class="ex"> Withdraw </van-button>
            <p class="text7">Minimum withdrawal amount is 0.000000 AIGF</p>
            <p class="text7">We will deduct 0.000000 AIGF from the balance as Gas Fee</p>
        </section>
    </div>
</template>

<script setup>
import Header1 from "@/components/Header1/index.vue";
import { ref } from "vue";
const token = ref("AIGF");
const chain = ref("BRC-20");
// const aigfPoints = ref("BRC-20");
</script>

<style scoped lang="less">
.withdraw-page {
    flex: 1;
    box-sizing: border-box;
    background: #161820;
    width: 100%;
    section {
        flex: 1;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        background: #161820;
        padding: 0.57rem 0.2rem;
        box-sizing: border-box;
        .wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .l-wrap {
                width: 1.62rem;
                height: 100%;
                display: flex;
                flex-direction: column;
                .title {
                    color: #707988;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.3px;
                    text-align: left;
                    margin-top: 0.2rem;
                }
                .supe {
                    width: 1.62rem;
                    height: 0.52rem;
                    border-radius: 8px;
                    background: #1f212b;
                    margin-top: 0.1rem;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0 0.2rem;
                    box-sizing: border-box;
                    .coin {
                        width: 0.24rem;
                        height: 0.24rem;
                    }
                    .supePoints {
                        width: 1.12rem;
                        height: 100%;
                        background: #1f212b;
                        color: #ffffff;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 0.52rem;
                        letter-spacing: -0.3px;
                        border: 0;
                    }
                    .wr {
                        width: 0.2rem;
                        height: 0.2rem;
                    }
                }
            }
        }
        .title {
            color: #707988;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: -0.3px;
            text-align: left;
            margin-top: 0.2rem;
        }
        .supe2 {
            width: 100%;
            height: 0.52rem;
            border-radius: 8px;
            background: #1f212b;
            margin-top: 0.1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.2rem;
            box-sizing: border-box;
            .coin {
                width: 0.24rem;
                height: 0.24rem;
            }
            .supePoints {
                flex: 2;
                height: 100%;
                background: #1f212b;
                color: #ffffff;
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: -0.3px;
                border: 0;
                padding: 0 0.2rem 0 0;
                box-sizing: border-box;
                &::placeholder {
                    color: #666d79;
                }
            }
            .max {
                color: #fff;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.3px;
            }
        }
        .title2 {
            font-size: 0.12rem;
            margin-top: 0.1rem;
        }
        .ex {
            width: 100%;
            height: 0.52rem;
            margin: 0.32rem 0 0.16rem 0;
            border-radius: 8px;
            background: linear-gradient(90deg, #55f 0%, #66f 100%);
            border: 0;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: -0.3px;
        }
        .text7 {
            color: #707988;
            text-align: center;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.3px;
        }
    }
}
</style>
