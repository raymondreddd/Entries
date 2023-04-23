const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const path = require('path')
const port = 3000;

//create app
const app = express()

// always code
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//register view-engine
app.set("view engine", "ejs");
// app.set('views','myfolder')
app.use(express.urlencoded({extended:false}))

//CONNECTING
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodemysql'
  });
   
db.connect((error) => {
    if(error){
        throw error;
    }
    console.log('connected to db');
});


app.get('/', (req,res) => {
    //NOT: res.send(, sendFile();
    // res.sendFile(path.join(__dirname, '/index.html'));
    res.render('index');
})

app.get('/form', (req, res) => {
    res.render('form');
  })


 //create db
 app.get('/createdb', (req,res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err)throw err;
        console.log((result));  
        res.send('Database created');
    })
 })

//create table
app.get('/createtable', (req, res) => {
    let sql = 'create table entries(id int AUTO_INCREMENT, name varchar(255), mobile int, relation varchar(255), gender varchar(255), email varchar(255), primary key (id))';
    db.query(sql, (err,result) => {
        if(err)throw err;
        console.log(result);
        res.send("Table created, name: entries");
    })
})

//show posts
app.get('/view', (req, res) => {
    let sql = 'select * from entries'
    let query = db.query(sql, (err, result) => {
        if(err)throw err;
        console.log(result);
        res.render('view', {result})
        // res.send("entries fetched..");
    })
})

app.post('/submit-form', (req, res) => {
    const { name, mobile,relation,  gender, email } = req.body;
    console.log(`Name: ${name}, Mobile: ${mobile},Relation: ${relation} Gender: ${gender}, Email: ${email}`);

    let entry ={name, mobile, relation,  gender, email};

    let sql = 'insert into entries set ?';
    let query = db.query(sql, entry, (err, result) => {
        if(err)throw err;
        console.log(result);
        res.render('/view');
    })
    
    
});


app.listen(port, () => {
    console.log(`Server running  on ${port}`)
});