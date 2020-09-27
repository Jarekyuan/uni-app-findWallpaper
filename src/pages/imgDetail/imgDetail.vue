<template>
  <view>
    <!-- 用户信息 开始 -->
    <view class="user_info">
      <view class="user_icon">
        <!-- 头像接口失效 -->
        <img src="../../static/img/1.png" mode="widthFix" />
      </view>
      <view class="user_desc">
        <view class="user_name">亲 接口数据失效了~~~</view>
        <view class="user_time">{{imgDetail.cnTime}}</view>
      </view>
      <!-- 转发 -->
      <view class="iconfont icon-zhuanfa">
        <button open-type="share"></button>
      </view>
    </view>

    <!-- 高清大图 开始 -->
    <view class="high_img">
      <swiper-action @swiperAction="handleSwiperAction">
        <img mode="widthFix" :src="imgDetail.img" />
      </swiper-action>
    </view>

    <!-- 点赞 开始 -->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icon-dianzan">{{imgDetail.rank}}</text>
      </view>
      <view class="user_collect">
        <text class="iconfont icon-shoucang">收藏</text>
      </view>
    </view>

    <!-- 专辑 开始 -->
    <view class="album_wrap" v-if="album.length">
      <!-- 标题 -->
      <view class="album_title">相关</view>
      <!-- 内容 -->
      <view class="album_list">
        <view class="album_item" v-for="item in album" :key="item.id">
          <view class="album_cover">
            <img :src="item.cover" mode="aspectFill" />
          </view>
          <!-- 右边 -->
          <view class="album_info">
            <view class="album_info_text">专辑</view>
            <view class="album_name">{{item.name}}</view>
            <text class="iconfont icon-jiantou"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 最热评论 hot -->
    <view class="comment hot" v-if="hot.length">
      <view class="comment_title">
        <text class="iconfont icon-hot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in hot" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <!-- <img mode="widthFix" :src="item.user.avatar" v-if="item.user.avatar"/> -->
              <img mode="widthFix" src="../../static/img/1.png" />
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cnTime}}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <img v-for=" item2 in  item.user.title" :key="item2.icon" :src="item2.icon" />
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icon-dianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 最新评论 comment -->
    <view class="comment new" v-if="comment.length">
      <view class="comment_title">
        <text class="iconfont icon-pinglun"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in comment" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <img mode="widthFix" src="../../static/img/1.png" />
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="user_nickname">{{item.user.name}}</view>
              <view class="user_time">{{item.cnTime}}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <img v-for=" item2 in  item.user.title" :key="item2.icon" :src="item2.icon" />
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content">{{item.content}}</view>
            <view class="comment_like">
              <text class="iconfont icon-dianzan">{{item.size}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 下载 -->
    <view class="download">
      <view class="download_btn" @click="download">下载图片</view>
    </view>
  </view>
</template>


<script>
import moment from "moment";
// 设置为中文
moment.locale("zh-cn");

import swiperAction from "../../components/swiperAction";

export default {
  data() {
    return {
      imgDetail: {},
      imgIndex: 0,
      // 评论
      album: [],
      comment: [],
      hot: [],
    };
  },

  onLoad() {
    //   结构出传来的数据
    const { imgIndex } = getApp().globalData;
    this.imgIndex = imgIndex;
    this.getData();
  },

  methods: {
    // 1.获取到全局的数据
    getData() {
      // 点击获得这个对象数据
      const { imgList } = getApp().globalData;
      this.imgDetail = imgList[this.imgIndex];

      // 数据：xxx年前
      this.imgDetail.cnTime = moment(this.imgDetail.atime * 1000).fromNow();
      // 发送请求获取图片评论
      this.getComments(this.imgDetail.id);
    },

    // 2.根据id获取当前图片的评论
    getComments(id) {
      this.request({
        url: `http://service.picasso.adesk.com/v2/wallpaper/wallpaper/${id}/comment`,
      }).then((res) => {
        console.log(res);

        this.album = res.res.album;
        this.comment = res.res.comment;
        this.hot = res.res.hot;

        // xxx年前 先遍历数组，找到然后moment()
        res.res.hot.forEach(
          (val) => (val.cnTime = moment(val.atime * 1000).fromNow())
        );
        res.res.comment.forEach(
          (val) => (val.cnTime = moment(val.atime * 1000).fromNow())
        );
      });
    },

    // 3.滑动事件
    handleSwiperAction(e) {
      //  1 用户左滑 imgIndex++, 用户右滑 imgIndex--
      //  2 判断 数组是否越界问题 imgDetail的长度s！！
      //  3 左滑:  e.direction==="left" && this.imgIndex < imgList.length-1
      //  4 右滑:  e.direction==="right" && this.imgIndex > 0

      const { imgList } = getApp().globalData;

      if (e.direction === "left" && this.imgIndex < imgList.length - 1) {
        // 加载下一页
        this.imgIndex++;
        this.getData();
      } else if (e.direction === "right" && this.imgIndex > 0) {
        // 加载上一页
        this.imgIndex--;
        this.getData();
      } else {
        // 超出提示
        uni.showToast({
          title: "没用图片了...",
          icon: "none",
        });
      }
    },

    // 4.下载
    async download() {
      await uni.showToast({ title: "下载中" });
      // 获取路径下载
      const res = await uni.downloadFile({ url: this.imgDetail.img });
      const { tempFilePath } = res[1];
      const res2 = await uni.saveImageToPhotosAlbum({ filePath: tempFilePath });
      // 提示下载完成
      uni.hideLoading();
      await uni.showToast({ title: "下载成功" });
    },
  },

  components: {
    swiperAction,
  },
};
</script>


<style scoped lang="scss">
// 信息
.user_info {
  display: flex;
  padding: 20rpx;
  position: relative;
  .user_icon {
    padding: 0 20rpx;
    img {
      width: 88rpx;
      border-radius: 50%;
    }
  }

  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }

    .user_time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }

  .icon-zhuanfa {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: $color;
    button {
      position: absolute;
      right: -5rpx;
      top: 5rpx;
      width: 100%;
      height: 100%;
      // background-color: #333;
      opacity: 0;
    }
  }
}

// 图片 点赞
.high_img {
  img {
    border-bottom: 1rpx solid #eee;
  }
}

.user_rank {
  display: flex;
  height: 80rpx;
  border-bottom: 5rpx solid #eee;
  .rank {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user_collect {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 专辑
.album_wrap {
  padding: 20rpx;
  .album_title {
    padding: 10rpx 0;
  }

  .album_list {
    .album_item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album_cover {
        flex: 1;
        img {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album_info {
        flex: 3;
        padding-left: 20rpx;
        position: relative;
        .album_info_text {
          width: 100rpx;
          height: 50rpx;
          background-color: $color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album_name {
          padding: 10rpx 0;
          color: #888;
        }
        .iconfont {
          font-size: 40rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10%;
          color: #000;
        }
      }
    }
  }
}

// 最热评论
.comment {
  padding: 10rpx;
  .comment_title {
    padding: 15rpx;
    .iconfont {
      color: red;
      font-size: 40rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  .comment_list {
    .comment_item {
      border-bottom: 15rpx solid #eee;
      // 用户信息
      .comment_user {
        display: flex;
        padding: 20rpx 0;
        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 90%;
          }
        }

        .user_name {
          flex: 1;
          .user_nickname {
            color: #777;
          }

          .user_time {
            color: #ccc;
            font-size: 24rpx;
            padding: 5rpx;
          }
        }

        .user_badge {
          img {
            width: 40rpx;
            height: 40rpx;
            display: inline-block;
          }
        }
      }
      // 评论数据
      .comment_desc {
        display: flex;
        padding: 30rpx 0;
        .comment_content {
          flex: 1;
          padding-left: 15%;
          color: #111;
          font-weight: 600;
        }

        .comment_like {
          text-align: right;
        }
      }
    }
  }
}
// 最新评论
.new {
  .icon-pinglun {
    color: $color !important;
    font-weight: 600 !important;
  }
}

// 下载
.download {
  height: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  .download_btn {
    width: 90%;
    height: 80%;
    background-color: $color;
    color: #fff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
