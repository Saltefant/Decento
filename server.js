// DECENTO - server.js 
//Uploaded here: https://decento.herokuapp.com/

// ======================================================================
// Getting the required modules
const express   = require('express'),
app             = express(),
port            = process.env.PORT || 8080,
mongoose        = require('mongoose'),
passport        = require('passport'),
flash           = require('connect-flash'),
morgan          = require('morgan'),
cookieParser    = require('cookie-parser'),
bodyParser      = require('body-parser'),
session         = require('express-session'),
configDB        = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

/*
// force https
app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://decento.herokuapp.com'+req.url);
    else
      next(); // Continue to other routes if we're not redirecting
});
*/

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'detteerenhemmelighed' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// required for using css with ejs
app.use(express.static(__dirname + '/public'));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
