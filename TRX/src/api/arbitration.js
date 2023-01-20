import http from "./http"

// 列表
export const list = (type) => http.post('/api/arbitrate/getuserarbitrate', {type})
// 仲裁员公示
export const publicityPersonList = () => http.post('/api/arbitrate/getarbitrators')
// 仲裁案公示
export const publicityCaseList = () => http.post('/api/arbitrate/getarbitrateinfo')
// 详情
export const detail = (id) => http.post('/api/arbitrate/getarbitratedetails', {arbitrateInfoId: id})
// 取消仲裁
export const cancel = (id) => http.post('/api/arbitrate/cancelarbitrate', {arbitrateInfoId: id})
// 申请延期
export const delay = (data) => http.post('/api/arbitrate/arbitratedelay', data)
// 追加举证
export const append = (data) => http.post('/api/arbitrate/addadducelist', data)
// 上传图片
export const upload = (data) => http.post(`/api/destruction/uploadimage?type=additionalProof`, data, {headers: {'Content-Type': 'multipart/form-data'}})
// 获取水印图片
export const getImg = (path) => http.post(`/api/user/getauthimage`, {path}, {responseType: 'blob'})