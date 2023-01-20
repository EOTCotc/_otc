<template>
  <div class="order-container" v-if='isShow(+order_item.id)'>
    <section class="app-bg"></section>
    <header class="header" v-if="order_type(+order_item.id)">
      <div class="header-top-left"  >
        <van-tag mark type="primary">
        <span>出售</span>
        </van-tag>
        &nbsp;&nbsp;
        <span class="header-top-left-test">USDT</span>
        &nbsp;&nbsp;
      </div>
      <p class="header-top">
        <span class="header-topRight"  @click='Contact_buyer(order_item)'>
          <van-icon name="guide-o" :style="{ fontSize: '20px' }" />
          联系买家
        </span>
      </p>
    </header>
    <header class="header" v-else>
      <div class="header-top-left"  >
        <van-tag mark type="warning">
        <span>收购</span>
        </van-tag>
        &nbsp;&nbsp;
        <span class="header-top-left-test">USDT</span>
        &nbsp;&nbsp;
      </div>
      <p class="header-top">
        <span class="header-topRight" @click='Contact_seller(order_item)'>
          <van-icon name="guide-o" :style="{ fontSize: '20px' }"  />
          联系卖家
        </span>
      </p>
    </header>
    <main class="main">
      <ul>
        <li class="main-top">
          <p>
            <span
              :style="{ color: '#000' }"
              @click.stop.self="
                handle_showPhone(order_item.id, '订单编号 已复制')
              "
              >订单编号:{{ order_item.id }}
            </span>
            <span :style="{ color: '#000' }">价格:{{ order_item.cny }}</span>
            <span>数量:{{ Number(order_item.num).toFixed(2) }}</span>
            <span>手续费:{{ order_item.amount2 }} USDT</span>
          </p>
          <p>
            <span> </span>
            <span></span>
            <span class="total_price">{{ order_item.amount1 }} CNY</span>
            <span>总金额</span>
          </p>
        </li>

        <li class="showFullInfo" v-if="!isShowFullInfo">
          <span></span>
          <span class="showFullInfo-btn" @click.stop="showFullInfo">
            展示完整信息
            <van-icon name="arrow-down" />
          </span>
        </li>

        <li v-if="isShowFullInfo">
          <span>商家姓名</span>
          <span>{{ order_item.mes }}</span>
        </li>
        <li v-if="isShowFullInfo" class="lx-fs">
          <span>联系方式</span>
          <span class="lx-tel">
            <b v-if="!isShowPhone" class="mask">{{ order_item.wechat }}</b>
            <a v-else :href="'tel:' + order_item.wechat">{{
              order_item.wechat
            }}</a>
            <van-icon
              @click.stop.self="
                handle_showPhone(order_item.wechat, '电话号码 复制成功')
              "
              name="eye-o"
              class="eye-o"
            />
          </span>
        </li>
      </ul>
    </main>
    <footer class="footer">
      <p>
        <span>{{ order_item.sname }}</span
        >&nbsp;
        <img class="info-rz" src="@/assets/currency-icons/rz.png" alt="" />
      </p>
      <p>
        {{ order_item.eotc | transformTime_MDMS }}
      </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "order-info",
  props: {
    order_item: {
      require: true,
      type: [Object],
    },
  },
  data() {
    return {
      order_countdown: 30 * 60 * 1000,
      isShowFullInfo: false,
      isShowPhone: false,
    };
  },
  
  created() {
    // //console.log(this.order_item);
  },
  methods: {
    order_type(id) {
      return /^[^0][8,9][\d]{8}$/g.test(id);
    },
    isShow(id){
        if(this.order_type(id)){
            return +this.order_item.dsx>2 ? true :false
        }else{
          return true
        }
    },
    Contact_buyer(cur_order){
      const MerchanInfo ={
        sname:cur_order.sname,
        amount1:cur_order.amount1,
        wechat:cur_order.wechat,
        mail:cur_order.smes,
        odid:cur_order.id
      }
       this.$router.push({
          name:"Payment-waterbill",
          params:{
            item:{
              ...cur_order,
              mail:cur_order.smes,
            },
            MerchanInfo,
          },
          query:{
            role:'buyer'
          }
        })
    },
    Contact_seller(){
       const $order = this.order_item
        this.$router.push({
          name:"water-bill",
          params:{
            odid:$order.id,
            money:$order.amount1,
            time:0,
            item:{
              mes:'',
              sname:$order.sname,
              dsx:$order.dsx
            },
            num:$order.num,
            MerchanInfo:{
              wechat:$order.wechat,
              aipay:$order.smes,
            }
          },
          query:{
            role:'buyer'
          }
        })
    },
    showFullInfo() {
      this.isShowFullInfo = true;
    },
    handle_showPhone(message, tips) {
      if (tips.includes("电话号码")) {
        this.isShowPhone = !this.isShowPhone;
      }
      this.$toast.clear();
      this.$copyText(message).then(
        (e) => {
          this.$toast.success(tips, {
            position: "bottom-right",
          });
        },
        (e) => {
          this.$toast.error("复制失败，请稍后重试");
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.order-container {
  font-size: 0.4rem;
  background-color: #eee;
  display: flex;
  margin: 25px;
  position: relative;
  border-radius: 15px;
  padding: 0 25px 0 0;
  flex-direction: column;
  .header {
    display: flex;
    align-items: center;
    line-height: 40px;
    justify-content: space-between;
    span {
      line-height: 40px;
    }
    .header-top-left {
      display: flex;
      align-items: center;
      .header-top-left-test {
        color: rgb(12, 177, 121);
        font-weight: 700;
      }
    }
    .header-top {
      font-size: 0.31rem;
      display: flex;
      align-items: center;
      color: rgb(243, 151, 85);
      .pending_coin {
        font-size: 0.4rem;
        color: crimson;
        font-weight: 700;
      }
      div {
        color: rgb(243, 151, 85);
      }
      .header-topRight {
        display: flex;
        align-items: center;
        color: rgb(238, 15, 15);
        font-size: 0.38rem;
        font-weight: 700;
      }
    }
  }
  .main {
    .eye-o {
      font-size: 0.5rem;
      margin-left: 3px;
    }
    li {
      font-size: 0.32rem;
      display: flex;
      justify-content: space-between;
      span {
        height: 40px;
        line-height: 40px;
      }
      span:first-child {
        color: var(--main-test-color);
      }
      .total_price {
        color: var(--main--color) !important;
        font-weight: 700;
        font-size: 0.5rem;
      }
      .price {
        color: rgb(245, 40, 40);
      }

      .showFullInfo-btn {
        z-index: 2;
        border: 3px solid #000;
        padding: 10px;
        font-size: 0.3rem;
        font-weight: 700;
        border-radius: 45px;
        color: #000;
      }
    }
    .main-top {
      p {
        display: flex;
        margin: 0;
        flex-direction: column;
      }
      p:last-child {
        span:nth-child(n + 3) {
          border-left: 2px solid #999;
          padding-left: 25px;
        }
      }
      span {
        padding: 8px 0;
      }
    }
    .showFullInfo {
      margin: 25px 0 !important;
    }
  }
  .lx-fs {
    position: relative;
    .lx-tel {
      position: absolute;
      z-index: 2;
      right: 0;
    }
  }
  .footer {
    display: flex;
    padding: 0 25px;
    align-items: center;
    justify-content: space-between;
    p {
      height: 40px;
      align-items: center;
      display: flex;
    }
    .info-rz {
      width: 40px;
      height: 40px;
    }
    p:last-child {
      color: var(--main-test-color);
    }
  }
  p {
    margin: 1em !important;
  }
}
</style>

<style >
/* 滤镜背景 */
.app-bg {
  z-index: 0;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  -ms-opacity: 0.5;
  -webkit-opacity: 0.5;
  -o-opacity: 0.5;
  opacity: 0.6;
  position: absolute;
  width: 200px;
  height: 200px;
  right: 20px;
  bottom: 20px;
  background: url(../../../assets/tools-svg/odbj.png);
  background-size: 100% 100%;
}
</style>