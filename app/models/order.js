// app/models/user.js
// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({

    order            : {
        customerId   : String,
        ordertype    : String,
        text         : String,
        date         : String
    }
    
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);