// 只清除用户信息的函数
export const clearUserInfo = () => {
  try {
    uni.removeStorageSync('token');
    uni.removeStorageSync('userinfo');
    return {
      isClear: true,
      message: "用户信息清除成功"
    }
  } catch (error) {
    console.error('清除用户信息时出错:', error);
  }
};