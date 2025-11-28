<!-- 修改后的 src/pages/my/my.vue -->
<template>
  <view class="container">
    <!-- 顶部导航 -->
    <PageHead
        ref="pageHeadRef"
        title="我的"
        class="page-head"
    />

    <!-- 主内容区 - 左侧导航+右侧内容布局 -->
    <view class="content page-content">
      <!-- 页面内容 -->
    </view>
    <view class="pc-container" >
      <view class="layout-wrapper">
        <!-- 左侧导航区域 -->
        <view class="left-nav">
          <!-- 整合用户信息功能 -->
          <view class="user-profile-section">
            <view class="avatar-section">
              <view class="avatar-wrapper">
                <image
                    class="avatar"
                    :src="userInfoStore.userInfo?.avatar || '/static/other/default-avatar.png'"
                    mode="aspectFill"
                ></image>
              </view>
              <view class="edit-avatar-btn" @click="handleEditAvatar">
                <up-icon name="edit-pen" size="16px"></up-icon>
                <text>更换头像</text>
              </view>
            </view>

            <view class="info-list">
              <view class="info-item" @click="handleEditNickname">
                <view class="info-label">昵称</view>
                <view class="info-value">
                  <text>{{ userInfoStore.userInfo?.nickname || ' ' }}</text>
                  <up-icon name="arrow-right" size="14px"></up-icon>
                </view>
              </view>

              <view class="info-item" @click="handleEditGender">
                <view class="info-label">性别</view>
                <view class="info-value">
                  <text>{{ getGenderText(userInfoStore.userInfo?.gender) }}</text>
                  <up-icon name="arrow-right" size="14px"></up-icon>
                </view>
              </view>

              <view class="info-item" @click="handleCopyOpenid">
                <view class="info-label">Uid</view>
                <view class="info-value">
                  <text class="openid-text">{{ userInfoStore.userInfo?.uid }}</text>
                  <up-icon name="file-text" size="18px"></up-icon>
                </view>
              </view>

              <!-- #ifdef MP-WEIXIN -->
              <view class="info-item" @click="handleUserRsgister">
                <view class="info-label">{{ accountBindStatus?"已绑定账号":"尚未绑定账号" }}</view>
                <view class="info-value">
                  <text class="openid-text">{{accountBindStatus?"您已经绑定账号":"立即绑定账号" }}</text>
                  <up-icon name="arrow-right" size="14px"></up-icon>
                </view>
              </view>
              <!-- #endif -->
            </view>

            <!-- 退出登录按钮 -->
            <view class="logout-section">
              <view class="logout-btn" @click="handleLogout">退出登录</view>
            </view>
          </view>

          <!-- 移除左侧导航菜单 -->
        </view>

        <!-- 右侧主内容区域 -->
        <view class="right-content">
          <!-- 第一行：数据概览卡片 -->
          <view class="stats-card card-shadow">
            <view class="stats-item">
              <view class="stats-value">{{ userInfoStore.userStats?.completed || 0 }}</view>
              <view class="stats-label">已完成</view>
            </view>
            <view class="stats-item">
              <view class="stats-value">{{ userInfoStore.userStats?.correctRate || 0 }}%</view>
              <view class="stats-label">正确率</view>
            </view>
            <view class="stats-item">
              <view class="stats-value">{{ userInfoStore.userStats?.collections || 0 }}</view>
              <view class="stats-label">收藏</view>
            </view>
          </view>

          <!-- 第二行：VIP卡片 -->
          <view class="vip-container card-shadow">
            <VipCard/>
          </view>

          <!-- 第三行：我的常用功能 - 调整按钮间距 -->
          <view class="common-functions card-shadow">
            <view class="section-title">我的常用</view>
            <view class="functions-grid">
              <myNavbar/>
            </view>
          </view>

          <!-- 第四行：学习数据统计 -->
          <view class="learning-stats card-shadow" v-if="userInfoStore.isLoggedIn">
            <view class="section-title">学习数据</view>
            <view class="stats-chart">
              <image src="/static/stats-example.png" mode="widthFix" class="chart-img"></image>
            </view>
          </view>

          <!-- 第五行：更多功能 -->
          <view class="more-functions card-shadow">
            <view class="section-title">更多功能</view>
            <view class="function-list">
              <CustomNavbar
                  :items="CustomNavbarList"
                  @nav-click="handleClick"/>
            </view>
          </view>
        </view>
      </view>
    </view>


    <!-- 登录弹窗 -->
    <uviewOverlay v-model:show="overlayShow">
      <template #overlaycontent>
        <view class="rect">
          <view class="overlay-header">
            <view class="overlay-title">你还没登录</view>
            <text class="login-tips">请选择下面任意一种方式登录</text>
          </view>
          <view class="login-but">
            <!-- #ifdef H5 -->
            <up-button type="primary" icon="fingerprint" @click="handleUseAccountLogin">账号登录</up-button>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <up-button type="primary" icon="fingerprint" @click="handleUseAccountLogin">账号登录</up-button>
            <up-button color="#09B83E" type="success" icon="weixin-fill" @click="handleUseWXLogin">微信登录</up-button>
            <!-- #endif -->
            <!-- #ifndef H5 || MP-WEIXIN -->
            <up-button type="primary" icon="fingerprint" @click="handleUseAccountLogin">账号登录</up-button>
            <up-button color="#09B83E" type="success" icon="weixin-fill" @click="handleUseWXLogin">微信登录</up-button>
            <!-- #endif -->
          </view>
          <view class="login-cancel">
            <up-button @click="handleCancelLogin">暂不登录</up-button>
          </view>
        </view>
      </template>
    </uviewOverlay>

    <!-- 回到顶部按钮 -->
    <BackToTop
        ref="backToTopRef"
        position="bottom-right"/>
  </view>
</template>

<script setup>
// 原有导入保持不变
import { ref, onMounted, onUnmounted } from 'vue';
import uviewOverlay from '../../components/core/uviewOverlay.vue';
import { UserInfoStore } from '../../stores/modules/UserinfoStore';
import { wechatLogin } from '../../util/wechatLogin';
import myNavbar from '../../components/modules/my/myNavbar.vue';
import VipCard from '../../components/modules/my/VipCard.vue';
import navBarHeightUtil from '../../util/navBarHeight.js';
import CustomNavbar from '../../components/core/CustomNavbar.vue';
import { clearExamCache } from '../../util/cacheCleaner.js';
import showShareMenu from '../../util/wechatShare.js';
import PageHead from '../../components/core/PageHead.vue';
import BackToTop from '../../components/core/BackToTop.vue';

// 添加用户信息相关导入
import handleCopy from '../../util/copy';
import { updateUserInfo, checkUserBind } from '../../API/My/UserInfoUpdateAPI';

// 原有变量保持不变
const overlayShow = ref(false);
const userInfoStore = UserInfoStore();
const navBarInfo = ref({});
const CustomNavbarList = ref([
  {
    title: '清除缓存',
    icon: '/static/navMy/c-my-clear.png',
    path: '/pages/my/MyFavoriteView'
  },
  {
    title: '问题反馈',
    icon: '/static/navMy/c-my-feedback.png',
    path: '/pages/my/MyWrongView'
  }
])
const pageHeadRef = ref();
const backToTopRef = ref();

// 添加用户信息相关变量
const accountBindStatus = ref(false);
const genderMap = {
  0: '保密',
  1: '男',
  2: '女'
};

// 原有方法保持不变
const handleClick = (item) => {
  if (item.title === '清除缓存') {
    if (clearExamCache().isClear) {
      uni.showToast({
        title: '清除成功',
        icon: 'success'
      })
    }
  }
  if (item.title === '问题反馈') {
    uni.navigateTo({
      url: '/pages/public/feedbackview'
    })
  }
}

const handleUserinfo = () => {
  if (!userInfoStore.isLoggedIn) {
    overlayShow.value = true;
  }
};

const handleCancelLogin = () => {
  overlayShow.value = false;
};

const handleUseWXLogin = async () => {
  overlayShow.value = false;
  try {
    await wechatLogin({
      onSuccess: () => {
        overlayShow.value = false;
      }
    });
  } catch (error) {
    console.error('微信登录失败', error);
    uni.showToast({
      title: '微信登录失败',
      icon: 'none'
    })
  }
};

const handleUseAccountLogin = () => {
  overlayShow.value = false;
  uni.navigateTo({
    url: '/pages/my/UserLoginView'
  });
}

const onPageScroll = (e) => {
  if (backToTopRef.value) {
    backToTopRef.value.handlePageScroll(e);
  }
};

// 添加用户信息相关方法
const CheckaccountBindStatus = async() => {
  try{
    const response = await checkUserBind();
    if(response.code===200){
      accountBindStatus.value = response.data.isBind;
    }
  }catch(e){
    console.error("获取账号绑定状态失败:",e);
    return false;
  }
}

const getGenderText = (genderValue) => {
  return genderMap[genderValue] || '未设置';
};

// 完善更换头像功能
const handleEditAvatar = async () => {
  if (!userInfoStore.isLoggedIn) {
    overlayShow.value = true;
    return;
  }

  // 选择图片
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];

      // 上传图片到服务器（这里假设存在上传接口）
      try {
        // 显示加载中
        uni.showLoading({ title: '上传中...' });

        // 调用上传接口（实际项目中替换为真实接口）
        const uploadResult = await uploadAvatar(tempFilePath);

        if (uploadResult.code === 200) {
          // 更新用户信息
          const updatedUserInfo = {
            ...userInfoStore.userInfo,
            avatar: uploadResult.data.avatarUrl
          };

          // 调用更新用户信息接口
          const updateResult = await updateUserInfo(updatedUserInfo);
          if (updateResult.code === 200) {
            userInfoStore.setUserInfo(updateResult.data);
            uni.showToast({ title: '头像更新成功', icon: 'success' });
          } else {
            uni.showToast({ title: '更新失败', icon: 'none' });
          }
        }
      } catch (error) {
        console.error('头像上传失败', error);
        uni.showToast({ title: '上传失败', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    }
  });
};

// 上传头像的封装函数（需要后端配合实现）
const uploadAvatar = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: '/api/user/upload-avatar', // 替换为实际上传接口
      filePath: tempFilePath,
      name: 'avatar',
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (e) {
          reject(new Error('解析上传结果失败'));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const handleEditNickname = () => {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入新昵称',
    success: async (res) => {
      if (res.confirm && res.content) {
        // 原有逻辑保持不变
        try {
          const updatedUserInfo = {
            ...userInfoStore.userInfo,
            nickname: res.content
          };

          const response = await updateUserInfo(updatedUserInfo);

          if (response.code === 200) {
            userInfoStore.setUserInfo(response.data);
            uni.showToast({ title: '修改成功', icon: 'success' });
          } else {
            uni.showToast({ title: response.message || '修改失败', icon: 'none' });
          }
        } catch (error) {
          uni.showToast({ title: '网络错误', icon: 'none' });
          console.error('更新昵称失败', error);
        }
      }
    }
  });
};

const handleEditGender = () => {
  uni.showActionSheet({
    itemList: ['男', '女', '保密'],
    success: async (res) => {
      const genderValueMap = { 0: 1, 1: 2, 2: 0 };
      try {
        const updatedUserInfo = {
          ...userInfoStore.userInfo,
          gender: genderValueMap[res.tapIndex]
        };

        const response = await updateUserInfo(updatedUserInfo);

        if (response.code === 200) {
          userInfoStore.setUserInfo(response.data);
          uni.showToast({ title: '修改成功', icon: 'success' });
        } else {
          uni.showToast({ title: response.message || '修改失败', icon: 'none' });
        }
      } catch (error) {
        uni.showToast({ title: '网络错误', icon: 'none' });
        console.error('更新性别失败', error);
      }
    }
  });
};

const handleCopyOpenid = () => {
  if (userInfoStore.userInfo?.uid) {
    handleCopy(userInfoStore.userInfo.uid);
  }
};

const handleUserRsgister = () => {
  if (!accountBindStatus.value) {
    uni.navigateTo({
      url: '/pages/my/UserRegisterView?isBind=true',
    });
  }
};

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userInfoStore.clearUserInfo();
        uni.removeStorageSync('token');
        uni.navigateBack();
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};

// 初始化
onMounted(() => {
  navBarInfo.value = navBarHeightUtil.getNavBarInfo();
  showShareMenu();
  uni.onPageScroll(onPageScroll);
  if (userInfoStore.isLoggedIn) {
    CheckaccountBindStatus();
  }
});

onUnmounted(() => {
  uni.offPageScroll(onPageScroll);
});
</script>

<style scoped>
/* 原有样式保持不变 */
.container {

  min-height: 100vh;
  background: linear-gradient(to bottom, #deeeff 0%, #FFFFFF 100%);
  position: relative;
}

.page-head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
}

.pc-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
  padding-top: calc(var(--page-head-height, 60px) + 30px) !important;
  padding-bottom: 60px;
}

.layout-wrapper {
  display: flex;
  gap: 25px;
  width: 100%;
}

.left-nav {
  width: 240px;
  flex-shrink: 0;
}

/* 用户信息区域样式 */
.user-profile-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.avatar-wrapper {
  margin-bottom: 10px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #eaeaea;
}

.edit-avatar-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #2979ff;
  cursor: pointer;
}

.edit-avatar-btn text {
  margin-left: 6rpx;
}

.info-list {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #333333;
}

.info-value {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
}

.info-value text {
  margin-right: 10rpx;
}

.openid-text {
  font-size: 12px;
  color: #999999;
}

.logout-section {
  margin-top: 10px;
}

.logout-btn {
  background-color: #ffffff;
  border-radius: 8px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 15px;
  color: #ff4d4f;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

/* 右侧内容区域样式 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-shadow {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 我的常用功能区域 - 关键调整 */
.common-functions {
  padding: 20px;
  box-sizing: border-box; /* 确保内边距不影响整体宽度 */
}

.functions-grid {
  display: flex;                  /* 弹性布局 */
  width: 100%;                    /* 占满容器宽度 */
  margin: 0;
  padding: 0;
}

/* 四个按钮平均分配空间，确保完全均匀 */
.functions-grid > view {
  flex: 1;                        /* 每个按钮占据1/4宽度 */
  display: flex;
  flex-direction: column;
  align-items: center;            /* 内容居中 */
  margin: 0;                      /* 清除默认外边距 */
  padding: 10px 0;                /* 垂直方向内边距 */
}

/* 按钮之间添加分隔间距（通过伪元素实现均匀间距） */
.functions-grid > view:not(:last-child)::after {
  content: '';
  width: calc(100% / 14);         /* 间距宽度为总宽度的1/14（4个按钮产生3个间距） */
  height: 0;
}

/* 图标和文字样式微调 */
.functions-grid image {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.functions-grid text {
  font-size: 14px;
  text-align: center;
}/* 其他原有样式保持不变 */
.stats-card {
  display: flex;
  padding: 20px;
  gap: 10px;
}

.stats-item {
  flex: 1;
  text-align: center;
  padding: 15px 0;
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.vip-container {
  padding: 20px;
}

.learning-stats, .more-functions {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.chart-img {
  width: 100%;
  border-radius: 8px;
}

.function-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

/* 登录弹窗样式 */
.rect {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 600rpx;
}

.overlay-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.overlay-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.login-tips {
  font-size: 28rpx;
  color: #666;
}
</style>