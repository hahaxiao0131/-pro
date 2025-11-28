// 显示分享菜单
const showShareMenu = () => {
  uni.showShareMenu({
    withShareTicket: true,
    title: '考神附体Pro',
    path: '/pages/index/index',
    menus: ["shareAppMessage", "shareTimeline"],
  });
};
export default showShareMenu;