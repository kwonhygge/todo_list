//jshint esversion:6

// console.log(module);

//괄호를 안넣은 건 함수가 실행되기를 바라는게 아니라 불리기를 바라기 때문에
//아래처럼만 하면 하나만 불러올 수 있음
// module.exports=getDate;
//여러개 불러오려면

module.exports.getDate=getDate;


function getDate(){
    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return today.toLocaleDateString("en-US",options);
}

//export 줄이기

//anonymous function으로 export
//module.exports => exports

exports.getDay = function (){

    //절대 바뀌지 않을 값이라서 let 에서 const로 바꿔줌
    const today = new Date();

    const options={
        day: "long"
    }
    return today.toLocaleDateString("en-US",options);
}