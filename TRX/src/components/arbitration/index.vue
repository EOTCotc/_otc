<template>
  <div class="content">
    <van-tabs
      v-model="active"
      @click="tabHandler"
      color="#237DF4"
      background="#1B2945"
      title-active-color="#fff"
      title-inactive-color="#8D94A2"
    >
      <van-tab title="仲裁员公示" :replace="true" class="">
        <div class="staff">
          <div class="staff_list" v-for="item in list" :key="item.number">
            <div class="staff_flex tiele">
              <p>{{ item.name }}</p>
              <p>{{ item.number }}</p>
            </div>
            <div class="staff_flex next">
              <p>申请时间</p>
              <p>{{ transformDate(item.createDate) }}</p>
            </div>
            <div class="staff_flex next">
              <p>仲裁次数</p>
              <p>{{item.arbitrateNum}}</p>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="仲裁公示">
        <div class="case">
          <div
            class="caselist"
            v-for="item in casedata"
            :key="item.arbitrateInfoId"
            @click="details(item)"
          >
            <both :info='item'></both>
            <div class="case_text">
              <p class="title">仲裁结果</p>
              <div class="text_flex">
                <p class="van-multi-ellipsis--l2">
                  本次参与仲裁判决的仲裁员共计{{ item.total }}人，通过双方提交举证，{{ item.plaintiffNum }}位仲裁员判定原告方胜。
                </p>
                <div><van-icon name="orders-o"  size="0.5rem" />详情</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="我的仲裁案">
        <my></my>
      </van-tab>
    </van-tabs>
    <div class="message" @click='$router.push({name: "arbitrationMsg"})'>
      <van-icon name="envelop-o"  />
      信息
    </div>
    <!-- 即将超时 -->
    <van-dialog
      v-model="overtimeShow"
      theme="round-button"
      confirm-button-text="前往处理"
      confirm-button-color="#237FF8"
      close-on-click-overlay
      @confirm="active=2"
    >
      <img class="popImg" src="@/static/image/overtime.png" alt="" />
      <div class="popText">有 1 件裁案即将超时</div>
    </van-dialog>
    <van-popup v-model="anewShow" class="popup">
      <img class="envelope" src="@/static/image/envelope.png" alt="" />
      <div class="anewBox">
        <p v-if="state==0">收到一条发起重新举证</p>
        <p v-else>收到一条仲裁延期申请</p>
        <div class="button">
          <van-button type="info" round plain @click="anewShow=false">稍后处理</van-button>
          <van-button type="info" round @click="go(state)">前往处理</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import both from "@/components/arbitration/module/both.vue";
import my from "@/components/arbitration/my.vue";
import {
  publicityCaseList,
  publicityPersonList
} from '@/api/arbitration'
import {$toast, transformDate} from '@/utils/utils'

export default {
  //仲裁
  components: {
    both,
    my,
  },
  data() {
    return {
      active: Number(localStorage.getItem("activeIdx")) || 0,
      loading: false,
      finished: false,
      // 仲裁员公示
      list: [],
      // 仲裁案公示
      casedata: [],
      //待处理提示
      pendingShow: false,
      //超时提示
      overtimeShow: false,
      //信封提示
      anewShow: false,
      state:1
    };
  },
  created() {
    this.getPublicityPersonList()
    this.getPublicityCaseList()
  },
  methods: {
    transformDate,
    details(item) {
      this.$router.push({ name: "publicityDetails", query: {id: item.arbitrateInfoId} });
    },
    // 获取仲裁员公示
    getPublicityPersonList() {
      const loading = $toast('loading', '加载中…')
      publicityPersonList().then(res => {
        this.list = res.items
      }).finally(() => {
        loading.clear()
      })
    },
    // 获取仲裁员公示
    getPublicityCaseList() {
      const loading = $toast('loading', '加载中…')
      publicityCaseList().then(res => {
        this.casedata = res.items.map(item => ({...item, total: item.plaintiffNum + item.defendantNum}))
        console.log(res.items)
      }).finally(() => {
        loading.clear()
      })
    },
    // tab点击事件
    tabHandler(idx) {
      this.active = idx;
      localStorage.setItem("activeIdx", idx); // 将选中的tab缓存起来
    },
    go(index){
      if(index==0){
        this.$router.push({name:'afresh'})
      }else{
        this.$router.push({name:'postpone'})
      }
    }
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: calc(100vh - 100px);
  background: #f3f4f5;
}
.staff {
  .staff_list {
    background: #fff;
    margin: 24px;
    border-radius: 20px;
    padding: 30px;
    font-size: 28px;
    .staff_flex {
      display: flex;
      justify-content: space-between;
    }
    .tiele {
      margin-bottom: 33px;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
      }
    }
    .next:nth-child(2) {
      margin-bottom: 20px;
    }
    .next {
      p:first-child {
        color: #999;
      }
    }
  }
}
.case {
  .caselist {
    background: #fff;
    margin: 24px;
    border-radius: 20px;
    padding: 30px;
    font-size: 28px;
    .case_text {
      margin-top: 32px;
      .title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .text_flex {
        display: flex;
        justify-content: space-between;
        div {
          width: 40%;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          padding-left: 24px;
        }
      }
    }
  }
}
.message {
  position: fixed;
  color: #237ff8;
  background: #fff;
  box-shadow: 0px 3px 6px 1px rgba(35, 96, 159, 0.1);
  font-size: 28px;
  padding: 20px 32px;
  border-radius: 35px;
  right: 0;
  bottom: 50px;
}

.popImg {
  width: 152px;
  position: absolute;
  top: -60px;
  left: 240px;
}
.popText {
  text-align: center;
  padding: 120px 0 40px;
}
/deep/.van-dialog {
  overflow: visible;
}
/deep/.van-dialog__footer {
  border-radius: 20px;
}
.popup {
  background: transparent;
  // background-image: url('@/static/image/envelope.png');
  .envelope {
    width: 600px;
    position: relative;
  }
  .anewBox {
    width: 100%;
    font-size: 32px;
    position: absolute;
    top: 0;
    p {
      text-align: center;
      font-weight: bold;
      color: #ffffff;
      padding: 66px 0 108px;
    }
    .button{
      display: flex;
      justify-content: space-around;
      button{
        width: 40%;
      }
    }
  }
}
</style>
