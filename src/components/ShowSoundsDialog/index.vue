<template>
    <div class="sounds-dialog">
        <van-popup class="pop" :show="isShowSounds" @click-overlay="closeDialog" round position="bottom">
            <Loading v-if="loading" />
            <div class="top">
                <p class="l">{{ $t("showSoundsDialog.text1") }}</p>
            </div>
            <div class="line"></div>
            <p class="en">Currently only supports English</p>
            <div class="b-wrap">
                <div
                    @click="
                        selectSounds(item.id, item.voiceType, item.rate, item.pitch, item.volume, item.style, item.styledegree)
                    "
                    :class="activeId == item.id ? 'soundsList active' : 'soundsList normal'"
                    v-for="item in list"
                    :key="item.id"
                >
                    <div class="wrap">
                        <img
                            src="@/assets/img/Gem/play.png"
                            alt=""
                            @click.stop="
                                synthesizeSpeech(
                                    item.voiceType,
                                    item.rate,
                                    item.pitch,
                                    item.volume,
                                    item.style,
                                    item.styledegree,
                                    item.uid,
                                    item.id
                                )
                            "
                        />
                        <p>{{ item.name }}</p>
                    </div>

                    <img v-if="activeId == item.id" class="activeImg" src="@/assets/img/Gem/playright.png" alt="" />
                </div>
            </div>
            <div class="button-wrap">
                <van-button class="cancel" @click="closeDialog()">{{ $t("showSoundsDialog.text2") }}</van-button>
                <van-button
                    v-if="aiChatExtInfo.is_vvip && aiChatUserInfo.vvip_expire_at > this.dateNow"
                    class="unlock"
                    @click="confirm()"
                    >{{ $t("showSoundsDialog.text3") }}</van-button
                >
                <van-button v-else class="unlock" @click="unClock()">{{ $t("showSoundsDialog.text4") }}</van-button>
            </div>
            <p class="content">{{ $t("showSoundsDialog.text5") }}</p>
        </van-popup>
    </div>
</template>

<script>
// 引入 Microsoft Cognitive Services Speech SDK
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { getOssObj } from "@/service/api.js";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { mapState } from "vuex";
import Loading from "@/components/Loading";
import { appChatUrlInfo } from "@/utils/webview";
let lastAudioDuration = 0; // 保存上一次合成的音频时长
let currentlyPlayingAudioElement = null; // 保存当前播放的音频的
// const subscriptionKey = "33c82ea3d4ef4ed89da76cc2d250f188";

// const region = "eastasia";
export default {
    props: ["isShowSounds"],
    components: { Loading },
    data() {
        return {
            val1: "",
            val2: "",
            val3: "",
            val4: "",
            val5: "",
            val6: "",
            loading: false,
            activeId: 0,
            dateNow: new Date() / 1000,
            list: [
                {
                    uid: "z100001",
                    id: "1",
                    name: this.$t("showSoundsDialog.text6"),
                    voiceType: "en-US-NancyNeural", //声音类型
                    // voiceType: "zh-CN-XiaoxiaoNeural ", // 用 Azure Text to Speech API 中的声音标识符替换这里的值
                    voiceDemol:
                        "https://being-app-1252166962.cos.ap-nanjing.myqcloud.com/resource/aibot/user_blob/en-US-JennyNeural_z100001_1.wav",
                    rate: "medium", //说话速率  （"x-slow": 极慢slow": 慢"medium": 中速（默认值）"fast": 快"x-fast": 极快）
                    pitch: "medium", //大声或小声 （"x-low": 极慢low": 慢"medium": 中速（默认值）"high": 快"x-high": 极快）
                    volume: "medium", //"silent": 静音 "x-soft": 极低"soft": 低"medium": 中等（默认值）"loud": 高"x-loud": 极高
                    style: "whispering", // neutral（中性）：中性的语气，没有特定的情感色彩。cheerful（高兴的）：表示高兴、愉快或积极的语气。serious（严肃的）：表示严肃、正式或庄重的语气。angry（愤怒的）：表示愤怒、生气或激动的语气。fearful（害怕的）：表示害怕、担忧或不安的语气。sad（悲伤的）：表示悲伤、沮丧或不快的语气。frustrated（沮丧的）：表示沮丧、不满或恼怒的语气。excited（兴奋的）：表示兴奋、激动或充满活力的语气。disgusted（反感的）：表示反感、讨厌或厌relaxed（轻松的）：表示轻松、安逸或无忧无虑的语气。恶的语气。
                    styledegree: "1", //0-1之间
                },
                {
                    uid: "z100002",
                    id: "2",
                    name: this.$t("showSoundsDialog.text7"),
                    voiceType: "en-US-JennyNeural",
                    // voiceType: "zh-CN-XiaoshuangNeural",
                    voiceDemol:
                        "https://being-app-1252166962.cos.ap-nanjing.myqcloud.com/resource/aibot/user_blob/en-US-JennyNeural_z100002_2.wav",
                    rate: "medium", //说话速率
                    pitch: "medium", //大声或小声
                    volume: "medium", //loud soft 等
                    style: "whispering", // neutral（中性）：中性的语气，没有特定的情感色彩。cheerful（高兴的）：表示高兴、愉快或积极的语气。serious（严肃的）：表示严肃、正式或庄重的语气。angry（愤怒的）：表示愤怒、生气或激动的语气。fearful（害怕的）：表示害怕、担忧或不安的语气。sad（悲伤的）：表示悲伤、沮丧或不快的语气。frustrated（沮丧的）：表示沮丧、不满或恼怒的语气。excited（兴奋的）：表示兴奋、激动或充满活力的语气。disgusted（反感的）：表示反感、讨厌或厌relaxed（轻松的）：表示轻松、安逸或无忧无虑的语气。恶的语气。
                    styledegree: "1", //0-1之间
                },
                {
                    uid: "z100003",
                    id: "3",
                    name: this.$t("showSoundsDialog.text8"),
                    voiceType: "en-US-AriaNeural",
                    // voiceType: "zh-CN-XiaohanNeural",
                    voiceDemol:
                        "https://being-app-1252166962.cos.ap-nanjing.myqcloud.com/resource/aibot/user_blob/en-US-JennyNeural_z100003_3.wav",
                    rate: "medium", //说话速率
                    pitch: "medium", //大声或小声
                    volume: "medium", //loud soft 等
                    style: "whispering", // neutral（中性）：中性的语气，没有特定的情感色彩。cheerful（高兴的）：表示高兴、愉快或积极的语气。serious（严肃的）：表示严肃、正式或庄重的语气。angry（愤怒的）：表示愤怒、生气或激动的语气。fearful（害怕的）：表示害怕、担忧或不安的语气。sad（悲伤的）：表示悲伤、沮丧或不快的语气。frustrated（沮丧的）：表示沮丧、不满或恼怒的语气。excited（兴奋的）：表示兴奋、激动或充满活力的语气。disgusted（反感的）：表示反感、讨厌或厌relaxed（轻松的）：表示轻松、安逸或无忧无虑的语气。恶的语气。
                    styledegree: "1", //0-1之间
                },
                {
                    uid: "z100004",
                    id: "4",
                    name: this.$t("showSoundsDialog.text9"),
                    voiceType: "en-US-AshleyNeural",
                    // voiceType: "zh-CN-XiaochenNeural",
                    voiceDemol:
                        "https://being-app-1252166962.cos.ap-nanjing.myqcloud.com/resource/aibot/user_blob/en-US-JennyNeural_z100004_4.wav",
                    rate: "medium", //说话速率
                    pitch: "medium", //大声或小声
                    volume: "medium", //loud soft 等
                    style: "whispering", // neutral（中性）：中性的语气，没有特定的情感色彩。cheerful（高兴的）：表示高兴、愉快或积极的语气。serious（严肃的）：表示严肃、正式或庄重的语气。angry（愤怒的）：表示愤怒、生气或激动的语气。fearful（害怕的）：表示害怕、担忧或不安的语气。sad（悲伤的）：表示悲伤、沮丧或不快的语气。frustrated（沮丧的）：表示沮丧、不满或恼怒的语气。excited（兴奋的）：表示兴奋、激动或充满活力的语气。disgusted（反感的）：表示反感、讨厌或厌relaxed（轻松的）：表示轻松、安逸或无忧无虑的语气。恶的语气。
                    styledegree: "1", //0-1之间
                },
                {
                    uid: "z100005",
                    id: "5",
                    name: this.$t("showSoundsDialog.text10"),
                    voiceType: "en-US-AmberNeural",
                    // voiceType: "zh-CN-XiaoyiNeural",
                    voiceDemol:
                        "https://being-app-1252166962.cos.ap-nanjing.myqcloud.com/resource/aibot/user_blob/en-US-JennyNeural_z100005_5.wav",
                    rate: "medium", //说话速率
                    pitch: "medium", //大声或小声
                    volume: "medium", //loud soft 等
                    style: "whispering", // neutral（中性）：中性的语气，没有特定的情感色彩。cheerful（高兴的）：表示高兴、愉快或积极的语气。serious（严肃的）：表示严肃、正式或庄重的语气。angry（愤怒的）：表示愤怒、生气或激动的语气。fearful（害怕的）：表示害怕、担忧或不安的语气。sad（悲伤的）：表示悲伤、沮丧或不快的语气。frustrated（沮丧的）：表示沮丧、不满或恼怒的语气。excited（兴奋的）：表示兴奋、激动或充满活力的语气。disgusted（反感的）：表示反感、讨厌或厌relaxed（轻松的）：表示轻松、安逸或无忧无虑的语气。恶的语气。
                    styledegree: "1", //0-1之间
                },
            ],
        };
    },
    computed: {
        ...mapState([
            "voiceType",
            "voiceRate",
            "voicePitch",
            "voiceVolume",
            "voiceStyle",
            "voiceStyledegree",
            "aiChatExtInfo",
            "aiChatUserInfo",
            "aiChatGFInfo",
        ]),
    },
    created() {
        const matchingVoice = this.list.find((item) => item.voiceType === this.voiceType);
        if (matchingVoice) {
            this.activeId = matchingVoice.id;
        }
    },
    mounted() {},
    methods: {
        selectSounds(val, val1, val2, val3, val4, val5, val6) {
            this.activeId = val;
            this.val1 = val1;
            this.val2 = val2;
            this.val3 = val3;
            this.val4 = val4;
            this.val5 = val5;
            this.val6 = val6;
        },
        closeDialog() {
            this.$emit("closeshowSounds", false);
            const matchingVoice = this.list.find((item) => item.voiceType === this.voiceType);
            if (matchingVoice) {
                this.activeId = matchingVoice.id;
            } else {
                this.activeId = 0;
            }
        },
        //解锁方法
        unClock() {
            appChatUrlInfo(`${process.env.VUE_APP_GO_TO_URL}buy-vip?gid=${this.aiChatGFInfo.gid}&vip=vvip`);
            this.$emit("closeshowSounds", false);
        },
        //点击确认方法，要加判断看当前时间跟有效期对比
        confirm() {
            if (this.aiChatExtInfo.is_vvip && this.aiChatUserInfo.vvip_expire_at > this.dateNow) {
                this.changeVoice();
                this.$emit("closeshowSounds", false);
            } else {
                this.$Toast({
                    type: "fail",
                    message: this.$t("showSoundsDialog.text11"),
                });
            }
        },
        changeVoice() {
            store.commit("updateVoiceType", this.val1);
            store.commit("updateVoiceRate", this.val2);
            store.commit("updateVoicePitch", this.val3);
            store.commit("updateVoiceVolume", this.val4);
            store.commit("updateVoiceStyle", this.val5);
            store.commit("updateVoiceStyledegree", this.val6);
        },

        //合成语音方法
        async synthesizeSpeech(voiceType, rate, pitch, volume, style, styledegree, uid, id) {
            // 替换为你自己的 Azure 订阅密钥和区域
            const ssmlText = "你好啊，Please note that the following neural voices are retired";
            const speechConfig = sdk.SpeechConfig.fromSubscription(
                process.env.VUE_APP_AZURE_KEY,
                process.env.VUE_APP_AZURE_REGION
            );
            let synthesizer = new sdk.SpeechSynthesizer(speechConfig);

            const voiceConfig = `
                <voice name="${voiceType}">
                    <mstts:express-as xml:lang="en-US" style="${style}" styledegree="${styledegree}" xmlns:mstts="https://www.w3.org/2001/mstts">
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
                                ${ssmlText}
                        </prosody>
                    </mstts:express-as>
                </voice>
            `;

            const ssmlTextWithConfig = `
                <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
                    ${voiceConfig}
                </speak>
            `;
            const shouldUpload = await this.searchIsHaveFile(voiceType, id, uid);
            if (shouldUpload) {
                return this.downloadAudioData(voiceType, id, uid);
            } else {
                return this.uploadAudioData(voiceType, synthesizer, ssmlTextWithConfig, id, uid);
            }
        },
        // 下载操作
        async downloadAudioData(voiceType, id, uid) {
            const result = await this.downloadAudio(voiceType, id, uid);
            if (result) {
                lastAudioDuration = await this.calculateAudioDuration(result);
                return lastAudioDuration || 0;
            } else {
                // 处理下载失败的情况
                return 0; // 或者其他错误处理
            }
        },
        //上传操作
        async uploadAudio(voiceType, audioBlob, id, uid) {
            return new Promise((resolve, reject) => {
                getOssObj({})
                    .then(async (res) => {
                        resolve(res.data);
                        const cos = new COS({
                            SecretId: res.data.cred.Credentials.TmpSecretId,
                            SecretKey: res.data.cred.Credentials.TmpSecretKey,
                            SecurityToken: res.data.cred.Credentials.Token,
                        });

                        // 上传文件到腾讯云对象存储
                        cos.putObject(
                            {
                                Bucket: res.data.bucket,
                                Region: res.data.region,
                                Key: `/resource/aibot/user_blob/${voiceType}_${uid}_${id}.wav`, // 设置文件在COS中的路径
                                Body: audioBlob,
                            },
                            async (err, data) => {
                                if (err) {
                                    console.error("Upload error:", err);
                                } else {
                                    console.log("首次合成，上传成功", data);
                                }
                            }
                        );
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

        // 合成出二级制音频数据给上传方法
        async uploadAudioData(voiceType, synthesizer, ssmlTextWithConfig, id, uid) {
            this.loading = true;
            const result = await new Promise((resolve, reject) => {
                synthesizer.speakSsmlAsync(
                    ssmlTextWithConfig,
                    (result) => {
                        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            resolve(result);
                        } else {
                            resolve("合成失败: " + result.errorDetails);
                        }
                        synthesizer.close();
                        synthesizer = undefined;
                    },
                    (error) => {
                        reject("合成出错: " + error);
                        synthesizer.close();
                        synthesizer = undefined;
                    }
                );
            });

            const audioData = result.audioData;
            const audioBlob = new Blob([audioData], { type: "audio/wav" });
            await this.uploadAudio(voiceType, audioBlob, id, uid);
            lastAudioDuration = await this.calculateAudioDuration(audioBlob);
            this.loading = false;
            return lastAudioDuration || 0;
        },
        // 下载操作，返回音频 Blob
        async downloadAudio(voiceType, id, uid) {
            return new Promise((resolve, reject) => {
                getOssObj({})
                    .then(async (res) => {
                        const cos = new COS({
                            SecretId: res.data.cred.Credentials.TmpSecretId,
                            SecretKey: res.data.cred.Credentials.TmpSecretKey,
                            SecurityToken: res.data.cred.Credentials.Token,
                        });
                        // 检查是否有正在播放的音频，如果有，暂停它
                        if (currentlyPlayingAudioElement) {
                            currentlyPlayingAudioElement.pause();
                        }
                        // 下载
                        cos.getObject(
                            {
                                Bucket: res.data.bucket,
                                Region: res.data.region,
                                Key: `/resource/aibot/user_blob/${voiceType}_${uid}_${id}.wav`, // 设置文件在COS中的路径
                                DataType: "blob",
                            },
                            async (err, data) => {
                                if (err) {
                                    console.error("Download error:", err);
                                    resolve(null); // 返回 null 表示下载失败
                                } else {
                                    console.log(data, "下载成功");
                                    // 添加事件监听器来追踪音频播放状态
                                    const objectUrl = `${res.data.cdn_domain}/resource/aibot/user_blob/${voiceType}_${uid}_${id}.wav`;
                                    const audioElement = new Audio(objectUrl);
                                    audioElement.id = `${voiceType}_${uid}_${id}`;

                                    // 添加事件监听器来追踪音频播放状态
                                    audioElement.addEventListener("play", () => {
                                        currentlyPlayingAudioElement = audioElement;
                                    });

                                    audioElement.addEventListener("ended", () => {
                                        currentlyPlayingAudioElement = null; // 清除当前播放的音频元素
                                    });
                                    audioElement.play();

                                    resolve(data.Body); // 返回音频 Blob
                                }
                            }
                        );
                    })
                    .catch((err) => {
                        console.error("Download error:", err);
                        reject(null); // 返回 null 表示下载失败
                    });
            });
        },

        // 获取音频时长
        async calculateAudioDuration(audioBlob) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(audioBlob);
            });

            try {
                const audioBuffer = await new Promise((resolve, reject) => {
                    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
                });

                // 获取音频文件的采样率和样本数
                const sampleRate = audioBuffer.sampleRate;
                const sampleCount = audioBuffer.length;

                // 计算音频时长
                const durationInSeconds = Math.ceil(sampleCount / sampleRate);
                return durationInSeconds;
            } catch (error) {
                console.error("Error decoding audio data:", error);
                return 0; // 返回默认值或错误处理
            }
        },
        //查找腾讯云是否有存储过的文件
        async searchIsHaveFile(voiceType, id, uid) {
            return new Promise((resolve, reject) => {
                getOssObj({})
                    .then(async (res) => {
                        const cos = new COS({
                            SecretId: res.data.cred.Credentials.TmpSecretId,
                            SecretKey: res.data.cred.Credentials.TmpSecretKey,
                            SecurityToken: res.data.cred.Credentials.Token,
                        });
                        const fileNameToFind = `resource/aibot/user_blob/${voiceType}_${uid}_${id}.wav`;
                        // 查找
                        cos.headObject(
                            {
                                Bucket: res.data.bucket,
                                Region: res.data.region,
                                Key: fileNameToFind,
                            },
                            function (err, data) {
                                if (data) {
                                    resolve(true); // 找到文件，返回 true
                                } else if (err.statusCode == 404) {
                                    resolve(false); // 未找到文件，返回 false
                                } else if (err.statusCode == 403) {
                                    resolve(false); // 未找到文件，返回 false
                                }
                            }
                        );
                    })
                    .catch((err) => {
                        console.log("发生错误:", err);
                        reject(err);
                    });
            });
        },
    },
};
</script>

<style scoped lang="less">
@import "../../styles/mixin.less";
.sounds-dialog {
    .van-popup {
        top: none !important;
    }
    &:deep(.pop) {
        top: auto !important;
        .mixin-SF-medium;
        background: #1f212b;
        min-height: 5.15rem;
        .top {
            width: 100%;
            height: 0.52rem;
            line-height: 0.52rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .l {
                font-size: 0.18rem;
                color: #ffffff;
                font-weight: bold;
            }
            .r {
                width: 0.57rem;
                height: 0.18rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(90deg, #be34f3 0%, #7152eb 100%);
                border-radius: 18px;
                margin-left: 0.04rem;
                & > img {
                    width: 0.2rem;
                    height: 0.14rem;
                }
                & > p {
                    font-size: 0.12rem;
                    color: #ffffff;
                }
            }
        }
        .line {
            height: 0.01rem;
            background: #161820;
            margin-bottom: 0.15rem;
        }
        .en {
            font-size: 0.14rem;
            color: #ffd961;
            margin-bottom: 0.15rem;
        }
        .b-wrap {
            flex: 1;
            padding: 0 0.24rem;
            box-sizing: border-box;
            .soundsList {
                width: 100%;
                height: 0.48rem;
                border-radius: 0.48rem;
                margin-bottom: 0.12rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 0.2rem 0 0.04rem;
                box-sizing: border-box;
                .wrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    & > img {
                        width: 0.4rem;
                        height: 0.4rem;
                        border-radius: 0.4rem;
                        margin-right: 0.12rem;
                    }
                }
                .activeImg {
                    width: 0.2rem;
                    height: 0.2rem;
                }
            }
            .normal {
                background: #2a2d39;
                .wrap {
                    & > p {
                        font-size: 0.16rem;
                        color: #ffffff;
                    }
                }
            }
            .active {
                background: #ffffff;
                .wrap {
                    & > p {
                        font-size: 0.16rem;
                        color: #000000;
                    }
                }
            }
        }
        .button-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 0.2rem;
            .cancel {
                width: 1.61rem;
                height: 0.48rem;
                background: #2a2d39;
                border-radius: 0.48rem;
                border: 0;
                color: #707988;
                font-size: 0.16rem;
                font-weight: bold;
                margin-right: 0.12rem;
            }
            .unlock {
                width: 1.61rem;
                height: 0.48rem;
                background: linear-gradient(90deg, #ff5f74 0%, #ff3c6a 100%);
                border-radius: 0.48rem;
                border: 0;
                color: #ffffff;
                font-size: 0.16rem;
                font-weight: bold;
            }
        }
        .content {
            margin-top: 0.12rem;
            font-size: 0.14rem;
            color: #666d79;
            font-weight: 400;
            margin-bottom: 0.46rem;
        }
    }
}
</style>
