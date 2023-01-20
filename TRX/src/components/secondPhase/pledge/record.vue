<template>
  <div>
    <van-nav-bar
      :title="title"
      :border="false"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <div class="top">
        <div class="frist">
          <p>累计收益</p>
          <p>+{{allsy}}</p>
        </div>
        <div class="second">
          <div>
            <p>当前质押</p>
            <p>{{allzy}}</p>
          </div>
          <div>
            <p>待赎回</p>
            <p>{{allsh}}</p>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="empty" v-if="list.length==0">
          <img src="@/static/icon/kong.png" alt />
          <p>暂无数据</p>
        </div>
        <div class="orderList" v-for="(item,index) in list" :key="index">
          <div class="listTop">
            <p>订单编号: {{item.id}}</p>
            <div class="topFlex">
              <p>{{item.date}}</p>
              <p v-if="item.state==1">质押到期:{{item.time}}</p>
            </div>
          </div>
          <div class="listCenter">
            <div>
              <p>质押数量</p>
              <p>{{item.znum}}</p>
            </div>
            <div>
              <p v-if="item.state==3">累计收益</p>
              <p v-else>预估收益</p>
              <p>+{{item.reward}}</p>
            </div>
            <div v-if="item.state==1">
              <p>到期可赎回</p>
              <p>{{item.zong}}</p>
            </div>
          </div>
          <div
            class="listState"
            :class="item.state==1?'State2':item.state==2?'State3':'State1'"
          >{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MyStakeList } from '@/api/trxRequest'
import { Toast } from 'vant'
export default {
  data() {
    return {
      list: [],
      zq: '',
      title: '质押记录',

      //总收益
      allsy: 0,
      //总当前质押
      allzy: 0,
      //总待赎回
      allsh: 0,
    }
  },
  created() {
    Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '加载中',
    })
    
    this.StakeList()
  },
  methods: {
    
    StakeList() {
      MyStakeList({}).then((res) => {
        Toast.clear()
        let data = res.data
        for (let i of data) {

          var nowdate = Date.parse(new Date())
          var Newdate = new Date(Date.parse(i.date.replace(/-/g, '/')))
          Newdate = Newdate.setMonth(Newdate.getMonth() + Number(i.uid))
          i.uid = i.uid * 1
          if (i.uid == 6) {
            i.reward = (i.znum * 1 * 0.48 * i.uid) / 12
          } else if (i.uid == 12) {
            i.reward = (i.znum * 1 * 0.72 * i.uid) / 12
          } else if (i.uid == 24) {
            i.reward = (i.znum * 1 * i.uid) / 12
          } else if (i.uid == 36) {
            i.reward = (i.znum * 1 * 1.2 * i.uid) / 12
          }

          if (Newdate > nowdate) {
            i.state = 1
            i.text = '质押中'
            i.time = this.getMyDate(Newdate, false)
            i.zong = (i.znum * 1 + i.reward).toFixed(2)
            this.allzy = Number(this.allzy * 1 + i.znum * 1).toFixed(2)
          } else {
            i.state = 2
            i.text = '待赎回'
            console.log(this.allsh)
            this.allsh = Number(this.allsh * 1 + i.znum * 1 + i.reward).toFixed(2)
          }
        }
        this.list = data.reverse()
      })
    },
    // 参数 str 为时间戳 可以传入10位也可以传入13位
    // 参数 bool的值可传true或者false或者不传，如果需要显示秒则传true，不需要显示则传false或者不传
    getMyDate(str, bool) {
      if (str > 9999999999) {
        // 这里判断：时间戳为几位数
        var c_Date = new Date(parseInt(str))
      } else {
        var c_Date = new Date(parseInt(str) * 1000)
      }
      var c_Year = c_Date.getFullYear(),
        c_Month = c_Date.getMonth() + 1,
        c_Day = c_Date.getDate(),
        c_Hour = c_Date.getHours(),
        c_Min = c_Date.getMinutes(),
        c_Sen = c_Date.getSeconds()
      if (bool) {
        // 判断是否需要显示秒
        var c_Time =
          c_Year +
          '-' +
          this.getzf(c_Month) +
          '-' +
          this.getzf(c_Day) +
          ' ' +
          this.getzf(c_Hour) +
          ':' +
          this.getzf(c_Min) +
          ':' +
          this.getzf(c_Sen) //最后拼接时间
      } else {
        var c_Time =
          c_Year +
          '-' +
          this.getzf(c_Month) +
          '-' +
          this.getzf(c_Day) +
          ' ' +
          this.getzf(c_Hour) +
          ':' +
          this.getzf(c_Min) //最后拼接时间
      }
      return c_Time
    },
    getzf(c_num) {
      if (parseInt(c_num) < 10) {
        c_num = '0' + c_num
      }
      return c_num
    },
  },
}
</script>

<style lang='less' scoped>
/deep/.van-nav-bar {
  background-color: #0d0415;
}
/deep/.van-nav-bar__title {
  color: #fff;
  font-weight: 600;
}
/deep/.van-nav-bar .van-icon {
  color: #fff;
}
.content {
  padding: 49px 30px 88px;
  background: #161622;
  font-size: 28px;
  min-height: calc(100vh - 145px);
  .top {
    background: linear-gradient(134deg, #2a86ff 0%, #54dcff 100%);
    border-radius: 20px 20px 20px 20px;
    color: #fff;
    padding: 30px 0 40px;
    margin-bottom: 30px;
    .frist {
      text-align: center;
      p:first-child {
        opacity: 50%;
      }
      p:last-child {
        font-size: 44px;
      }
    }
    .second {
      display: flex;
      justify-content: space-around;
      text-align: center;
      margin-top: 20px;
      div {
        p:first-child {
          opacity: 50%;
        }
        p:last-child {
          font-size: 44px;
        }
      }
    }
  }
  .center {
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
    }
    .orderList {
      padding: 30px 30px 40px;
      background: #202231;
      border-radius: 20px;
      position: relative;
      margin-bottom: 30px;
      p {
        opacity: 50%;
        color: #fff;
      }
      .listTop {
        border-bottom: 1px solid #2e3346;
        margin-bottom: 40px;

        p:first-child {
          opacity: 1;
        }

        .topFlex {
          display: flex;
          justify-content: space-between;
          margin: 40px 0 20px;
        }
      }
    }
    .listCenter {
      display: flex;
      justify-content: space-around;
      div {
        width: 50%;
        text-align: center;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          font-size: 30px;
          opacity: 1;
        }
      }
      div:nth-child(2) {
        p:last-child {
          color: #fdd16a;
        }
      }
    }
    .listState {
      padding: 12px 30px;
      border-radius: 40px 0 0 40px;
      position: absolute;
      right: 0;
      top: 24px;
    }
    .State1 {
      color: #fff;
      opacity: 50%;
      background: #1a1b27;
    }
    .State2 {
      color: #d5b15f;
      // opacity: 50%;
      background: #363137;
    }
    .State3 {
      color: #237ff8;
      // opacity: 50%;
      background: #213458;
    }
  }
}
</style>