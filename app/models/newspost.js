// app/models/user.js
// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
var newspostSchema = mongoose.Schema({

    local            : {
        headline     : String,
        text         : String,
        date         : String,
        imagePath    : String
    }
    
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Newspost', newspostSchema);