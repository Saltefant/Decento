var Post = require('../app/models/newspost');
var Order = require('../app/models/order');
var User = require('../app/models/user');

//To uplaod image
var fs = require('fs');
var multer  = require('multer');


// app/routes.js
module.exports = function(app, passport) {

// =====================================
// FORCE HTTPS =========================
// =====================================

app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https://decento.herokuapp.com'+req.url);
    else
      next(); // Continue to other routes if we're not redirecting
});

// =====================================
// SHOW HOME PAGE ======================
// =====================================

app.get('/', function(req, res) {
    res.render('index.ejs', {
        user : req.user, // get the user out of session and pass to template
    });
});

app.get('/brugerinfo', isLoggedIn, function(req, res) { 
    res.render('brugerinfo.ejs', {
        user : req.user
    });
});

app.post('/updateuser', isLoggedIn, function (req, res) {
    User.findOneAndUpdate({'_id' : req.user._id}, {
        'userinformation.firstName' : req.body.firstName,
        'userinformation.lastName' : req.body.lastName,
        'userinformation.adress' : req.body.adress,
        'userinformation.postalcode' : req.body.postalcode,
        'userinformation.city' : req.body.city,
        'userinformation.phone' : req.body.phone,
        'userinformation.email' : req.body.email, 
        'firminformation.firmName' : req.body.firmName,
        'firminformation.adress' : req.body.fadress,
        'firminformation.postalcode' : req.body.fpostalcode,
        'firminformation.city' : req.body.fcity,
        'firminformation.phone' : req.body.fphone,
        'firminformation.email' : req.body.femail 
    }, {upsert:true}, (err, res2) => {
        if (err) {
            req.flash('profileMessage', 'Noget gik galt...' + err);
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

    newOrder = new Order();
    d = new Date();

    newOrder.order.customerId = req.body.userId;
    newOrder.order.ordertype = req.body.ordertype;
    newOrder.order.details = req.body.details;
    newOrder.order.wantedDate = req.body.date;
    newOrder.response.status = 'Venter på bekræftelse';

    newOrder.location.adress = req.body.adress;
    newOrder.location.postalcode = req.body.postalcode;
    newOrder.location.city = req.body.city;

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;}

    newOrder.order.dateCreated = `${addZero(d.getDate())}-${addZero(d.getMonth()+1)}-${d.getFullYear()} Kl. ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
    
    if(newOrder.save()) {
        req.flash('profileMessage', 'Din ordre blev oprettet');
        res.redirect('/profile'); 
    } else {
        req.flash('profileMessage', 'Noget gik galt...');
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
        
            if(newPost.save()) {
                req.flash('profileMessage', 'Nyheden blev oprettet');
                res.redirect('/profile');
            } else {
                req.flash('profileMessage', 'Noget gik galt...');
                res.redirect('/profile');  
            }
        } else {
        req.flash('loginMessage', 'Du mangler rettigheder');
        res.redirect('/login');
    }
});

// =====================================
// SHOW NEWS SECTION ===================
// =====================================

app.get('/nyheder', function(req, res) {
    Post.find({}).sort({'newspost.date': 'desc'}).exec(function(err, res2) {  
        if (err) {
            req.flash('newsMessage', 'Noget gik galt...' + err)
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
// BUNCH OF EMPTY PAGES ======================
// =====================================

app.get('/kontakt', function(req, res) {
    res.render('kontakt.ejs', {
        user : req.user 
    });
});

app.get('/cases', function(req, res) {
    res.render('cases.ejs', {
        user : req.user
    });
});

app.get('/boligfoto', function(req, res) {
    res.render('boligfoto.ejs', {
        user : req.user 
    });
});

app.get('/bilfoto', function(req, res) {
    res.render('bilfoto.ejs', {
        user : req.user 
    });
});

app.get('/produktfoto', function(req, res) {
    res.render('produktfoto.ejs', {
        user : req.user
    });
});

app.get('/bryllupsfoto', function(req, res) {
    res.render('bryllupsfoto.ejs', {
        user : req.user 
    });
});

app.get('/portraetfoto', function(req, res) {
    res.render('portraetfoto.ejs', {
        user : req.user 
    });
});

// =====================================
// UPDATE ORDER STATUS =================
// =====================================

app.get('/customeraccept/:customerid/:orderid/:status', isLoggedIn, function(req, res) { //__________________________________________________________________________________
    
    if(req.user._id == req.params.customerid) {
            Order.findOneAndUpdate({'_id' : req.params.orderid}, {
                'customerResponse.accepted' : req.params.status
            }, {upsert:true}, (err, result) => {
                if(err) {
                    req.flash('profileMessage', "Noget gik galt... " + err);
                    res.redirect('/profile')
                }
            Order.find({}).sort({'order.dateCreated':'desc'}).exec(function(err, result) {  
                if (err) {
                    req.flash('profileessage', 'Noget gik galt... ' + err)
                    res.redirect('/profile');
                } else {
                    req.flash('profileMessage', 'Ordren blev opdateret')
                    res.redirect('/profile'); 
                }
            });
        });
    } else {
        req.flash('profileMessage','Du mangler rettigheder');
        res.redirect('/profile')
    }; 
});

// =====================================
// UPDATE ORDER STATUS =================
// =====================================

app.post('/updateorder/:orderid', isLoggedIn, function(req, res) { //__________________________________________________________________________________
    
    if(req.user.local.role === "Admin") {
            Order.findOneAndUpdate({'_id' : req.params.orderid}, {
                'response.status' : req.body.status,
                'response.comments' : req.body.comments,
                'response.actualDate' : req.body.date,
                'response.price' : req.body.price,
                'response.downloadLink' : req.body.downloadLink,
                'customerResponse.accepted' : 'Venter på bekræftelse'
            }, {upsert:true}, (err, result) => {
                if(err) {
                    req.flash('profileMessage', "Noget gik galt... " + err);
                    res.redirect('/profile')
                }
            Order.find({}).sort({'order.dateCreated':'desc'}).exec(function(err, result){  
                if (err) {
                    req.flash('profileMessage', 'Noget gik galt... ' + err)
                    res.redirect('/profile');
                } else {
                    req.flash('profileMessage', 'Ordren blev opdateret')
                    res.redirect('/profile'); 
                }
            });
        });
    } else {
        req.flash('profileMessage','Du mangler rettigheder');
        res.redirect('/profile')
    }; 
});

// =====================================
// DISPLAY USER INFORMATION ============
// =====================================

app.get('/displayuser/:id', isLoggedIn, function(req, res) {
    if(req.user.local.role === "Admin") {
        User.findById(req.params.id, (err, result) => {
            if(err)
            { 
                req.flash('profileMessage', "Noget gik galt... " + err);
                res.redirect('/profile')
            } else {
            res.render('displayuser.ejs', {
                user : req.user,
                founduser : result}); 
            }
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
                req.flash('newsMessage','Noget gik galt... ' + err);
                res.redirect('/nyheder')
            } else {
                req.flash('newsMessage','Nyheden blev slettet');
                res.redirect('/nyheder')
            }
        });
    } else {
        req.flash('profileMessage','Du mangler rettigheder');
        res.redirect('/profile')
    }       
});

// =====================================
// DELETE AN ORDER =====================
// =====================================

app.get('/deleteorder/:orderUserId/:id', isLoggedIn, function(req, res) {

    if(req.user._id == req.params.orderUserId || req.user.local.role == 'Admin') {
        
            Order.findByIdAndRemove(req.params.id, (err, newresult) => {
                if(err) {
                    req.flash('profileMessage', 'Noget gik galt... ' + err);
                    res.redirect('/profile'); 
                }

            Order.find({ 'order.customerId': req.user._id }).sort({'order.dateCreated':'desc'}).exec(function(err, result){
                if(err) {
                    req.flash('profileMessage', 'Noget gik galt... ' + err);
                    res.redirect('/profile'); 
                }
                
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
        req.flash('profileMessage', 'Du mangler rettigheder');
        res.redirect('/profile'); 
    }   
});

// =====================================
// SHOW PROFILE ========================
// =====================================

app.get('/profile', isLoggedIn, function(req, res) {
    Order.find({ 'order.customerId': req.user._id }).sort({'order.dateCreated':'desc'}).exec(function(err, result) {  
        if (err) {
            req.flash('profileMessage', 'Noget gik galt... ' + err)
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

// =====================================
// SHOW ALL ORDERS =====================
// =====================================

app.get('/alleordrer', isLoggedIn, function(req, res) {
    
        if(req.user.local.role === "Admin") {
            Order.find({}).sort({'order.dateCreated':'desc'}).exec(function(err, result) {  
            if (err) {
                req.flash('profileMessage', 'Noget gik galt... ' + err);
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
// SHOW ALL WAITING ORDERS =============
// =====================================

app.get('/alleaaccepteredeordrer', isLoggedIn, function(req, res) {
    
        if(req.user.local.role === "Admin") {
            Order.find({ 'customerResponse.accepted': 'Accepteret' }).sort({'order.dateCreated':'desc'}).exec(function(err, result) {  
            if (err) {
                req.flash('profileMessage', 'Noget gik galt... ' + err);
                res.redirect('/profile');
            } else {
                res.render('alleaaccepteredeordrer.ejs', {
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
// SHOW ALL WAITING ORDERS =============
// =====================================

app.get('/alleafventendeordrer', isLoggedIn, function(req, res) {
    
        if(req.user.local.role === "Admin") {
            Order.find({ 'response.status': 'Venter på bekræftelse' }).sort({'order.dateCreated':'desc'}).exec(function(err, result) {  
            if (err) {
                req.flash('profileMessage', 'Noget gik galt... ' + err);
                res.redirect('/profile');
            } else {
                res.render('alleafventendeordrer.ejs', {
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
// DISPLAY AN ORDER ====================
// =====================================

app.get('/displayorder/:id', isLoggedIn, function(req, res) {
    
        if(req.user.local.role === "Admin") {
            Order.find({ '_id' : req.params.id },(err, result) => {  
            if (err) {
                req.flash('profileMessage', 'Noget gik galt... ' + err);
                res.redirect('/profile');
            } else {
                res.render('displayorder.ejs', {
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
    
    