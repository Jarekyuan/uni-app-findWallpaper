<template>
  <!-- scroll-view 滚动    scrolltolower 触底部-->
  <scroll-view scroll-y @scrolltolower="toLower" class="recommend" v-if="recommends.length>0">
    <!-- 推荐 -->
    <navigator
      class="recommend-wrap"
      :url="`/pages/album/albumDetail?id=${'5f4f491de7bce762494265fb'}`"
    >
      <view class="recommend-item" v-for="(item,index) in recommends" :key="index">
        <img mode="widthFix" :src="item.value.lcover" />
      </view>
    </navigator>

    <!-- 月份 -->
    <view class="month-wrap">
      <!-- 标题 -->
      <view class="month-title">
        <view class="month-title-info">
          <text class="times">{{month.DD}}/{{month.MM}} 月</text>
          <text class="text">{{month.title}}</text>
        </view>
        <view class="month-title-more">更多</view>
      </view>
      <!-- 内容 -->
      <view class="month-content">
        <view class="month-item" v-for="(item,index) in month.items" :key="index">
          <!-- 超链接 -->
          <go-detail :list="month.items" :index="index">
            <!-- ***缩略图效果显示*** -->
            <img mode="aspectFill" :src="item.thumb+item.rule.replace('$<Height>',360)" alt />
          </go-detail>
        </view>
      </view>
    </view>

    <!-- 热门 -->
    <view class="hots-wrap">
      <view class="title">
        <text class="text">热门</text>
      </view>
      <view class="content">
        <view class="hot-item" v-for="(item,index) in hots" :key="index">
          <!-- 跳转组件 -->
          <go-detail :list="hots" :index="index">
            <img mode="widthFix" :src="item.thumb" alt />
          </go-detail>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import moment from "moment";
import goDetail from "../../../components/goDetail";

export default {
  data() {
    return {
      // 请求参数
      params: {
        limit: 30,
        order: "hot",
        skip: 0,
      },
      // hasmore
      hasMore: true,
      // 推荐列表
      recommends: [],
      // 月份
      month: {},
      // 热门
      hots: [],
    };
  },

  mounted() {
    // ***修改页面标题
    uni.setNavigationBarTitle({ title: "推荐" });
    // 调用
    this.getList();
  },

  methods: {
    // -------------------获取接口数据--------------------
    getList() {
      // 获取数据
      this.request({
        url: "http://service.picasso.adesk.com/v3/homepage/vertical",
        data: this.params,
      }).then((res) => {
        // console.log(res);

        // 没有更多数据,修改标志位,不再发请求
        if (res.res.vertical.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多了...",
            icon: "none",
          });
          return;
        }

        // 如果是第一次发请求:
        if (this.recommends.length === 0) {
          // 头部推荐
          this.recommends = res.res.homepage[1].items.slice(0, 2);
          // 月份
          this.month = res.res.homepage[2];
          this.month.MM = moment(this.month.stime).format("MM");
          this.month.DD = moment(this.month.stime).format("DD");
          console.log(this.month.items);
        }

        // 热门(数组拼接)
        this.hots = [...this.hots, ...res.res.vertical];
        console.log(this.hots);
      });
    },

    // -------------------上拉加载------------------------
    toLower() {
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

  components: {
    goDetail,
  },
};
</script>


<style scoped lang="scss">
.recommend {
  // h = 屏幕高度 - 头部标题的高度
  height: calc(100vh - 50px);
}
// 推荐
.recommend-wrap {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20rpx;
  .recommend-item {
    width: 50%;
    border: 5rpx solid #fff;
  }
}

// 月份
.month-wrap {
  .month-title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    .month-title-info {
      display: flex;
      font-weight: 600;
      .times {
        color: $color;
        font-size: 32rpx;
      }
      .text {
        margin-left: 20rpx;
        font-size: 34rpx;
        color: #555;
      }
    }
    .month-title-more {
      color: $color;
      font-size: 30rpx;
    }
  }

  .month-content {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10rpx;
    .month-item {
      width: 33.33%;
      border: 7rpx solid #fff;
    }
  }
}

// 热门
.hots-wrap {
  .title {
    padding: 20rpx;
    .text {
      border-left: 20rpx solid $color;
      padding-left: 20rpx;
      font-size: 34rpx;
      font-weight: 600;
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    .hot-item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
</style>
