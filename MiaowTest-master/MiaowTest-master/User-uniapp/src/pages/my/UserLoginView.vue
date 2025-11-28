<template>
  <view class="login-page">
    <!-- 左侧品牌（可点击触发烟花效果） -->
    <view class="brand-side" @click="createFireworks">
      <!-- 装饰点元素 -->
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>

      <!-- 烟花容器（动态生成烟花元素） -->
      <view class="fireworks-container"></view>

      <image class="brand-logo" src="/static/other/login.png" mode="aspectFit" />
      <text class="brand-title">考神附体pro</text>
      <text class="brand-desc">让学习更高效</text>
    </view>

    <!-- 右侧表单 -->
    <view class="form-side">
      <view class="form-card">
        <view class="header">
          <text class="title">用户登录</text>
          <text class="subtitle">欢迎回来，请登录您的账号</text>
        </view>

        <!-- 账号 -->
        <view class="input-box">
          <text class="label">账号</text>
          <input
              v-model="formData.account"
              class="input"
              type="text"
              placeholder="请输入手机号 / 邮箱"
              placeholder-class="placeholder"
          />
        </view>

        <!-- 密码 -->
        <view class="input-box">
          <text class="label">密码</text>
          <view class="pwd-wrap">
            <input
                v-model="formData.password"
                class="input"
                :password="!showPwd"
                placeholder="请输入密码"
                placeholder-class="placeholder"
            />
            <text class="eye-icon" @click="showPwd = !showPwd">
              {{ showPwd ? '&#xe69a;' : '&#xe699;' }}
            </text>
          </view>
        </view>

        <!-- 选项行 -->
        <view class="option-row">
          <view class="remember" @click="rememberMe = !rememberMe">
            <text :class="['radio', rememberMe && 'radio-active']"></text>
            <text class="txt">记住我</text>
          </view>
          <text class="link">忘记密码？</text>
        </view>

        <!-- 登录按钮 -->
        <view class="login-btn" @click="handleLogin">登 录</view>

        <!-- 注册入口 -->
        <view class="register-row">
          <text>还没有账号？</text>
          <text class="link" @click="goToRegister">立即注册</text>
        </view>

        <!-- 微信登录 -->
        <!-- #ifdef MP-WEIXIN || H5 -->
        <view class="third-box">
          <view class="divider">
            <text class="line"></text>
            <text class="txt">其他登录方式</text>
            <text class="line"></text>
          </view>
          <view class="wx-btn" @click="handleUseWXLogin">
            <text class="iconfont icon-weixin"></text>
            <text class="txt">微信一键登录</text>
          </view>
        </view>
        <!-- #endif -->
      </view>

      <!-- 协议 -->
      <view class="protocol">
        <text>登录即表示您同意</text>
        <text class="link" @tap="showUserAgreement">《用户服务协议》</text>
        <text>和</text>
        <text class="link" @tap="showPrivacyPolicy">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { UserAccountLogin } from '../../API/My/UserLoginAPI';
import { UserInfoStore } from '../../stores/modules/UserinfoStore';
import { wechatLogin } from '../../util/wechatLogin';

const showPwd = ref(false);
const rememberMe = ref(false);
const userInfoStore = UserInfoStore();

const formData = reactive({
  account: '',
  password: ''
});

// 登录方法
const handleLogin = async () => {
  if (!formData.account || !formData.password) {
    uni.showToast({
      icon: 'none',
      title: '请填写完整'
    });
    return;
  }

  try {
    const response = await UserAccountLogin({
      account: formData.account,
      password: formData.password
    });

    // 处理登录成功的情况
    if(response.code === 200 && response.success){
      uni.showToast({
        title: '登录成功',
        icon:'success',
        duration:2000
      });
      uni.setStorageSync('token', response.data.token); // 存储 Token
      userInfoStore.setUserInfo(response.data.userInfo); // 存储用户信息

      // 登录成功后返回上一页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/my/my'
        });
      }, 1500);
      return;
    }

    // 处理各种错误情况
    if(response.code === 404) {
      // 账号尚未注册
      uni.showModal({
        title: '提示',
        content: response.message || '账号尚未注册',
        confirmText: '去注册',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/my/UserRegisterView'
            });
          }
        }
      });
    } else if(response.code === 401) {
      // 密码或账号错误
      uni.showToast({
        title: response.message || '密码或账号错误',
        icon: 'none',
        duration: 2000
      });
    } else {
      // 其他错误
      uni.showToast({
        title: response.message || '登录失败，请稍后重试',
        icon: 'none',
        duration: 2000
      });
    }
  } catch (error) {
    // 网络错误或其他异常
    console.error('登录错误:', error);
    uni.showToast({
      title: error.message || '网络异常，请稍后重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 微信登录方法
const handleUseWXLogin = async () => {
  try {
    await wechatLogin();
  } catch (error) {
    console.error('微信登录失败', error);
    uni.showToast({
      title: '微信登录失败',
      icon: 'none'
    });
  }
};

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/my/UserRegisterView'
  });
};

// 显示用户服务协议
const showUserAgreement = () => {
  uni.showModal({
    title: '用户服务协议',
    content: '用户服务协议内容...\n\n这里是用户服务协议的详细内容，包括服务条款、使用规则、责任限制等相关信息。',
    showCancel: false
  });
};

// 显示隐私政策
const showPrivacyPolicy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '隐私政策内容...\n\n这里是隐私政策的详细内容，包括信息收集、使用、保护等相关政策。',
    showCancel: false
  });
};

// 点击左侧区域创建烟花效果
const createFireworks = (e) => {
  // 获取点击位置
  const { clientX, clientY } = e.touches?.[0] || e;
  const fireworksContainer = document.querySelector('.fireworks-container');

  if (!fireworksContainer) return;

  // 创建烟花容器
  const firework = document.createElement('view');
  firework.className = 'firework';
  firework.style.left = `${clientX}px`;
  firework.style.top = `${clientY}px`;
  fireworksContainer.appendChild(firework);

  // 随机生成12-20个烟花粒子
  const particleCount = Math.floor(Math.random() * 8) + 12;
  const colors = ['#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('view');
    particle.className = 'firework-particle';

    // 随机属性
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 6) + 4; // 4-10rpx
    const angle = (i / particleCount) * Math.PI * 2; // 圆周分布
    const distance = Math.floor(Math.random() * 60) + 40; // 粒子飞行距离

    // 设置样式
    particle.style.width = `${size}rpx`;
    particle.style.height = `${size}rpx`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    particle.style.left = '0';
    particle.style.top = '0';
    particle.style.opacity = '0';
    particle.style.transform = 'translate(0, 0)';
    particle.style.boxShadow = `0 0 ${size * 2}rpx ${color}`;

    // 添加到烟花容器
    firework.appendChild(particle);

    // 触发动画（延迟确保DOM已渲染）
    setTimeout(() => {
      particle.style.transition = `all ${Math.random() * 0.5 + 0.5}s cubic-bezier(0.1, 0.8, 0.9, 1)`;
      particle.style.opacity = '1';
      particle.style.transform = `translate(${Math.cos(angle) * distance}rpx, ${Math.sin(angle) * distance}rpx)`;

      // 动画结束后隐藏并移除元素
      setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
          }
        }, 500);
      }, 600);
    }, 50);
  }

  // 烟花完成后移除容器
  setTimeout(() => {
    if (firework.parentNode) {
      firework.remove();
    }
  }, 1500);
};

// 组件挂载时检查记住我功能
onMounted(() => {
  // 这里可以添加从本地存储读取记住的账号密码逻辑
  // const savedAccount = uni.getStorageSync('savedAccount');
  // const savedPassword = uni.getStorageSync('savedPassword');
  // if (savedAccount && savedPassword) {
  //   formData.account = savedAccount;
  //   formData.password = savedPassword;
  //   rememberMe.value = true;
  // }
});
</script>

<style lang="scss" scoped>
/* 图标字体，如已有可删除 */
@import url('//at.alicdn.com/t/c/font_2410209_5w9z2pa5j5b.css');

.login-page {
  min-height: 100vh;
  display: flex;
  background: #f5f9ff;

  /* 左侧品牌 */
  .brand-side {
    flex: 1.1;
    /* 灵动渐变背景+动态元素 */
    background:
        linear-gradient(135deg, #6a11cb 0%, #2575fc 100%),
        radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08) 0%, transparent 30%),
        radial-gradient(circle at 90% 80%, rgba(255,255,255,0.08) 0%, transparent 30%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: relative;
    overflow: hidden;
    cursor: pointer; /* 显示点击指针 */
    /* 增加背景微妙动效 */
    animation: bgShift 15s ease-in-out infinite alternate;

    /* 装饰点样式 */
    .decor-dot {
      position: absolute;
      width: 6rpx;
      height: 6rpx;
      background: rgba(255,255,255,0.6);
      border-radius: 50%;
      animation: float 8s ease-in-out infinite;
    }
    .decor-dot:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
    .decor-dot:nth-child(2) { top: 70%; left: 80%; animation-delay: 2s; }
    .decor-dot:nth-child(3) { top: 40%; left: 85%; animation-delay: 4s; }
    .decor-dot:nth-child(4) { top: 60%; left: 10%; animation-delay: 6s; }

    /* 烟花容器 */
    .fireworks-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* 不影响底层点击 */
    }

    .firework {
      position: absolute;
      transform: translate(-50%, -50%); /* 中心点对齐点击位置 */
    }
  }

  /* 流动光带动效 */
  .brand-side::before {
    content: '';
    position: absolute;
    width: 800rpx;
    height: 800rpx;
    background: linear-gradient(
            to right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0) 100%
    );
    transform: rotate(45deg) translate(-100%, -100%);
    animation: lightFlow 12s linear infinite;
  }

  /* 几何装饰元素 */
  .brand-side::after {
    content: '';
    position: absolute;
    width: 300rpx;
    height: 300rpx;
    border: 1rpx solid rgba(255,255,255,0.15);
    transform: rotate(45deg);
    bottom: 100rpx;
    right: 100rpx;
    border-radius: 15rpx;
    animation: rotate 20s linear infinite;
  }

  .brand-logo {
    /* 图标放大并添加悬浮效果 */
    width: 420rpx;
    height: 420rpx;
    margin-bottom: 48rpx;
    filter: drop-shadow(0 15rpx 20rpx rgba(0,0,0,0.15));
    position: relative;
    z-index: 1;
    animation: float 6s ease-in-out infinite;
  }

  .brand-title {
    font-size: 52rpx;
    font-weight: 600;
    margin-bottom: 20rpx;
    position: relative;
    z-index: 1;
    text-shadow: 0 5rpx 15rpx rgba(0,0,0,0.1);
  }

  .brand-desc {
    font-size: 30rpx;
    opacity: 0.9;
    position: relative;
    z-index: 1;
    max-width: 500rpx;
    text-align: center;
    line-height: 1.6;
  }

  /* 右侧表单 */
  .form-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 60rpx;
    .form-card {
      width: 100%;
      max-width: 760rpx;
      background: #ffffff;
      border-radius: 24rpx;
      box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.06);
      padding: 56rpx 48rpx;
      .header {
        text-align: center;
        margin-bottom: 48rpx;
        .title {
          font-size: 40rpx;
          font-weight: 600;
          color: #3c9cff;
          display: block;
          margin-bottom: 8rpx;
        }
        .subtitle {
          font-size: 26rpx;
          color: #909399;
        }
      }

      /* 输入框 */
      .input-box {
        margin-bottom: 36rpx;
        .label {
          font-size: 28rpx;
          color: #303133;
          margin-bottom: 12rpx;
          display: block;
        }
        .input {
          height: 88rpx;
          background: #f5f7fa;
          border-radius: 12rpx;
          padding: 0 24rpx;
          font-size: 30rpx;
          color: #303133;
        }
        .placeholder {
          color: #c0c4cc;
        }
        .pwd-wrap {
          position: relative;
          .eye-icon {
            position: absolute;
            right: 24rpx;
            top: 50%;
            transform: translateY(-50%);
            font-family: 'iconfont';
            font-size: 40rpx;
            color: #909399;
          }
        }
      }

      /* 选项行 */
      .option-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40rpx;
        font-size: 26rpx;
        .remember {
          display: flex;
          align-items: center;
          .radio {
            width: 28rpx;
            height: 28rpx;
            border: 2rpx solid #dcdfe6;
            border-radius: 50%;
            margin-right: 8rpx;
            transition: all 0.2s;
            &-active {
              background: #3c9cff;
              border-color: #3c9cff;
            }
          }
          .txt {
            color: #606266;
          }
        }
        .link {
          color: #3c9cff;
        }
      }

      /* 登录按钮 */
      .login-btn {
        height: 88rpx;
        border-radius: 12rpx;
        background: #3c9cff;
        color: #ffffff;
        font-size: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8rpx 24rpx rgba(60, 156, 255, 0.3);
        transition: all 0.2s;

        &:active {
          opacity: 0.9;
          transform: scale(0.98);
        }
      }

      /* 注册入口 */
      .register-row {
        text-align: center;
        margin-top: 40rpx;
        font-size: 26rpx;
        color: #606266;
        .link {
          color: #3c9cff;
          margin-left: 6rpx;
        }
      }

      /* 第三方登录 */
      .third-box {
        margin-top: 56rpx;
        .divider {
          display: flex;
          align-items: center;
          margin-bottom: 32rpx;
          .line {
            flex: 1;
            height: 2rpx;
            background: #e4e7ed;
          }
          .txt {
            padding: 0 16rpx;
            font-size: 24rpx;
            color: #909399;
          }
        }
        .wx-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80rpx;
          border-radius: 12rpx;
          background: #07c160;
          color: #ffffff;
          font-size: 28rpx;
          transition: all 0.2s;

          &:active {
            opacity: 0.9;
            transform: scale(0.98);
          }

          .icon-weixin {
            font-family: 'iconfont';
            font-size: 40rpx;
            margin-right: 12rpx;
          }
        }
      }
    }

    /* 协议 */
    .protocol {
      margin-top: 40rpx;
      font-size: 24rpx;
      color: #909399;
      text-align: center;
      .link {
        color: #3c9cff;
      }
    }
  }

  /* 响应式：移动端竖屏 */
  @media (max-width: 768px) {
    flex-direction: column;
    .brand-side {
      display: none;
    }
    .form-side {
      padding: 80rpx 40rpx 40rpx;
      .form-card {
        max-width: 100%;
        padding: 40rpx 32rpx;
      }
    }
  }
}

/* 动画关键帧 */
@keyframes bgShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes lightFlow {
  0% { transform: rotate(45deg) translate(-100%, -100%); }
  100% { transform: rotate(45deg) translate(100%, 100%); }
}

@keyframes rotate {
  0% { transform: rotate(45deg) scale(1); }
  50% { transform: rotate(225deg) scale(1.1); }
  100% { transform: rotate(405deg) scale(1); }
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
  100% { transform: translateY(0); }
}
</style>