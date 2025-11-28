<template>
  <view class="register-page">
    <!-- 左侧品牌（可点击触发烟花效果） -->
    <view class="brand-side" @click="createFireworks">
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>
      <view class="decor-dot"></view>

      <view class="fireworks-container"></view>

      <image class="brand-logo" src="/static/other/login.png" mode="aspectFit" />
      <text class="brand-title">考神附体pro</text>
      <text class="brand-desc">让学习更高效</text>
    </view>

    <!-- 右侧表单 -->
    <view class="form-side">
      <view class="form-card">
        <view class="header">
          <text class="title">{{ bindMode ? '绑定账号' : '用户注册' }}</text>
          <text class="subtitle">{{ bindMode ? '请输入您的账号完成绑定' : '创建账号，开启高效学习之旅' }}</text>
        </view>

        <!-- 邮箱/手机号 -->
        <view class="input-box">
          <text class="label">邮箱</text>
          <input
              v-model="formData.account"
              class="input"
              type="text"
              placeholder="请输入邮箱地址"
              placeholder-class="placeholder"
              @input="onAccountInput"
          />
        </view>

        <!-- 验证码 -->
        <view class="input-box">
          <text class="label">验证码</text>
          <view class="pwd-wrap">
            <input
                v-model="formData.code"
                class="input"
                type="number"
                placeholder="请输入验证码"
                placeholder-class="placeholder"
                maxlength="6"
            />
            <text class="code-btn" @click="getCode" :class="{ disabled: countDown > 0 || !isAccountValid }">
              {{ countDown > 0 ? `${countDown}s` : '获取验证码' }}
            </text>
          </view>
        </view>

        <!-- 密码 -->
        <view class="input-box">
          <text class="label">设置密码</text>
          <view class="pwd-wrap">
            <input
                v-model="formData.password"
                class="input"
                :password="!showPwd"
                placeholder="请设置密码"
                placeholder-class="placeholder"
            />
            <text class="eye-icon" @click="showPwd = !showPwd">
              {{ showPwd ? '&#xe69a;' : '&#xe699;' }}
            </text>
          </view>
        </view>

        <!-- 确认密码 -->
        <view class="input-box">
          <text class="label">确认密码</text>
          <view class="pwd-wrap">
            <input
                v-model="formData.confirmPwd"
                class="input"
                :password="!showConfirmPwd"
                placeholder="请再次输入密码"
                placeholder-class="placeholder"
            />
            <text class="eye-icon" @click="showConfirmPwd = !showConfirmPwd">
              {{ showConfirmPwd ? '&#xe69a;' : '&#xe699;' }}
            </text>
          </view>
        </view>

        <!-- 协议同意 -->
        <view class="agreement" @click="agree = !agree">
          <text :class="['checkbox', agree ? 'checked' : '']"></text>
          <text class="text">我已阅读并同意</text>
          <text class="link" @click.stop="showAgreement">《用户协议》</text>
          <text class="text">和</text>
          <text class="link" @click.stop="showPrivacy">《隐私政策》</text>
        </view>

        <!-- 注册按钮 -->
        <view class="register-btn" @click="handleRegister" :class="{ disabled: !agree || !canSubmit }">
          {{ bindMode ? '立即绑定' : '完成注册' }}
        </view>

        <!-- 登录入口 -->
        <view class="login-row">
          <text>已有账号？</text>
          <text class="link" @click="goToLogin">立即登录</text>
        </view>

        <!-- 微信注册 -->
        <!-- #ifdef MP-WEIXIN || H5 -->
        <view class="third-box">
          <view class="divider">
            <text class="line"></text>
            <text class="txt">其他注册方式</text>
            <text class="line"></text>
          </view>
          <view class="wx-btn" @click="wxRegister">
            <text class="iconfont icon-weixin"></text>
            <text class="txt">微信快捷注册</text>
          </view>
        </view>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { UserRegister, BindAccount } from '../../API/My/UserLoginAPI';

// 绑定模式状态
const bindMode = ref(false);

// 表单数据
const formData = reactive({
  account: '',
  code: '',
  password: '',
  confirmPwd: ''
});

// UI状态
const showPwd = ref(false);
const showConfirmPwd = ref(false);
const agree = ref(false);
const countDown = ref(0);
const timer = ref(null);

// 邮箱验证
const isAccountValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.account);
});

// 是否可以提交表单
const canSubmit = computed(() => {
  return formData.account &&
         formData.code &&
         formData.password &&
         formData.confirmPwd;
});

// 账号输入处理
const onAccountInput = (e) => {
  formData.account = e.detail.value;
};

// 获取验证码
const getCode = async () => {
  if (countDown.value > 0) return;

  // 邮箱验证
  if (!isAccountValid.value) {
    uni.showToast({
      title: '请输入正确的邮箱地址',
      icon: 'none'
    });
    return;
  }

  try {
    uni.showLoading({
      title: '发送中...',
      mask: true
    });

    // 这里应该调用实际的API发送验证码
    // 例如: await api.sendVerifyCode(formData.account);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    uni.hideLoading();

    uni.showToast({
      title: '验证码已发送',
      icon: 'success',
      duration: 2000
    });

    // 开始倒计时
    startCountdown();

  } catch (error) {
    console.error('验证码发送失败:', error);
    uni.hideLoading();
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
      duration: 2000
    });
  }
};

// 处理注册
const handleRegister = async () => {
  try {
    // 检查表单是否可提交
    if (!canSubmit.value) {
      uni.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      });
      throw new Error('表单填写不完整');
    }

    // 检查邮箱格式
    if (!isAccountValid.value) {
      uni.showToast({
        title: '请输入正确的邮箱地址',
        icon: 'none',
        duration: 2000
      });
      throw new Error('邮箱格式错误');
    }

    // 检查验证码格式
    if (formData.code.length !== 6) {
      uni.showToast({
        title: '验证码格式错误',
        icon: 'none',
        duration: 2000
      });
      throw new Error('验证码格式错误');
    }

    // 检查密码是否一致
    if (formData.password !== formData.confirmPwd) {
      await new Promise((resolve) => {
        uni.showModal({
          title: '密码不一致',
          content: '两次输入的密码不一致，请重新输入',
          showCancel: false,
          success: () => {
            formData.password = '';
            formData.confirmPwd = '';
            resolve();
          }
        });
      });
      throw new Error('密码不一致');
    }

    // 检查协议同意
    if (!agree.value) {
      uni.showToast({
        title: '请同意用户协议',
        icon: 'none',
        duration: 2000
      });
      throw new Error('未同意用户协议');
    }

    let result;
    // 根据模式调用不同的API
    if (bindMode.value) {
      // 绑定账号模式
      result = await BindAccount({
        account: formData.account,
        verifyCode: formData.code,
        password: formData.password,
      });
    } else {
      // 普通注册模式
      result = await UserRegister({
        account: formData.account,
        verifyCode: formData.code,
        password: formData.password,
      });
    }

    if (result.code === 200) {
      uni.showToast({
        title: result.message,
        icon: 'success',
        duration: 2000
      });

      if (bindMode.value) {
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        // 注册成功后跳转到登录页
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/my/UserLoginView' });
        }, 1500);
      }
    } else {
      // 处理注册失败的情况
      uni.showToast({
        title: result.message || '注册失败，请稍后重试',
        icon: 'none',
        duration: 2000
      });
    }

  } catch (error) {
    console.error(bindMode.value ? '绑定异常:' : '注册异常:', error);
    const errorMsg = error.message || '网络异常，请稍后重试';
    uni.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 2000
    });
    throw error;
  }
};

// 开始倒计时
const startCountdown = () => {
  countDown.value = 60;

  timer.value = setInterval(() => {
    countDown.value--;
    if (countDown.value <= 0) {
      stopCountdown();
    }
  }, 1000);
};

// 停止倒计时
const stopCountdown = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

// 前往登录页
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/my/UserLoginView' });
};

// 微信注册
const wxRegister = () => {
  // TODO: 微信注册逻辑
  uni.showToast({ title: '微信注册功能开发中', icon: 'none' });
};

// 显示协议
const showAgreement = () => {
  uni.showModal({
    title: '用户协议',
    content: '用户服务协议内容...\n\n这里是用户服务协议的详细内容，包括服务条款、使用规则、责任限制等相关信息。',
    showCancel: false
  });
};

// 显示隐私政策
const showPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '隐私政策内容...\n\n这里是隐私政策的详细内容，包括信息收集、使用、保护等相关政策。',
    showCancel: false
  });
};

// 烟花效果
const createFireworks = (e) => {
  const { clientX, clientY } = e.touches?.[0] || e;
  const fireworksContainer = document.querySelector('.fireworks-container');

  if (!fireworksContainer) return;

  const firework = document.createElement('view');
  firework.className = 'firework';
  firework.style.left = `${clientX}px`;
  firework.style.top = `${clientY}px`;
  fireworksContainer.appendChild(firework);

  const particleCount = Math.floor(Math.random() * 8) + 12;
  const colors = ['#ffffff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('view');
    particle.className = 'firework-particle';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.floor(Math.random() * 6) + 4;
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = Math.floor(Math.random() * 60) + 40;

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

    firework.appendChild(particle);

    setTimeout(() => {
      particle.style.transition = `all ${Math.random() * 0.5 + 0.5}s cubic-bezier(0.1, 0.8, 0.9, 1)`;
      particle.style.opacity = '1';
      particle.style.transform = `translate(${Math.cos(angle) * distance}rpx, ${Math.sin(angle) * distance}rpx)`;

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

  setTimeout(() => {
    if (firework.parentNode) {
      firework.remove();
    }
  }, 1500);
};

// 页面加载处理
onLoad((options) => {
  if (options.isBind === "true") {
    bindMode.value = true;
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCountdown();
});
</script>

<style lang="scss" scoped>
/* 引入与登录页相同的图标字体 */
@import url('//at.alicdn.com/t/c/font_2410209_5w9z2pa5j5b.css');

.register-page {
  min-height: 100vh;
  display: flex;
  background: #f5f9ff;

  /* 左侧品牌区域（与登录页保持一致） */
  .brand-side {
    flex: 1.1;
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
    cursor: pointer;
    animation: bgShift 15s ease-in-out infinite alternate;

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

    .fireworks-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .firework {
      position: absolute;
      transform: translate(-50%, -50%);
    }
  }

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

  /* 右侧表单区域 */
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

          .code-btn {
            position: absolute;
            right: 24rpx;
            top: 50%;
            transform: translateY(-50%);
            font-size: 28rpx;
            color: #3c9cff;
            padding: 8rpx 16rpx;

            &.disabled {
              color: #909399;
              cursor: not-allowed;
            }
          }
        }
      }

      /* 协议同意区 */
      .agreement {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 10rpx 0 40rpx;
        font-size: 24rpx;

        .checkbox {
          width: 28rpx;
          height: 28rpx;
          border: 2rpx solid #dcdfe6;
          border-radius: 6rpx;
          display: inline-block;
          margin-right: 10rpx;
          position: relative;

          &.checked {
            background: #3c9cff;
            border-color: #3c9cff;

            &::after {
              content: "✓";
              position: absolute;
              color: #fff;
              font-size: 20rpx;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }

        .text {
          color: #606266;
          margin-right: 6rpx;
        }

        .link {
          color: #3c9cff;
          margin-right: 6rpx;
        }
      }

      /* 注册按钮 */
      .register-btn {
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

        &:active:not(.disabled) {
          opacity: 0.9;
          transform: scale(0.98);
        }

        &.disabled {
          background: #b3d1ff;
          box-shadow: none;
          cursor: not-allowed;
        }
      }

      /* 登录入口 */
      .login-row {
        text-align: center;
        margin-top: 40rpx;
        font-size: 26rpx;
        color: #606266;

        .link {
          color: #3c9cff;
          margin-left: 6rpx;
        }
      }

      /* 第三方注册 */
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
  }

  /* 响应式适配（与登录页保持一致） */
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

/* 动画关键帧（与登录页保持一致） */
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