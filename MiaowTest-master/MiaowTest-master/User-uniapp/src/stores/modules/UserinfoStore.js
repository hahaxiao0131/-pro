import { defineStore } from 'pinia';
import { ref } from 'vue';

// 初始化状态
const initUserInfo = {
    uid: '',
    username: '',
    avatar: '',
    role: ''
};

export const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        userInfo: { ...initUserInfo },
        isLoggedIn: false
    }),
    actions: {
        // 设置用户信息（登录时调用）
        setUserInfo(userData) {
            this.userInfo = { ...this.userInfo, ...userData };
            this.isLoggedIn = true;
        },
        // 清除用户信息（退出登录时调用）
        clearUserInfo() {
            this.userInfo = { ...initUserInfo };
            this.isLoggedIn = false;
        },
        // 从本地存储恢复状态（初始化时调用）
        restoreFromStorage() {
            const storedUser = uni.getStorageSync('userInfo');
            const token = uni.getStorageSync('token');
            if (storedUser && token) {
                this.setUserInfo(storedUser);
            }
        }
    },
    persist: {
        key: 'userInfoStorage',
        storage: {
            getItem: (key) => uni.getStorageSync(key),
            setItem: (key, value) => uni.setStorageSync(key, value),
            removeItem: (key) => uni.removeStorageSync(key)
        }
    }
});