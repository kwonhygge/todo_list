const express=require("express");
const bodyParser=require("body-parser");

//아주 비슷하고 조금씩 다른 html 파일들 -> template으로 해결
//ejs 가 필요한 이유

const app=express();
app.set('view engine', 'ejs');


app.get("/",function(req,res){
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    const dayList = ["Sunday","Monday","Tuesday","Wednsday","Thursday","Friday","Saturday"];

    day=dayList[currentDay];
    res.render("list",{kindOfDay:day});
});

app.listen(3000,function(){
    console.log("Serever is running on port 3000");
});