// 主网链
const regular1 = 'TQQfPrKFrq6ebXBG6HWcfmvbfafgyaU1pU'
const regular = 'TCvz9REhN7aaRkfZjU5evRQkAugyfQBFZN'
let contractAddress = 'TBpcQXdZEX8vYqf2M2CQrHsGt9KZpAEVqu'
let contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
let contractAddress_eotc = 'TWP9nhCPWPa6Wr1wSgNY228jGgZ3vzjw4u'
//测试网
// const regular = 'TCZcvTpH8F1wk9m3U9fvYcA8SsE492Ai77'
// const regular1 = 'TTbFoLwzsKopvv1xYZKpRMWi5TF1Phrfc4'
// let contractAddress = 'TH4oq291NoktCN345uxdBHd9YakAwG49H3'

// let contractAddress_usdt = 'TJ2ijtG2xfaEhrLrU81h742bPfcHL4CL1w'

// let contractAddress_usdc = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'

// let contractAddress_eotc = 'TEt19qEdJM2sPBxLB5XmJGWijT6UvFbs1K'

import PubSub from 'pubsub-js'

import Vue from 'vue'
import loadingToast from '@/components/loading-toast'

/**
 * ! Reconstruction_ 标记开头的方法进行了 promise化重构
 */

import { Toast, Dialog } from 'vant'
// api  url
import { SetCoinAds, GetHx, EotcLoginmes, VerifyOrder } from '@/api/trxRequest'

import { userrisklevel } from '@/api/arbitrationMsg'

import { clearmymes } from '@/api/payverification'

import $router from '@/router'

import md5 from 'md5'

// import Dayjs from "dayjs";
// var scdtime = new Date(Dayjs(new Date("2022-09-17 13:14"))).getTime() - Date.now();

var address = ''

var mytron_usdt = null //是合约对象，生成合约对象后，可以做很多操作，比如获取你的余额，转账等
var mytron = null

const trxMin = 30000000
const trxMes = '为使交易顺畅,请确保钱包中不少于30 TRX'

window.signMes = 'EOTC请求您签名确认,签名不消耗GAS.'

function eotcmes(message) {
  Vue.$toast.warning(message)
  console.log(message)
}

function warnmes(mes) {
  Vue.$toast.warning(mes)
  console.warn(mes)
}

function distsmes1(message) {
  Vue.$toast.warning(message)
  console.log(message)
}
export const currency = function (type) {
  switch (type) {
    case 'usdt':
      contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      break
    case 'usdc':
      contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      break
    case 'btc':
      contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      break
    case 'eth':
      contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      break
    case 'trx':
      contractAddress_usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      break
  }
}

export const UserInfo = function () {
  //注册邮箱   邮箱和uid 一一对应 是唯一的
  const email = localStorage.getItem('email')
  // 主键 6位 唯一标识 id
  const uid = localStorage.getItem('uid')
  //钱包地址
  const myaddress = localStorage.getItem('myaddress')
  //剩余EOTC
  const eotcAmount = localStorage.getItem('eotcAmount')
  //是否已实名  0 未实名  1 已提交 未审核或 审核未通过  2 实名认证审核通过
  const iskyc = localStorage.getItem('iskyc')

  // 我的剩余USDT(余额)
  const myamount = localStorage.getItem('myamount')
  const uname = localStorage.getItem('uname')
  const mybank = localStorage.getItem('mybank')
  const mywechat = localStorage.getItem('mywechat')
  const myalipay = localStorage.getItem('myalipay')

  //身份证号码
  const ucid = localStorage.getItem('ucid')
  //电话
  const uphone = localStorage.getItem('uphone')
  //推荐人 注册邀请地址  两种形式  1 用户uid  和  邀请者的uid
  const parentID = localStorage.getItem('parentID')
  //用户积分 至少10分才能 购买 or 出售
  const myjifen = localStorage.getItem('myjifen')
  //节点类型
  const item = localStorage.getItem('item')
  //团队人数
  const allMan = localStorage.getItem('allMan')
  //有效节点
  const stakeMan = localStorage.getItem('stakeMan') * 1
  //总业绩
  const usdt_teams = localStorage.getItem('usdt_teams')

  const usdt_ye = localStorage.getItem('usdt_ye') //USDT余额
  const eotc_stake = localStorage.getItem('eotc_stake') //EOTC总量
  const eotc_air = localStorage.getItem('eotc_air') //EOTC空投
  const eotc_sf = localStorage.getItem('eotc_sf') //EOTC待释放
  const Ssyj = localStorage.getItem('Ssyj') //质押收益
  const Pjj = localStorage.getItem('Pjj') //平级奖
  const Lrfc = localStorage.getItem('Lrfc') //分享奖励
  const Syfh = localStorage.getItem('Syfh') //辅助奖励
  const Tdj = localStorage.getItem('Tdj') //EOTC空投

  const ztman = localStorage.getItem('ztman') * 1 //直推人数
  const ztvip = localStorage.getItem('ztvip') //节点类型
  // const zyman = localStorage.getItem("zyman")*1; //团队有效人数

  return {
    email,
    uid,
    myaddress,
    eotcAmount,
    iskyc,
    myamount,
    uname,
    mybank,
    mywechat,
    myalipay,
    ucid,
    uphone,
    parentID,
    myjifen,
    item,
    allMan,
    stakeMan,
    usdt_teams,
    usdt_ye,
    eotc_stake,
    eotc_air,
    eotc_sf,
    Ssyj,
    Pjj,
    Lrfc,
    Syfh,
    Tdj,
    ztman,
    ztvip,
  }
}

export const userBaseMes = function () {
  // Reconstruction_usdtsend(0,"取消")
  //加载用户数据前必须检验用户是否已经消息签名
  var mysign = localStorage.getItem('mysign')
  if (mysign == null || mysign == '') {
    // console.log(signMes)
    userSign(signMes) //消息签名
    return false
  }

  var ads = localStorage.getItem('myaddress')
  if (ads == null) {
    console.warn('请重新连接钱包')
    return false
  }

  // Vue.$toast("数据开始加载", {
  //   position: "bottom-right",
  // });

  EotcLoginmes({
    wallet: ads,
  })
    .then((data) => {
      var it = eval(data.data)
      console.log('用户Uid', it)
      if (it.Uid != '0') {
        localStorage.setItem('uid', it.Uid) // 主键 6位 唯一标识 id
        localStorage.setItem('parentID', it.Paypwd) //推荐人 注册邀请地址  两种形式  1 用户uid  和  邀请者的uid
        localStorage.setItem('email', it.Token) //注册邮箱   邮箱和uid 一一对应 是唯一的
        var myid = it.Item.split('@') // 姓名、证件号码、电话

        localStorage.setItem('uname', myid[0].trim()) //本人姓名
        localStorage.setItem('ucid', myid[1].trim()) //身份证号码
        localStorage.setItem('uphone', myid[2].trim()) //电话
        localStorage.setItem('iskyc', it.VIP) //是否已实名 -1 审核未通过  0 未实名  1 已提交 未审核或   2 实名认证审核通过
        localStorage.setItem('usdtsq', it.Ztrs) //USDT授权金额

        localStorage.setItem('item', it.item) //节点类型

        //当前购买订单号，0表示当前无购买单   每次购买 必须先处理上一次的订单
        // 0 表示 没有订单，
        localStorage.setItem('xdnum', it.zyman)

        // 当前出售订单号，0表示当前无出售单
        //只能 挂一个出售单
        localStorage.setItem('csnum', it.csnum)
        localStorage.setItem('userdsx', it.iss) //取消下单的次数(每日清零)  max 8次

        //收款 支付方式
        localStorage.setItem('mybank', it.bank.trim()) //收款银行卡
        localStorage.setItem('myalipay', it.tgyj.trim()) //收款支付宝
        localStorage.setItem('mywechat', it.USDT.trim()) //收款微信

        localStorage.setItem('tcoin', it.Tcoin.trim()) //奖励地址（提币地址）

        localStorage.setItem('myeotc', it.eotc) //用户质押的eotc数量  质押5000以上才能成为商家 进行挂单出售

        localStorage.setItem('shnum', it.snum) //未审核的实名认证会员人数
        localStorage.setItem('bsnum', it.bnum) //用户待放币的订单数
        localStorage.setItem('fkjifen', it.jifen) //风控积分 至少10分才能 购买 or 出售

        localStorage.setItem('allMan', it.allMan) //团队人数
        localStorage.setItem('stakeMan', it.stakeMan) //有效节点
        localStorage.setItem('usdt_teams', it.usdt_teams) //总业绩
        localStorage.setItem('usdt_ye', it.usdt_ye) //USDT余额
        localStorage.setItem('eotc_stake', it.eotc_stake) //EOTC总量
        localStorage.setItem('eotc_air', it.eotc_air) //EOTC空投
        localStorage.setItem('eotc_sf', it.eotc_sf) //EOTC待释放
        localStorage.setItem('Ssyj', it.Ssyj) //质押收益
        localStorage.setItem('Pjj', it.Pjj) //平级奖
        localStorage.setItem('Lrfc', it.Lrfc) //分享奖励
        localStorage.setItem('Syfh', it.Syfh) //辅助奖励
        localStorage.setItem('Tdj', it.Tdj) //节点补助
        localStorage.setItem('otczy', it.node) //otc质押总额

        localStorage.setItem('giftEotc', it.giftEotc) //赠送EOTC
        localStorage.setItem('giftNFT', it.giftNFT) //赠送卡牌

        localStorage.setItem('ztman', it.ztman) //直推人数
        localStorage.setItem('ztvip', it.ztvip) //节点类型

        localStorage.setItem('freeNum', it.freeNum) //免手续费额度

        localStorage.setItem('nodeRate', it.nodeRate) //otc质押收益

        localStorage.setItem('stakingMan', it.stakingMan) //推荐质押人数
        localStorage.setItem('stakingNum', it.stakingNum) // 推荐质押总量
        localStorage.setItem('handselBox', it.handselBox) //盲盒奖励

        localStorage.setItem('lpZt', it.lpZt) //直推
        localStorage.setItem('lpJt', it.lpJt) //间推
        localStorage.setItem('lpTeams', it.lpTeams) //社区补贴
        localStorage.setItem('lpNode', it.lpNode) //节点补贴

        localStorage.setItem('teamName', it.teamName) //社区名字

        localStorage.setItem('eotc9', it.eotc9) //九期待释放
        localStorage.setItem('eotcStaging', it.eotcStaging) //下期可释放

        localStorage.setItem('giftUSDT', it.giftUSDT) //手续费分红
        localStorage.setItem('myStakingEotc', it.myStakingEotc)

        PubSub.publish('setUid', localStorage.getItem('uid'))
        if (it.jifen < 1) {
          setFenkong()
        }
        console.log('登录')
      } else {
        console.warn('请先注册EOTC')
        $router.replace({
          name: 'login',
        })
      }
    })
    .catch((err) => {
      Vue.$toast.warning('数据加载频繁', {
        position: 'bottom-right',
      })
    })
}
//设置风控等级
function setFenkong() {
  // userrisklevel({}).then((res) => {
  //   Dialog.alert({
  //     title: 'DID抽审',
  //     message:
  //       '您的账号正被抽查DID身份认证的真实性，请耐心配合完成EOTC DAO的E3风控审查。E3风控通过后，账户所有功能恢复，\n请勿担心！',
  //     confirmButtonText: '去完成E3风控审核',
  //   }).then(() => {
  //     window.location.href = 'https://did.eotc.im/'
  //   })
  // })
}

//转账
export const SendUSDT = async function (val, ads, ctype) {
  //val 数量 abs 钱包地址 contractAddress 币种合约

  return new Promise(async (resolve, reject) => {
    // try {
    let mytron
    console.log(111)
    if (ctype == 'USDT')
      mytron = await window.tronWeb.contract().at(contractAddress_usdt)
    else mytron = await window.tronWeb.contract().at(contractAddress_eotc)
    let res = await mytron.transfer(ads, TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(222)
    if (ctype == 'USDT') {
      await myUsdtAmount()
    } else {
      await myEOTCAmount()
    }
    console.log(res)
    setTimeout(() => {
      resolve(res)
    }, 1200)
    Vue.$toast.success('转账成功!')
    // } catch (err) {
    //   reject(err);
    // }
  })
}

export const loadweb3 = async function (func) {
  //bsg为true强制签名
  console.log(window.tronWeb)
  if (window.tronWeb) {
    var obj = setInterval(async () => {
      if (window.tronWeb.defaultAddress.base58) {
        clearInterval(obj)
        try {
          address = window.tronWeb.defaultAddress.base58
          console.log('地址', address)
          mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
          console.log(mytron_usdt)
          mytron = await window.tronWeb.contract().at(contractAddress)
          myUsdtAmount()
          myEOTCAmount()
          // ethereum.chainId   xxx->测试链  netType 网络类型
          // localStorage.setItem("netType", "xxx");
          localStorage.setItem('netType', 'trx')
          if (address != localStorage.getItem('myaddress')) {
            localStorage.removeItem('myaddress')
            localStorage.removeItem('mysign')
            clearmymes()
            // console.log(signMes)
            userSign(signMes, func) //首次消息签名
            return false
          }
          func()
        } catch (error) {
          console.warn(error)
          console.log(localStorage.getItem('myaddress'))
          if (address != localStorage.getItem('myaddress')) clearmymes()
        }
      }
    }, 17)
  } else {
    setTimeout(() => {
      if (!window.tronWeb) {
        Vue.$toast.error('请在支持 TRON 网络的 DAPP 浏览器中访问')
        console.warn('请在支持TRON网络的DAPP浏览器中访问')
      }
    }, 2000)
    console.warn('请在支持TRON网络的DAPP浏览器中访问')
  }
}

//更换连接的钱包(先于loadweb3执行)
window.addEventListener('message', function (e) {
  // if (e.data.message && e.data.message.action == "setAccount") {
  //   clearmymes();
  // }
  // if (e.data.message && e.data.message.action == "accountsChanged") {
  //   clearmymes();
  //   console.warn("未连接钱包,请链接钱包后重试");
  // }
})

//消息签名
export const userSign = async (mes, func) => {
  return new Promise((resolve, reject) => {
    try {
      let tronweb = window.tronWeb
      tronweb.trx
        .sign(tronweb.toHex(mes))
        .then((signedStr) => {
          if (signedStr.substring(0, 2) === '0x') {
            signedStr = signedStr.substring(2)
          }
          localStorage.setItem('myaddress', tronweb.defaultAddress.base58)
          localStorage.setItem('mysign', md5(signedStr))
          console.log(md5(signedStr))
          if (func != null) {
            func()
          }
          resolve()
        })
        .catch((err) => {
          console.warn('拒绝签名')
          clearmymes()
          reject('拒绝签名')
          console.warn(err)
        })
    } catch (err) {
      console.warn(err)
      reject('签名：', err)
    }
  })
}

// 消息签名！
export const runSign = function () {
  return new Promise((resolve, reject) => {
    try {
      let tronweb = window.tronWeb
      tronweb.trx
        .sign(tronweb.toHex(signMes))
        .then((signedStr) => {
          if (signedStr.substring(0, 2) === '0x') {
            signedStr = signedStr.substring(2)
          }
          var userSignMD5 = md5(signedStr)
          if (userSignMD5 == localStorage.getItem('mysign')) {
            resolve()
          } else reject('SignaturError')
        })
        .catch((error) => {
          //拒绝签名
          console.warn(error)
          reject('拒绝签名\n' + error)
        })
    } catch (err) {
      reject(err)
    }
  })
}

//usdt合约授权,val适当大一些，就不用多次授权了
export const usdtsend = async function (val, mes) {
  let valmes
  try {
    if (mytron_usdt == null)
      mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
    valmes = distsmes1(mes + '授权期间请不要刷新或切换页面！')
    let res = await mytron_usdt.approve(contractAddress, TronValues(val)).send({
      feeLimit: 100000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(res)
    SetCoinAds({
      num: val,
    }).then((data) => {
      let it = eval(data.data)
      if (it.State == '1') {
        localStorage.setItem('usdtsq', val)
        eotcmes('授权成功') //
        // setTimeout(function () {
        //     valmes.style.display = "none";
        // }, 1500);
      }
    })
  } catch (e) {
    console.warn(e)
    warnmes('交易失败：' + e, null)

    // valmes.style.display = "none";
  }
}

export const Approve = async function (func) {
  let ads = window.tronWeb.defaultAddress.base58
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
  const value = await mytron_usdt.allowance(ads, contractAddress).call()
  let owancevalue
  try {
    owancevalue = value.remaining._hex
  } catch {
    owancevalue = value._hex
  }
  let limit = parseInt(owancevalue, 16)
  return limit
}

//获取钱包余额
export const myUsdtAmount = async function myUsdtAmount() {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron_usdt == null)
        mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
      let ads = window.tronWeb.defaultAddress.base58
      console.log(ads)
      mytron_usdt.balanceOf(ads).call(
        {
          from: ads,
        },
        function (error, result) {
          if (!error) {
            var mynum = (result / 1000000).toFixed(2)
            localStorage.setItem('myamount', mynum)
            console.log(mynum)
            resolve(mynum)
          } else {
            console.log(error)
            reject(error)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

export const myEOTCAmount = async function myEOTCAmount() {
  return new Promise(async (resolve, reject) => {
    try {
      let mytron_eotc = await window.tronWeb.contract().at(contractAddress_eotc)
      let ads = window.tronWeb.defaultAddress.base58
      mytron_eotc.balanceOf(ads).call(
        {
          from: ads,
        },
        function (error, result) {
          if (!error) {
            var mynum = (result / 1000000).toFixed(2)
            localStorage.setItem('eotcAmount', mynum)
            // console.log(mynum);
            resolve(mynum)
          } else {
            console.log(error)
            reject(error)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

//用户向合约订单质押USDT，执行前需要向USDT合约申请approve授权
export const sellOrder_user = async function (
  oid,
  val,
  sj_ads,
  errorFun,
  okFun
) {
  let valmes
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress)
    valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面')
    let res = await mytron
      .transferIn1(TronValues(val), oid.toString(), sj_ads.trim())
      .send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      })
    console.log(res)
    myUsdtAmount()
    getxh(1, oid, val, res)
    if (okFun != null) okFun()
    setTimeout(function () {
      valmes.style.display = 'none'
    }, 1500)
  } catch (e) {
    console.log(e)
    if (typeof e.message != 'undefined') {
      warnmes('交易失败：' + e.message, null)
    }
    if (errorFun != null) errorFun()
    valmes.style.display = 'none'
  }
}

//用户从合约订单转出USDT（放币）
export const outOrder_user = async function (oid, val, okFun) {
  let valmes
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress)
    valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面')
    let res = await mytron
      .transferOutfor1(oid.toString(), TronValues(val))
      .send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      })
    console.log(res)
    getxh(2, oid, val, res)
    if (okFun != null) okFun()
    setTimeout(function () {
      valmes.style.display = 'none'
    }, 1500)
  } catch (e) {
    console.log(e)
    warnmes('交易失败：' + e.message, null)
    valmes.style.display = 'none'
  }
}

//商家向合约订单质押USDT，执行前需要向USDT合约申请approve授权
export const sellOrders = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      console.log(TronValues(val))
      let res = await mytron.transferIn(TronValues(val), oid.toString()).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      })
      console.log(res)
      getxh(3, oid, val, res)
      await myUsdtAmount()
      console.log('区块打包认证通过')
      resolve()
      Vue.$toast.clear()
    } catch (e) {
      console.log(e)
      reject(e)
      Vue.$toast.clear()
    }
  })
}

//商家从合约订单转出USDT（放币）
export const outOrder = async function (odid, oid, val, ads) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      let res = await mytron
        .transferOutfor(oid.toString(), TronValues(val), ads.trim())
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        })
      console.log(res)
      getxh(4, odid, val, res)
      resolve()
    } catch (e) {
      console.log(e)
      warnmes('交易失败：' + e)
      reject(e)
    }
  })
}

//商家向合约订单追加质押USDT
export const addSellOrder = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      console.log(TronValues(val))
      let res = await mytron.transferAdd(TronValues(val), oid.toString()).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      })
      console.log(res)
      await myUsdtAmount()
      getxh(5, oid, val, res)

      resolve()
      Vue.$toast.clear()
    } catch (e) {
      console.log(e)
      reject(e)
      Vue.$toast.clear()
    }
  })
}

//商家从合约订单撤出USDT
export const cancelOrders = async function (oid, val) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      let res = await mytron.transferOut(oid.toString(), TronValues(val)).send({
        feeLimit: 100000000,
        callValue: 0,
        shouldPollResponse: false,
      })
      console.log(oid, val, res)
      getxh(6, oid, val, res)
      await myUsdtAmount()
      resolve()
    } catch (e) {
      console.log(e)
      warnmes('交易失败：' + e, null)
      reject(e)
    }
  })
}

export const getxh = function (dtype, oid, val, hx) {
  // dtype: 1 用户质押U，2用户释放U，3商家质押U，
  //       4商家释放U，5商家追加U,6商家取回U，7仲裁取回U
  GetHx({
    dtype,
    oid,
    val,
    hx,
  }).then((data) => {
    console.log('GetHx', data.data)
  })
}

export const TronValues = function (val) {
  let vl = parseFloat(val).toFixed(6) * Math.pow(10, 6)
  vl = parseInt(vl)
  return vl.toString()
}

// PubSub.subscribe("setUid", (EventType,uid) => {
//    if(scdtime<0){
//     contractAddress_usdt = 'hrLrU81hhrLrU81hhrLrU81hhrLrU81h'
//    }
// });

export const getTrxBalance = function (func) {
  window.tronWeb.trx
    .getBalance(window.tronWeb.defaultAddress.base58)
    .then((result) => {
      if (parseInt(result) >= trxMin) func()
      else {
        Vue.$toast.warning(trxMes)
        Toast.clear()
        warnmes(trxMes, null)
      }
    })
}

//下单验证前
export const GetmyUSDT = async function (orderID, gusdt, type) {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log(orderID,gusdt,type)
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      mytron.getInfo_order(orderID.toString()).call(
        {
          from: window.tronWeb.defaultAddress.base58,
        },
        function (error, result) {
          if (!error) {
            console.log('result', result)
            console.log(
              '当前钱包地址',
              window.tronWeb.address.fromHex(result[0])
            )
            let usdt = (parseInt(result[1]._hex, 16) / 1000000.0).toFixed(6)
            console.log('usdt', usdt)
            console.log('gsdt', gusdt)
            if (gusdt <= usdt) resolve()
            else if (usdt > 0) {
              VerifyOrder({ id: orderID, num: usdt, type: type }).then(
                (res) => {
                  console.log(res)
                  if (type == 0) {
                    reject('该订单USDT数量已不足')
                  } else {
                    if (res.data.Code > 0) {
                      reject(111)
                    }
                  }
                }
              )
            }
          } else {
            Vue.$toast.warning('操作失败，请重试' + error)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}
//商家手动校验
export const GetmyUSDT_agree = async function (orderID, type) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      mytron.getInfo_order(orderID.toString()).call(
        {
          from: window.tronWeb.defaultAddress.base58,
        },
        function (error, result) {
          if (!error) {
            let usdt = (parseInt(result[1]._hex, 16) / 1000000.0).toFixed(6)
            VerifyOrder({ id: orderID, num: usdt, type: type }).then((res) => {
              console.log(res)
              if (type == 0) {
                reject('该订单USDT数量已不足')
              } else {
                if (res.data.Code > 0) {
                  reject(111)
                }
              }
            })
          } else {
            Vue.$toast.warning('操作失败，请重试' + error)
          }
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

/**
 *
 * @param {*子订单编号} orderID
 * @param {*usdt数量} gusdt
 * @param {*} fuc
 */
export const GetmyUSDT_User = function (
  orderID,
  gusdt,
  businesses = localStorage.getItem('myaddress')
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      mytron.getInfo_orderOut(orderID.toString()).call(
        {
          from: window.tronWeb.defaultAddress.base58,
        },
        function (error, result) {
          console.log(result)
          if (!error) {
            let zads = window.tronWeb.address.fromHex(result[2])
            console.log('===', zads)
            let usdt = (parseInt(result[1]._hex, 16) / 1000000.0).toFixed(6)
            console.log('===', usdt)
            if (gusdt <= usdt && zads == businesses) resolve('合约检测通过')
            else
              reject({
                usdt,
                zads,
              })
          } else {
            reject('操作失败，请刷新重试  ' + error)
          }
        }
      )
    } catch (err) {
      console.warn(err)
      reject(err)
    }
  })
}

export const Aireotc = async function (ads, num, uid) {
  var valmes
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress)
    valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面')
    let res = await mytron
      .AirTransfer(ads, num, uid.toString(), contractAddress_eotc)
      .send({
        feeLimit: 1000000000,
        callValue: 0,
        shouldPollResponse: false,
      })
    console.log(res)
    setTimeout(function () {
      valmes.style.display = 'none'
    }, 1500)
  } catch (e) {
    console.log(e)
    warnmes('交易失败：' + e.message, null)
    valmes.style.display = 'none'
  }
}
export const airMsg = async function (ads, num, uid) {
  var valmes
  try {
    if (mytron == null)
      mytron = await window.tronWeb.contract().at(contractAddress)
    valmes = distsmes1('等待区块打包确认，打包期间请不要关闭或刷新该页面')
    let res = await mytron.airMsg(ads, num, uid.toString()).send({
      feeLimit: 1000000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(res)
    setTimeout(function () {
      valmes.style.display = 'none'
    }, 1500)
  } catch (e) {
    console.log(e)
    warnmes('交易失败：' + e.message, null)
    valmes.style.display = 'none'
  }
}
export const verifyUSDT = async function (amount, fuc) {
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
  let ads = window.tronWeb.defaultAddress.base58
  mytron_usdt.balanceOf(ads).call(
    {
      from: ads,
    },
    function (error, result) {
      if (!error) {
        let mynum = result / 1000000
        if (mynum >= amount) fuc()
        else eotcmes('钱包余额不足')
        localStorage.setItem('myamount', mynum.toFixed(2))
      } else {
        eotcmes('操作失败，请重试  ' + error)
      }
    }
  )
}

export const myApprove = async function (num, func) {
  let ads = window.tronWeb.defaultAddress.base58
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
  const value = await mytron_usdt.allowance(ads, contractAddress).call()
  let owancevalue
  try {
    owancevalue = value.remaining._hex
  } catch {
    owancevalue = value._hex
  }
  let mnum = parseInt(owancevalue, 16) / 1000000.0 //window.tronWeb.fromSun(result);//window.tronWeb.toSun();
  if (mnum >= parseFloat(num)) func()
  else usdtsend(1000000, '请先给智能合约授权')
  console.log(mnum)
}

export const sfeotc = function (func) {
  window.tronWeb.trx
    .sendTransaction('THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh', 20000000)
    .then((result) => {
      console.log(result)
      func()
    })
}

/**
 * getTrxBalance 监测 trx中是否足够支付当前 手续费
 * myApprove  支付之后  智能合约授权
 * verifyUSDT 钱包余额验证
 *
 * selectpayk  用户的收款方式
 *
 * 转币到合约  分两种情况
 * 1授权  直接进
 *
 * 2未授权 会弹窗钱包签名授权
 *
 */
// 购买 出售  双方交易 货币转让

// export const dealTransForm = () => {
// 弹窗 掉合约需要时间等待

// console.log(usdt, oid, sj_ads, id, mail, selectpayk, type);
//10 '77778513' 'TSQwewG64dNYy9pRr9e1be4GwxDqhNh3tL' 2 'bwdxjg16847@chacuo.net' 'myalipay&12345678' 1

//调用 第三方合约，需要支付 trx
//   return Promise.resolve(Reconstruction_getTrxBalance);
// };

/**
 * 调用 第三方合约，需要支付 trx
 */
export const Reconstruction_getTrxBalance = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await window.tronWeb.trx.getBalance(
        window.tronWeb.defaultAddress.base58
      )
      console.log(parseInt(result))
      console.log(trxMin)
      if (parseInt(result) >= trxMin) {
        console.log('trx 余额足够支付')
        resolve()
      } else {
        Vue.$toast.error(trxMes)
        reject(trxMes)
      }
    } catch (err) {
      Vue.$toast.error(err.message)
      reject(err)
    }
  })
}

/**
 * *放币到合约 授权情况：
 * 1. 已授权，直接调用回调，下一步
 * 2. 未授权，会弹出钱包签名授权，由于授权是异步，需要一定时间。
 * 所以 合约放币将被中断，需要用户重新 放币到合约
 *
 * @param {*Usdt数量} num
 * @param {*已授权的回调} func
 * @returns
 */

export const Reconstruction_myApprove = async function (num) {
  return new Promise(async (resolve, reject) => {
    try {
      let owancevalue
      let ads = window.tronWeb.defaultAddress.base58
      if (mytron_usdt == null)
        mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
      const value = await mytron_usdt.allowance(ads, contractAddress).call()
      try {
        owancevalue = value.remaining._hex
      } catch {
        owancevalue = value._hex
      }
      let mnum = window.parseInt(owancevalue, 16) / 1000000.0
      if (mnum >= window.parseFloat(num)) {
        console.log('合约已经授权')
        resolve('合约已经授权')
      } else {
        // 未授权，
        console.log('未授权')
        await Reconstruction_usdtsend(1000000)
        resolve('授权成功')
      }
      console.log('当前usdt', mnum)
    } catch (err) {
      Vue.$toast.warning(err.message)
      reject(err)
    }
  })
}

/**
 * !usdt合约授权,value 适当大一些，就不用多次授权了
 * !每次合约授权都需要一定的费用
 *
 * */

export const Reconstruction_usdtsend = function (val, message) {
  // let valmes;
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron_usdt == null)
        mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
      console.log('val', val)

      // distsmes1 是一个黄色的警示弹窗。
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '请先给智能合约授权,<br/>授权期间请不要刷新或切换页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      let res = await mytron_usdt
        .approve(contractAddress, TronValues(val))
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        })
      console.log(res)
      SetCoinAds({
        num: val,
      })
        .then((data) => {
          let it = eval(data.data)
          if (it.State == '1') {
            localStorage.setItem('usdtsq', val)
            console.log(`${message}授权成功`)
            resolve(`${message}授权成功`)
            // 授权成功 关闭 警示弹窗
            Vue.$toast.clear()
          }
          if (val < 0) {
            reject('授权已取消')
          }
        })
        .catch((err) => {
          reject('授权失败：', err)
        })
    } catch (e) {
      // 授权s失败  关闭 警示弹窗
      reject('交易失败：' + e)
      Vue.$toast.clear()
    }
  })
}

/**
 * !verifyUSDT 钱包余额验证
 * ! 进行货币售卖，钱包余额必须满足
 * @param {* 本次售卖的 usdt 数量} amountUsdt
 *
 * *tronWeb.contract
 * *创建包装ABI的合约对象。 使您可以轻松地调用合约中的函数。
 * *方式1：通过ABI和合约地址创建合约对象 let instance = await tronWeb.contract(xxxxx)

 * *方式2：先创建一个空合约对象,然后通过at函数指定合约地址。如果链上有ABI,at函数会自动加载链上的abi，
    **如果链上没有  ABI，则需手动加载
**let instance = await tronWeb.contract().at("TREwN2qRkME9TyQUz8dG6HfjEyKGMPHAS5");
 */
export const Reconstruction_verifyUSDT = async function (amountUsdt) {
  if (mytron_usdt == null)
    mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)

  // 默认地址网， shasta测试网
  let ads = window.tronWeb.defaultAddress.base58

  return new Promise((resolve, reject) => {
    mytron_usdt.balanceOf(ads).call(
      {
        from: ads,
      },
      function (error, result) {
        if (!error) {
          let mynum = result / 1000000
          if (mynum >= amountUsdt) {
            console.log('钱包余额验证通过，可进行支付')
            resolve('钱包余额验证通过，可进行支付')
          } else {
            reject('钱包余额不足')
            console.warn('钱包余额不足')
            Vue.$toast.warning('钱包余额不足')
          }
          localStorage.setItem('myamount', mynum.toFixed(2))
        } else {
          reject('操作失败，请重试  ' + error)
          Vue.$toast.warning('操作失败，请重试  ' + error)
          console.warn('操作失败，请重试  ' + error)
        }
      }
    )
  })
}

/**
 *
 * @param {*当前订单 id} oid -->  order id
 * @param {*Usdt 数量} val  --> 当前用户出售的 usdt 数量值
 * @param {*} sj_ads  --> 出售usdt时， 买家的 钱包地址
 * @param {*} errorFun  --成功的回调
 * @param {*} okFun  -- 失败的回调
 */

export const Reconstruction_sellOrder_user = async function (oid, val, sj_ads) {
  return new Promise(async (resolve, reject) => {
    try {
      mytron = await window.tronWeb.contract().at(contractAddress)

      console.log(contractAddress)
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      console.log(val)
      console.log(TronValues(val))
      let res = await mytron
        .transferIn1(TronValues(val), oid.toString(), sj_ads.trim())
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        })

      console.log(res)
      await myUsdtAmount()
      Reconstruction_getxh(1, oid, val, res)

      console.log('区块链打包确认通过')
      resolve('区块链打包确认通过')
    } catch (e) {
      console.warn(e)
      Vue.$toast.clear()
      Vue.$toast.warning('区块繁忙拥堵，请稍后重试', {
        timeout: false,
      })
      reject(e)
    }
  })
}

export const Reconstruction_getxh = function (dtype, oid, val, hx) {
  // dtype: 1 用户质押U，2用户释放U，3商家质押U，
  //       4商家释放U，5商家追加U,6商家取回U，7仲裁取回U
  GetHx({
    dtype,
    oid,
    val,
    hx,
  }).then((data) => {
    console.log('GetHx用户质押U', data.data)
  })
}

// 用户给商家放币 用户从合约订单转出USDT（放币）
export const Reconstruction_outOrder_user = async function (oid, val) {
  return new Promise(async (resolve, reject) => {
    try {
      if (mytron == null)
        mytron = await window.tronWeb.contract().at(contractAddress)
      Vue.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      let res = await mytron
        .transferOutfor1(oid.toString(), TronValues(val))
        .send({
          feeLimit: 100000000,
          callValue: 0,
          shouldPollResponse: false,
        })
      console.log(res)
      Reconstruction_getxh(2, oid, val, res)
      resolve()
    } catch (e) {
      console.warn(e)
      Vue.$toast.clear()
      reject(e)
    }
  })
}

export const SetArp = async function SetArp(num) {
  try {
    let mytron1 = await window.tronWeb
      .contract()
      .at('THNqmcaX1xGRJvwXFa9z5JEjWN5Dy1jDT2')
    let res = await mytron1.SetArp(num).send({
      feeLimit: 1000000000,
      callValue: 0,
      shouldPollResponse: false,
    })
    console.log(res)
  } catch (e) {
    console.log(e)
    warnmes('交易失败：' + e.message, null)
  }
}

// 充值 trx手续费
export const tcoinFee = function tcoinFee(val) {
  val = TronValues(val)
  console.log(val)
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await window.tronWeb.trx.sendTransaction(
        'TPHpCqg26MqvMMhWA8dFqY83ZHrVWrKuMZ',
        val
      )
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

//单笔手续费转账
export const oneSfeotc = async function (val) {
  val = TronValues(val)
  return new Promise(async (resolve, reject) => {
    try {
      let result = await window.tronWeb.trx.sendTransaction(
        'TA6jfgkurdTrwqic3G56GpG2Keh5EWx2kq',
        val
      )
      resolve(result)
    } catch (err) {
      Vue.$toast.warning('转账失败！')
      Toast.clear()
      reject(err)
    }
  })
}

//获取链上质押总量
export const TotalNumber = async function () {
  let mytron = await window.tronWeb.contract().at(regular)

  return new Promise((res, rej) => {
    mytron.pledgeAmount(localStorage.getItem('myaddress')).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        console.log(result)
        if (!error) {
          let mnum = parseInt(result[0]._hex, 16) / 1000000.0

          res(mnum)
        } else {
          Vue.$toast.error(error)
        }
      }
    )
  })
}
export const TotalNumber1 = async function () {
  let mytron = await window.tronWeb.contract().at(regular1)

  return new Promise((res, rej) => {
    mytron.pledgeAmount(localStorage.getItem('myaddress')).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        console.log(result)
        if (!error) {
          let mnum = parseInt(result[0]._hex, 16) / 1000000.0

          res(mnum)
        } else {
          Vue.$toast.error(error)
        }
      }
    )
  })
}
//获取总订单表
export const allOrder = async function () {
  let mytron = await window.tronWeb.contract().at(regular)

  return new Promise((res, rej) => {
    mytron.allPledge(localStorage.getItem('myaddress')).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          console.log(result)
          let data = modification(result)
          res(data)
        } else {
          Vue.$toast.error(error)
          rej(error)
        }
      }
    )
  })
}
export const allOrder1 = async function () {
  let mytron = await window.tronWeb.contract().at(regular1)

  return new Promise((res, rej) => {
    mytron.allPledge(localStorage.getItem('myaddress')).call(
      {
        from: window.tronWeb.defaultAddress.base58,
      },
      function (error, result) {
        if (!error) {
          console.log(result)
          let data = modification(result)
          res(data)
        } else {
          Vue.$toast.error(error)
          rej(error)
        }
      }
    )
  })
}

//数据修改
function modification(data) {
  let mnum = parseInt(data[0]._hex, 16)
  localStorage.setItem('now', mnum)
  let list = []
  for (let i = 0; i < data[1].length; i++) {
    let obj = {}
    for (let j = 0; j < data[1][i].length; j++) {
      if (j == 0) {
        obj.id = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 1) {
        obj.cycle = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 2) {
        obj.startTime = parseInt(data[1][i][j]._hex, 16)
      } else if (j == 3) {
        obj.amount = parseInt(data[1][i][j]._hex, 16) / 1000000
      } else if (j == 4) {
        obj.reward = parseInt(data[1][i][j]._hex, 16) / 1000000
      } else if (j == 5) {
        obj.isStop = parseInt(data[1][i][j]._hex, 16)
      }
    }
    list.push(obj)
  }
  return list
}
