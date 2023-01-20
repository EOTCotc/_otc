<template>
  <div class="select-container">
    <van-dropdown-menu active-color="#000">
      <!-- 收付款方式 start -->
      <van-dropdown-item :title="pay_title" ref="pay_item">
        <van-cell>
          <van-button
            class="pay-btn"
            v-for="(btn, i) in pay"
            :key="i"
            size="small"
            :class="{ 'active-btn': i == active_pay }"
            @click="select_pay(i, $event)"
          >{{ btn.text }}</van-button>
        </van-cell>
        <van-cell class="ref-btn">
          <van-button size="small" @click="reset_pay">重置</van-button>
          <van-button size="small" class="ok" @click="isok">完成</van-button>
        </van-cell>
      </van-dropdown-item>

      <!-- 收付款方式 end -->

      <!-- 交易金额 start -->

      <van-dropdown-item title="交易金额" ref="pay_size">
        <van-form @submit="onSubmit" class="ipt">
          <van-field
            v-model.number.lazy="money"
            placeholder="请输入目标金额"
            autofocus
            @focus="oninputFocus=true"
            type="digit"
            :rules="[{ required: true, message: '请填写交易金额' }]"
          />
        </van-form>
        <van-cell>
          <van-button
            class="pay-btn"
            v-for="(size, i) in pay_size"
            :key="i"
            size="small"
            :class="{ 'active-btn': i == active_moey }"
            @click="changeipt(i, $event)"
          >{{ size | ThousandSeparator }}</van-button>
        </van-cell>
        <van-cell class="ref-btn">
          <van-button size="small" @click="reset_size">重置</van-button>
          <van-button size="small" class="ok" @click="select_size">完成</van-button>
        </van-cell>
      </van-dropdown-item>

      <!-- 交易金额 end -->

      <!-- 筛选 start -->
      <!-- 筛选 内容待定 -->
      <van-dropdown-item title="更多筛选" ref="item">
        <van-cell>
          <van-button
            class="pay-btn"
            v-for="(n, i) in pay_fun"
            :key="i"
            size="small"
            @click="select_filter"
          >{{ n }}</van-button>
        </van-cell>
        <van-cell class="ref-btn">
          <van-button size="small">重置</van-button>
          <van-button size="small" class="ok">完成</van-button>
        </van-cell>
      </van-dropdown-item>
      <!-- 筛选 end -->
    </van-dropdown-menu>
  </div>
</template>

<script>
export default {
  name: 'select-Nav',
  data() {
    return {
      oninputFocus: false,
      active_pay: 0,
      active_moey: 0,
      money: '',
      pay_title: '收付款方式',
      pay_size: ['10', '100', '1000', '5000', '10000', '200000'],
      pay_fun: ['大宗交易', '我的关注', '交易过', '仅显示交易单'],
      pay: [
        { text: '全部', value: 0 },
        { text: '银行卡', value: 1 },
        { text: '支付宝', value: 2 },
        { text: '微信', value: 3 },
        { text: '现金', value: 4 },
      ],
    }
  },
  methods: {
    onIptBlur() {
      //console.log('输入框状态改变')
    },
    // 选择交易方式
    select_pay(index, e) {
      this.active_pay = index
      this.pay_title = e.target.innerText
      this.$refs['pay_item'].toggle()
      this.$emit('change-pay', this.pay[index].value)
    },
    // 表单 提交
    onSubmit(values) {
      //console.log("submit", values);
    },
    // 输入改变金额的大小
    changeipt(index, e) {
      this.oninputFocus = false
      this.active_moey = index
      this.money = +e.target.innerText.replace(/,/g, '')
      this.$emit('change-size', this.money)
      this.$refs['pay_size'].toggle()
    },
    //支付方式过滤
    select_filter(e) {
      if (e.target.innerText == '大宗交易') {
        this.$emit('change-size', 100000)
        this.$refs['item'].toggle()
      } else {
        this.filter_order()
      }
      e.target.classList.toggle('active-btn')
    },
    //重置支付交易方式
    reset_pay() {
      this.pay_title = '收付款方式'
      this.active_pay = 0
      this.$refs['pay_item'].toggle()
      this.$emit('change-pay', this.pay[this.active_pay].value)
    },
    // 用户选择完支付方式 是否点击 完成
    isok() {
      this.$emit('change-pay', this.pay[this.active_pay].value)
      this.$refs['pay_item'].toggle()
    },
    // 重置 选择金额大小
    reset_size() {
      this.money = ''
      this.active_moey = 0
      this.$emit('change-size')
      this.$refs['pay_size'].toggle()
    },
    // 选择 金额大小  用户点击完成
    select_size() {
      this.active_moey = this.money
      //console.log(this.oninputFocus,this.money)
      this.$refs['pay_size'].toggle()
      this.$emit('change-size', this.money)
    },
    filter_order() {
      this.$toast.clear()
      this.$toast.warning('功能暂未开放，请等待')
    },
  },
  filters: {
    // 千分位隔离符
    ThousandSeparator(input) {
      return (
        input &&
        input.toString().replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
      )
    },
  },
}
</script>

<style lang="less" scoped>
.select-container {
  background-color: #fff;
  padding: 10px 0;
}

.ipt {
  border: 1px solid #ebedf0;
  margin: 20px 40px 0 40px;
  .van-field {
    padding: 10px;
  }
}
/deep/ .van-dropdown-menu__bar {
  height: 68px;
}
.ok {
  background-color: #2483ff;
  color: #fff;
  border-radius: 10px;
}
.van-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .pay-btn {
    width: 30%;
    margin: 5px;
  }
}
.active-btn {
  border-color: #2d60e0;
  color: #2d60e0;
}
.ref-btn {
  width: 100%;
  button {
    width: 40%;
    margin: 0 20px;
    font-weight: 700;
  }
}
</style>