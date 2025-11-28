// http.js 关键修改
function http(options) {
    // 获取本地token（如果有）
    const token = uni.getStorageSync('token');

    // 统一添加请求头
    const header = {
        'Content-Type': 'application/json',
        ...options.header
    };

    // 如果token存在，才添加Authorization头（避免空token导致请求失败）
    if (token) {
        header['Authorization'] = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: options.url,
            method: options.method || 'GET',
            data: options.data,
            header: header,
            success: (res) => {
                // 处理401错误（token无效/过期）
                if (res.statusCode === 401) {
                    // 清除无效状态
                    uni.removeStorageSync('token');
                    const userInfoStore = useUserInfoStore();
                    userInfoStore.clearUserInfo();
                    // 跳转到登录页（避免循环请求）
                    uni.redirectTo({ url: '/pages/login/login' });
                    reject('登录状态失效，请重新登录');
                    return;
                }
                // 其他状态码处理
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    reject(`请求失败：${res.data.message || '服务器错误'}`);
                }
            },
            fail: (err) => {
                // 区分网络错误和服务器错误
                if (err.errMsg.includes('timeout') || err.errMsg.includes('fail')) {
                    reject('连接服务器超时，请检查网络或稍后重试');
                } else {
                    reject(`请求失败：${err.errMsg}`);
                }
            }
        });
    });
}