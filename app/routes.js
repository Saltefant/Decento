var Post = require('../app/models/newspost');
var Order = require('../app/models/order');
var User = require('../app/models/user');

//To uplaod image
var fs = require('fs');
var multer  = require('multer');


// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // SHOW HOME PAGE  =====================
    // =====================================
    
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/brugerinfo', isLoggedIn, function(req, res) { 
        res.render('brugerinfo.ejs', {
            user : req.user
        }); // load the index.ejs file
    });

    app.post('/updateuser', isLoggedIn, function (req, res) {
        User.findOneAndUpdate({'_id' : req.user._id}, {'local.userinformation.firstName' : req.body.firstName,'local.userinformation.lastName' : req.body.lastName }, {upsert:true}, (err, res2) => {
            if (err) {
                req.flash('profileMessage', 'Der skete en fejl.');
                res.redirect('/profile');
            } else {
                req.flash('profileMessage', 'Dine oplysninger blev opdateret');
                res.redirect('/profile'); 
            }
        });
    });

    // =====================================
    // CREATE AN ORDER =====================
    // =====================================

    app.post('/placeorder', isLoggedIn, function (req, res) {
        try {
        newOrder = new Order();
        d = new Date();

        newOrder.order.customerId = req.body.userId;
        newOrder.order.ordertype = req.body.type;
        newOrder.order.text = req.body.txtArea;
        newOrder.order.status = 'Venter på bekræftelse';

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;}

        newOrder.order.date = `${addZero(d.getDate())}-${addZero(d.getMonth())}-${d.getFullYear()} Kl. ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
        
        newOrder.save();
        
        req.flash('profileMessage', 'Din ordre blev oprettet');
        res.redirect('/profile'); 
        } catch(err) {
        req.flash('profileMessage', 'Der gik noget galt');
        res.redirect('/profile');     
        }
    });

    // =====================================
    // CREATE A NEWS POST ==================
    // =====================================
    var upload = multer({ dest: 'uploads/'}).single('recfile');
    //var type = upload.single('recfile');

    app.post('/postnews', isLoggedIn, upload, function (req, res) {
        
            if(req.user.local.role === "Admin") {
    
                newPost = new Post();
                d = new Date();
    
            try {
                var tmp_path = req.file.path;
                
                // The original name of the uploaded file stored in the variable "originalname"
                var target_path = 'public/uploads/' + req.file.originalname;
                
                //A better way to copy the uploaded file. **/
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                
                newPost.newspost.imagePath = 'uploads/' + req.file.originalname;
            
            } catch(err) {
                newPost.newspost.imagePath = '';
            }
    
            newPost.newspost.headline = req.body.headline;
            newPost.newspost.text = req.body.txtArea;

            function addZero(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;}

            newPost.newspost.date = `${addZero(d.getDate())}-${addZero(d.getMonth())}-${d.getFullYear()} Kl. ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
            
            newPost.save();
            
            req.flash('profileMessage', 'Nyheden blev oprettet');
            res.redirect('/profile');
            } else {
            res.redirect('/login');
        }
    });

    // =====================================
    // SHOW NEWS SECTION ===================
    // =====================================

    app.get('/nyheder', function(req, res) {
        Post.find((err, res2) => {  
            if (err) {
                res.render('nyheder.ejs', {
                    user : req.user,
                    message : req.flash('newsMessage')
            });
            } else {
                res.render('nyheder.ejs', {
                    user : req.user,
                    posts : res2,
                    message : req.flash('newsMessage')
                }); 
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
    app.post('/login', usernameToLowerCase, passport.authenticate('local-login', {
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

    // process the signup form
    app.post('/signup', usernameToLowerCase, passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    })); 

    // =====================================
    // BUNCH OF PAGES ======================
    // =====================================

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

    // =====================================
    // UPDATE ORDER STATUS =================
    // =====================================

    app.get('/updateorder/:id/:newstatus', isLoggedIn, function(req, res) {
        
        if(req.user.local.role === "Admin") {
            Order.findOneAndUpdate({'_id' : req.params.id}, {'order.status' : req.params.newstatus}, {upsert:true}, (err, result) => {
            Order.find((err, result) => {  
            if (err) {
                req.flash('orderMessage', 'Der skete en fejl')
                res.redirect('/alleordrer');
            } else {
                req.flash('orderMessage', 'Ordren blev opdateret')
                res.redirect('/alleordrer'); 
            }
            });
        });
        } else {
            res.redirect('/profile');
        }; 
    });

    // =====================================
    // DISPLAY USER INFORMATION ============
    // =====================================

    app.get('/displayuser/:id', isLoggedIn, function(req, res) {
        if(req.user.local.role === "Admin") {
            User.findById(req.params.id, (err, result) => {
                res.render('displayuser.ejs', {
                    founduser : result}); 
            });
        } else { 
            req.flash('profileMessage','Du mangler rettigheder');
            res.redirect('/profile')
        }
    });

    // =====================================
    // DELETE A NEWSPOST ===================
    // =====================================

    app.get('/deletepost/:id', isLoggedIn, function(req, res) {
        if(req.user.local.role === "Admin") {
            Post.findByIdAndRemove(req.params.id, (err, result) => {
                if (err) {
                    req.flash('newsMessage','Der skete en fejl');
                    res.redirect('/nyheder')
                } else {
                    req.flash('newsMessage','Nyheden blev slettet');
                    res.redirect('/nyheder')
                }
            });
        } else {
            req.flash('loginMessage','Du mangler rettigheder');
            res.redirect('/profile')
        }       
    });

    // =====================================
    // DELETE AN ORDER =====================
    // =====================================

    app.get('/deleteorder/:orderUserId/:id', isLoggedIn, function(req, res) {

        if(req.user._id == req.params.orderUserId || req.user.local.role == 'Admin') {
            Order.findByIdAndRemove(req.params.id, (err, newresult) => {
            Order.find({ 'order.customerId': req.user._id }, (err, result) => {
                
                if(req.user.local.role == 'Admin') {
                    req.flash('orderMessage', 'Ordren blev slettet');
                    res.redirect('/alleordrer'); 
                } else {
                    req.flash('profileMessage', 'Ordren blev slettet');
                    res.redirect('/profile')
                }
            });
        });
        } else {
            res.render('profile.ejs', {
                user : req.user,
                message : "Noget gik galt... UserId: " + req.user._id + "orderUserId: " + req.params.orderUserId
            }); 
        }   
    });

    // =====================================
    // SHOW PROFILE ========================
    // =====================================

    app.get('/profile', isLoggedIn, function(req, res) {
        //{ 'order.customerId': '5a31adc04c3cbf0860116616' },
        Order.find({ 'order.customerId': req.user._id }, (err, result) => {  
            if (err) {
                res.render('profile.ejs', {
                    user : req.user, // get the user out of session and pass to template
                    message : req.flash('profileMessage')
            });
            } else {
                res.render('profile.ejs', {
                    user : req.user,
                    orders : result,
                    message : req.flash('profileMessage') // get the user out of session and pass to template
                }); // load the index.ejs file
            }
        });
    });

    /*app.get('/profile/:message', isLoggedIn, function(req, res) {
        //{ 'order.customerId': '5a31adc04c3cbf0860116616' },
        Order.find({ 'order.customerId': req.user._id }, (err, result) => {  
            if (err) {
                res.render('profile.ejs', {
                    user : req.user, // get the user out of session and pass to template
                    message : 'error'
            });
            } else {
                res.render('profile.ejs', {
                    user : req.user,
                    orders : result,
                    message : req.params.message // get the user out of session and pass to template
                }); // load the index.ejs file
            }
        });
    });*/

    // =====================================
    // SHOW ALL ORDERS =====================
    // =====================================

    app.get('/alleordrer', isLoggedIn, function(req, res) {
        
            if(req.user.local.role === "Admin") {
                Order.find((err, result) => {  
                if (err) {
                    req.flash('profileMessage', 'Der skete en fejl');
                    res.redirect('/profile');
                } else {
                    res.render('alleordrer.ejs', {
                        user : req.user,
                        orders : result,
                        message : req.flash('orderMessage')
                    }); 
                }
                });
            } else {
                req.flash('profileMessage', 'Du mangler rettigheder')
                res.redirect('/profile');
            }; 
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
    req.flash('loginMessage', 'Du er ikke logget ind')
    res.redirect('/login');
};

function usernameToLowerCase(req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}
    
    