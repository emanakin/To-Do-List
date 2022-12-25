const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


var workItems = ["Request code review", "pull pygame repo"];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//create database  
mongoose.connect("mongodb+srv://admin-emmanuel:Akin9653@cluster0.71spgj6.mongodb.net/todolistDB", {useNewUrlParser: true});

//JSON format
const itemSchema = {
    body: String,
  };

//create a collection in the todolist database using item schema named Item's
const Item = mongoose.model("Item", itemSchema);

//creates 3 new items of type Item 
const item = new Item ({
    body: "Buy Food"
});
  
const itemTwo = new Item ({
    body: "Cook Food"
});
  
const itemThree = new Item ({
    body: "Eat Food"
});

//stores them into a list 
const items = [item, itemTwo, itemThree];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res){
    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0){
            //inserts them into item's collection
            Item.insertMany(items, function(err){
                if (err){
                console.log(err);
                } else {
                console.log("No error");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
      });

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    
    var day = today.toLocaleDateString("en-US", options);

    // res.render("list", {listTitle: day, itemArray: items});

});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", itemArray: workItems});
});



app.post("/", function(req, res){

    var body = req.body.newItem;
    var listName = req.body.list;
    
    let item = new Item ({
        body: body
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
   
    

});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if (!err){
            if (!foundList){
                const list = new List({
                    name: customListName,
                    items: items
                });

                list.save();
                res.redirect("/"+customListName);
            } else {
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            } 
        }
    });
    

});

app.post("/delete", function(req, res){

    var checkedItem = req.body.check;
    var listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({_id: checkedItem}, function(err){
            if (err){
                console.log(err);
            } else {
                console.log("Sucess")
            }
        })
        res.redirect("/")
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function(err, foundList){
            if (!err){
                res.redirect("/"+listName);
            }
        });
    }
    

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
    console.log("Server started sucesfully");
});