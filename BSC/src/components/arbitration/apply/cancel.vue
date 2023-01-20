<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="title">仲裁案</div>
      <div class="top">
        <both
          :bankShow="false"
          :planShow="false"
          :leftnaem="bothData.leftnaem"
          :rightname="bothData.rightname"
          :lefturl="bothData.lefturl"
          :righturl="bothData.righturl"
        ></both>
        <p class="qiyin">原告卖家发起仲裁，仲裁事件为账户冻结</p>
        <div class="details">
          <van-cell
            icon="orders-o"
            title="仲裁详情"
            is-link
            :to="{ name: 'details' }"
          />
        </div>
      </div>
      <div class="center">
        <div v-for="(item,index) in list " :key='index'>
          <p>{{item.title}}</p>
          <p>{{item.text}}</p>
        </div>
      </div>
      <!-- <div class="footer">
        <van-button type="default" round>不同意</van-button>
        <van-button color="#1B2945" round>同意</van-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import both from "@/components/arbitration/module/both.vue";
export default {
  //申请取消仲裁
  components: {
    white,
    both,
  },
  data() {
    return {
      title: "取消仲裁",
      bothData: {
        leftnaem: "吴敏",
        rightname: "王晓雷",
        lefturl: require("@/static/image/usdt.svg"),
        righturl: require("@/static/image/usdc.svg"),
      },
       list: [
        { title: "取消原因", text: "单方面撤诉" },
      
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 30px 32px 60px;
  font-size: 28px;
  color: #333;
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .top {
    margin-bottom: 40px;
    .qiyin {
      padding: 24px;
      background: #f3f4f5;
      border-radius: 0px 20px 20px 20px;
    }
    .details {
      /deep/.van-cell {
        padding-left: 0;
        margin-top: 20px;
      }
      /deep/.van-cell__left-icon {
        color: #237ff8;
      }
      /deep/.van-cell__title {
        color: #237ff8;
      }
    }
  }
  .center {
    div {
      margin-bottom: 40px;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
//   .footer {
//     width: 100%;
//     position: fixed;
//     bottom: 60px;
//     left: 0;
//     display: flex;
//     justify-content: space-around;
//     button {
//       width: 45%;
//     }
//   }
}
</style>
