const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const Schema = mongoose.Schema;
app.set('view engine' ,'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/myfirstDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
      },
    name: String,
    email: String,
    password: String,
    items: [String]
});

const Users = mongoose.model("Users",userSchema);

app.get("/",function(req,res){
    res.render("home",{listTitle: " To Do List"})
});

app.get("/login",function(req,res){
    res.render("login",{ error:"Please Enter Password"});
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const User = new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    User.save().then(()=>console.log("Success")).catch((err)=>console.log(err));
});

app.post("/login",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    Users.findOne({email:email})
    .then((user)=>{
        if(user === null){
            res.render("login",{ error:"User Not Found"})
        }else if(user.password != password){
            res.render("login",{error:"Wrong password"})
        }else{
            const name = user.name;
            res.redirect(`/todolist/${name}`);
        }
    })
    .catch((err)=>console.log(err));
});

app.post('/todolist/:name', function(req, res) {
    const itemName = req.body.item;
    const userName = req.params.name;
    console.log(itemName);
    //Find the user in the database
    Users.findOne({ name: userName }).then((foundUser) =>
    {
        if(foundUser) { // check if foundUser is not null or undefined
            foundUser.items.push(itemName);
            foundUser.save();
        }
    });
    res.redirect('/todolist/' + userName);
})

app.get('/todolist/:name', function(req, res) {
    const userName = req.params.name;
    Users.findOne({ name: userName }).then((foundUser) =>
    {
        if(foundUser) {
            const items = foundUser.items;
            res.render("todolist",{ userName: userName, newItems: items})
        }
    });
});
app.post('/delete/:name', async function(req, res) {
    const itemId = req.body.deleteButton;
    console.log('itemId:', itemId);
    const user = await Users.findOneAndUpdate(
        { name: req.params.name },
        { $pull: { items: itemId } },
        { new: true }
    );
    if (user) {
        console.log('Item successfully deleted from user:', user);
        res.redirect(`/todolist/${req.params.name}`);
    } else {
        console.log('User not found');
        res.status(404).send('User not found');
    }
});
app.listen("3000",function(){
    console.log("Server Running On Port 3000");
});
