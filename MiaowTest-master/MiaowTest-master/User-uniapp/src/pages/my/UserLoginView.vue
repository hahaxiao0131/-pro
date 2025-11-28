<template>
  <!-- 原有模板结构保持不变，主要修改登录逻辑 -->
  <view class="login-btn" @click="handleLogin">登 录</view>
  <view class="wx-btn" @click="handleUseWXLogin">
    <text class="iconfont icon-weixin"></text>
    <text class="txt">微信一键登录</text>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { UserAccountLogin } from '../../API/My/UserLoginAPI';
import { UserInfoStore } from '../../stores/modules/UserinfoStore';
import wechatLogin from '../../util/wechatLogin';

const showPwd = ref(false);
const rememberMe = ref(false); // "记住我"开关
const userInfoStore = UserInfoStore();

const formData = reactive({
  account: '',
  password: ''
});

// 账号密码登录
const handleLogin = async () => {
  if (!formData.account || !formData.password) {
    uni.showToast({ icon: 'none', title: '请填写完整' });
    return;
  }

  try {
    const response = await UserAccountLogin({
      account: formData.account,
      password: formData.password,
      rememberMe: rememberMe.value // 传递记住登录状态
    });

    if (response.code === 200 && response.success) {
      uni.showToast({ title: '登录成功', icon: 'success' });

      // 存储用户信息和Token
      userInfoStore.setUserInfo(response.data.userInfo);
      uni.setStorageSync('token', response.data.token);

      // 设置过期时间（记住我则7天，否则会话级）
      if (rememberMe.value) {
        uni.setStorageSync('tokenExpiry', Date.now() + 7 * 24 * 60 * 60 * 1000);
      } else {
        uni.removeStorageSync('tokenExpiry');
      }

      setTimeout(() => {
        uni.switchTab({ url: '/pages/my/my' });
      }, 1500);
    } else {
      // 错误处理（账号未注册、密码错误等）
      uni.showToast({
        title: response.message || '登录失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('登录错误:', error);
    uni.showToast({ title: error.message, icon: 'none' });
  }
};

// 微信登录
const handleUseWXLogin = async () => {
  try {
    await wechatLogin({
      rememberMe: rememberMe.value // 传递记住登录状态
    });
  } catch (error) {
    console.error('微信登录失败', error);
  }
};

// 页面挂载时读取记住的账号
onMounted(() => {
  const savedAccount = uni.getStorageSync('savedAccount');
  if (savedAccount) {
    formData.account = savedAccount;
    rememberMe.value = true; // 自动勾选"记住我"
  }
});
</script>