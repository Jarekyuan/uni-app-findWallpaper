<template>
  <scroll-view scroll-y @scrolltolower="handleToLower" class="ablum">
    <!-- 轮播图 加属性-->
    <view class="banner">
      <swiper autoplay indicator-dots circular>
        <swiper-item v-for="(item,index) in banner" :key="index">
          <!-- ***轮播图默认高度150px 图片宽度默认100%, 适配不同的宽度, 高不对应, 设置swiper的高度 -->
          <img src="../../../static/img/0.png" mode="widthFix" />
          <!-- <img :src="item.thumb" mode="widthFix" /> ---接口失效了-->
        </swiper-item>
      </swiper>
    </view>

    <!-- 专辑列表 -->
    <view class="ablum-list">
      <navigator
        :url="`/pages/album/albumDetail?id=${item.id}`"
        class="list-item"
        v-for="(item,index) in album"
        :key="index"
      >
        <!-- 图片 -->
        <view class="img">
          <img :src="item.cover" mode="widthFix" />
        </view>
        <!-- 文字 -->
        <view class="info">
          <view class="name">{{item.name}}</view>
          <view class="desc">{{item.desc}}</view>
          <view class="btn">
            <view class="button-guanzhu" @click.stop="guanzhu">关注</view>
          </view>
        </view>
      </navigator>
    </view>
  </scroll-view>
</template>


<script>
export default {
  data() {
    return {
      params: {
        limit: 10,
        order: "new",
        skip: 0,
      },
      banner: [],
      album: [],
      hasMore: true,
    };
  },

  mounted() {
    // ***修改页面标题
    uni.setNavigationBarTitle({ title: "专辑" });
    this.getList();
  },

  methods: {
    getList() {
      this.request({
        url: "http://service.picasso.adesk.com/v1/wallpaper/album",
        data: this.params,
      }).then((res) => {
        // console.log(res);

        // banner 接口失效
        this.banner = res.res.banner;

        // 没有更多数据,修改标志位,不再发请求
        if (res.res.album.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多了...",
            icon: "none",
          });
          return;
        }

        // 专辑(数组拼接)
        this.album = [...this.album, ...res.res.album];
      });
    },

    handleToLower() {
      // 修改参数,请求数据
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
  },
};
</script>


<style scoped lang="scss">
.ablum {
  // 定义scroll 的高度
  height: calc(100vh - 50rpx);
}

.banner {
  padding-top: 20rpx;

  // ***设置swiper的宽高比例
  swiper {
    // width: 750rpx;
    // 2.3 为图片实际宽高比
    height: calc(750rpx / 2.3);
    img {
      height: 100%;
    }
  }
}

.ablum-list {
  padding: 20rpx 10rpx;
  .list-item {
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ddd;

    .img {
      flex: 1;
      padding: 10rpx;
    }

    .info {
      flex: 2;
      padding: 0 10rpx;
      // 超出限制
      overflow: hidden;

      .name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx;
      }

      .desc {
        padding: 10rpx 0;
        font-size: 24rpx;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .btn {
        padding: 10rpx;
        display: flex;
        justify-content: flex-end;
        .button-guanzhu {
          color: $color;
          border: 1rpx solid $color;
          padding: 5rpx 10rpx;
          border-radius: 10rpx;
        }
      }
    }
  }
}
</style>
