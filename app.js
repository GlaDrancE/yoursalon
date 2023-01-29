const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
// var mysql = require('mysql');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require('pg');

const con = new Client({
  host: 'dpg-cf9ousun6mpv49epnfc0-a',
  user: 'root',
  port:5432,
  password:'hUR7hbi0zmA3iqvXQsTjo1vNxKzIeCph',
  database: 'yoursalondb'
})
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.use(cors())
try {
//     con.query(`CREATE DATABASE yoursalondb`);
//   con.query('drop table salon_details');
//   con.query('drop table subscribe_email');
    con.query(`CREATE TABLE IF NOT EXISTS salon_details (
        SALON_ID SERIAL,
        SALON_NAME varchar(30) DEFAULT NULL,
        SALON_ADDRESS varchar(150) DEFAULT NULL,
        SALON_PHONE decimal(10,0) DEFAULT NULL,
        SPECIALIZATION varchar(150) DEFAULT NULL,
        ARTIST_NAME varchar(30) DEFAULT NULL,
        SERVICES varchar(200) DEFAULT NULL,
        SALON_EMAIL varchar(30) DEFAULT NULL,
        imgURL varchar(100) DEFAULT NULL,
        PRIMARY KEY (SALON_ID)
      )`)
    con.query(`CREATE TABLE IF NOT EXISTS subscribe_email (
        S_EMAIL_ID SERIAL PRIMARY KEY,
        EMAILS VARCHAR(50)
      )`)
} catch (err) {
    console.log(err);
}
app.use(bodyparser.urlencoded())
app.use(express.static(path.join(__dirname, 'views')));
app.set(path.join(__dirname, 'views'))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/home.html")
})
app.get(["/facials", "/bleach-dtan", "/mani-padi", "/waxing", "/hair-care", "/makeup", "/pre-bridal", "/body-deals", "/bridal-makeup", "/threading"], (req, res) => {
    res.sendFile(__dirname + "/views/services.html");
})
app.get("/artist-list", (req, res) => {
    res.sendFile(__dirname + "/views/artist-list.html");
})
app.route('/artist-:id').post((req, res) => {
    let id = req.params.id
    con.query(`SELECT * FROM salon_details where SALON_ID = ${id}`, (err, result, fields) => {
        if (err) throw err;
        res.json(result)
    })
})
app.route('/artist-:id').get((req, res) => {
    res.sendFile(path.join(__dirname, "/views", "artist-profile.html"));
})

app.get("/salon-data", (req, res) => {
    con.query("SELECT * FROM salon_details", function (err, result, fields) {
        res.json(result)
    });
})
app.post("/add-salon-data-in-database", async (req, res) => {
    con.query(`insert into salon_details(SALON_NAME, SALON_ADDRESS,SALON_PHONE, SPECIALIZATION, ARTIST_NAME,SERVICES, SALON_EMAIL, imgURL) values('${req.body.salon_name}','${req.body.salon_add}',${req.body.salon_phone},'${req.body.specialization}','${req.body.artist_name}','${req.body.services}','${req.body.salon_email}','${req.body.imgUrl}')`)
    con.query("select * from salon_details", function(err, result){console.log(result)});  
  res.sendFile(path.join(__dirname, "/addData.html"))
})
app.get("/add-salon-data-in-database", (req, res) => {
    res.sendFile(path.join(__dirname, "/addData.html"))
})

app.post(["/", "/artist-list", "/facials", "/bleach-dtan", "/mani-padi", "/waxing", "/hair-care", "/makeup", "/pre-bridal", "/body-deals", "/bridal-makeup", "/threading"], (req, res)=>{
    con.query(`insert into subscribe_email(EMAILS) values ('${req.body.email}')`, function(err, result, fields){
        if (err) {
            throw err;
        }
        else{
            // alert("Thanks to join us");
            console.log("Thanks to join us");
        }
    })
    res.redirect(req.originalUrl);
})
app.post("/contact", (req, res) => {
    var mydata = new Contact(req.body)
    mydata.save().then(() => {
        res.send(alert("yup"))
    }).catch(() => {
        res.send("nope")
    })
})

app.listen(port, () => {
    console.log("app is listening on port ", port);
})
