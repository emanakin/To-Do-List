const express = require("express");
const bodyParser = require("body-parser");

var items = ["Stop world hunger", "Become the president", "Go to Mars"];
var workItems = ["Request code review", "pull pygame repo"];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    
    var day = today.toLocaleDateString("en-US", options);

    res.render("list", {listTitle: day, itemArray: items});

});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", itemArray: workItems});
});



app.post("/", function(req, res){

    var item = req.body.newItem;

    console.log(req)

    if (req.body.list === "Work List"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});