import { ref } from 'vue';
import { defineStore } from 'pinia';

// 响应式用户信息
const userInfo = ref({});
// 登录状态标识
const isLoggedIn = ref(false);

export const useUserInfoStore = defineStore('userInfo', {
    state: () => ({
        userInfo: userInfo.value,
        isLoggedIn: isLoggedIn.value
    }),
    actions: {
        // 设置用户信息（登录时调用）
        setUserInfo(val) {
            userInfo.value = val;
            isLoggedIn.value = true; // 标记为已登录
        },
        // 清除用户信息（退出登录时调用）
        clearUserInfo() {
            userInfo.value = {}; // 清空用户信息
            isLoggedIn.value = false; // 标记为未登录
        }
    },
    persist: true // 持久化存储（需配合pinia-plugin-persistedstate）
});