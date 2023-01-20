<template>
  <van-collapse v-model="activeNames" :border="false">
    <van-collapse-item title="订单详情" name="1">
      <div class="orderFrom">
        <div class="indent" v-for="(item, index) in orderlist" :key="index">
          <p>{{ item.title }}</p>
          <p :class="item.show ? 'orange' : ''">{{ item.number }}</p>
        </div>
        <div class="message">
          <p class="title">付款信息</p>
          <div
            class="messageList"
            v-for="(item, index) in messagelist"
            :key="index"
          >
            <p>{{ item.title }}</p>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </van-collapse-item>
  </van-collapse>
</template>

<script>
export default {
  //订单详情组件
  props: {
    orderlist: {
      type: Array,
    },
    messagelist: {
      type: Array,
    },
  },
  data() {
    return {
      activeNames: [""],
    };
  },

};
</script>

<style lang="less" scoped>
/deep/.van-cell--clickable {
  font-weight: bold;
  font-size: 32px;
  padding-left: 0;
  padding-right: 0;
}
/deep/.van-cell::after {
  border: none;
}
.orderFrom {
  .indent {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .orange {
      color: #fc7542 !important;
    }
    p:last-child {
      color: #333;
    }
  }
  .message {
    .title {
      font-size: 32px;
      margin-bottom: 20px;
      color: #333;
    }
    .messageList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p:last-child {
        color: #333;
      }
    }
  }
}
</style>
