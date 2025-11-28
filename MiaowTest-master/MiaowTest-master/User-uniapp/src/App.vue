<script>
export default {
  onLaunch: function () {
    //#ifdef MP-WEIXIN
    wx.cloud.init()
    //#endif
  },


}
</script>

<style>
/*每个页面公共css */
uni-modal {
  z-index: 19999 !important;
}
page {
  padding-top: 40px; /* 导航栏高度，需与实际保持一致 */
  box-sizing: border-box; /* 防止内边距撑大页面 */
}
</style>
