const express = require('express');
const path = require('path');
// const mongoose = require("mongoose")
const bodyparser = require("body-parser");
var mysql = require('mysql');
// const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;

// app.use(cors())
// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect('mongodb://localhost/contactPage');
// }
// const contactSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     content: String
// });
// const Contact = mongoose.model('contacts', contactSchema);

const con = mysql.createConnection({
    host: "dpg-cf9ousun6mpv49epnfc0-a",
    user: "root",
    password: "hUR7hbi0zmA3iqvXQsTjo1vNxKzIeCph",
});

con.connect((err)=>{
    if(err)throw err;
    console.log("Connected");
});
app.use(express.urlencoded())
app.use(express.static("views"))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/views/home.html")
})
app.get(["/facials", "/bleach-dtan", "/mani-padi", "/waxing" ,"/hair-care", "/makeup", "/pre-bridal", "/body-deals", "/bridal-makeup", "/treading"], (req, res) => {
    res.sendFile(__dirname+"/views/services.html"); 
})
app.get("/artist-list", (req, res)=>{
    const params = {"title":"This is title from node js"}
    res.sendFile(__dirname+"/views/artist-list.html");
})
app.get("/salon-data", (req, res)=>{
    con.query("SELECT * FROM yoursalondb.salon_details", function(err, result, fields){
        res.json(result)
    });
})
app.post("/contact", (req, res) => {
    var mydata = new Contact(req.body)
    mydata.save().then(()=>{
        res.send(alert("yup"))
    }).catch(()=>{
        res.send("nope")
    })
})

app.listen(port, ()=>{
    console.log("app is listening on port ", port);
} )
