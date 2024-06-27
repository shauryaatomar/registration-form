const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT | 3005;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://shauryatomar184:9n63-AtL.yGNif@cluster0.mxwk9wq.mongodb.net/registrationFormDB?retryWrites=true&w=majority`,);

//registration schema
const registrationSchema = new mongoose.Schema({
    registrationData : {
    name : String,
    email : String,
    password : String,
    },
});

//mode of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/", (req,res) => {
res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req,res) => {
    try{
        const userData = req.body;

        const existingUser = await Registration.findOne({email : userData.email});
       //check for existing user
        if(!existingUser){
            const newUser = new Registration({
                name : userData.name,
                email : userData.email,
                password : userData.password,
            });
            await newUser.save();
            res.redirect("/success");
        }
       
        else {
            console.log("user already exists");
            res.redirect("/error");
        }
    }
    catch(error){
        console.log(error);
        res.redirect("/error");
    }
})

app.get("/success", (req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
} )

app.get("/error", (req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});