<template>
  <scroll-view scroll-y class="info">
    <view class="category">
      <navigator
        :url="`/pages/category/categoryDetail?id=${item.id}`"
        class="item"
        v-for="item in category"
        :key="item.id"
      >
        <img mode="widthFix" :src="item.cover" />
        <view class="name">{{item.name}}</view>
      </navigator>
    </view>
  </scroll-view>
</template>


<script>
export default {
  data() {
    return {
      category: [],
    };
  },

  mounted() {
    // ***修改页面标题
    uni.setNavigationBarTitle({ title: "分类" });
    // 发送请求
    this.getList();
  },

  methods: {
    getList() {
      // 获取数据
      this.request({
        url: "http://service.picasso.adesk.com/v1/vertical/category",
      }).then((res) => {
        console.log(res);

        this.category = res.res.category;
      });
    },
  },
};
</script>


<style scoped lang="scss">
.info {
  height: calc(100vh - 50px);
}
.category {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    border: 7rpx solid #fff;
    position: relative;
    .name {
      position: absolute;
      bottom: 5rpx;
      left: 20rpx;
      font-size: 34rpx;
      font-weight: 600;
      color: #fff;
      letter-spacing: 4rpx;
      // 文字渐变
      background-image: linear-gradient(
        to right top,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
      );
    }
  }
}
</style>
