// app/models/user.js
// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({

    order            : {
        customerId   : String,
        ordertype    : String,
        dateCreated  : String,
        wantedDate   : String,
        details      : String
    }, 
    location         : {
        adress       : String,
        postalcode   : String,
        city         : String
    },
    response         : {
        status       : String,
        comments     : String,
        actualDate   : String,
        price        : String,
        downloadLink : String
    },
    customerResponse : {
        accepted     : String
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);