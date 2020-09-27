<template>
  <!-- 目的：简化参数数据传递 -->
  <view @click="goRouter">
    <slot></slot>
  </view>
</template>


<script>
export default {
  props: {
    list: Array,
    index: Number,
  },

  //   mounted() {
  //       console.log(this.list);
  //       console.log(this.index);
  //   },

  methods: {
    // 跳转
    goRouter() {
      // 1 往globalData里面缓存数据
      getApp().globalData.imgList = this.list;
      getApp().globalData.imgIndex = this.index;
      // 2 跳转 push({ name/params })
      uni.navigateTo({
        url: "/pages/imgDetail/imgDetail",
      });
    },
  },
};
</script>

<style scoped>
</style>
