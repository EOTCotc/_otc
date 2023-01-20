<template>
  <div>
    <white :title="title"></white>
    <!-- <div class="reminder">
      特别提示:
      伪造变造打款凭证是严重违法行为，如提交相关查询密码请注意保证个人资产安全
    </div> -->
    <!-- 申请再仲裁 -->
    <div class="content">
      <div class="event">
        <p class="event_title">{{ $route.query.id ? '仲裁' : '申诉' }}事件</p>
        <div>
          <template v-if='!$route.query.id'>
            <p :class="{'action': form.data.arbitrateInType === 0}" @click="handleTabClick(0)">账户被冻结</p>
            <p :class="{'action': form.data.arbitrateInType === 1}" @click="handleTabClick(1)">卖家未确认收款</p>
          </template>
          <p v-else :class="{'action': form.data.arbitrateInType === 3}" @click="handleTabClick(3)">仲裁异议</p>
          <p :class="{'action': form.data.arbitrateInType === 2}" @click="handleTabClick(2)">其他</p>
        </div>
      </div>
      <div class="text">
        <p>文字信息举证</p>
        <van-field
          v-model="form.data.memo"
          rows="2"
          :autosize="{ maxHeight: 150, minHeight: 150 }"
          type="textarea"
          maxlength="300"
          placeholder="描述具体情况及提供可核实情况所需信息"
          show-word-limit
        />
      </div>
      <div class="upimg">
        <p>图片信息举证 <span>(具有法律效力的相关举证)</span></p>
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="9"
          :after-read="afterRead"
        />
      </div>
      <div class="add">
        <div class="addFlex">
          <p>增加仲裁员 <span>(默认11人)</span></p>
          <van-switch v-model="checked" />
        </div>
        <div v-show="checked" class="people" @click="showPicker = true">
          <p>{{ form.data.num }}</p>
          <p>人</p>
        </div>
        <van-popup
          v-model="showPicker"
          round
          position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
      <div class="pay">
        <div>
          <p>需支付</p>
          <p>{{ money }} EOTC</p>
        </div>
        <p class="explain">{{ explain }}</p>
      </div>
      <div class="footer">
        <van-button
          round
          block
          color="#1B2945"
          :disabled="!form.data.memo || !fileList.length"
          @click="show = true"
          >提交</van-button
        >
      </div>
      <van-popup
        v-model="show"
        position="bottom"
        round
        @closed="readChecked = false"
      >
        <div class="pop">
          <p class="popTitle">确认提交并支付</p>
          <p class="hint">
            每人仅可提交一次延期申请，请认真填写，是否确定提交该申请延期并支付？
          </p>
          <van-checkbox v-model="readChecked" shape="square">我已确认</van-checkbox>
          <div class="buttons">
            <van-button
              color="#1B2945"
              round
              block
              :disabled="!readChecked"
              @click="handleSubmit"
              >确定提交并支付</van-button>
            <p @click="readChecked = false">我再想想</p>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import {submit, upload} from "@/api/appeal"
import {
  $toast,
  $loading,
  $notify
} from '@/utils/utils'
import {getTrxBalance, SendUSDT} from "@/utils/web3"

export default {
  name: 'appeal',
  //申请再仲裁
  components: { white },
  data() {
    return {
      title: "发起申诉",
      //图片上传
      fileList: [],
      //增加开关
      checked: false,
      //增加人数弹出层
      showPicker: false,
      // 是否确认开关
      readChecked: false,
      columns: [],
      show: false,
      explain: "",
      form: {
        data: {
          defendant: "",
          plaintiff: "",
          orderId: "",
          num: 11,
          memo: "",
          images: [],
          arbitrateInType: ""
        }
      }
    };
  },
  created() {
    this.init()
    // this.stat = 1;
    // if (this.stat == 1) {
    //   this.explain =
    //     "说明: 申请再仲裁需支付500 EOTC，仲裁员默认11人，追加仲裁员一名需支付10 EOTC";
    //   this.title = "申请再仲裁";
    //   for (let i = 13; i <= 101; i += 2) {
    //     this.columns.push(i);
    //   }
    // } else {
    //   this.explain =
    //     "说明: 发起仲裁后平台将委派11位仲裁员进行判决，需要支付100 EOTC，如取消仲裁或最终仲裁胜诉EOTC将返还至您的账户";
    //   this.title = "发起仲裁";
    // }
  },
  computed: {
    money() {
      return 500 + (this.form.data.num - 11) * 10;
    },
  },

  methods: {
    init() {
      const { id, defendant, plaintiff, orderId } = this.$route.query
      this.form.data.plaintiff = plaintiff
      this.form.data.defendant = defendant
      this.form.data.orderId = orderId
      this.columns = []
      for (let i = 11; i < 103; i++) {
        if (i % 2 === 1) {
          this.columns.push(i)
        }
      }
      if (id) {
        this.title = '申请再仲裁'
        this.form.data.arbitrateInfoId = id
        this.form.data.arbitrateInType = 3
      }
    },
    handleTabClick(data) {
      this.form.data.arbitrateInType = data
    },
    afterRead(file) {
      file.length ? file.forEach((item, index) => this.uploadImg(item, index)) : this.uploadImg(file, this.form.data.images.length)
    },
    // 上传图片
    uploadImg(file, index) {
      const formData = new FormData()
      formData.append('file', file.file)
      file.status = 'uploading'
      file.message = '上传中…'
      upload(formData).then(res => {
        file.status = 'success'
        file.message = '上传成功'
        this.$set(this.form.data.images, index, res.message)
      }).catch(() => {
        file.status = 'fail'
        file.message = '上传失败'
        $notify('fail', `第${index}张图片上传失败，请重新上传`)
        this.fileList.splice(index, 1)
      })
    },
    onConfirm(value) {
      this.form.data.num = value;
      this.showPicker = false;
    },
    // 提交申诉信息
    handleSubmit() {
      const loading = $loading('提交中…')
      submit({ ...this.form.data, images: this.form.data.images.join(',') }).then(res => {
        $toast('success', '提交成功', () => this.$router.replace({name: 'arbitration'}))
      }).catch(err => {
        $toast('fail', err.message)
      }).finally(() => {
        loading.clear()
      })
    }
  },
};
</script>

<style lang="less" scoped>
.reminder {
  padding: 24px;
  color: #fc7542;
  background: #fffbe8;
  font-size: 28px;
}
.content {
  padding: 32px 32px 60px;
  font-size: 28px;
  .event {
    margin-bottom: 40px;
    .event_title {
      font-size: 32px;
      margin-bottom: 30px;
    }
    div {
      display: flex;
      flex-wrap: wrap;
      .action {
        background: #fff;
        border: 2px solid #237ff8;
        color: #237ff8;
      }
      p {
        // width: 140px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #f3f4f5;
        padding: 0 20px;
        border: 2px solid #f3f4f5;
        border-radius: 8px;
        margin: 0 24px 20px 0;
      }
    }
  }
  .text {
    margin-bottom: 40px;
    p {
      font-size: 32px;
      //   font-weight: bold;
      margin-bottom: 20px;
    }
    /deep/.van-cell {
      border: 1px solid #c8cfde;
      border-radius: 20px;
    }
  }
  .upimg {
    margin-bottom: 40px;
    p:first-child {
      font-size: 32px;
      margin-bottom: 20px;
      span {
        font-size: 28px;
        color: #999;
      }
    }
  }
  .add {
    margin-bottom: 80px;
    .addFlex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 32px;
        span {
          font-size: 28px;
          color: #999;
        }
      }
    }
    .people {
      display: flex;
      justify-content: space-between;
      padding: 28px 32px;
      margin-top: 40px;
      border-radius: 8px;
      border: 0.5px solid #c8cfde;
    }
  }
  .pay {
    div {
      display: flex;
      justify-content: space-between;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 45px;
      p:last-child {
        color: #fc7542;
      }
    }
    .explain {
      color: #999;
    }
  }
  .footer {
    margin-top: 80px;
  }
  .pop {
    padding: 32px 32px 40px;
    .popTitle {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 30px;
      color: #1b2945;
    }
    .hint {
      color: #f37a4c;
      margin-bottom: 40px;
    }
    .buttons {
      margin-top: 40px;
      button {
        margin-bottom: 40px;
      }
      p {
        text-align: center;
        color: #666;
      }
    }
  }
}
</style>
