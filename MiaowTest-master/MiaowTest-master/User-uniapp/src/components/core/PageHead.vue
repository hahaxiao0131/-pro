<template>
  <view class="pc-nav-container">
    <view class="pc-nav">
      <!-- 顶部渐变装饰条（增强版） -->
      <view class="nav-gradient-bar"></view>
      <div class="logo-container">
        <view class="logo">
          <span class="logo-text">考神附体Pro</span>
          <span class="logo-tag">专业版</span>
          <!-- 新增Logo发光效果容器 -->
          <span class="logo-glow"></span>
        </view>
      </div>
      <div class="pc-nav-menu">
        <a
          v-for="(item, index) in navItems"
          :key="index"
          :class="{ 'active': currentPage === item.path }"
          @click="handleNavClick(item.path)"
        >
          {{ item.title }}
          <span class="nav-item-glow"></span>
          <!-- 新增底部渐变高光 -->
          <span class="nav-item-highlight"></span>
        </a>
      </div>
      <div class="pc-nav-actions">
        <!-- 刷新按钮（增强视觉效果） -->
        <view
          class="refresh-btn"
          :class="{ 'refreshing': loading }"
          @click="handleRefresh"
        >
          <uni-icons
            type="refreshempty"
            size="16"
            color="#ffffff"
            :class="{ 'rotating': loading }"
          ></uni-icons>
          <text class="refresh-text">{{ refreshText }}</text>
          <!-- 新增按钮发光效果 -->
          <span class="btn-glow"></span>
        </view>
        <slot name="right-content"></slot>
        <!-- 用户头像（增强版） -->
        <view class="user-avatar">
          <div class="avatar-wrapper">
            <image
              src="/static/avatar/default.png"
              mode="widthFix"
              class="avatar-img"
            ></image>
            <!-- 头像光环效果 -->
            <span class="avatar-ring"></span>
            <span class="avatar-glow"></span>
          </div>
        </view>
      </div>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const navItems = ref([
  { title: '首页', path: '/pages/index/index' },
  { title: '考试', path: '/pages/exam/exam' },
  { title: '工具', path: '/pages/tools/tools' },
  { title: '我的', path: '/pages/my/my' }
]);

const props = defineProps({
  showRefresh: { type: Boolean, default: false },
  refreshText: { type: String, default: '刷新' },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(['refresh']);
const router = useRouter();
const route = useRoute();
const currentPage = computed(() => route.path);

const handleRefresh = () => emit('refresh');
const handleNavClick = (url) => {
  router.push(url);
};
</script>

<style scoped lang="scss">
.pc-nav-container {
  width: 100%;
  background: linear-gradient(135deg, #f8f9ff 0%, #eaf6ff 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 6px 24px rgba(0, 122, 255, 0.12);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.8);
}

.pc-nav {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 96px;
  padding: 0 48px;
  position: relative;

  .nav-gradient-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 30%, #72efdd 60%, #4facfe 100%);
    background-size: 300% auto;
    animation: gradientShift 4s ease infinite;
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.logo-container {
  margin-right: 80px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(79, 172, 254, 0.25);
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(90deg, #007AFF, #5AC8FA, #00f2fe);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 0.8px;
    text-shadow: 0 2px 4px rgba(0, 122, 255, 0.1);
  }

  .logo-tag {
    margin-left: 12px;
    font-size: 13px;
    color: #fff;
    background: linear-gradient(90deg, #FF4D4F, #FF7875);
    padding: 3px 10px;
    border-radius: 16px;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: tagShine 2s infinite;
    }
  }

  .logo-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }
}

@keyframes tagShine {
  0% { left: -100%; }
  100% { left: 150%; }
}

.pc-nav-menu {
  display: flex;
  gap: 50px;
  margin-right: auto;

  a {
    font-size: 18px;
    color: #2d3748;
    text-decoration: none;
    height: 96px;
    line-height: 96px;
    position: relative;
    transition: all 0.3s ease;
    padding: 0 8px;
    font-weight: 600;
    letter-spacing: 0.5px;

    &:hover {
      color: #007AFF;
      transform: translateY(-2px);
    }

    &.active {
      color: #007AFF;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #007AFF, #5AC8FA);
        border-radius: 4px 4px 0 0;
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.4);
      }

      .nav-item-highlight {
        transform: scaleX(1);
        opacity: 1;
      }
    }

    .nav-item-glow {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, rgba(79, 172, 254, 0) 0%, rgba(79, 172, 254, 0.8) 50%, rgba(79, 172, 254, 0) 100%);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      border-radius: 4px;
    }

    .nav-item-highlight {
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 100%);
      transform: scaleX(0);
      opacity: 0;
      transition: all 0.3s ease 0.1s;
      border-radius: 2px;
    }

    &:hover .nav-item-glow {
      transform: scaleX(1);
    }

    &:hover .nav-item-highlight {
      transform: scaleX(0.8);
      opacity: 0.8;
    }
  }
}

.pc-nav-actions {
  display: flex;
  align-items: center;
  gap: 30px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(90deg, #007AFF, #5AC8FA);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: btnShine 3s infinite;
  }

  &:hover {
    background: linear-gradient(90deg, #0056b3, #4aa8e8);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
  }

  .btn-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
}

@keyframes btnShine {
  0% { left: -100%; }
  100% { left: 150%; }
}

.refresh-text {
  margin-left: 10px;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  .avatar-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
    transition: all 0.3s ease;
  }

  .avatar-ring {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid transparent;
    border-radius: 50%;
    background: linear-gradient(90deg, #007AFF, #5AC8FA) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ringPulse 3s infinite;
  }

  .avatar-glow {
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: glowPulse 4s infinite;
  }

  &:hover .avatar-img {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(0, 122, 255, 0.3);
  }
}

@keyframes ringPulse {
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
}

@keyframes glowPulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { opacity: 0.4; }
}

@keyframes rotate360 {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotating {
  animation: rotate360 0.8s linear infinite;
  transform-origin: center;
}

@media (max-width: 1200px) {
  .pc-nav {
    padding: 0 32px;
  }
  .pc-nav-menu {
    gap: 30px;
  }
}
</style>