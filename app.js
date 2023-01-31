const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
// var mysql = require('mysql');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const accountSid = 'AC90ecf9cf80e00edd573fcecb357d2ced';
const authToken = '6a4a1ccc3764bc8d5a75a4508ad68e6d';
const client = require('twilio')(accountSid, authToken);
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




// app.use(cors())
// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Ayush123",
// });

// con.connect((err) => {
//     if (err) throw err;
//     console.log("Connected");
// });
// try {
//     con.query(`CREATE TABLE IF NOT EXISTS yoursalondb.salon_details (
//         SALON_ID int NOT NULL AUTO_INCREMENT,
//         SALON_NAME varchar(30) DEFAULT NULL,
//         SALON_ADDRESS varchar(150) DEFAULT NULL,
//         SALON_PHONE decimal(10,0) DEFAULT NULL,
//         SPECIALIZATION varchar(150) DEFAULT NULL,
//         ARTIST_NAME varchar(30) DEFAULT NULL,
//         SERVICES varchar(200) DEFAULT NULL,
//         SALON_EMAIL varchar(30) DEFAULT NULL,
//         imgURL varchar(100) DEFAULT NULL,
//         PRIMARY KEY (SALON_ID)
//       )`)
//     con.query(`CREATE TABLE IF NOT EXISTS yoursalondb.subscribe_email (
//         S_EMAIL_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
//         EMAILS VARCHAR(50)
//       )`)
// } catch (err) {
//     console.log(err);
// }
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
let artistPhone;
app.route('/artist-:id').post((req, res) => {
    let id = req.params.id
    con.query(`SELECT * FROM salon_details where SALON_ID = ${id}`, (err, result, fields) => {
        if (err) throw err;
        res.json(result.rows[0])
    })
    con.query(`SELECT salon_phone FROM salon_details where SALON_ID = ${id}`, (err, result, fields) => {
        artistPhone = result;
    })
})
app.post("/make-appoinment", (req, res)=>{
    client.messages.create({
        from: "+12054489306",
        to: `+91${artistPhone}`,
        body:
        `
        Name: ${req.body.userName}\nPhone: ${req.body.userPhone}\nDate: ${req.body.userDate}\nTime: ${req.body.userTime}\nSelected services: ${req.body.service}
        `
    }).then(res=>console.log("message sent")).catch(err=>console.log(err))
    console.log(req.body);
    res.sendFile(path.join(__dirname, "views", "/thanks-you.html"));
})
app.route('/artist-:id').get((req, res) => {
    res.sendFile(path.join(__dirname, "/views", "artist-profile.html"));
})

app.get("/salon-data", (req, res) => {
    con.query("SELECT * FROM salon_details", function (err, result, fields) {
        res.json(result.rows)
    });
})
app.post("/add-salon-data-in-database", async (req, res) => {
    con.query(`insert into salon_details(SALON_NAME, SALON_ADDRESS,SALON_PHONE, SPECIALIZATION, ARTIST_NAME,SERVICES, SALON_EMAIL, imgURL) values('${req.body.salon_name}','${req.body.salon_add}',${req.body.salon_phone},'${req.body.specialization}','${req.body.artist_name}','${req.body.services}','${req.body.salon_email}','${req.body.imgUrl}')`)
    res.sendFile(path.join(__dirname, "/addData.html"))
})
app.get("/add-salon-data-in-database", (req, res) => {
    res.sendFile(path.join(__dirname, "/addData.html"))
})

app.post(["/", "/artist-list", "/facials", "/bleach-dtan", "/mani-padi", "/waxing", "/hair-care", "/makeup", "/pre-bridal", "/body-deals", "/bridal-makeup", "/threading"], (req, res)=>{
    con.query(`insert into subscribe_email(EMAILS) values ('${req.body.email}')`)
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
