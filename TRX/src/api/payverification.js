import request from "@/utils/request";
import { getItem } from "@/utils/storage";

function postAPIURL(url) {
  return "/api/Post/" + url;
}

// 购买出售权限验证所需要的数据
export const payInfoUser = function () {
  //是否已实名  0 未实名  1 已提交 未审核或 审核未通过  2 实名认证审核通过
  // w先实名才能购买 or 出售
  const iskyc = localStorage.getItem("iskyc");
  //当前购买订单号，0表示当前无购买单   每次购买 必须先处理上一次的订单
  // 0 表示 没有订单，
  const xdnum = localStorage.getItem("xdnum");
  // 当前出售订单号，0表示当前无出售单
  //只能 挂一个出售单
  const csnum = localStorage.getItem("csnum");

  const userdsx = localStorage.getItem("userdsx"); //取消下单的次数(每日清零)  max 8次
  const myjifen = localStorage.getItem("myjifen"); //用户积分 至少10分才能 购买 or 出售

  return {
    iskyc,
    xdnum,
    csnum,
    userdsx,
    myjifen,
  };
};

//退出时 清空本地存储内容
export const clearmymes = function () {
  localStorage.removeItem("myaddress");
  localStorage.removeItem("mysign");
  localStorage.removeItem("email");
  localStorage.removeItem("uname");
  localStorage.removeItem("ucid");
  localStorage.removeItem("uid");
  localStorage.removeItem("parentID");
  localStorage.removeItem("uphone");
  localStorage.removeItem("myamount");
  localStorage.removeItem("usdtsq");
  localStorage.removeItem("xdnum");
  localStorage.removeItem("mybank");
  localStorage.removeItem("myalipay");
  localStorage.removeItem("mywechat");
  localStorage.removeItem("tcoin");
  localStorage.removeItem("csnum");
  localStorage.removeItem("myeotc");
  localStorage.removeItem("shnum");
  localStorage.removeItem("bsnum");
  localStorage.removeItem("eotcAmount");
  localStorage.removeItem("myjifen");
};

/**
 *
 * @param {*} param0
 * @returns
 */

export const Verification_UserXbuyOrder_before = ({
  oid,
  cnyNum,
  dsx,
  userPay,
}) => {
  const params = {
    uid: getItem("uid"),
    sign: getItem("mysign"),
    ads: getItem("myaddress"),
    oid, // 总订单id
    cnyNum, // 本次购买 usdt 数量
    dsx, // 订单价格状态
    userPay, // 用户选择的支付方式
  };
  return request({
    method: "POST",
    url: postAPIURL("UserXbuyOrder"),
    params,
  });
};

/**
 *
 * @param {*} uid
 * @param {*订单编号} oid
 * @param {*xnum 出售usdt num} gnum
 * @param {*} dsx
 */
export const Verification_order_before = ({
  uid = localStorage.getItem("uid"),
  oid,
  gnum,
  dsx,
  ads = localStorage.getItem("myaddress"),
}) => {
  const params = {
    uid,
    oid,
    gnum,
    dsx,
    ads,
    sign: getItem("mysign"),
  };
  return request({
    method: "POST",
    url: postAPIURL("UserXsellOrder"),
    params,
  });
};

/**
 * 根据订单id 获取聊天 token
 * https://test.dsufhldskld.site/api/EOTC/Getwsid
 * @param {* otype} 0用户购买  1 用户出售
 *  @param {* user} 0用户  1 商家
 *  @param {* oid}  子订单编号
 *  @param {* uid}
 *  @param {* sign}
 * @returns
 */
export const Getwsid = ({ otype = 0, user = 0, oid }) => {
  const params = {
    otype,
    user,
    oid,
    uid: getItem("uid"),
    sign: getItem("mysign"),
  };
  return request({
    method: "post",
    url: "/api/EOTC/Getwsid",
    params,
  });
};

/**
 *
 * @returns 获取聊天记录 接口
 *
 */

export const GetOidMsg = ({ oid, page }) => {
  const params = {
    oid,
    page,
    pid: 99999999,
  };
  console.log(params);
  return request({
    method: "post",
    url: "/api/EOTC/GetOidMsg",
    params,
  });
};

export const OrderAudit = ({ oid, rcoin = 0 }) => {
  const params = {
    uid: getItem("uid"),
    sign: getItem("mysign"),
    oid,
    rcoin,
  };
  return request({
    method: "POST",
    url: "/api/EOTC/OrderAudit",
    params,
  });
};

//收款 支付方式
export const myPayment = function () {
  //收款 支付方式
  const mybank = localStorage.getItem("mybank"); //收款银行卡
  const myalipay = localStorage.getItem("myalipay"); //收款支付宝
  const mybmywechatnk = localStorage.getItem("mywechat"); //收款微信

  return {
    mybank,
    myalipay,
    mybmywechatnk,
  };
};

// 根据总订单 获取商家信息
export const Getsjmes = (id) => {
  return request({
    method: "Post",
    url: postAPIURL("Getsjmes"),
    params: {
      id,
    },
  });
};

//  获取用户自己 基本信息
export const Bususer = () => {
  return request({
    method: "post",
    url: postAPIURL("Bususer"),
    params: {
      uid: getItem("uid"),
    },
  });
};

/**
 * 修改商家信息
 * @param {* 商家姓名} sname
 * @param {* 电话号码} stel
 * @param {* 收购信息提示} mes
 * @param {* 出售信息提示} smes
 */
export const SetBususer = ({ sname, stel, mes = "", smes = "" }) => {
  const params = {
    uid: localStorage.getItem("uid"),
    sign: localStorage.getItem("mysign"),
    sname,
    stel,
    mes,
    smes,
  };
  return request({
    method: "Post",
    url: postAPIURL("SetBususer"),
    params,
  });
};

// 修改收付款信息

export const SetPayType = ({ type, pay }) => {
  const params = {
    uid: getItem("uid"),
    sign: getItem("mysign"),
    type,
    pay,
  };

  return request({
    method: "POST",
    url: postAPIURL("SetPayType"),
    params,
  });
};

// 挂出售单
export const CheckSellOrder = () => {
  const params = {
    uid: getItem("uid"),
    ads: getItem("myaddress"),
    sign: getItem("mysign"),
  };
  return request({
    method: "POST",
    url: postAPIURL("CheckSellOrder"),
    params,
  });
};

// token 认证
// 自动转账

export const AutoCoin = (type, token) => {
  return request({
    method: "POST",
    url: "/api/EOTC/AutoCoin",
    params: {
      token,
      type,
    },
  });
};
