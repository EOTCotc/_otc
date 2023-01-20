<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="top">
        <div :class="info.status === 0 ? 'black' : ''">
          <van-icon color='#237ff8' name="underway-o" />
          <van-count-down
            v-if="info.status === 0"
            :time="info.time"
            format="DD 天 HH 时 mm 分 "
          />
          <p class='text' v-else>等待仲裁结果</p>
        </div>
<!--        v-if="info.status === 0"-->
        <van-button
          plain
          round
          type="info"
          size="mini"
          v-if='!info.hasDelay'
          :to="{ name: 'adjourn', query: { id: $route.query.id } }"
        >
          申请延期
        </van-button>
      </div>
      <div class="time">
        <p>仲裁发起时间</p>
        <p>{{ transformDate(info.createDate) }}</p>
      </div>
      <bothplan
        v-if="info.status === 1"
        :info='info'
      ></bothplan>
      <div v-else class="both">
        <div class="bothBox">
          <p class="accuser">原告</p>
          <div>
            <van-icon name="chat-o" color="#247FF7" size="16" />
          </div>
          <div>
            <p>吴敏</p>
            <span>(卖家)</span>
          </div>
        </div>
        <div class="bothBox">
          <p class="accused">被告</p>
          <div>
            <van-icon name="chat-o" color="#247FF7" size="16" />
          </div>
          <div>
            <p>王晓雷</p>
            <span>(买家)</span>
          </div>
        </div>
      </div>
      <div class="cause">卖家发起仲裁，仲裁事件为{{ getArbitrateType(info.arbitrateInType) }}</div>
      <twosides
        :plaintiffId='info.plaintiffId'
        :defendantId='info.defendantId'
        :list="info.adduce"
      />
      <orderDetails
        :messagelist="messagelist"
        :orderlist="orderlist"
      ></orderDetails>
      <van-row :gutter='15' v-if="info.status < 2" class="footer">
        <van-col :span='info.status === 0 ? 12 : 24' v-if='info.plaintiffUId === uid'>
          <van-button
            round
            block
            plain
            @click="cancelArbitrate"
          >取消仲裁</van-button>
        </van-col>
        <van-col v-if='info.status === 0' :span='info.plaintiffUId === uid ? 12 : 24'>
          <van-button
            round
            block
            color="#1B2945"
            :to='{ name: "additionalProof", query: { id: $route.query.id } }'
          >追加举证</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import orderDetails from "@/components/arbitration/module/orderDetails.vue";
import twosides from "@/components/arbitration/module/twosides.vue";
import bothplan from "@/components/arbitration/module/both.vue";
import {
  cancel,
  detail
} from '@/api/arbitration'
import {
  $loading,
  $toast,
  getArbitrateType,
  transformDate
} from '@/utils/utils'
export default {
  //仲裁员身份的待处理详情
  //仲裁案详情
  components: {
    white,
    orderDetails,
    twosides,
    bothplan,
  },
  data() {
    return {
      title: "仲裁案详情",
      uid: '',
      orderlist: [
        {
          title: "订单号",
          number: "7777781205789",
        },
        {
          title: "交易数量",
          number: "997.00000 USDT",
        },
        {
          title: "交易单价",
          number: "6.35 CNY",
        },
        {
          title: "交易总价",
          number: "6350.00 CNY",
          show: true,
        },
        {
          title: "交易时间",
          number: "2022.05.26 15:00:21",
        },
      ],
      messagelist: [
        { title: "姓名", value: "李牧" },
        { title: "开户银行", value: "工商银行" },
        { title: "银行卡号", value: "4005633224656232" },
      ],
      info: {}
    };
  },
  methods: {
    transformDate,
    getArbitrateType,
    getDetail() {
      const loading = $loading('加载中…')
      detail(this.$route.query.id).then(res => {
        const items = res.items
        items.total = items.plaintiffNum + items.defendantNum
        items.adduce = items.adduce.map(item => ({...item, images: item.images.split(',')}))
        items.time = this.$dayjs(items.status === 0 ? items.adduceDate : items.voteDate).add('-8', 'hour').diff(this.$dayjs(), 'millisecond')
        this.info = items
      }).catch((err) => {
        $toast('fail', "加载失败！")
      }).finally(() => {
        loading.clear()
      })
    },
    // 取消仲裁
    cancelArbitrate() {
      this.$dialog.confirm({
        title: "取消仲裁",
        message: "确认取消当前仲裁案",
        callback: action => {
          if (action === 'confirm') {
            const loading = $loading('loading', '仲裁取消中…')
            cancel(this.$route.query.id).then(res => {
              $toast('success', '取消成功', () => this.$router.go(-1))
            }).finally(() => {
              loading.clear()
            })
          }
        }
      })
    }
  },
  created() {
    this.uid = localStorage.getItem('uid')
    this.getDetail()
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 32px;
  font-size: 28px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
    .black {
      color: #333;
    }
    div {
      display: flex;
      align-items: center;
      .text {
        color: #237ff8;
        font-weight: bold;
        font-size: 32px;
      }
      i {
        font-size: 42px;
        padding-right: 12px;
      }
      /deep/.van-count-down {
        color: #237ff8;
      }
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    p:first-child {
      font-weight: bold;
    }
    p:last-child {
      color: #999;
    }
  }
  .both {
    display: flex;
    justify-content: space-between;
    // margin-bottom: 30px;
    .bothBox {
      width: 40%;
      padding: 24px;
      box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.03);
      position: relative;
      .accuser {
        background: #4ea0f5;
        color: #fff;
        font-weight: bold;
        padding: 8px 24px;
        border-radius: 0 24px 24px 24px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .accused {
        background: #ec6f66;
        color: #fff;
        font-weight: bold;
        padding: 8px 24px;
        border-radius: 0 24px 24px 24px;
        position: absolute;
        top: 0;
        left: 0;
      }
      div:first-of-type {
        display: flex;
        flex-direction: row-reverse;
      }
      div:last-child {
        display: flex;
        align-items: center;
        padding-top: 24px;
        img {
          width: 60px;
        }
        p {
          margin-left: 12px;
        }
        span {
          color: #999;
        }
      }
    }
  }
  .cause {
    padding: 24px;
    background: #f3f4f5;
    border-radius: 0px 20px 20px 20px;
    margin: 30px 0;
  }

  .footer {
    margin: 60px 0 30px;
  }

  .judgment-pop {
    padding: 32px 32px 60px;
    font-size: 32px;
    p {
      margin-bottom: 30px;
    }
    p:first-child {
      font-weight: bold;
    }
    p:nth-child(2) {
      color: #f37a4c;
    }
    .asd {
      border: 1px solid #c8cfde;
      border-radius: 20px;
      margin-bottom: 30px;
    }
    .button {
      display: flex;
      justify-content: space-between;
      button {
        width: 45%;
      }
    }
  }
  .winpop {
    padding: 32px 32px 60px;
    p:first-child {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    p:nth-child(2) {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    p:nth-child(3) {
      color: #666;
      margin-bottom: 100px;
    }
    .button {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      button {
        width: 45%;
      }
    }
  }
  .judgmentbox {
    div:first-child {
      display: flex;
      // padding: 0 30px;

      justify-content: space-between;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
      }
      div {
        display: flex;
        align-items: center;
        color: #4ea0f5;
      }
    }
    .message {
      margin-top: 30px;
      padding: 24px;
      border-radius: 0px 20px 20px 20px;
      background: #f3f4f5;
    }
  }
}
</style>

