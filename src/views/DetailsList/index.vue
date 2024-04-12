<template>
    <div class="power-list">
        <Header1 class="header" :headerId="2" :iconId="0"></Header1>
        <van-tabs v-model:active="active" @click-tab="onClickTab">
            <van-tab :title="$t('detailList.text6')"
                ><div class="wrap" v-if="list.length > 0">
                    <van-pull-refresh
                        v-model="refreshing"
                        @refresh="onRefresh"
                        style="height: 100%"
                        :pulling-text="$t('public.refresh.text1')"
                        :loosing-text="$t('public.refresh.text2')"
                        :loading-text="$t('public.refresh.text3')"
                        :success-text="$t('public.refresh.text4')"
                        success-duration="300"
                    >
                        <van-list
                            class="van-list"
                            v-model="loadingshow"
                            :finished="finished"
                            :finished-text="list.length > 0 ? 'noMore~' : ''"
                            @load="onLoad"
                            :offset="offset"
                            :immediate-check="false"
                            loading-text="$t('public.refresh.text3')"
                        >
                            <div class="list" v-for="(item, index) in list" :key="index">
                                <div class="l">
                                    <p v-if="item.event_type == '2000000'">{{ $t("detailList.text1") }}</p>
                                    <p v-if="item.event_type == '2000001'">{{ $t("detailList.text2") }}</p>
                                    <p v-if="item.event_type == '2000002'">{{ $t("detailList.text3") }}</p>
                                    <p v-if="item.event_type == '2000003'">{{ $t("detailList.text4") }}</p>
                                    <p v-if="item.param_2 == '1'">Daily checkin</p>
                                    <p v-if="item.param_2 == '2'">Chat with characters</p>
                                    <p v-if="item.param_2 == '3'">Invite friends</p>
                                    <p v-if="item.param_2 == '4'">Unlock characters</p>
                                    <p v-if="item.param_2 == '5'">Unlock Photos</p>
                                    <p v-if="item.param_2 == '6'">Follow us on X(Twitter)</p>
                                    <p v-if="item.param_2 == '7'">Join our Discord</p>
                                    <span>{{ formatEn(item.created_at) }}</span>
                                </div>
                                <div :class="item.op == '1' ? 'r add' : 'r remote'">
                                    {{ item.op == "1" ? "+" : "-" }}{{ item.amount }}
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
                <div class="empty-order text-shadow1 font-weight" v-if="isLoading == false && list.length == 0">
                    {{ $t("detailList.text5") }}
                </div></van-tab
            >
            <van-tab :title="$t('detailList.text7')"
                ><div class="wrap" v-if="listp.length > 0">
                    <van-pull-refresh
                        v-model="refreshingP"
                        @refresh="onRefreshP"
                        style="height: 100%"
                        :pulling-text="$t('public.refresh.text1')"
                        :loosing-text="$t('public.refresh.text2')"
                        :loading-text="$t('public.refresh.text3')"
                        :success-text="$t('public.refresh.text4')"
                        success-duration="300"
                    >
                        <van-list
                            class="van-list"
                            v-model="loadingshowP"
                            :finished="finishedP"
                            :finished-text="listp.length > 0 ? 'noMore~' : ''"
                            @load="onLoadP"
                            :offset="offsetP"
                            :immediate-check="false"
                            loading-text="$t('public.refresh.text3')"
                        >
                            <div class="list" v-for="(item, index) in listp" :key="index">
                                <div class="l">
                                    <p v-if="item.event_type == '2000000'">{{ $t("detailList.text1") }}</p>
                                    <p v-if="item.event_type == '2000001'">{{ $t("detailList.text2") }}</p>
                                    <p v-if="item.event_type == '2000002'">{{ $t("detailList.text3") }}</p>
                                    <p v-if="item.event_type == '2000003'">{{ $t("detailList.text4") }}</p>
                                    <p v-if="item.param_2 == '1'">Daily checkin</p>
                                    <p v-if="item.param_2 == '2'">Chat with characters</p>
                                    <p v-if="item.param_2 == '3'">Invite friends</p>
                                    <p v-if="item.param_2 == '4'">Unlock characters</p>
                                    <p v-if="item.param_2 == '5'">Unlock Photos</p>
                                    <p v-if="item.param_2 == '6'">Follow us on X(Twitter)</p>
                                    <p v-if="item.param_2 == '7'">Join our Discord</p>
                                    <span>{{ formatEn(item.created_at) }}</span>
                                </div>
                                <div :class="item.op == '1' ? 'r add' : 'r remote'">
                                    {{ item.op == "1" ? "+" : "-" }}{{ item.amount }}
                                </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
                <div class="empty-order text-shadow1 font-weight" v-if="isLoadingP == false && listp.length == 0">
                    {{ $t("detailList.text5") }}
                </div></van-tab
            >
        </van-tabs>
    </div>
</template>

<script setup>
import Header1 from "@/components/Header1/index.vue";
import { formatEn } from "@/utils";
import { ref, getCurrentInstance, onMounted } from "vue";
const { $api } = getCurrentInstance().proxy;
const pageNum = ref("1");
const pageSize = ref("20");
const total = ref(0);
const offset = ref(50);
const list = ref([]);
const refreshing = ref(false);
const loadingshow = ref(false);
const finished = ref(false);
const isLoading = ref(false);
//下面为points的变量
const listp = ref([]);
const pageNumP = ref("1");
const pageSizeP = ref("20");
const totalP = ref(0);
const offsetP = ref(50);
const refreshingP = ref(false);
const loadingshowP = ref(false);
const finishedP = ref(false);
const isLoadingP = ref(false);
const active = ref(0);
onMounted(() => {
    getList();
    getListP();
});
const onClickTab = (tag) => {
    if (tag.name == "0") {
        pageNum.value = "1";
        list.value = [];
        getList();
    } else {
        pageNumP.value = "1";
        listp.value = [];
        getListP();
    }
};
//加载更多
const onLoad = () => {
    if (loadingshow.value) {
        return false;
    }
    pageNum.value++;
    getList();
};
// 下拉刷新
const onRefresh = () => {
    list.value = [];
    pageNum.value = "1";
    pageSize.value = "20";
    finished.value = true;
    getList();
};
//获取列表数据
const getList = () => {
    let params = {
        page: pageNum.value,
        page_size: pageSize.value,
    };
    isLoading.value = true;
    loadingshow.value = true;
    $api.getGemDetials(params)
        .then((res) => {
            isLoading.value = false;
            loadingshow.value = false;
            refreshing.value = false;
            if (res && res.data && res.data.list && res.data.list.length > 0) {
                list.value.push(...res.data.list);
                total.value = res.data.total_count;
                if (list.value == null || list.value.length === 0) {
                    // 加载结束
                    finished.value = true;
                    return;
                }
                if (list.value.length >= total.value) {
                    finished.value = true;
                    return;
                } else {
                    finished.value = false;
                }
            } else {
                list.value = [];
                total.value = 0;
                finished.value = true;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
//加载更多
const onLoadP = () => {
    if (loadingshowP.value) {
        return false;
    }
    pageNumP.value++;
    getListP();
};
// 下拉刷新
const onRefreshP = () => {
    listp.value = [];
    pageNumP.value = "1";
    pageSizeP.value = "20";
    finishedP.value = true;
    getListP();
};
//获取列表数据 points
const getListP = () => {
    let params = {
        page: pageNumP.value,
        page_size: pageSizeP.value,
    };
    isLoadingP.value = true;
    loadingshowP.value = true;
    $api.getPointsDetials(params)
        .then((res) => {
            isLoadingP.value = false;
            loadingshowP.value = false;
            refreshingP.value = false;
            if (res && res.data && res.data.list && res.data.list.length > 0) {
                listp.value.push(...res.data.list);
                // let filterList = res.data.list.filter((item) => item.amount != 0);
                // console.log(filterList);
                // listp.value.push(...filterList);
                totalP.value = res.data.total_count;
                if (listp.value == null || listp.value.length === 0) {
                    // 加载结束
                    finishedP.value = true;
                    return;
                }
                if (listp.value.length >= totalP.value) {
                    finishedP.value = true;
                    return;
                } else {
                    finishedP.value = false;
                }
            } else {
                listp.value = [];
                totalP.value = 0;
                finishedP.value = true;
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
</script>

<style scoped lang="less">
.power-list {
    flex: 1;
    box-sizing: border-box;
    // background: #161820;
    background: var(--bg-chat-primary);
    width: 100%;
    &:deep(.van-tabs) {
        margin-top: 0.45rem;
        .van-tabs__content {
            padding-top: 0.45rem;
            box-sizing: border-box;
        }
        .van-tabs__wrap {
            width: 100%;
            height: 0.52rem;
            position: fixed;
            left: 0;
            right: 0;
            z-index: 111;

            .van-tabs__nav {
                // background: #161820 !important;
                background: var(--bg-chat-primary) !important;
                padding-bottom: 10px;
                .van-tab--line {
                    color: #707988;
                    font-size: 0.16rem;
                    font-weight: bold;
                }
                .van-tabs__line {
                    background: #fff;
                }
                .van-tab--active {
                    color: #fff !important;
                    font-size: 0.16rem;
                    font-weight: bold;
                }
            }
        }
    }
    .font-weight {
        font-weight: bold;
    }
    .empty-order {
        padding-top: 50%;
        // background: #161820;
        background: var(--bg-chat-primary);
        flex: 1;
        font-size: 0.18rem;
        color: #ffffff;
        text-align: center;
    }
    .wrap {
        flex: 1;
        box-sizing: border-box;
        // overflow-y: auto;
        width: 100%;
        height: 100%;
        border-radius: 0.12rem;
        // background: #161820;
        background: var(--bg-chat-primary);
        .list {
            width: 100%;
            height: 0.71rem;
            padding: 0 0.16rem;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // border-bottom: 1px solid #1f212b;
            border-bottom: 1px solid var(--bg-input-box);
            .l {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                & > p {
                    font-size: 0.16rem;
                    color: #ffffff;
                    font-weight: bold;
                    margin-bottom: 0.03rem;
                }
                & > span {
                    font-size: 0.12rem;
                    color: #707988;
                    font-weight: 400;
                }
            }
            .r {
                font-size: 0.18rem;
                font-weight: 500;
                font-family: "DIN";
            }
            .add {
                color: #ffd961;
            }
            .remote {
                color: #b2b9c6;
            }
        }
    }
}
</style>
