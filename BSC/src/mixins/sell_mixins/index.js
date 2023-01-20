import { myPayment, Getsjmes } from "@/api/payverification";
import loadingToast from "@/components/loading-toast";
import { subbuysellorder } from "@/api/trxRequest";
import { GetmyUSDT_User } from "@/utils/web3";

export default {
  data: function () {
    return {
      order_countdown: 30 * 60 * 1000,
      isShowFullInfo: false,
      isShowPhone: false,
      showOrderSaleInfo: false,
      playList: [],
      item: null,
      sellerMthods: myPayment(),
      curpaymentterm: null,
      isclose_on_click_overlay: true,
      isSelect_payMethod: true,
      is_xj: 0,
      xjstr: "",
    };
  },
  methods: {
    isType(cach){
      if (cach === '1') {
        this.is_xj = 1
        this.xjstr = "可现金交易";
      }else if(cach === '-1'){
        this.is_xj = -1
        this.xjstr = "只现金交易";
      }else{
        this.is_xj = 0
        this.xjstr = "非现金交易";
      }
    },
    async showFullInfo() {
      try {
        const { data: sell_info } = await this.init_xjpayInfo();
        this.isType(sell_info.cash.trim())
        this.isShowFullInfo = true;
      } catch {
        this.$toast.error("操作过于频繁");
      }
    },
    async init_xjpayInfo() {
      try {
        return await Getsjmes(this.order_item.odid);
      } catch (err) {
        return err;
      }
    },
    // 因网络故障  已转币但 还是待转币转态，用户可以校验合约
    async Verify_Coin() {
      const $order = this.order_item;
      // //console.log('当前未完成订单',$order);
      try {
        const { data: sell_info } = await Getsjmes($order.odid);
        this.isType(sell_info.cash.trim())
        //console.log(sell_info.cash);
        await GetmyUSDT_User($order.id, $order.num, sell_info.cny.trim());
        this.item = {
          bank: sell_info.bank, //商家银行卡
          aipay: sell_info.aipay, // 商家支付宝
          wechat: sell_info.wechat, // 商家微信
        };
        this.getInit_payList();
        this.showOrderSaleInfo = true;
        this.$toast.success(
          <div>
            <p style="font-size:13px;margin:5px 0">合约校验成功，</p>
            <p style="font-size:15px;margin:5px 0">请选择收款方式!</p>
          </div>
        );
      } catch (err) {
        console.warn(err);
        this.$toast.error(
          <div>
            <p style="font-size:13px;margin:5px 0">合约校验失败，</p>
            <p style="font-size:15px;margin:5px 0">无转币到合约记录!</p>
          </div>
        );
      }
    },
    async handlePayChange(curType) {
      this.isclose_on_click_overlay = false;
      this.isSelect_payMethod = false;
      this.$toast.clear();
      if (!this.hasOwnthisPay(curType)) {
        return false;
      }
      this.curpaymentterm = curType;
      this.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );

      const $order = this.order_item;
      try {
        const oid = $order.id;
        const usdt = $order.num;
        const mail = $order.smes;
        const selectpayk = this.getMoneyInfo(this.curpaymentterm);
        const type = 1;
        const cny = $order.cny;
        const result = await subbuysellorder({
          oid,
          usdt,
          mail, //卖家邮箱
          selectpayk,
          type,
          cny,
        });
        const it = eval(result);
        if (it.State != "0") {
          // type = 0 or 1 区分 收购 和 出售
          if (type == 0) {
            localStorage.setItem("xdnum", "0");
            this.$toast.success("您的订单已完成付款，请等待卖家确认");
          } else {
            localStorage.setItem("csnum", "0");
            this.$toast.success("已转币至合约，请等待买家付款");
          }
        }
        this.$bus.$emit("update-active");
      } catch (err) {
        console.warn(err);
        this.$toast.error(err.message);
      }
      this.$toast.clear();
      this.showOrderSaleInfo = false;
      this.isclose_on_click_overlay = true;
    },
    handle_showPhone(message, tips) {
      if (tips.includes("电话号码")) {
        this.isShowPhone = true;
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
    close_model() {
      this.$toast.clear();
      if (!this.isSelect_payMethod) {
        return false;
      }
      this.$toast.warning(
        <div>
          <p style="font-size:13px;margin:5px 0">请填写收款方式</p>
        </div>
      );
    },
    order_type(id) {
      return /^[^0][8,9][\d]{8}$/g.test(id);
    },
    hasOwnthisPay(curType) {
      if (curType === "xj") return true;
      if (curType === "wx" && this.sellerMthods["mybmywechatnk"]) {
        return true;
      }
      if (curType === "zfb" && this.sellerMthods["myalipay"]) {
        return true;
      }
      if (curType === "yhk" && this.sellerMthods["mybank"]) {
        return true;
      }
      this.$toast.clear();
      this.$toast.error(
        <div>
          <p style="font-size:16px;margin:5px">您没有填写当前收款方式</p>
          <p style="font-size:16px;margin:5px">请重新选择</p>
        </div>
      );
    },
    // 我的收款方式
    getMoneyInfo(payMethos) {
      switch (payMethos) {
        case "yhk": {
          let name = localStorage.getItem("uname");
          let methds = this.sellerMthods.mybank?.split("&");
          return `${name} & ${methds[0]} &  ${methds[1]}`;
        }
        case "zfb": {
          let name = localStorage.getItem("uname");
          return `${name} & ${this.sellerMthods.myalipay} & 支付宝`;
        }
        case "wx": {
          let name = localStorage.getItem("uname");
          return `${name} & ${this.sellerMthods.mybmywechatnk} & 微信`;
        }
        case "xj": {
          let name = localStorage.getItem("uname");
          return `${name} & 现金 & 现金交易`;
        }
      }
    },
    hasCurrentPay(value) {
      return Boolean(value.split("&")[1]);
    },
    getInit_payList() {
      const Icons = [];
      const item = this.item;
      for (const key of Object.keys(item)) {
        switch (key) {
          case "bank":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("yhk");
            }
            break;
          case "aipay":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("zfb");
            }
            break;
          case "wechat":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("wx");
            }
            break;
        }
      }
      this.playList = Icons;
    },
    getpayType(value) {
      switch (value) {
        case "yhk":
          return "银行卡";
        case "zfb":
          return "支付宝";
        case "wx":
          return "微信支付";
        case 'xj':
          return '现金'
        default: {
          this.$toast.error("未知收款方式");
        }
      }
    },
  },
};
