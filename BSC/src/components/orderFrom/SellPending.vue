<template>
  <div class="content">
    <VueLoading
      v-if="showLoading"
      type="spiningDubbles"
      :size="{ width: '35px', height: '35px' }"
      :style="{ fill: 'rgb(219,9, 9)' }"
    ></VueLoading>
    <van-empty
      class="null"
      v-else-if="dataList.length == 0"
      description="暂无订单信息"
    />
    <div v-else class="order" v-for="(item, index) in dataList" :key="index">
      <div class="title">
        <p>
          <span>订单号</span>&nbsp;
          <span>{{ item.odid }}</span>
          <span>（{{ item.id }}）</span>
        </p>
        <span class="text-color">
          <van-icon
            :badge="unRead_Map.get(item.id)"
            @click="handle_waterBill(item)"
          >
            <i class="iconfont icon-document" />
          </van-icon>
        </span>
      </div>
      <div class="text">
        <div>
          <p>对方质押数量</p>
          <p class="text-color">{{ item.stake }} EOTC</p>
        </div>
        <div>
          <p>交易数量</p>
          <p>{{ item.num }} USDT</p>
        </div>
        <div>
          <p>交易单价</p>
          <p>{{ item.cny }} CNY</p>
        </div>
        <div>
          <p>交易总价</p>
          <span class="text-color">{{ item.amount1 }} CNY</span>
        </div>
        <div>
          <p>提交时间</p>
          <p>{{ item.eotc }}</p>
        </div>
        <div class="sendBtn_coin">
          <van-button
            type="warning"
            :disabled="isAccountDetection(item)"
            @click="release_coinFun(item)"
            >释放 USDT</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Eotcdis_Order } from "@/api/trxRequest";
import { VueLoading } from "vue-loading-template";

export default {
  // 商家出售 待处理订单
  name: "pending-sellorder",
  components: {
    VueLoading,
  },
  data() {
    return {
      release_coin: false,
      dataList: null,
      showLoading: true, // 加载loading
      activeItem: { sname: "xxx&xxx&xxx", amount1: "0" },
      unRead_Map: new Map(),
    };
  },
  created() {
    this.initData();
  },
  methods: {
    isAccountDetection(item) {
      const rcoin = item.rcoin;
      if (rcoin === "-1") {
        return true;
      } else if (rcoin && +rcoin >= 0) {
        return false;
      } else if (!rcoin) {
        return true;
      }
      return true;
    },
    release_coinFun(item) {
      this.activeItem = item;
      console.log(item)
      if ( !item.sname || item.sname === "" || item.dsx==='0') {
        this.$toast.info("等待用户进行汇款！");
        return false;
      }
      this.$router.push({
        name: "release_coin",
        params: {
          item,
        },
      });
    },
    handle_waterBill(item) {
      this.$router.push({
        name: "seller-water-bill",
        params: {
          odid: item.id,
          item,
        },
        query: {
          role: "seller",
        },
      });
    },
    async initData() {
      try {
        const { data } = await Eotcdis_Order({
          type: 10,
          t1: -1,
        });
        // dsx = 0 未通过流水审查   1 用户已付款，待放币
        this.dataList = data;
        data.forEach((order) => {
          this.unRead_Map.set(order.id, 1);
        });
        this.showLoading = false;
      } catch (err) {
        console.warn(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: 50vh;
  position: relative;
  .vue-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  padding-bottom: 96px;
}
.sendBtn_coin {
  display: flex;
  padding: 10px;
  justify-content: flex-end !important;
}
.text-color {
  color: #fc7542;
}
.order {
  margin: 24px;
  padding: 35px 32px 40px;
  font-size: 28px;
  background: #fff;
  color: #333;
  border-radius: 20px;
  .title {
    margin-bottom: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      span {
        display: flex;
        align-items: center;
      }
    }
    i {
      font-size: 40px;
    }
  }
  .text {
    margin-bottom: 30px;
    div {
      flex: 1;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      p:first-child {
        color: #999999;
      }
      .quota {
        color: #333 !important;
        display: flex;
        flex-flow: column;
        text-align: right;
      }
    }
  }
  .button {
    margin: 20xp;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.payInfo {
  display: flex;
  flex-direction: column;
  span {
    color: #999999;
    display: flex;
    align-items: center;
  }
  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 0.7rem;
  }
}

.pop-content {
  padding: 32px;
  font-size: 28px;
  ul {
    margin-bottom: 25px;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  .title {
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
    margin-bottom: 30px;
  }
  .text {
    margin-bottom: 40px;
    padding: 25px;
    color: #000;
    line-height: 45px;
    background-color: #eee;
    border-radius: 15px;
  }
  .button {
    margin-top: 40px;
    font-size: 32px;
    display: flex;
    flex-flow: column;
    align-items: center;
    p {
      padding: 40px 0 8px;
    }
  }
}
</style>
>
