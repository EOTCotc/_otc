import http from './http'

// 获取仲裁消息列表
export const getarbitratemessage = (data) => {
  return http({
    url: '/api/arbitrate/getarbitratemessage',
    method: 'POST',
    data,
  })
}

// 获取仲裁消息列表
export const getmessageopen = (data) => {
  return http({
    url: '/api/arbitrate/getmessageisopen',
    method: 'POST',
    data,
  })
}

// 获取原被告延期消息
export const getarbitratedelay = (data) => {
  return http({
    url: '/api/arbitrate/getarbitratedelay',
    method: 'POST',
    data,
  })
}

// 申请延期投票
export const arbitratedelayvote = (data) => {
  return http({
    url: '/api/arbitrate/arbitratedelayvote',
    method: 'POST',
    data,
  })
}

// 追加举证
export const getadducelist = (data) => {
  return http({
    url: '/api/arbitrate/getadducelist',
    method: 'POST',
    data,
  })
}

// 获取取消仲裁消息
export const getcancelarbitrate = (data) => {
  return http({
    url: '/api/arbitrate/getcancelarbitrate',
    method: 'POST',
    data,
  })
}

// 结案通知
export const getclosure = (data) => {
  return http({
    url: '/api/arbitrate/getclosure',
    method: 'POST',
    data,
  })
}

// 设置消息为已读
export const setmessageisopen = (data) => {
  return http({
    url: '/api/arbitrate/setmessageisopen',
    method: 'POST',
    data,
  })
}

// 获取未处理消息
export const pendingMsg = () => {
  return http({
    url: '/api/arbitrate/getwaitmessage',
    method: 'POST',
  })
}

// 获取积分
export const getcreditscorebyuid = ({ uid = localStorage.getItem('uid') }) => {
  const params = { uid }
  return http({
    url: `/api/creditscore/getcreditscorebyuid`,
    method: 'GET',
    params,
  })
}

// 获取用户风险等级
export const getuserrisklevel = () => {
  return http({
    url: '/api/risk/getuserrisklevel',
    method: 'POST',
  })
}
//设置风控
export const userrisklevel = ({
  walletAddress = localStorage.getItem('myaddress'),
  otype = localStorage.getItem('netType'),
  sign = localStorage.getItem('mysign'),
  level = 2,
  reason = '风控',
}) => {
  const data = { walletAddress, otype, sign, level, reason }
  return http({
    url: `/api/risk/userrisklevel`,
    method: 'POST',
    data,
  })
}
// 获取社区名字
export const getinfo = ({ uid = localStorage.getItem('uid') }) => {
  const params = { uid }
  return http({
    url: `/api/user/getinfo`,
    method: 'GET',
    params,
  })
}
//首次添加收付款方式增加信用分
export const addpayscore = ({ uid = localStorage.getItem('uid') }) => {
  const params = { uid }
  return http({
    url: `/api/creditscore/addpayscore`,
    method: 'GET',
    params,
  })
}
