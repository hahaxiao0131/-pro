<template>
  <view class="my-page">
    <view class="user-info" v-if="userInfoStore.isLoggedIn">
      <image :src="userInfoStore.userInfo.avatar" class="avatar"></image>
      <text class="username">{{ userInfoStore.userInfo.username }}</text>
    </view>
    <button class="logout-btn" @click="handleLogout" v-if="userInfoStore.isLoggedIn">
      退出登录
    </button>
  </view>
</template>

<script setup>
import { useUserInfoStore } from '@/stores/modules/UserinfoStore';
import { onMounted } from 'vue';

const userInfoStore = useUserInfoStore();

// 页面加载时恢复登录状态
onMounted(() => {
  userInfoStore.restoreFromStorage();
});

// 退出登录处理
const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出当前账号吗？',
    confirmText: '退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync('token');
        uni.removeStorageSync('userInfo');
        // 清除Pinia状态
        userInfoStore.clearUserInfo();
        // 跳转登录页（替换当前页面栈）
        uni.reLaunch({ url: '/pages/login/login' });
        // 提示信息
        uni.showToast({ title: '已退出登录', icon: 'success' });
      }
    }
  });
};
</script>

<style scoped>
.my-page {
  padding: 30rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
.username {
  font-size: 36rpx;
  margin-top: 20rpx;
  display: block;
}
.logout-btn {
  margin-top: 50rpx;
  background-color: #ff4d4f;
  color: white;
}
</style>