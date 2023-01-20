
import { userSign } from "@/utils/web3"

//let address = "";
let cutdownFlag = true;
let isok = false;
function jiaoyi(val) {
    window.location.href = "index.html?id=" + val;
}

import $router from "@/router"
import { Toast } from 'vant';

import {
    GetCode, RegEotc
} from "@/api/trxRequest"
// import router from '@/router';

function fmenu() {
    var fhmh = document.getElementById("fhmh");
    var dmenu = document.getElementById("dmenu");
    if (fhmh.getAttribute("data-dropdowns") != "nav") {
        fhmh.setAttribute("data-dropdowns", "nav");
        dmenu.setAttribute("data-dropdowns", "true");
    }
    else {
        fhmh.setAttribute("data-dropdowns", "");
        dmenu.setAttribute("data-dropdowns", "");
    }
}


export const yzm = function (email) {
    return new Promise(function (resolve, reject) {
        Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中',
        });
        var mail = email
        var reg0 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reg0.test(mail)) {
            Toast('电子邮箱格式有误');
            reject()
            return
        }
        GetCode({ regPhone: email }).then(data => {
            //console.log('成功', data)
            Toast.clear()
            Toast.success('成功')
            resolve()
        }).catch(err => {
            Toast.clear()
            //console.log('失败', err)
            if (err.response.status == 429) {
                Toast.fail('操作频繁')
                reject()
            }
        })
    })
}
// function test() {
//     window.switched(); // 直接通过window方法去调用methods中对应方法
//     }
export const reg = function (that, value1, wallet, email, verification, loginStatic, invite = '', checked = '') {
    // //console.log('win',Window)

    //console.log('this', that)
    //钱包地址
    var wallet_ads = wallet;
    //邮箱
    var mail = email
    //验证码
    var code1 = verification
    //邀请码
    var yqm = invite
    //网络
    // 测试网络固定
    // var otype= localStorage.getItem("netType")
    // var otype = value1

    var sign = localStorage.getItem("mysign");


    //用户协议
    var isok = checked
    // let signMes="EOTC请求您签名确认,签名不消耗GAS."

    var reg0 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var reg1 = /^\d{6}$/;
    var reg2= /[@]/im;
    console.log(sign)
    if (sign == null || sign == "") {
        // console.log(window.signMes)
        userSign(signMes);
        return false;
    }
    if (wallet_ads.length < 30) {
        Toast("钱包地址获取失败");
        return false;
    }
    if (!reg0.test(mail)) {
        Toast("邮箱输入错误");
        return false;
    }
    if (yqm != "") {
        if(reg2.test(yqm)){
            Toast('请输入推荐人UID或者钱包地址')
            return false;
        }
        if (!reg1.test(yqm)) {
            if (yqm == wallet_ads || (yqm.length != 42 && yqm.length != 34)) {
                Toast("请输入正确的邀请码");
                return false;
            }
        }
    }
    if (loginStatic == 0) {
        if (!isok) {
            Toast("请阅读用户协议");
            return false;
        }
    }


    if (code1.length > 5) {
        if (loginStatic == 0) {
            RegEotc({ userid: mail, pwd: wallet_ads, yzm: code1, pid: yqm, sign: sign }).then(data => {
                //console.log(data)
                var it = data.data;
                if (it.State != "x" &&it.State !=0) {
                    Toast.success('注册成功');
                    $router.push({
                        name: "index"
                    })
                }
                else{
                    Toast.fail('验证码或邀请码不正确');
                }
            })
        } else {
            RegEotc({ userid: mail, pwd: wallet_ads, yzm: code1, pid: yqm, sign: sign }).then(data => {
                var it = data.data;
                if (it.State == 3) {
                    Toast.success('登录成功');
                    $router.push({
                        name: "index"
                    })
                }
                else if (it.State == 'x') {
                    Toast.fail('验证码不正确');
                } else {
                    Toast.fail('用户尚未注册');
                    that.switched()
                    return false

                }
            })
        }
    }
    else Toast("请输入正确的验证码");
}