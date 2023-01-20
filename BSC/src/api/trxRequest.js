import request from "@/utils/request";
import utils from "@/utils/utils";

import { axiosAutoTry } from "./autoRequest";

function postAPIURL(url) {
  return "/api/Post/" + url;
}

import { getItem } from "@/utils/storage";

// 购买 出售 主页默认加载数据
export const EotcBuyOrder = (
  { pay = "0", amount = "0", dtype = "0", otype = getItem("netType") } = {
    pay: "0",
    amount: "0",
    dtype: "0",
    otype: getItem("netType"),
  }
) => {
  const config = {
    method: "POST",
    url: postAPIURL("EotcBuyOrder"),
    data: utils.initFormData({
      pay,
      amount,
      dtype,
      otype,
    }),
    __try_count: 3, //重试次数
  };

  return axiosAutoTry(config);
};

// 购买 出售 数据 筛选！！

export const UserBind = ({ gid = 0, type }) => {
  return request({
    method: "POST",
    url: "/api/EOTC/UserBind",
    params: {
      uid: localStorage.getItem("uid"),
      gid,
      type,
    },
  });
};

export const SetCoinAds = ({
  id = getItem("uid"),
  num = "0",
  ads = getItem("myaddress"),
  otype = getItem("netType"),
}) => {
  const data = utils.initFormData({
    id,
    num,
    ads,
    otype,
  });

  return request({
    method: "POST",
    url: `/api/Post/SetCoinAds`,
    data,
  });
};

// 用户和商家质押相关
export const GetHx = ({ dtype, uid = getItem("uid"), oid, val, hx }) => {
  const data = utils.initFormData({
    dtype,
    uid,
    oid,
    val,
    hx,
  });

  return request({
    method: "POST",
    url: `/api/Post/Gethx`,
    data,
  });
};

// app 加载时  自动连接钱包
export const EotcLoginmes = ({ wallet }) => {
  const data = {
    wallet,
    otype: getItem("netType"),
    sign: getItem("mysign"),
  };

  return request({
    method: "POST",
    url: `/api/Post/EotcLoginmes`,
    params: data,
  });
};

// 登录注册  获取验证码   一分钟一次
export const GetCode = ({ regPhone = "" }) => {
  const params = {
    regPhone,
  };
  return request({
    method: "GET",
    url: `/api/UserInfo/GetCode`,
    params,
  });
};

// 登录 注册 api
export const RegEotc = ({
  userid,
  pwd,
  yzm,
  pid,
  sign,
  otype = localStorage.getItem("netType"),
}) => {
  const data = {
    userid,
    pwd,
    yzm,
    pid,
    sign,
    otype,
  };

  return request({
    method: "POST",
    url: `/api/Post/RegEotc`,
    params: data,
  });
};
//基本信息验证
export const SetUID = ({
  username,
  uid = localStorage.getItem("uid"),
  myzd,
  ccid,
  sign,
  ads = "",
}) => {
  const params = { username, uid, myzd, ccid, sign, ads };
  return request({
    method: "POST",
    url: `/api/Post/SetUID`,
    params,
  });
};
//身份验证失败获取失败数据
export const GetKycMes = ({ uid = localStorage.getItem("uid") }) => {
  const params = { uid };
  return request({
    method: "GET",
    url: `/api/UserInfo/GetKycMes`,
    params,
  });
};

//图片上传
export const Update = (data) => {
  // const params = data
  return request({
    method: "POST",
    url: `/api/Post/Update`,
    data,
  });
};

//聊天图片上传
export const ChatUpdate = (data) => {
  // const params = data
  return request({
    method: "POST",
    url: `/api/OTC/UpdateImg`,
    data,
  });
};

//审核数据获取、通过、打回
export const EotcKyc = ({
  pid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
  uid = 0,
  kyc = 0,
  msg = "",
}) => {
  const params = { pid, sign, uid, kyc, msg };
  return request({
    method: "POST",
    url: `/api/EOTC/Eotc_Kyc_bak`,
    params,
  });
};
//释放EOTC
export const Get_MyEOTC = ({
  uid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
}) => {
  const params = { uid, sign };
  return request({
    method: "POST",
    url: `/api/Post/Get_MyEOTC`,
    params,
  });
};

//商家USDT余额不足校验
export const VerifyOrder = ({
  ads = localStorage.getItem("myaddress"),
  sign = localStorage.getItem("mysign"),
  id,
  num,
  type
}) => {
  const params = { ads, sign,id,num,type };
  return request({
    method: "POST",
    url: `/api/OTC/VerifyOrder`,
    params,
  });
};

//防止误触
export const VerifyReleaseCoins = ({
  ads=localStorage.getItem("myaddress"),
  sign=localStorage.getItem("mysign"),
  oid 
}) => {
  const params = { oid, ads,sign };
  return request({
    method: "POST",
    url: `/api/EOTC/VerifyReleaseCoins`,
    params,
  });
};

//加速
export const myeotc_js = ({
  uid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
}) => {
  const params = { uid, sign };
  return request({
    method: "POST",
    url: `/api/Post/myeotc_js`,
    params,
  });
};
//获取团队人员列表
export const GetMyTeams = ({
  uid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
}) => {
  const params = { uid, sign };
  return request({
    method: "POST",
    url: `/api/EOTC/GetMyTeams`,
    params,
  });
};
//查看钱包
export const MemberWallet = ({
  uid,
  net = localStorage.getItem("netType"),
}) => {
  const params = { uid, net };
  return request({
    method: "POST",
    url: `/api/EOTC/MemberWallet`,
    params,
  });
};
//查看收益明细
export const GetSymx = ({
  uid = localStorage.getItem("uid"),
  // uid=205433
}) => {
  const params = { uid };
  return request({
    method: "POST",
    url: `/api/Post/GetSymx`,
    params,
  });
};

//获取推荐人信息
export const PidMsg = ({
  uid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
  // uid=205433
}) => {
  const params = { uid, sign };
  return request({
    method: "POST",
    url: `/api/EOTC/PidMsg`,
    params,
  });
};

//获取和设置自身电报群
export const SetTelegram = ({
  uid = localStorage.getItem("uid"),
  sign = localStorage.getItem("mysign"),
  telegram = "",
}) => {
  const params = { uid, sign, telegram };

  return request({
    method: "POST",
    url: `/api/EOTC/SetTelegram`,
    params,
  });
};

export const StakingEotc = ({
  ads = localStorage.getItem("myaddress"),
  sign = localStorage.getItem("mysign"),
  net = localStorage.getItem("netType"),
  num,
  zq,
  hx='node'
}) => {
  const params = { ads, sign, net, num, zq,hx};

  return request({
    method: "POST",
    url: `/api/EOTC/StakingEotc`,
    params,
  });
};
//充值
export const Recharge = ({
  ads = localStorage.getItem("myaddress"),
  uid = localStorage.getItem("uid"),
  net,
  hx,
  usdt,
}) => {
  const params = { ads, uid, net,usdt,hx};

  return request({
    method: "POST",
    url: `/api/EOTC/Recharge`,
    params,
  });
};
//充值记录
export const RechargeList = ({
  ads = localStorage.getItem("myaddress"),
  uid = localStorage.getItem("uid"),
}) => {
  const params = { ads, uid};

  return request({
    method: "POST",
    url: `/api/EOTC/RechargeList`,
    params,
  });
};

/**
 * !挂 一个购买单
 * @param {*价格} cny
 * @param {*数量} num
 * @param {*最小金额} amount1
 * @param {*最大金额} amount2
 * @param {*} id   1
 * @param {*} did  0
 * cash -1 只接受现金    1 可接受现金
 */

export const addOrder = ({
  cny,
  num,
  amount1,
  amount2,
  cash = 0,
  did = 0,
  type = 1,
}) => {
  const params = {
    cny,
    num,
    amount1,
    amount2,
    uid: getItem("uid"),
    ads: getItem("myaddress"),
    otype: getItem("netType"),
    sign: getItem("mysign"),
    type, // 1收购  0出售
    did, // 固定值 意义暂定
    cash, // 1可接受现金  -1 只接受现金
  };

  return request({
    method: "POST",
    url: "/api/Post/BususerSet",
    params,
  });
};

/**
 * !获取收购单列表
 * @param {*uid} uid
 * @param {*type} type  11 收购单总列表     10出售单列表
 * @param {*ads} ads
 */

export const Order_sj = ({ type = 11 } = { type: 11 }) => {
  const params = {
    method: "POST",
    url: postAPIURL("Order_sj"),
    params: {
      uid: getItem("uid"),
      ads: getItem("myaddress"),
      type, // 收购
    },
    // delayTimes: 2,
    __try_count: 10, // 重试次数
  };

  return axiosAutoTry(params);
};

/**
 * type t1 t2  状态组合区分  11 0 2 商家待处理订单
 * type t1 t2   11 1  3  商家已完成订单
 * type t1 t2   10 -1 2  商家未完成订单
 * type t1 t2   1 -1  2  用户未完成订单
 * type t1 t2   1  1  4  用户已完成订单
 * type t1 t2   1  3  10 其他状态的订单
 * @param {* 11 收购订单} type  11
 * @param {* } t1  -- -1
 * @param {* } t2  -- 2
 */

export const Eotcdis_Order = ({
  uid = getItem("uid"),
  type = 11, //  11 双位数是商家   1 个位数是用户
  ads = getItem("myaddress"),
  t1 = 0,
  t2 = 2,
}) => {
  // 返回数据值参考
  //     "dsx": "1",
  // 0 用户下单，订单已经生成，但未转币到合约。
  // 1 商家收购待处理单,商家未付款  2 商家已付款，等待合约放币
  // 3 已完成
  // },

  const params = {
    method: "POST",
    url: postAPIURL("EotcdisOrder"),
    data: utils.initFormData({
      uid,
      type,
      ads,
      t1,
      t2,
    }),
    // delayTimes: 2,
    __try_count: 3, // 重试次数
  };

  return axiosAutoTry(params);
};

/**
 * !修改收购单
 * @param {*uid} uid
 * @param {*type} type  11 收购单列表
 * @param {*ads} ads
 */

export const UPdateOrder_sj = ({
  cny = 0,
  num,
  amount1 = 0,
  amount2 = 0,
  did,
  type = 1,
}) => {
  const params = {
    cny,
    num,
    amount1,
    amount2,
    type, // 1收购  0出售
    did, // 订单号
    uid: getItem("uid"),
    sign: getItem("mysign"),
  };
  return request({
    method: "POST",
    url: "/api/Post/UPdateOrder_sj",
    params,
  });
};

/**
 * !~购买 or 出售 转币到合约
 * @param {*} id
 * @param {*订单 oid 子订单号} oid
 * @param {*价格} cny
 * @param {*邮箱} mail
 * @param {* selectpayk 用户的收款方式 } selectpayk
 */
export const subbuysellorder = ({
  oid,
  cny = 0,
  mail = "",
  selectpayk,
  type,
}) => {
  const params = {
    uid: getItem("uid"),
    oid,
    cny,
    mail,
    pay: selectpayk,
    type,
    sign: getItem("mysign"),
  };

  return request({
    method: "POST",
    url: "/api/Post/buyCoin", //购买或出售 货币
    params,
  });
};

/**
 *!商家更新订单状态， 待付款 更新成 已付款
 *!确认已收款 进行放币  订单完成
 * @param {* 用户id} uid
 * @param {* 子订单id} did
 * @param {* 默认值 11 }  type  11 收购单  10 出售单    12 给收购单放币
 * @param {*} mail  用户邮箱 or 商家邮箱（ 放币给商家 ）
 * @param {*} busPay  用户 收款方式
 */
export const UpdateOrderType = ({
  uid = localStorage.getItem("uid"),
  did,
  type = 11,
  mail,
  busPay = "",
}) => {
  const params = {
    uid,
    did,
    type,
    mail,
    busPay,
  };
  return request({
    method: "POST",
    url: postAPIURL("UpdateOrderType"),
    params,
  });
};

/**
 *
 * @param {* 根据订单获取商家地址} uid
 * @returns
 */
export const GetBusinessAds = (oid) => {
  return request({
    method: "post",
    url: postAPIURL("GetBusinessAds"),
    params: {
      oid,
    },
  });
};

/**
 * 催付款 催放币
 */
export const Reminders = (params) => {
  return request({
    method: "Post",
    url: "/api/EOTC/Reminders",
    params,
  });
};

/**
 *  UpdateOrder  更新订单顺序！
 *  oid
 */

export const UpdateOrder = (eid) => {
  return request({
    method: "Post",
    url: "/api/EOTC/UpdateOrder",
    params: {
      eid,
    },
  });
};

/**
 * 商家 取消订单
 * id 子订单id
 * eid 商家uid
 * oid 大订单id 7**
 * ads 用户钱包地址
 */

export const cancel_order = ({ id, oid, ads }) => {
  console.log({
    id,
    eid: localStorage.getItem("uid"),
    ads,
    oid,
  });
  return request({
    method: "Post",
    url: "/api/EOTC/CancelOrder",
    params: {
      id,
      eid: localStorage.getItem("uid"),
      ads,
      oid,
    },
  });
};
//获取质押记录
export const MyStakeList = ({
  ads=localStorage.getItem('myaddress'),
  net=localStorage.getItem('netType'),
  zq=0
}) => {
  const params = {
    ads,net,zq
  };
  return request({
    method: "POST",
    url: "/api/EOTC/MyStakeList",
    params,
  });
};

//申诉提交
export const Petition = ({
  uuid=localStorage.getItem('uid'),
  oid,
  type,
  msg
}) => {
  const params = {
    uuid,
    oid,
    msg,
    type,
  };

  return request({
    method: "POST",
    url: "/api/OTC/Petition", //购买或出售 货币
    params,
  });
};
//查询otc交易总量
export const TradingVolume = () => {
  return request({
    method: 'GET',
    url: `/api/OTC/TradingVolume`,
  })
}