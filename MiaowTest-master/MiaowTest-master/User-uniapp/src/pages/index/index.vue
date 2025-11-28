<template>
  <view class="content">
    <!-- 页面头部导航 -->
    <PageHead
        ref="pageHeadRef"
        title="考神附体Pro"
        :showSearch="true"
        searchPlaceholder="搜索考试科目~"
    />

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 单张图片与导航 - PC端网格布局 -->
      <view class="card-container">
        <!-- 单张图片区域 -->
        <view class="single-image">
          <image
              :src="imageSrc"
              mode="widthFix"
              class="main-image"
              v-if="!loadingStatus.image"
          />
          <view class="empty-placeholder" v-if="loadingStatus.image">
            <text>图片加载中...</text>
          </view>
        </view>

        <!-- 导航功能区 -->
        <view class="navigation">
          <uniNavigation />
        </view>
      </view>

      <!-- 推荐练习 -->
      <view class="hot-exam">
        <view class="header-section">
          <view class="hot-exam-title">推荐练习</view>
          <view class="more-section" @click="handleViewMore">
            <text class="more-text">查看更多</text>
            <text class="arrow-icon">›</text>
          </view>
        </view>
        <HotExamContainer />
      </view>

      <!-- 我的题库/收藏考试 -->
      <view class="my-question-bank">
        <view class="header-section">
          <view class="hot-exam-title">
            <uviewSubsection
                :list="list"
                @updateCurrent="handleSendMode"
                :current="currentMode"/>
          </view>
          <view class="more-section" @click="handleCreateQuestionBank" v-if="currentMode===0">
            <text class="more-text">新建题库</text>
            <text class="arrow-icon">›</text>
          </view>
          <view class="more-section" @click="handleViewMoreExams" v-if="currentMode===1">
            <text class="more-text">查看考试</text>
            <text class="arrow-icon">›</text>
          </view>
        </view>
        <UserQuestionBank v-if="currentMode===0"/>
        <UserExamFavorite v-if="currentMode===1"/>
      </view>
    </view>

    <!-- 回到顶部按钮 -->
    <BackToTop
        ref="backToTopRef"
        position="bottom-right"/>

    <!-- 宠物装饰 -->
    <CatPet />
  </view>
</template>

<script setup>
import { onMounted, ref, onUnmounted, nextTick } from 'vue';
// 外部库及全局组件
import PageHead from '../../components/core/PageHead.vue';
import BackToTop from '../../components/core/BackToTop.vue';
import uviewSubsection from '../../components/core/uviewSubsection.vue';

// 业务组件
import uniNavigation from '../../components/modules/index/Navbar.vue';
import HotExamContainer from '../../components/modules/index/HotExamContainer.vue';
import UserQuestionBank from '../../components/modules/index/UserQuestionBank.vue';
import UserExamFavorite from '../../components/modules/index/UserExamFavorite.vue';
import CatPet from '../../components/CatPet.vue';

// 工具函数及配置
import { getIndexBanner } from '../../API/Index/AnnouncementAPI';
import escconfig from '../../config/esc.config';
import showShareMenu from '../../util/wechatShare.js';

// 响应式数据
const imageSrc = ref('');
const list = ref(['我的题库', '收藏考试']);
const currentMode = ref(0);
const backToTopRef = ref();
const pageHeadRef = ref();
const loadingStatus = ref({
  image: true
});

// 切换标签模式
const handleSendMode = (value) => {
  currentMode.value = value;
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
};

// 获取图片信息
const fetchImageInfo = async () => {
  loadingStatus.value.image = true;
  try {
    const res = await getIndexBanner();
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      // 取第一张轮播图作为单张图片
      const firstImage = res.data[0];
      imageSrc.value = `${escconfig.useTunnel ? escconfig.tunnelUrl : `http://${escconfig.serverHost}:${escconfig.serverPort}`}${firstImage.cover.startsWith('/') ? firstImage.cover : '/' + firstImage.cover}`;
    } else {
      console.warn('图片数据格式不正确，使用默认图');
      imageSrc.value = '/static/images/default-banner1.png';
    }
  } catch (error) {
    console.error('获取图片信息失败:', error);
    uni.showToast({ title: '图片加载失败，请稍后重试', icon: 'none' });
    // 加载失败时显示默认图片
    imageSrc.value = '/static/images/default-banner1.png';
  } finally {
    loadingStatus.value.image = false;
  }
};

// 页面跳转方法
const handleViewMore = () => {
  uni.switchTab({ url: '/pages/exam/exam' });
};

const handleViewMoreExams = () => {
  uni.navigateTo({ url: '/pages/exam/favoriteExamsView' });
};

const handleCreateQuestionBank = () => {
  uni.navigateTo({ url: '/pages/exam/crquestionbankView' });
};

// 页面滚动处理
const onPageScroll = (e) => {
  if (backToTopRef.value) {
    backToTopRef.value.handlePageScroll(e);
  }
};

// 初始化
onMounted(async () => {
  // 确保DOM加载完成后再获取数据
  await nextTick();
  fetchImageInfo();
  showShareMenu();
  // 注册页面滚动事件
  uni.onPageScroll(onPageScroll);
});

onUnmounted(() => {
  uni.offPageScroll(onPageScroll);
});
</script>

<style scoped lang="scss">
/* 基础样式变量 */
$primary-color: #007AFF;
$bg-color: #F5F7FA;
$card-bg-color: #FFFFFF;
$border-radius: 8px;
$shadow-light: 0 4px 12px rgba(0, 0, 0, 0.05);

.content {
  min-height: 100vh;
  background-color: $bg-color;
}

/* 主内容区样式 */
.main-content {
  padding: 0 20px 120px;
  box-sizing: border-box;
  margin-top: 80px;
  display: block;
  opacity: 1;
}

/* 卡片容器 */
.card-container {
  margin: 20px 0;
  border-radius: $border-radius;
  background-color: $card-bg-color;
  overflow: hidden;
  box-shadow: $shadow-light;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 20px;
  min-height: 450px;
}

/* 单张图片区域 */
.single-image {
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  max-height: 400px;
}

/* 导航区域 */
.navigation {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
}

/* 推荐练习区域 */
.hot-exam {
  padding: 20px;
  background-color: $card-bg-color;
  border-radius: $border-radius;
  margin: 20px 0;
  box-shadow: $shadow-light;
  visibility: visible;
}

/* 标题栏样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hot-exam-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  padding-left: 10px;
  border-left: 4px solid $primary-color;
  width: 55%;
}

/* 更多按钮样式 */
.more-section {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  background-color: #f0f7ff;
  border-radius: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e0efff;
  }
}
/* 在现有样式基础上修改content类 */
.content {
  min-height: 100vh;
  /* 替换原背景色为蓝色渐变 */
  background: linear-gradient(to bottom, #deeeff 0%, #FFFFFF 100%);
}

/* 我的题库区域 */
.my-question-bank {
  margin: 20px 0;
  background-color: $card-bg-color;
  border-radius: $border-radius;
  padding: 20px;
  box-shadow: $shadow-light;
}

/* 空状态占位符 */
.empty-placeholder {
  width: 100%;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  color: #999;
}

/* PC端响应式优化 */
@media screen and (min-width: 1024px) {
  .main-content {
    max-width: 1440px;
    margin: 40px auto 0;
    padding: 0 40px 120px;
  }

  ::v-deep .exam-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }

  ::v-deep .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    cursor: pointer;

    image {
      width: 60px;
      height: 60px;
      display: block;
    }

    .nav-title {
      font-size: 16px;
      margin-top: 15px;
      display: block;
    }
  }
}

/* 底部导航栏在PC端隐藏 */
::v-deep uni-tab-bar {
  display: none;
}
</style>