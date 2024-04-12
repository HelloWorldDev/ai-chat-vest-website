<style lang="less" scoped>
@import "../../styles/mixin.less";
.header1-index {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    height: 0.45rem;
    flex-shrink: 0;
    color: #ffffff;
    // background: #161820;
    background: var(--bg-chat-primary);
    .l,
    .exitIndex {
        width: 0.45rem;
        height: 100%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 0 0 0.2rem;
        box-sizing: border-box;
        img {
            width: 0.3rem;
            height: 0.3rem;
        }
    }
    .c {
        // flex: 1;
        text-align: center;
        font-size: 0.18rem;
        font-weight: bold;
        line-height: 0.22rem;
        .mixin-SF-medium;
    }
    .r {
        padding-right: 0.2rem;
        box-sizing: border-box;
        .mixin-SF-medium;
    }
    .showclass {
        visibility: visible;
    }
    .hiddenclass {
        visibility: hidden;
        width: 0;
    }
}
</style>
<style lang="less"></style>

<template>
    <div class="header1-index">
        <div class="l" @click="goBack()">
            <img src="../../assets/img/Header/goBack.png" alt="" />
        </div>
        <div class="c" v-for="(item, ind) in title_list" :key="ind" v-show="headerId == item.id">
            {{ item.name }}
        </div>
        <div
            @click="goDetails()"
            class="c r"
            v-for="(item, ind) in icon_list"
            :key="ind"
            :class="iconId == item.id ? 'showclass' : 'hiddenclass'"
        >
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import { appGoback } from "@/utils/webview";
export default {
    components: {},
    computed: {},
    data() {
        return {
            title_list: [
                {
                    name: this.$t("header1.text1"),
                    id: 1,
                },
                {
                    name: this.$t("header1.text2"),
                    id: 2,
                },
                {
                    name: this.$t("header1.text4"),
                    id: 4,
                },
                {
                    name: this.$t("header1.text5"),
                    id: 5,
                },
                {
                    name: this.$t("header1.text6"),
                    id: 6,
                },
                {
                    name: this.$t("header1.text7"),
                    id: 7,
                },
                {
                    name: this.$t("header1.text8"),
                    id: 8,
                },
            ],
            icon_list: [
                {
                    name: this.$t("header1.text3"),
                    id: 1,
                },
            ],
        };
    },
    watch: {},
    created() {},
    props: ["headerId", "iconId", "type", "from"],
    methods: {
        goBack() {
            if (this.type && this.type == 1) {
                this.$router.go(-1);
            } else {
                appGoback();
            }
        },
        goDetails() {
            console.log(this.from);
            if (this.from == "1") {
                this.$router.push("/exchangeList");
            } else {
                this.$router.push("/details-list");
            }
        },
    },
};
</script>
