import {
  contractAddress_usdt,
  contractAddress,
  contractAbi,
  contractAbi_usdt,
  contractAddress_eotc,
  Contract_EOTC,
  Contract_USDT,
  Contract_EOTC_token,
} from './abi'

import PubSub from 'pubsub-js'
import Vue from 'vue'

import loadingToast from '@/components/loading-toast'

/**
 * ! Reconstruction_ 标记开头的方法进行了 promise化重构
 */
import { Toast, Dialog } from 'vant'

import { SetCoinAds, GetHx, EotcLoginmes, VerifyOrder } from '@/api/trxRequest'

import { userrisklevel } from '@/api/arbitrationMsg'

import { clearmymes } from '@/api/payverification'

import $router from '@/router'
import md5 from 'md5'

window.signMes = 'EOTC请求您签名确认,签名不消耗GAS.'

const regular = 'TCvz9REhN7aaRkfZjU5evRQkAugyfQBFZN'
const regular1 = 'TQQfPrKFrq6ebXBG6HWcfmvbfafgyaU1pU'

var address = ''
const bscMin = 0.01
const distime = 2000
const bscMes = '为使交易顺畅，请确保钱包中不少于0.01BNB'

function eotcmes(message) {
  Vue.$toast.warning(message)
  console.warn(message)
}

function warnmes(mes) {
  Vue.$toast.warning(mes)
  console.warn(mes)
}

function distsmes1(message) {
  console.warn(message)
}

export const UserInfo = function () {
  //注册邮箱   邮箱和uid 一一对应 是唯一的
  const email = localStorage.getItem('email')
  // 主键 6位 唯一标识 id
  const uid = localStorage.getItem('uid')
  //钱包地址
  const myaddress = localStorage.getItem('myaddress')
  //USDT授权金额
  const usdtsq = localStorage.getItem('usdtsq')
  //是否已实名  0 未实名  1 已提交 未审核或 审核未通过  2 实名认证审核通过
  const iskyc = localStorage.getItem('iskyc')

  const myeotc = localStorage.getItem('myeotc')
  const uname = localStorage.getItem('uname')
  const mybank = localStorage.getItem('mybank')
  const mywechat = localStorage.getItem('mywechat')
  const myalipay = localStorage.getItem('myalipay')

  const myamount = localStorage.getItem('myamount')

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

  const allMan = localStorage.getItem('allMan') //团队人数
  const stakeMan = localStorage.getItem('stakeMan') * 1 //有效节点
  const usdt_teams = localStorage.getItem('usdt_teams') //总业绩

  const usdt_ye = localStorage.getItem('usdt_ye') //USDT余额
  const eotc_stake = localStorage.getItem('eotc_stake') //EOTC总量
  const eotc_air = localStorage.getItem('eotc_air') //EOTC空投
  const eotc_sf = localStorage.getItem('eotc_sf') //EOTC待释放
  const Ssyj = localStorage.getItem('Ssyj') //质押收益
  const Pjj = localStorage.getItem('Pjj') //平级奖
  const Lrfc = localStorage.getItem('Lrfc') //分享奖励
  const Syfh = localStorage.getItem('Syfh') //辅助奖励
  const Tdj = localStorage.getItem('Tdj') //EOTC空投

  const ztman = localStorage.getItem('ztman') //直推人数
  const ztvip = localStorage.getItem('ztvip') //节点类型

  return {
    email,
    uid,
    item,
    myaddress,
    usdtsq,
    myamount,
    iskyc,
    myeotc,
    uname,
    mybank,
    mywechat,
    myalipay,
    ucid,
    uphone,
    parentID,
    myjifen,
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

export const loadweb3 = async function loadweb3(func) {
  //bsg为true强制签名
  if (window.ethereum) {
    window.web3 = new Web3(ethereum)
    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      address = accounts[0].toLocaleLowerCase()
      myUsdtAmount()
      console.log(address)
      localStorage.setItem('netType', 'bsc') //ethereum.chainId
      // localStorage.setItem('netType', 'asd')
      if (address != localStorage.getItem('myaddress')) {
        console.log('没有地址')
        clearmymes()
        userSign(signMes, func) //首次消息签名
        return false
      }
      func()
    } catch (error) {
      console.warn(error)
      if (address != localStorage.getItem('myaddress')) clearmymes()
    }
  } else {
    Vue.$toast.warning(
      {
        component: loadingToast,
        props: {
          title: '请在支持 BSC 的Dapp 游览器中打开！',
        },
      },
      {
        icon: false,
        timeout: false,
      }
    )

    // console.log(signature);
  }
}

export const userBaseMes = function () {
  // Reconstruction_usdtsend(0,"取消")
  //加载用户数据前必须检验用户是否已经消息签名
  var mysign = localStorage.getItem('mysign')
  if (mysign == null || mysign == '') {
    userSign(signMes) //消息签名
    return false
  }

  var ads = localStorage.getItem('myaddress')
  if (ads == null) {
    console.warn('请重新连接钱包')
    return false
  }

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

        localStorage.setItem('allMan', it.allMan) //团队人数
        localStorage.setItem('stakeMan', it.stakeMan) //有效节点
        localStorage.setItem('usdt_teams', it.usdt_teams) //总业绩

        //收款 支付方式
        localStorage.setItem('mybank', it.bank.trim()) //收款银行卡
        localStorage.setItem('myalipay', it.tgyj.trim()) //收款支付宝
        localStorage.setItem('mywechat', it.USDT.trim()) //收款微信

        localStorage.setItem('tcoin', it.Tcoin.trim()) //奖励地址（提币地址）

        localStorage.setItem('myeotc', it.eotc) //用户质押的eotc数量  质押5000以上才能成为商家 进行挂单出售

        localStorage.setItem('shnum', it.snum) //未审核的实名认证会员人数
        localStorage.setItem('bsnum', it.bnum) //用户待放币的订单数
        // localStorage.setItem('myjifen', it.jifen) //用户积分 至少10分才能 购买 or 出售

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
      } else {
        // sysMes("请先注册EOTC", function () { window.location.href = "login.html" });
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
  //     message: `您的账号正被抽查DID身份认证的真实性，请耐心配合完成EOTC DAO的E3风控审查。E3风控通过后，账户所有功能恢复，\n请勿担心！`,
  //     confirmButtonText: '去完成E3风控审核',
  //   }).then(() => {
  //     window.location.href = 'https://did.eotc.im/'
  //   })
  // })
}

//更换连接的钱包(先于loadweb3执行)
ethereum.on('accountsChanged', handleAccountsChanged)
function handleAccountsChanged(accounts) {
  //if (address != localStorage.getItem("myaddress")) {
  //    clearmymes();
  //    userSign(signMes, null);
  //}
  if (accounts.length === 0) {
    eotcmes('未连接钱包')
  }
}

//消息签名
export const userSign = function userSign(mes, func) {
  window.web3.eth.personal
    .sign(window.web3.utils.utf8ToHex(mes), address)
    .then((result) => {
      console.log('mes_sign：' + result)
      localStorage.setItem('myaddress', address)

      localStorage.setItem('mysign', md5(result))
      if (func != null) func()
    })
    .catch((error) => {
      console.log('拒绝签名')
      clearmymes()
    })
}

export const runSign = function () {
  return new Promise((resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    try {
      window.web3.eth.personal
        .sign(window.web3.utils.utf8ToHex(signMes), address)
        .then((result) => {
          let userSignMD5 = md5(result)
          if (userSignMD5 == localStorage.getItem('mysign')) {
            resolve()
          } else reject('SignaturError')
        })
        .catch((error) => {
          //拒绝签名
          console.log(error)
          reject('拒绝签名\n' + error)
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const Reconstruction_usdtsend = function (val, message) {
  return new Promise(async (resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    try {
      var myContract = Contract_USDT(window.web3)
      myContract.methods
        .approve(contractAddress, EthValues(val))
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
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
                  if (val < 0) {
                    reject('授权已取消')
                  }
                  Vue.$toast.clear()
                }
              })
              .catch((err) => {
                reject('授权失败：', err)
              })
          } else {
            console.log(error)
            reject('交易失败：' + error)
          }
        })
    } catch (e) {
      // 授权s失败  关闭 警示弹窗
      reject('交易失败：' + e)
      Vue.$toast.clear()
    }
  })
}

//转账
export const SendUSDT = async function (val, ads, ctype) {
  console.log(ctype)
  return new Promise((resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    var myContract
    let type, num
    if (ctype == 'usdt') {
      myContract = Contract_USDT(window.web3)
      type = 'ether'
      num = EthValues(val)
    } else if (ctype == 'eotc') {
      myContract = Contract_EOTC_token(window.web3)
      type = 'mwei'
      num = EthValues(val, type)
    } else {
      warnmes('BSC网络暂不支持EOTC转账')
      return
    }
    console.log(num)
    myContract.methods
      .transfer(ads, num)
      .send({ from: address }, function (error, result) {
        if (!error) {
          console.log(result)
          setTimeout(() => {
            resolve(result)
          }, 1200)
          eotcmes('转账成功')
        } else {
          reject(error)
          console.log(error)
        }
      })
  })
}

//获取钱包 USDT 余额
function myUsdtAmount() {
  var myContract = Contract_USDT(new Web3(ethereum))
  console.log(address)

  myContract.methods
    .balanceOf(address)
    .call({ from: address }, function (error, result) {
      if (!error) {
        var mynum = TypeShow(result).toFixed(2)
        console.log('myamount', mynum)
        localStorage.setItem('myamount', mynum)
      } else {
        console.log(error)
        return -1
      }
    })
}
//网络判断
function TypeShow(result) {
  //mwei 1000000 gwei:1000000000 ether 1000000000000000000
  if (localStorage.getItem('netType') == 'asd') {
    return parseFloat(new Web3(ethereum).utils.fromWei(result, 'mwei'))
  } else if (localStorage.getItem('netType') == 'bsc') {
    return parseFloat(new Web3(ethereum).utils.fromWei(result, 'ether'))
  }
}

//用户向合约订单质押USDT，执行前需要向USDT合约申请approve授权

export const Reconstruction_sellOrder_user = async function (oid, val, sj_ads) {
  return new Promise(async (resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      // val=(val*1).toFixed(6)
      console.log(val)
      console.log(EthValues(val))
      myContract.methods
        .transferIn1(EthValues(val), oid.toString(), sj_ads.trim())
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
            Vue.$toast.warning(
              {
                component: loadingToast,
                props: {
                  title:
                    '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
                },
              },
              {
                icon: false,
                timeout: false,
              }
            )
            getxh(11, oid, val, result)
            //执行成功
            myUsdtAmount()
            console.log('区块链打包确认通过')
            resolve('区块链打包确认通过')
            Vue.$toast.clear()
          } else {
            console.log(error)
            Vue.$toast.warning('交易失败,区块繁忙拥堵，请稍后重试')
            reject(error)
          }
        })
    } catch (e) {
      console.warn(e)
      Vue.$toast.clear()
      Vue.$toast.warning('区块繁忙拥堵，请稍后重试')
      reject(e)
    }
  })
}

//用户从合约订单转出USDT（放币）
export const Reconstruction_outOrder_user = async function (oid, val) {
  return new Promise(async (resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    try {
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .transferOutfor1(oid.toString(), EthValues(val))
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)

            Vue.$toast.warning(
              {
                component: loadingToast,
                props: {
                  title:
                    '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
                },
              },
              {
                icon: false,
                timeout: false,
              }
            )

            getxh(12, oid, val, result)
            //执行成功
            resolve()
            Vue.$toast.clear()
          } else {
            console.log(error)
            reject(error)
          }
        })
    } catch (e) {
      console.warn(e)
      Vue.$toast.clear()
      reject(e)
    }
  })
}

//商家向合约订单质押USDT，执行前需要向USDT合约申请approve授权
export const sellOrders = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    try {
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .transferIn(EthValues(val), oid.toString())
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
            Vue.$toast.warning(
              {
                component: loadingToast,
                props: {
                  title:
                    '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
                },
              },
              {
                icon: false,
                timeout: false,
              }
            )

            getxh(13, oid, val, result)
            //执行成功
            myUsdtAmount()
            resolve('授权成功')
            Vue.$toast.clear()
          } else {
            console.log(error)
            reject(error)
          }
        })
    } catch (e) {
      console.log(e)
      reject(e)
      Vue.$toast.clear()
    }
  })
}

export const outOrder = async function (odid, oid, val, ads) {
  return new Promise(async (resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .transferOutfor(oid.toString(), EthValues(val), ads.trim())
        .send(
          { from: localStorage.getItem('myaddress') },
          function (error, result) {
            if (!error) {
              console.log(result)
              Vue.$toast.warning(
                {
                  component: loadingToast,
                  props: {
                    title:
                      '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
                  },
                },
                {
                  icon: false,
                  timeout: false,
                }
              )
              getxh(14, odid, val, result)
              //执行成功
              resolve()
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

export const addSellOrder = async function (val, oid) {
  return new Promise(async (resolve, reject) => {
    const address = localStorage.getItem('myaddress')
    try {
      var myContract = Contract_EOTC(new Web3(ethereum))
      myContract.methods
        .transferAdd(EthValues(val), oid.toString())
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
            Vue.$toast.warning(
              {
                component: loadingToast,
                props: {
                  title:
                    '等待区块打包确认，<br/>打包期间请不要关闭或刷新该页面',
                },
              },
              {
                icon: false,
                timeout: false,
              }
            )
            getxh(15, oid, val, result)
            //执行成功
            myUsdtAmount()
            resolve()
          } else {
            console.log(error)
            reject(error)
          }
        })
    } catch (err) {
      Vue.$toast.warning(err.message)
      reject(err)
    }
  })
}

//商家从合约订单撤出USDT
export const cancelOrders = async function cancelOrders(oid, val, okFun) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      var valmes
      myContract.methods
        .transferOut(oid.toString(), EthValues(val))
        .send({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
            getxh(16, oid, val, result)
            //执行成功
            resolve()
          } else {
            console.log(error)
            reject('交易失败，网络出了点小问题！')
          }
        })
    } catch (err) {
      reject('交易失败，网络出了点小问题！')
    }
  })
}

function getxh(dtype, oid, val, hx) {
  //dtype:11 用户质押U，12用户释放U，13商家质押U，14商家释放U，15商家追加U,16商家取回U，17仲裁取回U
  GetHx({
    dtype,
    oid,
    val,
    hx,
  }).then((data) => {
    console.log('GetHx', data.data)
  })
}
function EthValues(val, type) {
  //mwei 1000000 gwei:1000000000 ether 1000000000000000000
  val = (val * 1).toFixed(6)
  if (localStorage.getItem('netType') == 'asd' || type) {
    return new Web3(ethereum).utils.toWei(val.toString(), 'mwei')
  } else if (localStorage.getItem('netType') == 'bsc') {
    return new Web3(ethereum).utils.toWei(val.toString(), 'ether')
  }
}

export const dealTransForm = () => {
  return Promise.resolve(Reconstruction_getTrxBalance)
}

export const Reconstruction_getTrxBalance = async function () {
  return new Promise((resolve, reject) => {
    try {
      console.log(111)
      new Web3(ethereum).eth
        .getBalance(localStorage.getItem('myaddress'))
        .then((result) => {
          if (TypeShow(result) >= bscMin) resolve()
          else {
            Vue.$toast.warning(bscMes)
            reject(bscMes)
          }
        })
    } catch (err) {
      Vue.$toast.error(err.message)
      reject(err)
    }
  })
}

export const GetmyUSDT = function (orderID, gusdt, type) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .getInfo_order(orderID.toString())
        .call({ from: address }, function (error, result) {
          if (!error) {
            console.log(result)
            let usdt = TypeShow(result[1]).toFixed(6)
            console.log(usdt)
            console.log(111)
            if (gusdt <= usdt) resolve()
            else {
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
        })
    } catch (err) {
      reject(err)
    }
  })
}
//商家手动校验
export const GetmyUSDT_agree = async function (orderID, type) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .getInfo_order(orderID.toString())
        .call({ from: address }, function (error, result) {
          if (!error) {
            let usdt = TypeShow(result[1]).toFixed(6)
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
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const GetmyUSDT_User = function (orderID, gusdt, fuc) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_EOTC(window.web3)
      myContract.methods
        .getInfo_orderOut(orderID.toString())
        .call({ from: address }, function (error, result) {
          if (!error) {
            let zads = result[2]
            console.log(zads)
            let usdt = TypeShow(result[1]).toFixed(6)
            console.log(usdt)
            if (
              gusdt <= usdt &&
              zads.toLocaleLowerCase() ==
                localStorage.getItem('myaddress').toLocaleLowerCase()
            )
              resolve()
            else reject('订单异常')
          } else {
            reject('操作失败，请刷新重试  ' + error)
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const Reconstruction_verifyUSDT = function verifyUSDT(amount, fuc) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_USDT(window.web3)
      myContract.methods
        .balanceOf(address)
        .call({ from: address }, function (error, result) {
          if (!error) {
            let mynum = TypeShow(result)
            if (mynum >= amount) resolve()
            else {
              reject('钱包余额不足')
              Vue.$toast.warning('钱包余额不足')
            }
            localStorage.setItem('myamount', mynum.toFixed(2))
          } else {
            reject('操作失败，请重试  ' + error)
            Vue.$toast.warning('操作失败，请重试  ' + error)
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const myApprove = async function myApprove(num, func) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_USDT(window.web3)
      myContract.methods
        .allowance(address, contractAddress)
        .call({ from: address }, function (error, result) {
          if (!error) {
            let mnum = TypeShow(result)
            if (mnum >= parseFloat(num)) resolve()
            else reject(1000000, '请先给智能合约授权')
          } else {
            reject('操作失败，请重试  ' + error)
          }
        })
    } catch (err) {
      reject(err)
    }
  })
}

export const Reconstruction_myApprove = async function (num) {
  return new Promise((resolve, reject) => {
    try {
      const address = localStorage.getItem('myaddress')
      var myContract = Contract_USDT(new Web3(ethereum))
      myContract.methods
        .allowance(address, contractAddress)
        .call({ from: address }, function (error, result) {
          if (!error) {
            let mnum = TypeShow(result)
            if (mnum >= parseFloat(num)) resolve()
            else {
              Reconstruction_usdtsend(1000000).then((res) => {
                resolve('授权成功')
              })
            }
          } else {
            console.warn(error)
            reject('操作失败，请重试  ' + error)
          }
        })
    } catch (err) {
      Vue.$toast.warning(err.message)
      console.warn(err)
      reject(err)
    }
  })
}

export const Approve = async function (func) {
  const address = localStorage.getItem('myaddress')
  console.log(address)
  let myContract = Contract_USDT(new Web3(ethereum))
  console.log(myContract)
  myContract.methods
    .allowance(address, contractAddress)
    .call({ from: address }, function (error, result) {
      if (!error) {
        console.log(result)
        console.log(TypeShow(result))
        let limit = TypeShow(result)
        return limit
      } else {
        eotcmes('操作失败，请重试  ' + error)
      }
    })
}

export const sfeotc = function (func) {
  func()
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
