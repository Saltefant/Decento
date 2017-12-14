var Post = require('../app/models/newspost');
var ImagePost = require('../app/models/imagepost');

//To uplaod image
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'upload/'});
var type = upload.single('recfile');


// app/routes.js
module.exports = function(app, passport) {

                                                    
        /** Permissible loading a single file, 
            the value of the attribute "name" in the form of "recfile". **/
        app.post('/postnews', type, function (req, res) {
            
            try{
                if(req.user.local.role === "Admin") {
        
                    newPost = new Post();
                    d = new Date();
        /** When using the "single"
             data come in "req.file" regardless of the attribute "name". **/
        
                try {
                    var tmp_path = req.file.path;
                    
                    /** The original name of the uploaded file
                         stored in the variable "originalname". **/
                    var target_path = 'public/uploads/' + req.file.originalname;
                    
                    /** A better way to copy the uploaded file. **/
                    var src = fs.createReadStream(tmp_path);
                    var dest = fs.createWriteStream(target_path);
                    src.pipe(dest);
                    
                    newPost.local.imagePath = 'uploads/' + req.file.originalname;
                
                } catch(err) {
                    newPost.local.imagePath = '';
                }
        
                newPost.local.headline = req.body.headline;
                newPost.local.text = req.body.txtArea;
    
                function addZero(i) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    return i;}
    
                newPost.local.date = `${addZero(d.getDate())}-${addZero(d.getMonth())}-${d.getFullYear()} Kl. ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
                
                newPost.save()
                res.render('profile.ejs', {
                    user : req.user,
                    message : 'Nyheden blev oprettet!'
                });
                } else {
                res.redirect('/login');
            }} catch(err) {
                console.log(err);
                res.redirect('/login')
            }
        });

    
        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function(req, res) {
            res.render('index.ejs', {
                user : req.user // get the user out of session and pass to template
            }); // load the index.ejs file
        });

        app.get('/nyheder', function(req, res) {
            Post.find((err, result) => {  
                if (err) {
                    res.render('nyheder.ejs', {
                        user : req.user
                });
                } else {
                    res.render('nyheder.ejs', {
                        user : req.user,
                        posts : result // get the user out of session and pass to template
                    }); // load the index.ejs file
                }
            });
        });
    
        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { 
                user : req.user,
                message : req.flash('loginMessage') 
            }); 
        });
    
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {
    
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { 
                user : req.user,
                message : req.flash('signupMessage') 
            });
        });

        app.get('/kontakt', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('kontakt.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });

        app.get('/cases', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('cases.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });

        app.get('/boligfoto', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('boligfoto.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });
        
        app.get('/bilfoto', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('bilfoto.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });
        
        app.get('/produktfoto', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('produktfoto.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });

        app.get('/bryllupsfoto', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('bryllupsfoto.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });

        app.get('/test/:somevalue', function(req, res) {
                    // render the page and pass in any flash data if it exists
                    res.render('test.ejs', {
                        value : req.params.somevalue
                    });
        });

        app.get('/portraetfoto', function(req, res) {
            
                    // render the page and pass in any flash data if it exists
                    res.render('portraetfoto.ejs', {
                        user : req.user // get the user out of session and pass to template
                    });
        });
    
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })); 

        /*
        app.post('/postnews', function (req, res) {
            try{
                if(req.user.local.role === "Admin") {

                    newPost = new Post();
                    d = new Date();

                    newPost.local.headline = req.body.headline;
                    newPost.local.text = req.body.txtArea;

                    function addZero(i) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        return i;}

                    newPost.local.date = `${addZero(d.getDate())}-${addZero(d.getMonth())}-${d.getFullYear()} Kl. ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
                    
                    newPost.save()
                    res.render('profile.ejs', {
                        user : req.user,
                        message : 'Nyheden blev oprettet!'
                    });
                } else {
                res.redirect('/login');
            }} catch(err) {
                console.log(err);
                res.redirect('/login')
        }
        });
        */

        app.get('/deletepost/:id', function(req, res) {
            try{
            if(req.user.local.role === "Admin") {
                Post.findByIdAndRemove(req.params.id, (err, result) => {
                    res.redirect('/nyheder')
                });
            } else {
                res.redirect('/login')
            }} catch(err) {
                console.log(err);
                res.redirect('/login');
            }        
        });
    
        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user, // get the user out of session and pass to template
                message : ''
            });
        });
    
        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };
    
    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/login');
    }
    
    