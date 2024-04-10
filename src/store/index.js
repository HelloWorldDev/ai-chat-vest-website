import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { getAiBotChatEnter } from "../service/api";
const debug = process.env.NODE_ENV !== "production";

const state = {
    lang: "en-US",
    aiChatLoading: false,
    voiceType: "en-US-NancyNeural", //以下7个变量为合成语音的参数（声音类型，速度，语调等）
    voiceRate: "medium",
    voicePitch: "medium",
    voiceVolume: "medium",
    voiceStyle: "whispering",
    voiceStyledegree: "1",
    voiceBlob: "",
    aiChatUserInfo: {}, //用户信息
    aiChatExtInfo: {}, // vip 解锁信息
    aiChatGFInfo: {}, //当前聊天女友信息
    aiChatUnlockResult: {}, // 解锁结果
    bgImg: "", //购买vip背景图
    isFollowed: false, //是否关注
    isDiscorded: false, //是否加入
    socialListVx: [], //存储的关注列表
};

const mutations = {
    updateLang(state, value) {
        state.lang = value;
    },
    updateAiChatLoading(state, value) {
        state.aiChatLoading = value;
    },
    updateVoiceType(state, value) {
        state.voiceType = value;
    },
    updateVoiceRate(state, value) {
        state.voiceRate = value;
    },
    updateVoicePitch(state, value) {
        state.voicePitch = value;
    },
    updateVoiceVolume(state, value) {
        state.voiceVolume = value;
    },
    updateVoiceStyle(state, value) {
        state.voiceStyle = value;
    },
    updateVoiceStyledegree(state, value) {
        state.voiceStyledegree = value;
    },
    updateVoiceBlob(state, value) {
        state.voiceBlob = value;
    },
    updateAiChatUserInfo(state, value) {
        state.aiChatUserInfo = value;
    },
    updateAiChatExtInfo(state, value) {
        state.aiChatExtInfo = value;
    },
    updateAiChatGFInfo(state, value) {
        state.aiChatGFInfo = value;
    },
    updateAiChatUnlockResult(state, value) {
        state.aiChatUnlockResult = value;
    },
    updateBgImg(state, value) {
        state.bgImg = value;
    },
    updateFollowT(state, value) {
        state.isFollowed = value;
    },
    updateJoinD(state, value) {
        state.isDiscorded = value;
    },
    updateSocialListVx(state, value) {
        state.socialListVx = value;
    },
};
const actions = {
    store_getAiBotChatEnter({ commit }, value) {
        return new Promise((resolve, reject) => {
            getAiBotChatEnter(value)
                .then((res) => {
                    if (!res.error_code) {
                        const common = res.common;
                        commit("updateAiChatUserInfo", common.user_info);
                        commit("updateAiChatExtInfo", common.ext_info);
                        commit("updateAiChatGFInfo", res.data.character);
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

export default createStore({
    state,
    mutations,
    actions,
    strict: debug,
    plugins: [createPersistedState()],
});
