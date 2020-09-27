<template>
  <view class="view-detail">
    <!-- 上部分 -->
    <view class="ablum-bg">
      <img mode="widthFix" :src="album.cover" />
      <view class="info">
        <view class="name">{{album.name}}</view>
        <view class="btn">关注专辑</view>
      </view>
    </view>
    <!-- 中间 -->
    <view class="album-desc">
      <view class="title">
        <img src="../../static/img/1.png" mode="widthFix" />
        <view class="name">{{album.user.name}}</view>
      </view>
      <view class="info">
        <!-- ***如果后台数据里有换行，则使用text标签 -->
        <text>{{album.desc}}</text>
      </view>
    </view>
    <!-- 下边图片列表 -->
    <view class="ablum-list">
      <view class="item">
        <img src="../../static/img/0.png" mode="widthFix" />
        <img src="../../static/img/0.png" mode="widthFix" />
        <img src="../../static/img/0.png" mode="widthFix" />
        <img src="../../static/img/0.png" mode="widthFix" />
        <img src="../../static/img/0.png" mode="widthFix" />
        <img src="../../static/img/0.png" mode="widthFix" />
      </view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      params: {
        limit: 10,
        order: "new",
        skip: 0,
        first: 1,
      },
      id: -1,
      album: {},
      hasMore: true,
    };
  },

  onLoad(options) {
    // 获取页面参数id
    this.id = options.id;
  },

  // ***页面加载，上拉加载: 整个页面全部下拉时候直接用onReachBottom, 比scroll简单
  onReachBottom() {
    if (this.hasMore) {
      this.params.skip += this.params.limit;
      this.getList();
    } else {
      // 弹窗
      uni.showToast({
        title: "没有更多了...",
        icon: "none",
      });
    }
  },

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      this.request({
        url: `http://service.picasso.adesk.com/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params,
      }).then((res) => {
        console.log(res);

        // ------ Object.keys(this.album) 表示对象存在
        if (Object.keys(this.album).length === 0) {
          this.album = res.res.album;
        }

        // wallpaper 接口失效
      });
    },
  },
};
</script>


<style scoped lang="scss">
// 背景
.ablum-bg {
  width: 100%;
  position: relative;
  .info {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    color: #fff;
    height: 80rpx;
    align-items: center;
    padding: 5rpx 20rpx;
    .name {
      font-size: 40rpx;
    }
    .btn {
      background-color: $color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
    }
  }
}

// 中间文字
.album-desc {
  padding: 10rpx;
  .title {
    padding: 10rpx 0;
    display: flex;
    img {
      width: 50rpx;
    }
    .name {
      color: #111;
      margin-left: 15rpx;
      font-weight: 600;
    }
    .info {
      line-height: 25rpx;
    }
  }
}

// 图片列表
.ablum-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 33%;
    border: 3rpx solid #fff;
  }
}
</style>
