<template>
  <!-- 假设页面中有退出登录按钮 -->
  <button @click="handleLogout">退出登录</button>
</template>

<script setup>
import { useUserInfoStore } from '@/stores/modules/UserinfoStore';
import { clearUserInfo } from '@/util/cacheCleaner';

const userInfoStore = useUserInfoStore();

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 1. 清除Pinia中的用户信息
        userInfoStore.clearUserInfo();
        // 2. 清除本地存储的token和用户信息
        clearUserInfo();
        // 3. 跳转到登录页（或首页）
        uni.redirectTo({ url: '/pages/login/login' }); // 建议用redirectTo避免返回原页面
        // 4. 提示退出成功
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};
</script>