//jshint esversion:6
//아주 비슷하고 조금씩 다른 html 파일들 -> template으로 해결
//ejs 가 필요한 이유



const express=require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//만약 run 한다면 require는 date.js로 갈거고, console.log(module)이 실행될 것임
// const date = require(__dirname+"/date.js");


//여기다가 괄호를 넣어줘서 함수 실행, 리턴값 나옴
// console.log(date());

//mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, 
useUnifiedTopology: true, 
useCreateIndex: true, 
useFindAndModify: false});

const itemsSchema = new mongoose.Schema({
    name:String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to your todo list!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<--- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];

//encryption 사용하고 그럴거면 new mongoose.schema쓰는 건데 그게 아니면 그냥 써도 무방
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

//mongo db


const app=express();

//get에서 미리 item 정의해두려고 하는데, 현재 값이 없으니까
//전역변수로 미리 정의해놓고 post에서 전달된 값으로 바꿔주기만 하면 됨
// let items = ["Buy food","Cook food","Eat food"];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));



app.get("/",function(req,res){
    
    
    //day 모두 생략
    
    // let day = date.getDate();
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
                console.log("error");
                
            }else{
                console.log("Successfully Inserted");
                
            }
        });
        res.redirect("/");
            
        }else{
            res.render("list",{listTitle:"Today", newListItems:foundItems});
            
        }
    })

app.get("/:customListName",function(req,res){
        const customListName = _.capitalize(req.params.customListName);
        
        List.findOne({name:customListName},function(err,foundList){
            if(!err){
                if(!foundList){
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                                        });
                    list.save();
                    res.redirect("/"+customListName);
                }
                else{
                    res.render("list",{listTitle: foundList.name, newListItems:foundList.items});
                }
            }
        });
    
        
    });




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
    const itemName = req.body.newItem; 
    const listName = req.body.list;
    
    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    //변수에 내용이 저장된 뒤에 Redirect 해줘서 app.get이 다시 실행되고
    //ejs를 다시 render 하게 만들어야 함
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
    
    //아래 코드는 에러가 남
    //이유는 list.ejs에서 newListItem을 출력하려고 하는데 item이
    //정의되지 않아서. 따라서 app.get에서 미리 보내놔야 함
    // res.render("list",{newListItem:item});

    

    
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err){
                console.log(err);
                
            }
            else{
                console.log("Successfully deleted");
                res.redirect("/");
            }
        })

    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/"+listName);
            }
        });
    }

    
});

app.get("/about",function(req,res){
    res.render("about");
})
console.log(process.env.PORT);
app.listen(process.env.PORT||3000,function(){
    console.log("Serever is running on port 3000");
});