<template>
  <!-- 提供滑动的方向 -->
  <view @touchstart="handleTouchstart" @touchend="handleTouchend">
    <slot></slot>
  </view>
</template>


<script>
export default {
  data() {
    return {
      // 按下的时间
      startTime: 0,
      // 按下的坐标
      startX: 0,
      startY: 0,
    };
  },

  methods: {
    handleTouchstart(event) {
      // 滑动开始时候的时间和位置
      this.startTime = Date.now();
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
    },
    handleTouchend(event) {
      // 滑动结束时候的时间和位置
      const endTime = Date.now();
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;

      // -----判断按下的时长
      if (endTime - this.startTime > 2000) {
        return;
      }

      // 滑动的方向
      let direction = "";
      // -----先判断用户滑动的距离 是否合法 合法：判断滑动的方向  注意 距离要加上绝对值
      if (
        Math.abs(endX - this.startX) > 10 &&
        Math.abs(endY - this.startY) < 10
      ) {
        // 滑动方向！！！
        direction = endX - this.startX > 0 ? "right" : "left";
      } else {
        return;
      }

      // 用户做了合法的滑动操作，派发事件给父组件
      this.$emit("swiperAction", { direction });
    },
  },
};
</script>

<style scoped>
</style>
