import http from '@/api/http'

export const submit = (data) => http.post('/api/arbitrate/addarbitrateinfo', data)
// 上传图片
export const upload = (data) => http.post(`/api/destruction/uploadimage?type=arbitration`, data, {headers: {'Content-Type': 'multipart/form-data'}})