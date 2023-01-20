window.onload = function () {
    let kyc = localStorage.getItem("iskyc");
    let sub = document.getElementById("upJQuery");
    if (kyc == "0") {
        sub.setAttribute("onclick", "submes()");
        document.getElementById("kyc").style.display = "";
    }
    else if (kyc == "1") {
        sysMes("身份认证信息审核中...", function () {
            history.go(-1);
        });
    } else {
        let n = "";
        let name = localStorage.getItem("uname");
        let phone = localStorage.getItem("uphone");
        let cid = localStorage.getItem("ucid");
        // let ads = localStorage.getItem("");
        for (i = 1; i < name.length; i++)n += "*";
        document.getElementById("name").innerText = name.substring(0, 1) + n;
        document.getElementById("email").innerText = localStorage.getItem("email");
        document.getElementById("uphone").innerText = phone.substring(0, 3) + "****" + phone.substring(phone.length - 4);
        document.getElementById("cid").innerText = cid.substring(0, 2) + "**************" + cid.substring(cid.length - 2);
        // document.getElementById("myads").innerText = ads.substring(0, 10) + "..." + ads.substring(ads.length - 10);
        document.getElementById("kycmes").style.display = "";
    }
}
let yanzheng = 0;
let reader = new FileReader();
let img = new Image();
let eleFile = document.querySelector('#proof');
let eleFile1 = document.querySelector('#proof1');
let eleFile2 = document.querySelector('#proof2');
let proof_img;
let fileZip;
// base64地址图片加载完毕后      
img.onload = function () {
    var originWidth = this.width, //image resize   压缩后的宽
        originHeight = this.height,
        maxWidth = 720, maxHeight = 720,
        quality = 0.7, //image quality  压缩质量
        canvas = document.createElement('canvas'),
        drawer = canvas.getContext("2d");
    // alert(this.width+"---"+ this.height);
    //  drawer.rotate(Math.PI / 2);
    canvas.width = maxWidth;
    canvas.height = originHeight / originWidth * maxWidth;
    drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
    var base64 = canvas.toDataURL("image/jpeg", quality); // 这里就拿到了压缩后的base64图片
    //console.log(base64);
    //blob对象
    canvas.toBlob(function (blob) {
        //console.log(blob)
    }, "image/jpeg", quality);
    fileZip = dataURLtoFile(base64, "id.jpg");
    proof_img.src = base64;
};
//base64转file
//filename图片的名字dataurl是base64地址
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
// 文件base64化，以便获知图片原始尺寸
reader.onload = function () {
    //reader.result就是base64
    img.src = reader.result;
};
function upimages() {
    var upfile = this.files[0];
    // 选择的文件是图片
    if (upfile.type.indexOf("image") == 0) {
        //console.log(file);
        if (upfile.size > 307200) {//300K以上的图片都需要压缩
            // fzname = upfile.name;
            reader.readAsDataURL(upfile); //以数据url的方式读取文件内容 
        }
        else {
            fileZip = upfile;
            if (window.FileReader) {
                var r1 = new FileReader();
                r1.readAsDataURL(upfile);
                r1.onloadend = function (e) {
                    proof_img.src = e.target.result;
                    // $("#proof_img").attr("src", e.target.result);
                };
            }
        }
    } else {
        eleFile.value = "";
        eotcmes('请选择图片文件');
    }
}
eleFile.addEventListener('change', upimages);
eleFile1.addEventListener('change', upimages);
eleFile2.addEventListener('change', upimages);
function submes() {
    if (yanzheng == 0) {
        var reg0 = /[\u4e00-\u9fa5]/gm;
        var reg1 = /^(\+?86)?(1[3456789]\d{9})$/;
        var reg2 = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        var uname = document.getElementById("uname").value;
        var phone = document.getElementById("phone").value;
        var userid = document.getElementById("userid").value;
        if (uname.length < 2) {
            dismesq("姓名填写错误");
            return false;
        }
        if (phone.length < 7) {
            dismesq("手机号码错误");
            return false;
        }
        // if (!reg2.test(userid)) {
        if (userid.length < 8) {
            dismesq("身份证号码错误");
            return false;
        }

        $(this).prop("onclick", null).off("click");
        $.ajax({
            url: postAPIURL() + 'SetUID',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: { username: uname, uid: localStorage.getItem("uid"), myzd: phone, ccid: userid, ads: "" },
            type: 'post',
            success: function (data) {
                var it = eval(data);
                if (it.State != "-1") {
                    yanzheng = 1;
                    document.getElementById("update0").style.display = "none";
                    document.getElementById("update1").style.display = "";
                    proof_img = document.getElementById("proof_img");
                }
                else eotcmes('证件号码已被认证');
                $(this).bind('click', submes);
            }
        });
    }
    else if (yanzheng == 1) {
        updateImg('#proof');
    }
    else if (yanzheng == 2) {
        updateImg('#proof1');
    }
    else if (yanzheng == 3) {
        updateImg('#proof2');
    }
}
function updateImg(proof) {
    if ($(proof).val() == '') {
        eotcmes('无证件图片');
        return;
    }
    $("#upJQuery").prop("onclick", null).off("click");
    var fd = new FormData();
    fd.append("uid", localStorage.getItem("uid"));
    fd.append("ctype", yanzheng);
    fd.append("proof", fileZip);
    $.ajax({
        url: postAPIURL() + "Update",
        type: "POST",
        cache: false,
        processData: false,
        contentType: false,
        data: fd,
        success: function (data) {
            var it = eval(data);
            if (it.State != "x") {
                if (yanzheng == 1) {
                    document.getElementById("update1").style.display = "none";
                    document.getElementById("update2").style.display = "";
                    proof_img = document.getElementById("proof_img1");
                    eotcmes("请上传身份证背面图片");
                }
                else if (yanzheng == 2) {
                    document.getElementById("update2").style.display = "none";
                    document.getElementById("update3").style.display = "";
                    proof_img = document.getElementById("proof_img2");
                }
                else if (yanzheng == 3) {//认证信息提交完毕
                    localStorage.setItem("iskyc", 1);
                    document.getElementById("upJQuery").style.display = "none";
                    document.getElementById("proof2").style.display = "none";
                    eotcmes("认证信息提交成功");
                }
                yanzheng++;
            }
            $("#upJQuery").bind('click', submes);
        }
    });
}