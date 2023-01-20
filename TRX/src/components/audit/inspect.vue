<template>
  <div>
    <!-- background="#F3F4F5" -->

    <div class="not_content">
      <div v-if="list.length != 0">
        <van-search
          class="search"
          v-model="value"
          background="#F3F4F5"
          placeholder="请输入搜索关键词"
        />
        <div class="content" v-for="(item, index) in list" :key="index">
          <div class="cont_title">
            <p>{{ item.name }}</p>
            <p>提交时间:{{ item.subtime }}</p>
          </div>
          <div class="number">
            <p>手机号: {{ item.phone }}</p>
            <p>证件号: {{ item.IDcard }}</p>
          </div>
          <p>证件及手持证件照</p>
          <div class="imgs">
            <img @click="imgClick(0)" src="@/static/image/222.png" alt="" />
            <img @click="imgClick(1)" src="@/static/image/222.png" alt="" />
          </div>
          <div class="time">
            <p class="shtime">审核时间:{{ item.audittime }}</p>
            <p>审核人:陈粒</p>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty class="null" image="error" description="描述文字" />
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "inspect",
  //检查页面
  data() {
    return {
      value: "",
      list: [
        {
          name: "大明",
          subtime: "2022-5-21",
          phone: "1342541****",
          IDcard: "589615524****",
          imgs: [],
          audittime: "2022-3-23",
          show: true,
        },
        {
          name: "二明",
          subtime: "2022-5-20",
          phone: "1342541****",
          IDcard: "589615524****",
          imgs: [],
          audittime: "2022-3-23",
          cause: "手持证件照有误,请重新提交",
          show: false,
        },
      ],
    };
  },
  methods: {
    imgClick(index) {
      ImagePreview({
        images: [
          "https://img01.yzcdn.cn/vant/apple-1.jpg",
          "https://img01.yzcdn.cn/vant/apple-2.jpg",
        ],
        startPosition: index,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  /deep/.van-search__content {
    background: #fff;
  }
  /deep/.van-search {
    padding-bottom: 0;
    border-radius: 16px;
  }
}
.not_content {
  padding: 24px;
  background: #f3f4f5;
  .null{
      min-height: calc(100vh - 228px);
  }
  .content {
    padding: 22px 30px 40px;
    margin-bottom: 24px;
    background: #fff;
    font-size: 28px;
    color: #333;
    border-radius: 28px;
    .cont_title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 52px;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
      }
      p:last-child {
        color: #999;
      }
    }
    .number {
      margin-bottom: 30px;
      //   position: relative;
      //   img {
      //     width: 200px;
      //     position: absolute;
      //     right: 0;
      //     top: -20px;
      //   }
      p:first-child {
        margin-bottom: 16px;
      }
    }
    .imgs {
      padding: 16px 0 28px;
      display: flex;
      justify-content: space-around;
      img {
        width: 284px;
        height: 190px;
        border-radius: 10px;
      }
    }
    .time {
      display: flex;
      justify-content: space-between;
      .shtime {
        color: #999;
        // padding-bottom: 30px;
      }
    }
  }
}
</style>
