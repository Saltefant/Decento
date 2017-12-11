// app/routes.js
module.exports = function(app, passport) {
    
        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        app.get('/', function(req, res) {
            res.render('index.ejs', {
                user : req.user // get the user out of session and pass to template
            }); // load the index.ejs file
        });
    
        // =====================================
        // LOGIN ===============================
        // =====================================
        // show the login form
        app.get('/login', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { 
                user : req.user,
                message: req.flash('loginMessage') 
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
                message: req.flash('signupMessage') 
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
    
        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
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
    
    