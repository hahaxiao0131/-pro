import { Userlogin } from '../API/My/UserLoginAPI';
import { UserInfoStore } from '../stores/modules/UserinfoStore';

/**
 * 微信登录工具函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.rememberMe - 是否记住登录状态
 * @param {boolean} options.navigateToMy - 登录成功后是否跳转到我的页面
 * @returns {Promise<Object>} 返回登录结果
 */
export const wechatLogin = async (options = {}) => {
  const {
    rememberMe = false,
    navigateToMy = true
  } = options;

  try {
    // 获取微信登录凭证
    const loginData = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: (data) => resolve(data),
        fail: (err) => reject(new Error(`获取微信授权失败: ${err.errMsg}`))
      });
    });

    // 调用登录接口（传递rememberMe参数）
    const response = await Userlogin(loginData.code, rememberMe);

    if (response.code === 200 && response.success) {
      uni.showToast({ title: '登录成功', icon: 'success' });

      const userInfoStore = UserInfoStore();
      userInfoStore.setUserInfo(response.data.userInfo);

      // 根据rememberMe设置存储有效期
      if (rememberMe) {
        // 记住登录：存储7天（单位：秒）
        uni.setStorageSync('token', response.data.token);
        uni.setStorageSync('tokenExpiry', Date.now() + 7 * 24 * 60 * 60 * 1000);
      } else {
        // 不记住：会话级存储（关闭应用失效）
        uni.setStorageSync('token', response.data.token);
        uni.removeStorageSync('tokenExpiry'); // 不设置过期时间
      }

      if (navigateToMy) {
        uni.switchTab({ url: '/pages/my/my' });
      }
      return response;
    } else {
      const errorMsg = response.message || '登录失败，请重试';
      uni.showToast({ title: errorMsg, icon: 'none' });
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('微信登录失败', error);
    uni.showToast({ title: error.message || '登录失败', icon: 'none' });
    throw error;
  }
};

export default wechatLogin;