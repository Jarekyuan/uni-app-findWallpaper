<template>
  <view>
    <!-- tab栏分页展示 -->
    <view class="home">
      <view class="header">
        <view class="header-inner">
          <!-- 分段器 -->
          <uni-segmented-control
            :current="current"
            :values="items"
            @clickItem="onClickItem"
            style-type="text"
            active-color="#1a73e8"
          ></uni-segmented-control>
        </view>
        <view class="iconfont icon-sousuo"></view>
      </view>
      <!-- 内容部分 -->
      <view class="content">
        <view v-if="current === 0">
          <homeRecommend></homeRecommend>
        </view>
        <view v-if="current === 1">
          <homeCategory></homeCategory>
        </view>
        <view v-if="current === 2">
          <homeAlbum></homeAlbum>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import homeRecommend from "./sonCom/recommend.vue";
import homeCategory from "./sonCom/category.vue";
import homeAlbum from "./sonCom/album.vue";

import { uniSegmentedControl } from "@dcloudio/uni-ui";

export default {
  data() {
    return {
      items: ["推荐", "分类", "专辑"],
      current: 0,
    };
  },
  methods: {
    //   点击切换tab
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
  },

  components: {
    homeRecommend,
    homeCategory,
    homeAlbum,
    uniSegmentedControl,
  },
};
</script>

<style scoped lang="scss">
.home {
    width: 100%;
    height: 100%;
    .header {
        height: 50px;
        padding-top: 10px;
        position: relative;


        .header-inner {
            width: 45%;
            margin: 0 auto;
        }
        .iconfont {
            position: absolute;
            right: 5%;
            font-size: 18px;
            font-weight: 600;
            color: #1a73e8;
            top: 50%;
            transform: translateY(-50%)
        }
    }
    .content {
        width: 100%;
    }
}
</style>
