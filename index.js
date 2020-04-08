//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();
 
//konfigurasi koneksi
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kasir'
});
 
//connect ke database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public sebagai static folder untuk static file
app.use('/assets',express.static(__dirname + '/public'));
 
//route untuk homepage
app.get('/',(req, res) => {
  let sql = "SELECT product.*, chasier.*, category.* FROM product INNER JOIN chasier ON chasier.id_chasier = product.id_chasier INNER JOIN category ON category.id_category = product.id_category";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('tampilan',{
      results: results
    });
  });
});

// ambil data chasier
app.get('/AmbilDataChasier',(req, res) => {
  let sql = "SELECT * FROM chasier";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.json(results)
  });
});

app.get('/AmbilDataCategory',(req, res) => {
  let sql = "SELECT * FROM category";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.json(results)
  });
});


// Ambil data berdasarkan id
app.get('/AmbilId/:id',(req, res) => {
  let sql = "SELECT product.*, chasier.*, category.* FROM product INNER JOIN chasier ON chasier.id_chasier = product.id_chasier INNER JOIN category ON category.id_category = product.id_category WHERE product.id = '"+req.params.id+"'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('update',{
      results: results
    });
  });
});
 
//route untuk insert data
app.post('/save',(req, res) => {
  let sql = "INSERT INTO product(name, price, id_category, id_chasier) VALUES ('"+req.body.menu+"', '"+req.body.price+"', '"+req.body.name_category+"', '"+req.body.name_chasier+"')";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route untuk update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET name='"+req.body.name+"',id_category='"+req.body.category+"', id_chasier='"+req.body.chasier+"', price='"+req.body.price+"' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
 
//route untuk delete data
app.get('/delete/:id',(req, res) => {
  let sql = "DELETE FROM product WHERE id="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});
 
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});