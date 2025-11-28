<template>
  <view
    class="cat-container"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="handleDrag"
    @touchmove="handleDrag"
    @mouseup="endDrag"
    @touchend="endDrag"
    @mouseleave="endDrag"
    @click="showRandomBubble"
  >
    <!-- 猫咪图片（5张图） -->
    <image
      :src="currentCatImage"
      mode="widthFix"
      class="cat-image"
      :class="{ 'dragging': isDragging }"
    />

    <!-- 浅黄配色对话框 -->
    <view class="bubble" v-if="showBubble">
      <text>{{ bubbleText }}</text>
      <view class="bubble-tail"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 位置状态
const x = ref(200); // 初始X坐标
const y = ref(300); // 初始Y坐标
const startX = ref(0);
const startY = ref(0);
const isDragging = ref(false);
const showBubble = ref(false);
const bubbleText = ref('喵~');

// 猫咪图片路径（5张图）
const catImages = [
  '/static/images/cat/cat1.png',
  '/static/images/cat/cat2.png',
  '/static/images/cat/cat3.png',
  '/static/images/cat/cat4.png',
  '/static/images/cat/cat5.png'
];
const currentCatImage = ref(catImages[0]);

// 可爱对话文字
const bubbleTexts = [
  '喵~ 陪我玩呀',
  '你好呀~ 我超可爱的',
  '今天也要加油哦',
  '摸我摸我~ 软fufu的',
  '困困... 要睡啦',
  '想吃小鱼干',
  '天气真好呀',
  '这个球好好玩',
  '咕噜咕噜~ 开心',
  '快来陪我玩嘛'
];

// 开始拖拽（优化触发灵敏度）
const startDrag = (e) => {
  isDragging.value = true;
  // 优先获取触点位置，减少延迟
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  // 立即计算起始偏移量，无延迟
  startX.value = clientX - x.value;
  startY.value = clientY - y.value;

  currentCatImage.value = catImages[0];
  showRandomBubble();
};

// 拖拽中（优化响应速度）
const handleDrag = (e) => {
  if (!isDragging.value) return;
  // 触摸事件优先阻止默认行为，避免页面滚动干扰
  if (e.type.includes('touch')) e.preventDefault();

  // 快速获取最新触点位置
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

  // 直接计算新位置，无额外延迟
  const newX = clientX - startX.value;
  const newY = clientY - startY.value;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 限制范围（保留10px边距，避免贴边）
  x.value = Math.max(10, Math.min(newX, windowWidth - 110));
  y.value = Math.max(10, Math.min(newY, windowHeight - 110));
};

// 结束拖拽（立即释放状态）
const endDrag = () => {
  isDragging.value = false;
  // 延迟缩短，快速切换图片
  setTimeout(() => {
    currentCatImage.value = catImages[1];
  }, 200);
};

// 随机显示气泡
const showRandomBubble = () => {
  bubbleText.value = bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)];
  showBubble.value = true;
  setTimeout(() => {
    showBubble.value = false;
  }, 3000);
};

// 定时切换图片
let activityTimer;
onMounted(() => {
  activityTimer = setInterval(() => {
    if (!isDragging.value) {
      const randomIndex = Math.floor(Math.random() * catImages.length);
      currentCatImage.value = catImages[randomIndex];

      if (Math.random() > 0.6) {
        showRandomBubble();
      }
    }
  }, Math.random() * 3000 + 4000);
});

onUnmounted(() => {
  clearInterval(activityTimer);
});
</script>

<style scoped>
.cat-container {
  position: fixed;
  z-index: 9999; /* 确保最上层，不被遮挡 */
  pointer-events: auto;
  cursor: grab;
  transition: none; /* 取消过渡动画，提升拖拽响应 */
}

.cat-container:active {
  cursor: grabbing;
}

.cat-image {
  width: 100px;
  height: auto;
  transition: transform 0.2s ease; /* 缩短动画时间，不影响拖拽 */
}

.cat-image.dragging {
  transform: scale(1.05) rotate(2deg); /* 轻微放大旋转，不影响拖拽手感 */
}

/* 恢复浅黄配色对话框 */
.bubble {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff9e6; /* 浅黄底色 */
  padding: 10px 18px;
  border-radius: 24px;
  box-shadow: 0 3px 10px rgba(255, 220, 150, 0.2); /* 浅黄阴影 */
  min-width: 100px;
  text-align: center;
  z-index: 10;
  border: 1px solid #ffe8b3; /* 浅黄边框 */
}

/* 可爱文字样式（搭配浅黄背景） */
.bubble text {
  color: #b37d49; /* 暖棕色文字，柔和不刺眼 */
  font-size: 14px;
  font-family: "Comic Sans MS", "Marker Felt", "Arial Rounded MT Bold", sans-serif; /* 圆润手写字体 */
  font-weight: 500;
  letter-spacing: 0.8px; /* 加宽字间距 */
  line-height: 1.5;
  text-shadow: 0.5px 0.5px 1px rgba(255, 255, 255, 0.8); /* 轻微白边 */
}

/* 对话框尾巴（浅黄配色） */
.bubble-tail {
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 18px;
  height: 18px;
  background: #fff9e6;
  border-right: 1px solid #ffe8b3;
  border-bottom: 1px solid #ffe8b3;
  box-shadow: 3px 3px 5px rgba(255, 220, 150, 0.1);
}
</style>