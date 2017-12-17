// app/models/user.js
// load the things we need
const mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        username     : String,
        displayName  : String,
        password     : String,
        role         : String
        },
    userinformation  : {
        firstName    : String,
        lastName     : String,
        adress      : String,
        postalcode   : String,
        city         : String,
        phone        : String,
        email        : String
    },
    firminformation  : {
        firmName     : String,
        adress      : String,
        postalcode   : String,
        city         : String,
        phone        : String,
        email        : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);