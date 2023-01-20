<template>
  <div class='container'>
    <white :title='title' />
    <div class='top-line'></div>
    <!-- 内容 -->
    <div class='content'>
      <div class='title'>
        <span>仲裁案</span>
        <span v-show='false'>-100EOTC</span>
      </div>
      <div class='user-box'>
        <div class='user-top'>
          <!-- 原告 -->
          <div class='user-left'>
            <div class='left-tag-box'>
              <img
                class='victory-via'
                src='@/assets/imgs/huangguan.png'
                v-show='closureObj.status == 2'
              />
              <div class='left-user-tag'>原告</div>
            </div>
            <div class='left-via-name'>
              <!-- 申请延期 -->
              <span v-if='messageType == 0 && isArbitrate == 0'>
                {{ postponeObj.plaintiff }}
              </span>
              <!-- 追加举证 -->
              <span v-else-if='messageType == 1'>
                {{ addObj.plaintiff }}
              </span>
              <!-- 发起重新举证 -->
              <span v-else-if='messageType == 0 && isArbitrate == 1'>
                {{ anewObj.plaintiff }}
              </span>
              <!-- 取消仲裁 -->
              <span v-else-if='messageType == 2'>
                {{ cancelObj.plaintiff }}
              </span>
              <!-- 结案通知 -->
              <span v-else-if='messageType == 3'>
                {{ closureObj.plaintiff }}
              </span>
              <span class='seller'>(卖家)</span>
            </div>
            <div class='left-ticket' v-if='messageType == 3'>
              {{ closureObj.plaintiffNum }}票
            </div>
          </div>
          <!-- 被告 -->
          <div class='user-right'>
            <div class='right-tag-box'>
              <img
                class='victory-via'
                src='@/assets/imgs/huangguan.png'
                v-show='closureObj.status == 3'
              />
              <div class='right-user-tag'>被告</div>
            </div>
            <div class='right-via-name'>
              <span class='purchaser'>(买家)</span>
              <!-- 申请延期 -->
              <span v-if='messageType == 0 && isArbitrate == 0'>
                {{ postponeObj.defendant }}
              </span>
              <!-- 追加举证 -->
              <span v-else-if='messageType == 1'>
                {{ addObj.defendant }}
              </span>
              <!-- 发起重新举证 -->
              <span v-else-if='messageType == 0 && isArbitrate == 1'>
                {{ anewObj.defendant }}
              </span>
              <!-- 取消仲裁 -->
              <span v-else-if='messageType == 2'>
                {{ cancelObj.defendant }}
              </span>
              <!-- 结案通知 -->
              <span v-else-if='messageType == 3'>
                {{ closureObj.defendant }}
              </span>
            </div>
            <div class='right-ticket' v-if='messageType == 3'>
              {{ closureObj.defendantNum }}票
            </div>
          </div>
        </div>
        <!-- 其他消息 -->
        <div v-if='messageType != 3'>
          <div class='user-content'>
            <span v-if='arbitrateInType == 0'>账户被冻结</span>
            <span v-else-if='arbitrateInType == 1'> 卖家未确认收款 </span>
            <span v-else-if='arbitrateInType == 2'>其他</span>
          </div>
          <div class='user-detail' @click='$router.push({name: messageType == 2 ? "finishDetails" : "details", query: {id: arbitrateInfoId}})'>
            <span>
              <van-icon name='orders-o' />
              仲裁详情
            </span>
            <van-icon name='arrow' size='14' color='#999' />
          </div>
        </div>
        <!-- 结案通知 -->
        <div class='final-notice' v-if='messageType == 3'>
          <div class='process_wrap'>
            <van-progress
              stroke-width='12'
              :percentage='plaintiffNum / headcount * 100 || 0'
              :show-pivot='false'
              color='#4EA0F5'
              track-color='#EC6F66'
            />
          </div>
          <div class='notice-title'>仲裁结果</div>
          <div class='notice-bot'>
            <p>
              本次参与仲裁事件的仲裁员共计{{
                headcount
              }}人，通过双方提交举证，{{
                closureObj.defendantNum
              }}位仲裁员判定被告dsads
            </p>
            <div class='notice-bot-r' @click='$router.push({name: "finishDetails", query: {id: arbitrateInfoId}})'>
              <van-icon name='orders-o' />
              <span>详情</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 延期内容 -->
      <div class='postpone' v-if='messageType == 0 && isArbitrate == 0'>
        <div class='postpone-every'>
          <div>申请人</div>
          <p>原告:{{ postponeObj.plaintiff }}</p>
        </div>
        <div class='postpone-every'>
          <div>申请原因</div>
          <p>{{ postponeObj.reason }}</p>
        </div>
        <div class='postpone-every'>
          <div>申请延期说明</div>
          <p>{{ postponeObj.explain }}</p>
        </div>
        <div class='postpone-every'>
          <div>申请延期时间</div>
          <p>{{ postponeObj.days }}天</p>
        </div>
      </div>
      <!-- 取消原因 -->
      <div class='cancel' v-if='messageType == 2'>
        <div>取消原因</div>
        <p>{{ cancelObj.reason }}</p>
      </div>
      <!-- 追加举证 -->
      <div class='add-to' v-if='messageType == 1'>
        <div
          class='add-to-plaintiff'
          v-show='addObj.adduceUserId == addObj.plaintiffId'
        >
          原告举证
        </div>
        <div
          class='add-to-appellee'
          v-show='addObj.adduceUserId == addObj.defendantId'
        >
          被告举证
        </div>
        <div class='add-to-content'>
          <div>追加举证</div>
          <img
            v-for='(item, index) in addObj.images'
            :key='index'
            :src='spliceSrc(item)'
          />
          <p>{{ addObj.memo }}</p>
        </div>
      </div>
      <!-- 发起重新举证 -->
      <div class='postpone' v-if='messageType == 0 && isArbitrate == 1'>
        <div class='postpone-every'>
          <div>发起人</div>
          <p>{{ anewObj.name }} 编号: {{ anewObj.number }}</p>
        </div>
        <div class='postpone-every'>
          <div>申请原因</div>
          <p>{{ anewObj.reason }}</p>
        </div>
        <div class='postpone-every'>
          <div>申请延期说明</div>
          <p>{{ anewObj.explain }}</p>
        </div>
      </div>
      <!-- 结案通知 -->
      <div class='close' v-if='messageType == 3'>
        <div>说明</div>
        <p>
          该仲裁案已结案，如有异议可在结案后七日内进入详情申请再仲裁，注意逾期将无法队此案进行再仲裁
        </p>
        <div class='btn'>
          <van-button
            v-if='show'
            block
            round
            color='#1b2945'
            :to='{name: "appeal", query: { id: arbitrateInfoId } }'
          >
            申请再次仲裁
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import White from '@/components/Nav/white.vue';
import {
  getarbitratedelay,
  getadducelist,
  getcancelarbitrate,
  getclosure,
  setmessageisopen
} from '@/api/arbitrationMsg';
import {spliceSrc} from '@/utils/utils'

export default {
  name: 'arbitrationMsg',
  data() {
    return {
      title: '',
      show: false, // 是否显示在仲裁
      messageType: 0, //消息类型0 申请延期 1 追加举证 2 仲裁取消 3 结案通知
      isArbitrate: 0, //是否为仲裁员0是，1是
      paramsRoute: {}, //路由传的值
      // 有多种情况，所以需要单独拎出来
      arbitrateInType: '', //其他消息
      // 有多种情况，所以需要单独拎出来
      arbitrateInfoId: '', //去往仲裁详情页传的值，arbitrateInfoId
      // 请求到的数据
      postponeObj: {}, //延期申请数据
      addObj: {}, //追加举证数据
      cancelObj: {}, //取消仲裁数据
      anewObj: {}, //发起重新举证
      closureObj: {}, //结案通知
      headcount: 0, //仲裁员总人数
      plaintiffNum: 0, // 投原告人数的票数
      defendantNum: 0, // 被告票数
      isBtn: true //结案通知的申请再次仲裁是否禁用
    };
  },
  components: {
    White
  },
  mounted() {
    this.isArbitrate = this.$route.query.arbitrateId;
    this.messageType = this.$route.query.messageType;
    this.paramsRoute = this.$route.query;
    this.setmessageisopen(this.$route.query.arbitrateMessageId)
    if (this.messageType == 0 && this.isArbitrate == 0) {
      this.title = '申请延期'
      this.getarbitratedelay(); // 获取申请延期消息
    } else if (this.messageType == 1) {
      this.title = '追加举证'
      this.getadducelist(); // 追加举证
    } else if (this.messageType == 0 && this.isArbitrate == 1) {
      this.title = '发起重新举证'
      this.anewPostpone(); // 发起重新举证
    } else if (this.messageType == 2) {
      this.title = '取消仲裁'
      this.getcancelarbitrate(); // 取消仲裁
    } else if (this.messageType == 3) {
      this.title = '结案通知'
      this.getclosure(); // 结案通知
    }
  },
  methods: {
    spliceSrc,
    // 获取申请延期消息
    getarbitratedelay() {
      getarbitratedelay({
        id: this.paramsRoute.associatedId,
        isArbitrate: this.paramsRoute.arbitrateId
      }).then((res) => {
        let data = res.items;
        console.log(data, '申请延期');
        this.postponeObj = data;
        this.arbitrateInType = data.arbitrateInType;
        this.arbitrateInfoId = data.arbitrateInfoId;
      });
    },
    // 取消仲裁
    getcancelarbitrate() {
      getcancelarbitrate({
        id: this.paramsRoute.associatedId
      }).then((res) => {
        let data = res.items;
        console.log(data, '取消仲裁');
        this.cancelObj = data;
        this.arbitrateInType = data.arbitrateInType;
        this.arbitrateInfoId = data.arbitrateInfoId;
      });
    },
    // 追加举证
    getadducelist() {
      getadducelist({
        id: this.paramsRoute.associatedId
      }).then((res) => {
        let data = res.items;
        data.images = data.images.split(',');
        console.log(data, '追加举证');
        this.addObj = data;
        this.arbitrateInType = data.arbitrateInType;
        this.arbitrateInfoId = data.arbitrateInfoId;
      });
    },
    // 发起重新举证
    anewPostpone() {
      getarbitratedelay({
        id: this.paramsRoute.associatedId,
        isArbitrate: this.paramsRoute.arbitrateId
      }).then((res) => {
        let data = res.items;
        console.log(data, '发起重新举证');
        this.anewObj = data;
        this.arbitrateInType = data.arbitrateInType;
        this.arbitrateInfoId = data.arbitrateInfoId;
      });
    },
    // 结案通知
    getclosure() {
      getclosure({
        id: this.paramsRoute.associatedId
      }).then((res) => {
        let data = res.items;
        this.closureObj = data;
        this.arbitrateInType = data.arbitrateInType;
        this.arbitrateInfoId = data.arbitrateInfoId;
        this.headcount = data.plaintiffNum + data.defendantNum;
        this.plaintiffNum = data.plaintiffNum;
        this.defendantNum = data.defendantNum;
        this.show = this.$dayjs().utc().diff(this.$dayjs.utc(data.voteDate), 'day') < 7
        // 再次申请仲裁按钮，先注释
        // let nowTimestamp = new Date().getTime();
        // let voteDateTimestamp =
        //   new Date(transformUTCDate(data.voteDate)).getTime() + 604800000;
        // this.isBtn = nowTimestamp > voteDateTimestamp ? true : false;
      });
    },
    // 设置消息为已读 小红点的显示隐藏
    setmessageisopen(associatedId) {
      console.log(associatedId)
      setmessageisopen({
        id: associatedId
      }).then(res => {
      })
    }
  }
};
</script>
<style lang='less' scoped>
.container {
  background: #fff;
  min-height: 100vh;
}

.top-line {
  height: 20px;
  background: #f3f4f5;
}

// 内容
.content {
  padding: 0 30px;
  overflow: hidden;

  .title {
    margin-top: 30px;
    font-size: 32px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;

    span:last-of-type {
      color: #fc7542;
    }
  }

  .user-box {
    margin-top: 20px;
    padding: 32px;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.1);
    border-radius: 20px;

    .user-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    // 原告
    .user-left {
      .left-tag-box {
        position: relative;
        margin-top: 16px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .victory-via {
          position: absolute;
          top: -25px;
          left: 25%;
          width: 30px;
          height: 28px;
        }

        .left-user-tag {
          width: 93px;
          height: 48px;
          text-align: center;
          line-height: 48px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          background: #4ea0f5;
          border-radius: 0px 24px 24px 24px;
        }
      }

      .left-via-name {
        margin-top: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 28px;

        .seller {
          font-size: 24px;
          color: #999;
        }
      }

      .left-ticket {
        margin-top: 12px;
        font-size: 24px;
        color: #4ea0f5;
      }
    }
    // 被告
    .user-right {
      .right-tag-box {
        position: relative;
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .victory-via {
          position: absolute;
          top: -25px;
          right: 18%;
          width: 30px;
          height: 28px;
        }

        .right-user-tag {
          width: 93px;
          height: 48px;
          text-align: center;
          line-height: 48px;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          background: #ec6f66;
          border-radius: 24px 0 24px 24px;
        }
      }

      .right-via-name {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 28px;

        .purchaser {
          font-size: 24px;
          color: #999;
        }
      }

      .right-ticket {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
        font-size: 24px;
        color: #ec6f66;
      }
    }
  }

  // 其他消息
  .user-content {
    margin-top: 30px;
    padding: 0 24px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    font-size: 28px;
    color: #333;
    background: #f3f4f5;
    border-radius: 0px 20px 20px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-detail {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;

    span {
      margin-left: 10px;
      font-size: 28px;
      color: #237ff8;
    }
  }

  // 结案通知
  .final-notice {
    margin-top: 20px;

    .process_wrap {
      margin-top: 30px;
    }

    .notice-title {
      margin-top: 32px;
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    // 详情
    .notice-bot {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      height: 92px;

      p {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-right: 24px;
        height: 92px;
        font-size: 28px;
        line-height: 46px;
      }

      .notice-bot-r {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 28px;
        font-weight: bold;

        span {
          margin-left: 8px;
          width: 56px;
        }
      }
    }
  }
}

// 延期内容和发起重新举证公用css
.postpone {
  position: relative;
  padding-bottom: 250px;

  .postpone-every {
    margin-top: 40px;
    color: #333;

    div {
      font-size: 32px;
      font-weight: bold;
    }

    p {
      margin-top: 24px;
      font-size: 28px;
    }
  }

  .postpone-btn {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      width: 328px;
      height: 96px;
      border-radius: 48px;
    }

    button:first-of-type {
      font-size: 32px;
      color: #666;
      border: 2px solid #eee;
      background: #fff;
    }

    button:last-of-type {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
      background: #1b2945;
    }
  }
}

// 取消原因
.cancel {
  color: #333;

  div {
    margin-top: 40px;
    font-size: 32px;
    font-weight: bold;
  }

  p {
    margin-top: 20px;
    font-size: 28px;
  }
}

// 追加举证
.add-to {
  margin-top: 45px;
  background: #f3f4f5;
  border-radius: 20px;

  .add-to-plaintiff {
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    background: #4ea0f5;
    border-radius: 0px 30px 30px 30px;
  }

  .add-to-appellee {
    float: right;
    width: 180px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    background: #ec6f66;
    border-radius: 30px 0 30px 30px;
  }

  .add-to-content {
    margin-top: 32px;
    padding: 30px;
    color: #333;

    div {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
    }

    img {
      display: block;
      width: 100%;
    }

    p {
      margin-top: 20px;
      font-size: 28px;
    }
  }
}

// 结案通知
.close {
  margin-top: 40px;
  color: #333;

  div {
    font-size: 32px;
  }

  p {
    margin-top: 20px;
    font-size: 28px;
    line-height: 46px;
  }

  .btn {
    position: absolute;
    bottom: 60px;
    left: 30px;
    right: 30px;
  }
}
</style>