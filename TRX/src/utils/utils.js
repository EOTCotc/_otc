import {Toast, Notify} from 'vant'
import dayjs from 'dayjs'

Toast.allowMultiple()

// 0 0 0 trx
function initFormData(data) {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value)
  }

  return formData
}


export default {
  initFormData
}

export const paytype = (value) => {
  switch (value) {
    case "yhk":
      return "银行卡";
    case "zfb":
      return "支付宝";
    case "wx":
      return "微信支付";
    case "xj":
      return '现金'
  }
}

// 浏览远程图片
export function spliceSrc(src) {
  return `http://192.168.2.110:5555/${src}`
}

export function $toast(type = 'success', message, cb, duration = 2000) {
  return Toast[type]({
    forbidClick: true,
    message,
    duration,
    onClose: () => {
      cb && cb()
    }
  })
}

export function $notify(type = 'success', message, cb, duration = 1500) {
  return Notify({
    type: type,
    message,
    duration,
    onClose: () => {
      cb && cb()
    }
  })
}

export function $loading(message) {
  return Toast.loading({
    forbidClick: true,
    message,
    duration: 0
  })
}

// 日期格式转换
export function transformDate(str) {
  return dayjs(str).add('-8', 'hour').format('YYYY-MM-DD HH:mm:ss')
}

// 获取仲裁事件类型
export function getArbitrateType(type) {
  const arr = ['账户被冻结', '卖家未确认收款', '其他', '仲裁异议']
  return arr[type]
}
