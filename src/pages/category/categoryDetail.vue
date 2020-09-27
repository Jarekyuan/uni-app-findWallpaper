<template>
  <view>
    <view class="header">
      <!-- 分段器 -->
      <uni-segmented-control
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        style-type="text"
        active-color="#1a73e8"
      ></uni-segmented-control>
    </view>
    <!-- 内容 -->
    <scroll-view scroll-y class="info" @scrolltolower="toLower">
      <view v-if="current === 0" class="content">
        <view class="item" v-for="(item,index) in picDetali" :key="item.id">
          <go-detail :list="picDetali" :index="index">
            <img :src="item.thumb" mode="widthFix" />
          </go-detail>
        </view>
      </view>
      <view v-if="current === 1" class="content">
        <view class="item" v-for="(item,index) in picDetali" :key="item.id">
          <go-detail :list="picDetali" :index="index">
            <img :src="item.thumb" mode="widthFix" />
          </go-detail>
        </view>
      </view>
    </scroll-view>
  </view>
</template>


<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import goDetail from "../../components/goDetail";

export default {
  data() {
    return {
      items: ["最新", "热门"],
      current: 0,
      order: ["new", "hot"],
      // 参数
      params: {
        limit: 30,
        order: "new",
        skip: 0,
      },
      id: -1,
      // 列表数据
      picDetali: [],
      hasMore: true,
    };
  },

  onLoad(options) {
    // 获取页面参数id
    this.id = options.id;

    this.getList();
  },

  methods: {
    onClickItem(e) {
      // 点击切换tab
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      } else {
        // 点击相同的标题两次
        return;
      }
      // 点击后切换对应数据
      this.params.order = this.order[e.currentIndex];
      this.params.skip = 0;
      this.picDetali = [];
      // 重新发送请求
      this.getList();
    },

    // 获取数据
    getList() {
      this.request({
        url: `http://service.picasso.adesk.com/v1/vertical/category/${this.id}/vertical`,
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
        this.picDetali = [...this.picDetali, ...res.res.vertical];
      });
    },

    // 触发加载更多
    toLower() {
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
    uniSegmentedControl,
    goDetail,
  },
};
</script>

<style scoped lang="scss">
.header {
  width: 35%;
  margin: 0 auto;
  height: 50px;
  padding-top: 10px;
  position: relative;
}
.info {
  margin-top: 10rpx;
  height: calc(100vh - 50px);

  .content {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 33.33%;
      border: 4rpx solid #fff;
    }
  }
}
</style>
