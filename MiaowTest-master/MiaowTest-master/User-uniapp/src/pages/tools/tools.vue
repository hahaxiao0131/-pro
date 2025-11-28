<template>
  <view class="container">
    <!-- 页面头部 -->
    <PageHead
        ref="pageHeadRef"
        title="所有工具"
    />
    <view class="content page-content">
      <!-- 工具列表区域 -->
      <view
          class="tools-container"
          :style="{ paddingTop: `${contentTopPadding}px` }">

        <!-- 工具分类标题 -->
        <view class="tools-section-title">时间工具</view>

        <!-- 计时器工具卡片 -->
        <view
            class="tool-card"
            @tap="navigateToTimer">
          <view class="tool-info">
            <view class="tool-title">计时器</view>
            <view class="tool-desc">精确计时，支持倒计时和正计时模式</view>
          </view>
          <view class="tool-icon">
            <TimerIcon :size="0.31" />
          </view>
        </view>
      </view>
    </view>

    <!-- 返回顶部按钮 -->
    <BackToTop
        ref="backToTopRef"
        position="bottom-right"
        :scrollDistance="500"
        primaryColor="#409eff"
    />
  </view>
</template>

<script setup>
// 原有逻辑保持不变
import { ref, onMounted, onUnmounted, computed } from 'vue';
// 导入图标组件
import TimerIcon from '../../components/icons/TimerIcon.vue';
// 导入核心组件
import PageHead from '../../components/core/PageHead.vue';
import BackToTop from '../../components/core/BackToTop.vue';
// 导入工具函数
import showShareMenu from '../../util/wechatShare.js';
// 导入导航栏高度工具
import navBarHeightUtil from '../../util/navBarHeight.js';

const pageHeadRef = ref();
const backToTopRef = ref();
// 计算内容区顶部内边距（导航栏高度 + 10px间距）
const contentTopPadding = computed(() => {
  const navInfo = navBarHeightUtil.getNavBarInfo();
  return navInfo.totalHeight + 10;
});

// 导航到计时器页面
const navigateToTimer = () => {
  uni.navigateTo({
    url: '/pages/tools/TimerToolView'
  });
};

// 页面滚动处理
const onPageScroll = (e) => {
  if (backToTopRef.value) {
    backToTopRef.value.handlePageScroll(e);
  }
};

// 页面加载时执行
onMounted(() => {
  showShareMenu();
  // 监听页面滚动事件
  uni.onPageScroll(onPageScroll);
});

// 页面卸载时清理
onUnmounted(() => {
  uni.offPageScroll(onPageScroll);
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #deeeff 0%, #FFFFFF 100%);
  position: relative;
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 30rpx 30rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
}

/* 工具分类标题 */
.tools-section-title {
  font-size: 26rpx;
  color: #6b7280;
  margin: 30rpx 0 15rpx 10rpx;
  font-weight: 500;
  letter-spacing: 0.5rpx;
}

/* 工具卡片样式 */
.tool-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 25rpx 40rpx 25rpx 25rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  min-height: 120rpx;
  border: 2px solid #ebeef5;
}

.tool-card:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

/* 确保容器在小程序和H5环境下都能正常显示 */
/* #ifdef MP-WEIXIN */
.tools-container {
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}
/* #endif */

/* #ifdef H5 */
.tools-container {
  padding-bottom: 30rpx;
}
/* #endif */

.tool-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #f0f7ff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 10rpx;
}

.icon {
  font-size: 50rpx;
  color: #409eff;
}

.cat-decoration {
  position: absolute;
  bottom: -5rpx;
  right: -5rpx;
  font-size: 30rpx;
  opacity: 0.8;
}

.tool-info {
  flex: 1;
}

.tool-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8rpx;
}

.tool-desc {
  font-size: 25rpx;
  color: #a0a5a5;
}

/* 响应式设计 - 小屏幕设备 */
@media screen and (max-width: 750rpx) {
  .tool-card {
    padding: 20rpx;
    min-height: 100rpx;
  }

  .tool-icon {
    width: 60rpx;
    height: 60rpx;
    margin-left: 15rpx;
  }

  .tool-title {
    font-size: 30rpx;
  }

  .tool-desc {
    font-size: 24rpx;
  }
}

/* 响应式设计 - 大屏幕设备 */
@media screen and (min-width: 1024px) {
  .content {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .tools-container {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 0;
  }

  .tools-section-title {
    font-size: 18px;
    margin: 40px 0 20px 0;
  }

  .tool-card {
    padding: 30px;
    min-height: 140px;
    border-radius: 12px;
    cursor: pointer;
  }

  .tool-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .tool-icon {
    width: 100px;
    height: 100px;
    margin-left: 25px;
  }

  .tool-title {
    font-size: 20px;
  }

  .tool-desc {
    font-size: 16px;
  }
}
</style>