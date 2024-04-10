//统一管理api
import { base_aibot_mini } from "./base"; // 导入接口域名列表
import { _post } from "./tool"; // 导入http中创建的axios实例
//聊天
export const getAiBotChatList = (params) => _post(base_aibot_mini + "/chat/list", params);
export const sendAiBotChatAsync = (params) => _post(base_aibot_mini + "/chat/async/send", params);
export const getAiBotChatAsyncQuery = (params) => _post(base_aibot_mini + "/chat/async/query", params);
export const getAiBotChatHistory = (params) => _post(base_aibot_mini + "/chat/history", params);
export const sendAiBotChatAudioReadable = (params) => _post(base_aibot_mini + "/chat/audio/readable", params);
export const sendAiBotChatBgSet = (params) => _post(base_aibot_mini + "/chat/bg/set", params);
export const sendAiBotChatPlus18Set = (params) => _post(base_aibot_mini + "/chat/plus18/set", params);
export const sendAiBotChatUnlock = (params) => _post(base_aibot_mini + "/chat/unlock", params);
// 获取当前人物信息和关系
export const getAiBotChatEnter = (params) => _post(base_aibot_mini + "/chat/enter", params);
//vip商店接口
export const getVipConfig = (params) => _post(base_aibot_mini + "/vip/config", params);
//宝石商店接口
export const getGemConfig = (params) => _post(base_aibot_mini + "/gem/config", params);
//宝石变动记录
export const getGemDetials = (params) => _post(base_aibot_mini + "/gem/log", params);
//获取腾讯存储信息
export const getOssObj = (params) => _post(base_aibot_mini + "/v1/aibot/storage/cred", params);
//获取任务列表
export const getTaskList = (params) => _post(base_aibot_mini + "/aibot/task/info", params);
//领取任务奖励
export const taskClaim = (params) => _post(base_aibot_mini + "/aibot/task/claim", params);
//积分变动记录
export const getPointsDetials = (params) => _post(base_aibot_mini + "/supepoint/log", params);
export default {
    getAiBotChatList,
    sendAiBotChatAsync,
    getAiBotChatAsyncQuery,
    getAiBotChatHistory,
    sendAiBotChatAudioReadable,
    sendAiBotChatBgSet,
    sendAiBotChatPlus18Set,
    sendAiBotChatUnlock,
    getAiBotChatEnter,
    getVipConfig,
    getGemConfig,
    getGemDetials,
    getOssObj,
    getTaskList,
    taskClaim,
    getPointsDetials,
};
