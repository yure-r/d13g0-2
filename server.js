const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const cors = require("cors")
const routes = require('./routes')
// const {aggregator} = require('./helpers')
const querystring = require('querystring')
const axios = require('axios')
const Twitter = require('twitter')
const exphbs  = require('express-handlebars');
const hbs = require('hbs')
const fileUpload = require('express-fileupload');

app.engine('html', exphbs({
  extname: '.html'
}));
app.set('view engine', 'hbs');


app.use(express.static("public"));



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/logo", (request, response) => {
  response.sendFile(__dirname + "/views/animatedlogo.html");
});

app.get("/logov", (request, response) => {
  response.sendFile(__dirname + "/views/animatedlogo-asfont.html");
});

app.get("/logovflexa", (request, response) => {
  response.sendFile(__dirname + "/views/animatedlogo-asfont-flexa.html");
});

app.get("/logovbw", (request, response) => {
  response.sendFile(__dirname + "/views/animatedlogo-asfont-bw.html");
});

app.get("/logolong", (request, response) => {
  response.sendFile(__dirname + "/views/animatedlogo-asfont-long.html");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())

//helper for cross-origin access
const prepare = (req, res, next)=>{
  //handle tokens eventually
  
  // res.set({'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
  next()
}

//allow for static asset serving, like html, css and js files
// app.use(express.static("public"));

//HTML routes
app.get("/", routes.index);

// app.get("/projects", routes.projects)
app.get("/info", routes.about)
// app.get("/resources", routes.resources)
// app.get("/resources-placeholder", routes.resourcesPlaceholder)
// app.get("/credit", routes.credit)
// app.get("/contact", routes.contact)
// app.get("/about", routes.about)


app.get("/thankyou", routes.thankYou)

app.get("/invalid", routes.nameError)
//API endpoints
// ✓ get all data
app.get("/data", prepare, routes.getData);


app.get("/data/pagemetadata/:pagemetadata", prepare, routes.getMetaData)

// app.get('/pagemetadata/:requrl', function (req, res) {
//   console.log(res.send(req.params.requrl))
//   res.status(200).send(req.params.requrl)
  
// })


// ✓ get a datum by id
app.get("/data/:id", prepare, routes.getDatum)



// ✓ get a datum by id
app.get("/project/:project", prepare, routes.getFellowByFellow)



// get a datum by id
app.get("/data/name/:name", prepare, routes.getDatumByName)

// ✓ add a datum
app.post("/data", prepare, routes.postDatum, routes.index)

// ✓ edit a datum
app.post("/data/update", routes.editDatum, routes.indexEdit)

app.post("/data/name/update", routes.editDatumByName, routes.index)

app.post("/nopage/data/name/update", routes.editDatumByNameNoPage, routes.index)

app.post("/nopage/data/name/approve/:name", prepare, routes.editDatumByNameNoPageApprove)

app.post("/nopage/data/name/updateOrder/:name/:order", prepare, routes.editDatumByNameNoPageUpdateOrder)

app.post("/nopage/data/name/deny/:name", prepare, routes.editDatumByNameNoPageDeny)

// ✓ danger: erase a specific datum
app.post("/erase/:id", routes.eraseDatum, routes.index)


app.post("/erase/name/:name", routes.eraseDatumByName, routes.index)


// ✓ danger: erase everything
// app.post("/erase", routes.eraseData, routes.index)

// ✓ surface the schema... just for fun
app.get("/schema", prepare, routes.schema);

app.get("/authors", prepare, routes.authors)

// app.get("/postTweet", prepare, routes.postTweet)



// listen for requests :)
var listener = app.listen(process.env.PORT, async () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
  // await aggregator()
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



// init passport for authentication management & express-session for session management
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const LocalStrategy = require('passport-local').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
app.use(session({ 
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  secret: 'nice hair',
  resave: false, 
  saveUninitialized: false, 
  
}));
app.use(passport.initialize());
app.use(passport.session());

// app.get("/edit", routes.edit)


const adminDirectory = '/' + "edit";

// set passport to use LocalStrategy to check for username and password fields
passport.use(new LocalStrategy(
  function(username, password, callback) {
    if (username !== "username" || password !== "password") {
      console.log('login attempt failed:', username, password);
      return callback(null, false);
    }
    let user = { username, password };
    return callback(null, { username: username, password: password });
}));

// passport authenticated session persistence config
passport.serializeUser(function(user, callback) {
  callback(null, 0);
});
passport.deserializeUser(function(user, callback) {
  callback(null, {username: "username", password: "password"});
});

// ROUTE: success is sent to the directory sent in .env

app.get('/AuthenticateAdmin', function(request, response){
  response.sendFile(__dirname + '/views/login.html')

});

app.get('/login', function(request, response){
  response.sendFile(__dirname + '/views/login.html')

});

app.get('/404', function(request, response){
  response.sendFile(__dirname + '/views/404.html')

});

app.get(adminDirectory, ensureLoggedIn(), function(request, response) {
  console.log('success', request.user);
  response.sendFile(__dirname + '/views/editindex.html');
});


app.get("/addImage", ensureLoggedIn(), function(request, response) {
  console.log('success', request.user);
  
//   exports.display = async (req, res) => {
//   //list all image names and urls
  
//   let fileData = db.get("files").value()
  
//   let fileDataList = fileData.map((file)=>{
    
//     if(file.filetype == "mp4"){
//       return `<li><iframe style="height:130px;width:auto;" src="${file.filepath}"></iframe><br><a href="${file.filepath}" target="_blank">${file.filepath}</a></li>`
//     } else {
//       return `<li><img style="height:130px;width:auto;"src="${file.filepath}"><br><a href="${file.filepath}" target="_blank">${file.filepath}</a></li>`
//     }
    
    
  
  
//   })
  
//   res.set('Content-Type', 'text/html');
//   return res.end(`<ul>${fileDataList}</ul>`)
// };
  
  response.sendFile(__dirname + '/public/addImage.html');
});






// ROUTE: login post endpoint
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(request, response) {
  response.redirect(adminDirectory);
});

// ROUTE: logout
app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

// ROUTE: failed login
app.get('/error', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

//////////////////////////////////////////////////////////////////////////////////////////
app.get('/fellows/:fellow', fetch, render, errors);

function fetch(req, res, next) {
  var fellowId = req.params.fellow;

  // add code to fetch articles here

  req.leg = fellowId;
  next();
}

function render(req, res, next) {
  res.locals.word = req.leg;
  res.render('weather');
}

function errors(err, req, res, next) {
  console.log(err);

  res.locals.error = err.message;
  // render an error/404 page
  res.render('error');
}




            //IMAGES
// const express = require('express');
// const app = module.exports = express();
// const routes = require('./routes');
// const pdf = require('./routes/pdf.js');

// const bodyParser = require('body-parser');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());

//standard routes for displaying webpages and files
// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/public/index.html');
// });

app.get('/img/:file', function(req, res) {
  // res.sendFile(__dirname + '/.data/'+req.params.file);
   res.sendFile(__dirname + '/public/images/'+req.params.file);
});

//Simple interfaces for viewing data
app.get('/data', routes.data)


app.get('/display', routes.display);
app.get('/preview', routes.preview);
// app.get('/list', routes.listByFilename);
app.get('/list', routes.listByTimestamp);

app.get('/listByTimestamp', routes.listByTimestamp);

//Post-only routes for upload and destructive operations
app.get('/remove', routes.remove);
app.post('/upload', routes.upload);
         //END - IMAGES







// ROUTE: everywhere else is not auth'd
app.get('*', function(request, response) {
  console.log(request.url)
  console.log("404!")
  // response.sendFile(__dirname + '/views/wildcard.html');
  response.redirect('/404');
});