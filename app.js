const Sequelize =require ('sequelize');
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const accountRouter = require('./routes/accounts');
const saltRounds = 10;
const db = require('./models')


app.use(
  session({
    secret: "the new twitter",
    resave: false,
    saveUninitialized: true
  })
);
function loginRedirect(req, res, next){
  console.log(',.,.,.,.,.,.,.,.,.')
  if (req.session.userId){
    console.log("<<<<<<<<<<")
    res.redirect("/account")
  }else{
    next();
  }
}
function authenticate (req, res, next){
  if (!req.session.userId){
    console.log(">>>>>>>>>>")
    res.redirect("/")
  } else{
    next();
  }
}
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");

app.get("/", (req, res) => {
  let data = {};
  console.log(">>>>>>>>>>>")
  data=db.content.findAll();
  console.log(data.posting)
  res.render("index", data);
});

app.get("/login", loginRedirect, (req, res) => {
  res.render('/');
});


app.get("/account", authenticate, (req, res) => {
  console.log(">>>>>>>>>>")
  res.render('account');
  console.log("<<<<<<<<")
});

app.get("/register", loginRedirect, (req, res) => {
  res.render('register');
});

app.post("/login", loginRedirect, function(req, res) {
  db.Users.findOne({
    where:{
      email: req.body.email
    }
  }).then(function(user){
    if (!user){
    res.redirect('/')
    } else{
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if (result){
          req.session.userId = user.id
          res.redirect('/account');
        } else{
           return res.status(500).send('Invalid username or password');
       
        }
      });
    }
  });

});
app.get('/tweet', (req, res)=>{
  db.contents.find({}, (err, posting) =>{
    console.log(">>>>>")
    res.send("/", posting)
  })
})
app.post('/tweet', (req, res)=>{
 
  db.contents.create({
    posting: res.body
  }).then()
 
})

app.post('/users', async (req, res)=>{
  bcrypt.hash(req.body.password, saltRounds, function (err, hash){
    db.Users.create({
      email: req.body.email,
      password: hash
    }).then(function(data){
      if (data){
        res.redirect('/');
      }
    });
  });
});

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});
app.listen(3000)


