//아주 비슷하고 조금씩 다른 html 파일들 -> template으로 해결
//ejs 가 필요한 이유



const express=require("express");
const bodyParser=require("body-parser");

//만약 run 한다면 require는 date.js로 갈거고, console.log(module)이 실행될 것임
const date = require(__dirname+"/date.js");


//여기다가 괄호를 넣어줘서 함수 실행, 리턴값 나옴
// console.log(date());


const app=express();

//get에서 미리 item 정의해두려고 하는데, 현재 값이 없으니까
//전역변수로 미리 정의해놓고 post에서 전달된 값으로 바꿔주기만 하면 됨
let items = ["Buy food","Cook food","Eat food"];
let workItems=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    
    let day = date.getDate();

    res.render("list",{listTitle:day, newListItems:items});

    // var currentDay = today.getDay();
    // var day = "";
    // const dayList = ["Sunday","Monday","Tuesday","Wednsday","Thursday","Friday","Saturday"];

    // day=dayList[currentDay];
    // res.render("list",{kindOfDay:day});

    //how to format javascript date 
    //https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date


});

app.post("/",function(req,res){

    //bodyparser가 있어야 내용가져올 수 있음
    let item = req.body.newItem; 
    console.log(req.body);
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item)
    //아래 코드는 에러가 남
    //이유는 list.ejs에서 newListItem을 출력하려고 하는데 item이
    //정의되지 않아서. 따라서 app.get에서 미리 보내놔야 함
    // res.render("list",{newListItem:item});

        res.redirect("/");
    //변수에 내용이 저장된 뒤에 Redirect 해줘서 app.get이 다시 실행되고
    //ejs를 다시 render 하게 만들어야 함
    }
    
    
    
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List", newListItems:workItems});
});

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("Serever is running on port 3000");
});