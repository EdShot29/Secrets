//Déclaration du package dotenv
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Connection à la base de données 
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Définition des schémas
const userSchema = new mongoose.Schema({
    email: String, 
    password: String
});

//Accès aux variables de dotENV : process.env.VARIABLEENV
userSchema.plugin(mongooseEncryption, {secret: process.env.SECRET_KEY, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    
    const newUser = new User({
        email: req.body.username, 
        password: req.body.password
    });
    
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                } else {
                    console.log("Mauvais mot de passe renseigné, veuillez retenter");
                }
            } else {
                console.log("Utilisateur non déclaré dans la base de données");
            }

        }
    });

});

















app.listen(3000, function(){
    console.log("Server started on port 3000");
})