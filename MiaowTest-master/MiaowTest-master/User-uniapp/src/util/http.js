// 云托管请求封装
import { useUserInfoStore } from '@/stores/modules/UserinfoStore'; // 引入Pinia store

function cloudRequest(options) {
    return new Promise((resolve, reject) => {
        if (!wx.cloud) {
            reject(new Error('请在微信小程序环境下使用云托管API'));
            return;
        }

        // 基础配置
        const baseURl = 'https://your-api-base-url.com'; // 补充实际基础URL
        const escconfig = {
            cloudService: 'your-cloud-service', // 补充云服务名称
            cloudEnv: 'your-cloud-env' // 补充云环境ID
        };

        // 处理请求参数
        const processedOptions = {
            ...options,
            method: options.method || 'GET'
        };

        // 处理URL
        if (!processedOptions.url.startsWith('http')) {
            processedOptions.url = baseURl + processedOptions.url;
        }

        // 设置超时
        processedOptions.timeout = processedOptions.timeout || 40000;

        // 获取平台信息
        const getPlatform = () => {
            const platform = uni.getSystemInfoSync().platform;
            return platform === 'devtools' ? 'h5' : platform;
        };
        const platform = getPlatform();
        const clientHeader = platform === 'h5' ? 'web' : 'miniapp';

        // 构建请求头
        const finalHeader = {
            'X-WX-SERVICE': escconfig.cloudService,
            'source-client': clientHeader,
            'platform': platform,
            ...processedOptions.header
        };

        // 添加token
        const token = uni.getStorageSync('token');
        if (token) {
            finalHeader.Authorization = `Bearer ${token}`;
        }

        // 发起请求
        wx.cloud.callContainer({
            config: {
                env: escconfig.cloudEnv
            },
            path: processedOptions.url, // 使用处理后的完整URL
            header: finalHeader,
            method: processedOptions.method,
            data: processedOptions.data || {},
            success: res => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else if (res.statusCode === 401) {
                    // 401处理：清除状态并跳转登录
                    uni.removeStorageSync('token');
                    const userInfoStore = useUserInfoStore();
                    userInfoStore.clearUserInfo();
                    uni.redirectTo({ url: '/pages/login/login' }); // 直接跳登录页，避免返回
                    reject(new Error('登录已过期，请重新登录'));
                } else {
                    const errorMsg = res.data?.message || `请求错误（${res.statusCode}）`;
                    uni.showToast({ title: errorMsg, icon: 'none', mask: true });
                    reject(new Error(errorMsg));
                }
            },
            fail: err => {
                uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', mask: true });
                reject(err);
            }
        });
    });
}

// 简化GET/POST调用
export const http = {
    get: (url, params = {}, header = {}) => cloudRequest({ url, method: 'GET', data: params, header }),
    post: (url, data = {}, header = {}) => cloudRequest({ url, method: 'POST', data, header })
};