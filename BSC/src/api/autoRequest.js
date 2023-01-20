import request from "@/utils/request";

import Dayjs from "dayjs";



// 自动重试随机数量
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}



export const axiosAutoTry = function (data) {
    data = Object.assign({
        delayTimes: getRandomInt(1200, 2500)
    }, data)
    return new Promise((resolve, reject) => {
        request(data)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                // 有重试次数
                if (typeof data.__try_count == "number" && data.__try_count > 0) {
                    data.__try_count--;
                    if (error.code == "ECONNABORTED") {
                        // 中止，超时 Socket 连接错误
                        return resolve(axiosAutoTry(data));
                    } else if (error.code == "ECONNRESET") {
                        // Socket 连接错误
                        return resolve(axiosAutoTry(data));
                    } else {
                        if (error.response && error.response.status == 407) {
                            // 代理407
                            return setTimeout((v) => {
                                resolve(axiosAutoTry(data));
                            }, getRandomInt(100, 500));
                        } else if (error.response && error.response.status == 503) {
                            // 服务器异常
                            return setTimeout((v) => {
                                resolve(axiosAutoTry(data));
                            }, 500 + Math.random() * 500);
                        } else if (error.response && error.response.status == 429) {
                            // 并发超过限制
                            return setTimeout((v) => {
                                resolve(axiosAutoTry(error.config));
                            },data.delayTimes);
                        }
                    }
                }
                reject(error);
            });
    });
}



//自动重试
function retryAdapterEnhancer(adapter, options) {
    const {
        times = 0, delay = 300
    } = options;

    return async (config) => {
        const {
            retryTimes = times, retryDelay = getRandomInt(200, 800)
        } = config;
        let __retryCount = 0;
        const request = async () => {
            try {
                return await adapter(config);
            } catch (err) {
                if (!retryTimes || __retryCount >= retryTimes) {
                    return Promise.reject(err);
                }
                __retryCount++;
                // 延时处理
                const delay = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, retryDelay);
                });
                // 重新发起请求
                return delay.then(() => {
                    return request();
                });
            }
        };
        return request();
    };
}


