import { myPayment } from '@/api/payverification'

export default {
  data() {
    return {
      isclose_on_click_overlay: true,
      //单价
      price: '',
      //数量
      number: '',
      //最大法币
      MaxLegalTender: '',
      //最小法币
      MinLegalTender: '',
      //最大数字货币
      MaxDigitalCash: '',
      //最小数字货币
      MinDigitalCash: '',
      popshow: false,
      checked: false,
      receivingList: [],
      sellerMthods: myPayment(),
      isMoney: false, //只接受现金
      receiving_checked: false, //可接受现金
      vali_value: true,
      eror: [false, false, false, false], // 对应错误信息展示
      cash: 0, // cash -1 只接受现金    1 可接受现金
    }
  },
  created() {
    this.getCurPayList(this.sellerMthods)
  },
  methods: {
    check_change(methds) {
      this[methds] = false
    },
    //若弹出层关闭则初始化复选框
    close() {
      this.checked = false
    },
    popswitch() {
      this.cash = 0
      if (this.receiving_checked) {
        this.cash = 1
      } else if (this.isMoney) {
        this.cash = -1
      }
      this.popshow = true
    },
    onPriceInput(min, max, e, kind) {
      console.log(kind)
      this.hasInput = false
      if (kind != 'USDT' && kind != 'USDC') {
        this.price = e.target.value
        this.is_validVal()
        return
      }
      if (min <= Number(e.target.value) && Number(e.target.value) <= max) {
        this.price = e.target.value
      } else if (Number(e.target.value) <= min) {
        e.target.value = min
        this.price = min
        this.$toast.warning(`该货币价格不能低于 ${min} CNY`)
      } else if (Number(e.target.value) >= max) {
        this.price = max
        e.target.value = max
        this.$toast.warning(`该货币价格不能高于 ${max} CNY`)
      }
      this.is_validVal()
    },
    onNumInput(e) {
      // const max = localStorage.getItem("myeotc");
      const myEoct = localStorage.getItem('myeotc') * 1
      const otczy = localStorage.getItem('otczy') * 1
      const giftEotc = localStorage.getItem('giftEotc') * 1

      const max = myEoct + otczy + giftEotc
      console.log(max)
      if (Number(e.target.value) < 200) {
        e.target.value = 200
        this.number = 200
        this.$toast.warning('您的出售数量至少为200')
      }
      if (Number(e.target.value) > +max * 10) {
        e.target.value = max * 10
        this.number = e.target.value
        console.log(this.kind)
        this.$toast.warning(
          <div>
            <p style="font-size:13px;margin:5px">
              您最高收购 ${this.kind} 的数量
            </p>
            <p style="font-size:16px;margin:5px">
              不能超过质押的数量${max * 10}!
            </p>
          </div>
        )
      }
      this.is_validVal()
    },
    //限购 最小 法币值
    onMinLegalTender(e) {
      const value = e.target.value
      if (
        0 < parseFloat(value) &&
        value <= (parseFloat(this.price) * parseFloat(this.number)).toFixed(2)
      ) {
        this.MinDigitalCash = (+e.target.value / this.price).toFixed(6)
      }
      this.is_validVal()
    },
    // 限购 最小 货币值
    onMinDigitalCash(e) {
      const value = e.target.value

      if (0 <= +value && +value <= this.number) {
        this.MinLegalTender = (value * this.price).toFixed(2)
      }
      this.is_validVal()
    },
    // 限购 最高 金额
    onMaxLegalTender(e) {
      const value = parseFloat(e.target.value)
      if (
        value >= parseFloat(this.MinLegalTender) &&
        value <= (parseFloat(this.price) * parseFloat(this.number)).toFixed(2)
      ) {
        this.MaxDigitalCash = (value / this.price).toFixed(6)
      }
      this.is_validVal()
    },
    //最高收购总额
    onMaxDigitalCash(e) {
      const value = e.target.value
      if (+this.MinDigitalCash <= value && value <= +this.number) {
        this.MaxLegalTender = (value * this.price).toFixed(2)
      }
      this.is_validVal()
    },
    //获取当前收付款方式
    getCurPayList(item) {
      function hasCurrentPay(value) {
        return value.split('&')[1] || value
      }
      for (const key of Object.keys(item)) {
        switch (key) {
          case 'mybank':
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: item[key].split('&')[1],
                account: item[key].split('&')[0],
                icon: 'bank',
                checked: false,
              })
            }
            break
          case 'myalipay':
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: '支付宝',
                account: item[key].split('&')[0],
                icon: 'alipay',
                checked: false,
              })
            }
            break
          case 'mybmywechatnk':
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: '微信',
                account: item[key].split('&')[0],
                icon: 'wechat',
                checked: false,
              })
            }
            break
        }
      }
    },
    warning(index, flg) {
      this.$set(this.eror, index, flg)
      setTimeout(() => {
        this.$set(this.eror, index, !flg)
      }, 800)
    },
    is_validVal() {
      if ((this.price ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.number ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MaxLegalTender ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MinLegalTender ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MaxDigitalCash ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MinDigitalCash ?? '') === '') {
        this.vali_value = true
        return false
      }
      this.effective_range()
      return true
    },
    effective_range() {
      const MinLegalTender = parseFloat(this.MinLegalTender)
      const MinDigitalCash = parseFloat(this.MinDigitalCash)
      const MaxLegalTender = parseFloat(this.MaxLegalTender) // tender 法币
      const MaxDigitalCash = parseFloat(this.MaxDigitalCash)

      const price = parseFloat(this.price)
      const num = parseFloat(this.number)

      if (MinLegalTender <= 0 || MinLegalTender > (price * num).toFixed(2)) {
        this.vali_value = true
        this.warning(0, true)
        return false
      }

      if (MinDigitalCash <= 0 || MinDigitalCash > num) {
        this.vali_value = true
        this.warning(1, true)
        return false
      }

      if (
        MaxLegalTender < MinLegalTender ||
        MaxLegalTender > (price * num).toFixed(2)
      ) {
        this.vali_value = true
        this.warning(2, true)
        return false
      }

      if (MaxDigitalCash < MinDigitalCash || MaxDigitalCash > num) {
        this.vali_value = true
        this.warning(3, true)
        return false
      }
      this.vali_value = false
    },
  },
}
