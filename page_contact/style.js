window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})

//Form validate project
/*
fname: isRequired isName
lname: isRequired isName
email: isRequired isEmail
subject: isRequired
message: isRequired min(10) max(40)
*/

const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

//Các hàm check valid
const isRequired = (value) => (value ? "" : "that field is required!");
const isName = (value) => (REG_NAME.test(value) ? "" : "name is invalid!");
const isEmail = (value) => (REG_EMAIL.test(value) ? "" : "email is invalid!");
const min = (numBound) => (value) => (value.length >= numBound ? "" : `Min is ${numBound}!`);
const max = (numBound) => (value) => (value.length <= numBound ? "" : `Max is ${numBound}!`);

//viết thử object để xài cấu trúc observer design pattern
// let fnameNode = document.querySelector("#fname");
/*
{
    value: fnameNode.value
    funcs: [isRequired, isName]
    parentNode: fnameNode.parentElement
    controlNodes: [fnameNode]
}
*/
//createMsg: thông báo lỗi
const createMsg = (parentNode, controlNodes, msg) => {
    //tạo ra div lỗi
    let invalidMsg = document.createElement("div");
    //nhét lỗi vào
    invalidMsg.innerHTML = msg;
    //hiện đỏ cho câu chửi
    invalidMsg.classList.add("invalid-feedback");
    //nhét div vào cha
    parentNode.appendChild(invalidMsg);
    //thêm đỏ cho ô input
    controlNodes.forEach((inputNode) => {
        inputNode.classList.add("is-invalid");
    });
};
//test
// let fnameNode = document.querySelector("#fname");
// createMsg(fnameNode.parentElement, [fnameNode], "dog");

const isValid = ({value, funcs, parentNode, controlNodes}) => {
    //kiểm tra value thử bằng các hàm
    for (const functionCheck of funcs) {
        if(functionCheck(value)){//nếu ra lỗi thì hứng lỗi rồi dừng và tạo ra lỗi và trả ra lỗi đó
            let msg = functionCheck(value);
            createMsg(parentNode, controlNodes, msg);
            return msg;
        };
    }
    return "";//trả ra chuỗi rỗng nếu không bị gì
};

//test
// let fnameNode = document.querySelector("#fname");
// isValid({
//     value: fnameNode.value,
//     funcs: [isRequired, isName],
//     parentNode: fnameNode.parentElement,
//     controlNodes: [fnameNode],
// });

const clearMsg = () => {
    //xóa tất cả báo đỏ và lỗi
    document.querySelectorAll(".invalid-feedback").forEach((item) => {
        item.remove();
    });
    document.querySelectorAll(".is-invalid").forEach((inputNode) => {
        inputNode.classList.remove("is-invalid");
    });
};

//main flow
//bắt luôn cả sự kiện submit form vì mình muốn vừa enter và bấm nút

document.querySelector("form").addEventListener("submit", (event) => {
    //ngăn load lại cái
    event.preventDefault();
    //xóa hết lỗi trước khi vào
    clearMsg();
    //dom vô từng cái trước
    // fname
    const fnameNode = document.querySelector("#fname");
    const lnameNode = document.querySelector("#lname");
    const emailNode = document.querySelector("#email");
    const subjectNode = document.querySelector("#subject");
    const messageNode = document.querySelector("#message");

    //test từng thằng một
    let errMsg = [
        isValid({
            value: fnameNode.value,
            funcs: [isRequired, isName],
            parentNode: fnameNode.parentNode,
            controlNodes: [fnameNode]
        }),
        isValid({
            value: lnameNode.value,
            funcs: [isRequired, isName],
            parentNode: lnameNode.parentNode,
            controlNodes: [lnameNode]
        }),
        isValid({
            value: emailNode.value,
            funcs: [isRequired, isEmail],
            parentNode: emailNode.parentNode,
            controlNodes: [emailNode]
        }),
        isValid({
            value: subjectNode.value,
            funcs: [isRequired],
            parentNode: subjectNode.parentNode,
            controlNodes: [subjectNode],
        }),
        isValid({
            value: messageNode.value,
            funcs: [isRequired, min(10), max(40)],
            parentNode: messageNode.parentNode,
            controlNodes: [messageNode],
        }),
    ];
    let result = errMsg.every((item) => (item == ""));
    if(result){
        alert("form is valid");
    };
});
