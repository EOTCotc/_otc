<template>
  <div class="order-container">
    <header class="header">
      <div class="header-top-left">
        <van-tag mark type="primary" v-if="order_type(+order_item.id)">
          <span >出售</span>
        </van-tag>
         <van-tag mark type="warning" v-else>
          <span>收购</span>
        </van-tag>
        &nbsp;&nbsp;
        <span class="header-top-left-test">USDT</span>
        &nbsp;&nbsp;
        <van-tag
           v-if="order_type(+order_item.id)"
          color="#ffe1e1"
          text-color="#ad0000"
          @click.stop="Verify_Coin"
          >校验
        </van-tag>
      </div>
      <p class="header-top">
        <span class="header-topRight">
          <!-- <i class="iconfont  icon-lianximaijia"></i> -->
          <van-icon name="guide-o" :style="{ fontSize: '20px' }" />
          已取消
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
        <li v-if="isShowFullInfo">
          <span>联系方式</span>
          <span>
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

    



    <!-- start  收款方式 提示弹窗 -->
    <van-popup
      v-model="showOrderSaleInfo"
      :close-on-popstate="true"
      get-container="body"
      position="bottom"
      class="saleInfo"
      :close-on-click-overlay="isclose_on_click_overlay"
      @close="close_model"
      :style="{ height: '350px' }"
    >
     <template>
        <div>
          <header class="header">
            <van-icon name="arrow-left" />
            <span class="header-text">选择收款方式</span>
          </header>
          <main class="main">
            <template v-if="is_xj === -1 || (is_xj === 1 && xjstr==='可现金交易')">
              <van-cell center @click="handlePayChange('xj')">
                <template #title>
                  <span class="custom-title">&nbsp;现金交易</span>
                </template>
                <template #icon>
                  <img
                    class="xj_moeny"
                    src="@/assets/currency-icons/moeny-c.png"
                    alt="xj"
                  />
                </template>
              </van-cell>
            </template>

            <template v-if="is_xj === 0 || (is_xj ===1 && xjstr==='可现金交易')">
              <van-cell
                center
                v-for="(payType, i) in playList"
                :key="i"
                @click="handlePayChange(payType)"
              >
                <template #title>
                  <span class="custom-title">{{ getpayType(payType) }}</span>
                </template>
                <template #icon>
                  <van-icon>
                    <i
                      :class="[
                        'iconfont',
                        `icon-${payType}`,
                        `pay-icon${payType}`,
                      ]"
                    ></i>
                  </van-icon>
                </template>
                <template #right-icon> </template>
              </van-cell>
            </template>

            <div class="salePay-info">
              <span class="span1"
                >*<i class="zy-info">请使用本人实名账户进行收款</i
                >,否则会导致订单失败且账号存在被冻结风险</span
              >
            </div>
          </main>
        </div>
      </template>
    </van-popup>
    <!-- end 出售 详细信息  收款方式 提示弹窗  -->
  </div>
</template>

<script>
import sell_Mixin from "@/mixins/sell_mixins";

export default {
  name: "order-info",
  props: {
    order_item: {
      require: true,
      type: [Object],
    },
  },
  mixins: [sell_Mixin],
};
</script>
<style lang="less" scoped>
.order-container {
  p {
    margin: 1em !important;
  }
  font-size: 0.4rem;
  background-color: #eee;
  display: flex;
  margin: 25px;
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
        border: 3px solid #999;
        padding: 10px;
        font-size: 0.3rem;
        font-weight: 700;
        border-radius: 45px;
        color: var(--main-test-color);
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
}

.iconfont {
  margin-right: 15px;
}

.saleInfo {
  background-color: #fff !important;
  box-sizing: border-box;
  h6 {
    margin: 0;
    font-size: 36px;
  }
  .header {
    font-size: 36px;
    color: #000;
    font-weight: 700;
    padding: 15px;
    border-bottom: 2px solid var(--main-test-color);
    .header-text {
      margin-left: 15px;
    }
  }
  .salePay-info {
    display: flex;
    margin: 45px 25px 25px;
    flex-direction: column;
    background-color: rgb(249, 249, 249);
    padding: 15px;
    border-radius: 15px;
    .span1 {
      margin: 10px;
      flex: 1;
      line-height: 40px;
    }
    .zy-info {
      color: #ee0a24;
    }
    font-size: 24px;
  }
  .sell-info {
    font-size: 26px;
    ul {
      display: flex;
      flex-direction: column;
      li {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        span:last-child {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
