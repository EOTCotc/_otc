import Vue from 'vue'
import VueRouter from 'vue-router'

import { toastComponent } from '@/utils/element-config'
import { Bususer } from '@/api/payverification'

import { loadweb3, userBaseMes } from '@/utils/web3'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
    name: 'init',
  },
  {
    path: '/index',
    name: 'index',
    redirect: {
      name: 'CurrencyTrading',
    },
    component: () => import('@/views/home'),
    children: [
      {
        path: 'CurrencyTrading',
        name: 'CurrencyTrading', // 货币购买页面
        redirect: {
          name: 'trading-center',
        },
        component: () => import('@/components/ChooseWay'),
        children: [
          {
            path: 'trading-center',
            name: 'trading-center', // 货币购买页面
            props: {
              method: '去购买',
            },
            component: () => import('@/components/ChooseWay/Currencytype'),
          },
        ],
      },
      {
        path: 'order-pay', //订单生成页
        name: 'order-pay',
        meta: {
          inTrading: true,
        },
        props: true,
        component: () => import('@/views/pay-fllow/pay-order'),
      },
      //中间插入测试页面
      {
        path: 'water-bill', //流水审查
        name: 'water-bill',
        meta: {
          inTrading: true,
        },
        props: true,
        component: () => import('@/views/waterBill'),
      },
      {
        path: 'seller-water-bill', //流水审查
        name: 'seller-water-bill',
        meta: {
          inTrading: true,
        },
        props: true,
        component: () => import('@/views/waterBill/seller-bill.vue'),
      },
      {
        path: 'sellerBuy-water-bill', //流水审查
        name: 'sellerBuy-water-bill',
        meta: {
          inTrading: true,
        },
        props: true,
        component: () => import('@/views/waterBill/seller_buyBill.vue'),
      },
      //中间插入测试页面
      {
        path: 'pay-success', // 已付款，成功收到 币
        name: 'pay-success',
        component: () => import('@/views/pay-fllow/pay-success'),
      },
      {
        path: 'CompleteOrderPayment', // 处理订单生成页
        name: 'CompleteOrderPayment',
        meta: {
          inTrading: true,
        },
        props: true,
        component: () => import('@/views/pay-fllow/Complete-order-payment'),
      },
      {
        path: 'awaitSellerAffirm', // 等待用户确认收款
        name: 'awaitSellerAffirm',
        props: true,
        component: () => import('@/views/pay-fllow/Await-seller-affirm'),
      },
      //中间插入测试页面
      {
        path: 'user-arbitral-decision', // 用户发起仲裁
        name: 'user-arbitral-decision',
        // component: () => import("@/views/arbitral-decision/user-arbitral-decision")
        component: () => import('@/views/delay-currency/seller-delay-currency'),
      },
      //中间插入测试页面
      {
        path: 'delay-currency', // 延迟放币
        name: 'delay-currency',
        component: () => import('@/views/delay-currency/seller-delay-currency'),
      },
      {
        path: 'release_coin', //商家释放 usdt
        name: 'release_coin',
        props: true,
        component: () => import('@/views/pay-fllow/release_coin'),
      },
      {
        path: 'outflows',
        name: 'outflows', //出售页
        redirect: {
          name: 'outflows-center',
        },
        component: () => import('@/components/ChooseWay'),
        children: [
          {
            path: 'outflows-center',
            name: 'outflows-center',
            props: {
              method: '出售',
            },
            component: () =>
              import('@/components/ChooseWay/sell-currency-type'),
          },
        ],
      },
      {
        path: 'outflows-currency', //货币出售 ---> 订单生成
        name: 'outflows-currency',
        props: true,
        component: () => import('@/views/sell-fllow/outflows-currency'),
        // component: () => import("@/views/sell-fllow/Payment-details")
        // component: () => import("@/views/sell-fllow/sell-success")
      },
      {
        path: 'Payment-waterbill', //转币到合约 --> 流水审查
        name: 'Payment-waterbill',
        props: true,
        component: () => import('@/views/sell-fllow/Payment-waterbill'),
      },
      {
        path: 'Payment-details',
        name: 'Payment-details',
        props: true,
        component: () => import('@/views/sell-fllow/Payment-details'),
      },
      {
        path: 'sell-success', // 出售成功
        name: 'sell-success',
        props: true,
        component: () => import('@/views/sell-fllow/sell-success'),
      },

      // 个人信息页面 往下
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/components/Nav/right'),
      },
      {
        path: 'orderGather-full', // 订单列表页
        name: 'orderGather-full',
        component: () => import('@/views/order-gather/order-gather-full'),
      },
      {
        path: 'merchantInfo', // 商家店铺信息 首页
        name: 'merchantInfo',
        props: true,
        component: () => import('@/views/merchant/merchant-info'),
      },
      {
        path: 'important-userList', // 用户关注列表
        name: 'important-userList',
        component: () => import('@/views/merchant/Important-userList'),
      },
      {
        path: 'Temporal-yield',
        name: 'Temporal-yield', // 设置年化收益率
        component: () => import('@/views/Tempora_yield'),
      },
      {
        path: 'TemporaryCoinRefunds',
        name: 'TemporaryCoinRefunds', // 用户临时取币
        props: true,
        component: () =>
          import('@/views/order-gather/order-undone/TemporaryCoinRefunds'),
      },
      {
        path: 'RechargeCoins',
        name: 'RechargeCoins', // 用户临时取币 转账 充值
        props: true,
        component: () => import('@/views/Recharge-Coins'),
      },
    ],
  },
  {
    path: '/login', //登录
    name: 'login',
    component: () => import('@/views/login'),
  },
  {
    path: '/right',
    name: 'right',
    component: () => import('@/views/nav-right-operation/blue-nav/index'),
    children: [
      {
        path: 'accountstate', //个人信息页面
        name: 'accountstate',
        component: () => import('@/components/Accountstate/index.vue'),
      },
      {
        path: 'identity', //身份认证
        name: 'identity',
        component: () => import('@/components/Accountstate/identity'),
      },
      {
        path: 'identity_message', //身份验证成功
        name: 'identity_message',
        component: () => import('@/components/Accountstate/identity_message'),
      },
      {
        path: 'erroridentity', //身份验证失败
        name: 'erroridentity',
        component: () => import('@/components/Accountstate/erroridentity'),
      },
      {
        path: 'audit', //审核
        name: 'audit',
        component: () => import('@/components/audit/index.vue'),
      },
      {
        path: 'order-Ticket', //委托单
        name: 'order-Ticket',
        props: true,
        component: () => import('@/components/order-Ticket/index.vue'),
      },
      {
        path: 'earnings', //分享收益
        name: 'earnings',
        component: () => import('@/components/earnings'),
      },

      {
        path: 'team', //团队节点
        name: 'team',
        component: () => import('@/components/team'),
      },
      {
        path: 'share', //分享链接
        name: 'share',
        component: () => import('@/components/share'),
      },

      {
        path: 'contact', //联系我们
        name: 'contact',
        component: () => import('@/components/contact'),
      },
      {
        path: 'arbitration', //仲裁
        name: 'arbitration',
        component: () => import('@/components/arbitration'),
      },

      {
        path: 'firstPhase', //一期推广
        name: 'firstPhase',
        component: () => import('@/components/firstPhase'),
      },
      {
        path: 'secondPhase', //二期推广
        name: 'secondPhase',
        component: () => import('@/components/secondPhase'),
      },

      {
        // 反馈
        path: 'feedback',
        name: 'feedback',
        component: () => import('@/components/feedback'),
      },
      {
        // 收付款方式列表
        path: '/rightItem/receiving/receivingList',
        name: 'receivingList',
        props: true,
        component: () => import('@/components/Receiving/list.vue'),
      },
      // {
      //   //添加收付款方式
      //   path: "/rightItem/addPayment",
      //   name: "addPayment",
      //   component: () => import("@/views/rightItem/addPayment"),
      // },
      {
        // 申请成为仲裁员
        path: '/rightItem/arbitrator',
        name: 'arbitrator',
        component: () => import('@/components/arbitrator/index.vue'),
      },
      {
        // 公链地址信息
        path: '/rightItem/chain',
        name: 'chain',
        component: () => import('@/components/Chain/index.vue'),
      },
    ],
  },

  {
    path: '/setmessage', //信息设置
    name: 'setmessage',
    component: () => import('@/views/nav-right-operation/set/setmessage.vue'),
  },
  {
    path: '/setpurchase', //购买设置
    name: 'setpurchase',
    component: () => import('@/views/nav-right-operation/set/setpurchase.vue'),
  },
  {
    path: '/setsell', //出售设置
    name: 'setsell',
    component: () => import('@/views/nav-right-operation/set/setsell.vue'),
  },
  {
    path: '/credit', //信用分页面
    name: 'credit',
    component: () => import('@/views/nav-right-operation/credit/credit.vue'),
  },
  {
    path: '/more', //更多节点
    name: 'more',
    component: () => import('@/components/team/more'),
  },
  {
    path: '/transfer', //转账
    name: 'transfer',
    component: () => import('@/components/team/transfer'),
  },
  // {
  //   path: "/record", //转账记录
  //   name: "record",
  //   component: () => import("@/components/team/record"),
  // },
  {
    path: '/pledgFrom', //质押表单
    name: 'pledgFrom',
    component: () => import('@/components/secondPhase/pledge/from.vue'),
  },
  {
    path: '/shfrom', //赎回表单
    name: 'shfrom',
    component: () => import('@/components/secondPhase/pledge/shfrom.vue'),
  },
  {
    path: '/publicityDetails', //公示仲裁案详情
    name: 'publicityDetails',
    component: () => import('@/components/arbitration/publicityDetails.vue'),
  },
  {
    path: '/details', //待处理仲裁案详情
    name: 'details',
    component: () => import('@/components/arbitration/details.vue'),
  },
  {
    path: '/anew', //发起重新举证
    name: 'anew',
    component: () => import('@/components/arbitration/anew.vue'),
  },
  {
    path: '/afresh', //重新举证通知页面
    name: 'afresh',
    component: () => import('@/components/arbitration/apply/afresh.vue'),
  },
  {
    path: '/cancel', //取消仲裁
    name: 'cancel',
    component: () => import('@/components/arbitration/apply/cancel.vue'),
  },
  {
    path: '/over', //结案通知
    name: 'over',
    component: () => import('@/components/arbitration/apply/over.vue'),
  },
  {
    path: '/postpone', //申请延期，仲裁员身份
    name: 'postpone',
    component: () => import('@/components/arbitration/apply/postpone.vue'),
  },
  {
    path: '/adjourn', //申请延期，原告、被告身份
    name: 'adjourn',
    component: () => import('@/components/arbitration/adjourn.vue'),
  },

  {
    path: '/forArbitrationDetails', //待仲裁案件详情
    name: 'forArbitrationDetails',
    component: () =>
      import('@/components/arbitration/forArbitrationDetails.vue'),
  },

  {
    path: '/additionalProof', //追加举证
    name: 'additionalProof',
    component: () => import('@/components/arbitration/additionalProof.vue'),
  },
  {
    path: '/finishDetails', //已结案详情
    name: 'finishDetails',
    component: () => import('@/components/arbitration/finishDetails.vue'),
  },

  {
    path: '/againArbitration', //申请再仲裁
    name: 'againArbitration',
    component: () => import('@/components/arbitration/againArbitration.vue'),
  },

  {
    path: '/release', //EOTC释放
    name: 'release',
    component: () => import('@/views/release'),
  },
  {
    path: '/look', //查看明细
    name: 'look',
    component: () => import('@/components/firstPhase/look.vue'),
  },
  {
    // 公链地址信息详情
    path: '/rightItem/chain/details',
    name: 'chainDetails',
    component: () => import('@/components/Chain/details'),
  },

  {
    // 非当前公链地址信息详情
    path: '/rightItem/chain/other',
    name: 'chainOther',
    component: () => import('@/components/Chain/other'),
  },
  {
    // 收付款方式
    path: '/rightItem/receiving/receiving',
    name: 'receiving',
    component: () => import('@/components/Receiving'),
  },
  {
    // 申请成为仲裁员
    path: '/rightItem/arbitrator/arbitratorStudy',
    name: 'arbitratorStudy',
    component: () => import('@/views/rightItem/arbitrator/study'),
  },
  {
    // 答题页面
    path: '/rightItem/arbitrator/exam',
    name: 'exam',
    component: () => import('@/views/rightItem/arbitrator/exam'),
  },

  {
    // 流动性挖矿
    path: '/secondPhase/mining',
    name: 'mining',
    component: () => import('@/components/secondPhase/mining'),
  },
  {
    // 申诉
    path: '/appeal',
    name: 'appeal',
    component: () => import('@/views/appeal'),
  },
  {
    // NFT收益
    path: '/secondPhase/NFT',
    name: 'NFT',
    component: () => import('@/components/secondPhase/NFT'),
  },
  {
    // 链上理财转币
    path: '/secondPhase/zyzb',
    name: 'zyzb',
    component: () => import('@/components/secondPhase/zyzb'),
  },
  {
    path: '/secondPhase/pledge', //交易质押
    name: 'pledge',
    component: () => import('@/components/secondPhase/pledge'),
  },
  {
    path: '/secondPhase/record', //质押记录
    name: 'PledgeRecord',
    component: () => import('@/components/secondPhase/pledge/record'),
  },

  {
    path: '/recharge', //充值
    name: 'recharge',
    component: () => import('@/components/secondPhase/recharge'),
  },

  {
    path: '/rechargeRecord', //充值记录
    name: 'rechargeRecord',
    component: () => import('@/components/secondPhase/rechargeRecord'),
  },

  {
    path: '/Withdraw', //提现
    name: 'Withdraw',
    component: () => import('@/components/secondPhase/Withdraw'),
  },
  {
    path: '/WithdrawRecord', //提现记录
    name: 'WithdrawRecord',
    component: () => import('@/components/secondPhase/WithdrawRecord'),
  },
  {
    path: '/transaction', //交易数据
    name: 'transaction',
    component: () => import('@/components/transaction'),
  },
  {
    path: '/404',
    name: 'error',
    component: () => import('@/components/NotFound'),
  },
  {
    path: '*',
    redirect: '/404',
  },
]

const payWhitelist = [
  'order-pay',
  'CompleteOrderPayment',
  'awaitSellerAffirm',
  'outflows-currency',
  'Payment-details',
]
// "pledge"
// ,"secondPhase"
// 'zyzb'
// 'transaction',

const rightMenu_Whitelist = [
  'arbitration',
  'arbitrator',
  'Withdraw',
  'NFT',
  'important-userList',
]

const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => {})
}

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => {})
}

const router = new VueRouter({
  routes,
})

router.beforeEach((to, form, next) => {
  window.document.title = 'EOTC全球首个去中心化OTC交易所'

  if (to.name === 'setmessage' || to.name === 'receiving') {
    //判断有没有实名认证
    const iskyc = localStorage.getItem('iskyc')
    switch (iskyc) {
      case '-1':
        Vue.$toast.error({
          component: toastComponent,
          props: {
            title: '身份认证失败',
            content: '请重新进行身份认证.',
            color: '#fff',
          },
        })
        return next({
          name: 'erroridentity',
        })

      case '1':
        Vue.$toast.warning({
          component: toastComponent,
          props: {
            title: '身份认证审核中',
            content: '身份认证通过后，才能进行信息设置',
          },
        })
        return next(new Error('身份认证审核中，请稍后'))
      case '0':
        Vue.$toast.warning({
          component: toastComponent,
          props: {
            title: '请先进行实名认证',
          },
        })

        return next({
          name: 'identity',
        })
      default:
        next()
    }
  }

  if (to.name === 'order-Ticket') {
    Vue.$toast.clear()
    if (
      localStorage.getItem('otczy') * 1 < 5000 &&
      Number(localStorage.getItem('giftNFT')) == 0
    ) {
      Vue.$toast.warning({
        component: toastComponent,
        props: {
          title: '您质押的EOTC不足',
          content: 'EOTC质押5000以上的会员才能挂单.',
          color: 'red',
        },
      })
      return next(false)
    }
    if (localStorage.getItem('myjifen') < 9) {
      Vue.$toast.warning({
        component: toastComponent,
        props: {
          title: '您的积分不足',
          content: '拥有10积分的会员才能挂单.',
          color: 'red',
        },
      })
      return next(false)
    }
    Bususer().then((res) => {
      if(res.data==null){
        return next()
      }
      localStorage.setItem('userData', JSON.stringify(res.data))
      if (JSON.parse(localStorage.getItem('userData')).num === '0') {
        Vue.$toast.warning({
          component: toastComponent,
          props: {
            title: '您已经被限制下单',
            content: '请联系管理员！.',
            color: 'red',
          },
        })
        return next(false)
      }
    })
  }

  if (payWhitelist.includes(to.name)) {
    if (form.meta.inTrading || to.query.inTrading) {
      next()
    } else {
      next({
        name: 'CurrencyTrading',
        replace: true,
      })
    }
  }

  if (rightMenu_Whitelist.includes(to.name)) {
    Vue.$toast.warning({
      component: toastComponent,
      props: {
        title: '功能暂未开放，请耐心等待',
        content: '',
        color: 'red',
      },
    })
    return next(new Error('功能暂未完成。。'))
  }

  next()
})

export default router
