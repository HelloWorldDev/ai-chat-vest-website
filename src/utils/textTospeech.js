import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { getOssObj } from "@/service/api.js";
import COS from "cos-js-sdk-v5";
import store from "@/store";
let lastAudioDuration = 0; // 保存上一次合成的音频时长
let speechObj = {};
let currentlyPlayingAudioElement = null; // 保存当前播放的音频的
let ossCredentials = null; // 保存OSS临时凭证的全局变量

// 异步获取OSS临时凭证，如果已经存在有效的凭证，则不再调用接口
async function getOSSCredentials() {
    if (ossCredentials && isCredentialsValid(ossCredentials)) {
        return ossCredentials;
    }
    try {
        if (ossCredentials === null || !isCredentialsValid(ossCredentials)) {
            const response = await getOssObj({});
            ossCredentials = response.data;
        }
        return ossCredentials;
    } catch (error) {
        console.error("获取OSS凭证出错:", error);
        throw error;
    }
}

// 检查OSS凭证是否有效
function isCredentialsValid(credentials) {
    const expiration = credentials.cred.ExpiredTime; // 获取凭证的过期时间
    const now = Date.now() / 1000; // 获取当前时间戳（秒）
    return now < expiration;
}

// 入口方法
export async function getVoiceDuration(val, text, id, uid) {
    await getOSSCredentials();
    const ssmlText = text;
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.VUE_APP_AZURE_KEY, process.env.VUE_APP_AZURE_REGION);
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);
    const voiceConfig = `
        <voice name="${store.state.voiceType}">
            <mstts:express-as style="${store.state.voiceStyle}" styledegree="${store.state.voiceStyledegree}" xmlns:mstts="https://www.w3.org/2001/mstts">
                <prosody rate="${store.state.voicePitch}" pitch="${store.state.voicePitch}" volume="${store.state.voiceVolume}">
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
    try {
        if (val == 1) {
            let isHaveFile = await searchIsHaveFile(store.state.voiceType, id, uid);
            if (isHaveFile) {
                const downloadResult = await downloadAudioData(store.state.voiceType, id, uid);
                if (downloadResult.lastAudioDuration === 0) {
                    throw new Error("播放时长为 0");
                }
                return downloadResult;
            } else {
                const uploadResult = await uploadAudioData(store.state.voiceType, synthesizer, ssmlTextWithConfig, id, uid);
                if (uploadResult.lastAudioDuration === 0) {
                    throw new Error("播放时长为 0");
                }
                return uploadResult;
            }
        } else {
            const uploadResult = await uploadAudioData(store.state.voiceType, synthesizer, ssmlTextWithConfig, id, uid);
            if (uploadResult.lastAudioDuration === 0) {
                throw new Error("播放时长为 0");
            }
            return uploadResult;
        }
    } catch (error) {
        console.error("合成出错: " + error);
        // 不设置 URL
        throw error; // 抛出错误以便在调用方法的.catch中处理
    }
}
// 合成出二进制音频数据并上传
async function uploadAudioData(voiceType, synthesizer, ssmlTextWithConfig, id, uid) {
    try {
        const result = await new Promise((resolve, reject) => {
            synthesizer.speakSsmlAsync(
                ssmlTextWithConfig,
                async (result) => {
                    console.log(result.reason, "结果");
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        const audioData = result.audioData;
                        const audioBlob = new Blob([audioData], { type: "audio/wav" });
                        const blobUrl = await uploadAudio(audioBlob, id, uid);
                        speechObj.blobUrl = blobUrl;
                        lastAudioDuration = await calculateAudioDuration(audioBlob);
                        speechObj.lastAudioDuration = lastAudioDuration;
                        speechObj.voiceType = voiceType;
                        resolve(speechObj);
                    } else {
                        reject("合成失败: " + result.errorDetails);
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

        return result;
    } catch (error) {
        console.error("合成或上传出错: " + error);
        // 不设置 URL
        throw error; // 抛出错误以便在调用方法的 .catch 中处理
    }
}
// 下载操作
async function downloadAudioData(voiceType, id, uid) {
    const result = await downloadAudio(id, uid);
    if (result) {
        const { objectUrl, objectBlob } = result;
        // 现在可以访问 objectUrl 和 dataBody
        lastAudioDuration = await calculateAudioDuration(objectBlob);
        speechObj.blobUrl = objectUrl;
        speechObj.lastAudioDuration = lastAudioDuration;
        speechObj.voiceType = voiceType;
    } else {
        console.log("出错了");
    }
    return speechObj;
}
//上传操作
async function uploadAudio(audioBlob, id, uid) {
    return new Promise((resolve, reject) => {
        const cos = new COS({
            SecretId: ossCredentials.cred.Credentials.TmpSecretId,
            SecretKey: ossCredentials.cred.Credentials.TmpSecretKey,
            SecurityToken: ossCredentials.cred.Credentials.Token,
        });

        // 上传文件到腾讯云对象存储
        cos.putObject(
            {
                Bucket: ossCredentials.bucket,
                Region: ossCredentials.region,
                Key: `/resource/aibot/user_blob/${store.state.voiceType}_${uid}_${id}.wav`, // 设置文件在COS中的路径
                Body: audioBlob,
            },
            async (err, data) => {
                if (err) {
                    reject(err);
                    console.error("Upload error:", err);
                } else {
                    console.log("首次合成，上传成功", data);
                    const url = `${ossCredentials.cdn_domain}/resource/aibot/user_blob/${store.state.voiceType}_${uid}_${id}.wav`;
                    resolve(url);
                }
            }
        );
    });
}
// 下载操作，返回音频 Blob
async function downloadAudio(id, uid) {
    return new Promise((resolve, reject) => {
        const cos = new COS({
            SecretId: ossCredentials.cred.Credentials.TmpSecretId,
            SecretKey: ossCredentials.cred.Credentials.TmpSecretKey,
            SecurityToken: ossCredentials.cred.Credentials.Token,
        });
        // 检查是否有正在播放的音频，如果有，暂停它
        if (currentlyPlayingAudioElement) {
            currentlyPlayingAudioElement.pause();
        }
        // 下载
        cos.getObject(
            {
                Bucket: ossCredentials.bucket,
                Region: ossCredentials.region,
                Key: `/resource/aibot/user_blob/${store.state.voiceType}_${uid}_${id}.wav`, // 设置文件在COS中的路径
                DataType: "blob",
            },
            async (err, data) => {
                if (err) {
                    console.error("Download error:", err);
                    reject(err); // 返回 null 表示下载失败
                } else {
                    console.log(data, "下载成功");
                    // 添加事件监听器来追踪音频播放状态
                    const objectUrl = `${ossCredentials.cdn_domain}/resource/aibot/user_blob/${store.state.voiceType}_${uid}_${id}.wav`;
                    const objectBlob = data.Body;
                    resolve({ objectUrl, objectBlob });
                }
            }
        );
    });
}

// 获取音频时长
async function calculateAudioDuration(audioBlob) {
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
}
//查找腾讯云是否有存储过的文件
async function searchIsHaveFile(voiceType, id, uid) {
    return new Promise((resolve, reject) => {
        const cos = new COS({
            SecretId: ossCredentials.cred.Credentials.TmpSecretId,
            SecretKey: ossCredentials.cred.Credentials.TmpSecretKey,
            SecurityToken: ossCredentials.cred.Credentials.Token,
        });
        const fileNameToFind = `resource/aibot/user_blob/${voiceType}_${uid}_${id}.wav`;
        // 查找
        cos.headObject(
            {
                Bucket: ossCredentials.bucket,
                Region: ossCredentials.region,
                Key: fileNameToFind,
            },
            function (err, data) {
                if (data) {
                    resolve(true); // 找到文件，返回 true
                } else if (err.statusCode == 404) {
                    resolve(false); // 未找到文件，返回 false
                } else if (err.statusCode == 403) {
                    resolve(false); // 未找到文件，返回 false
                } else {
                    reject(err);
                }
            }
        );
    });
}

//暂停已读消息
export function pauseSpeech() {
    if (currentlyPlayingAudioElement) {
        currentlyPlayingAudioElement.pause();
        currentlyPlayingAudioElement.src = "";
    }
}
