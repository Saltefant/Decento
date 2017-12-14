// app/models/user.js
// load the things we need
const mongoose = require('mongoose');

// define the schema for our user model
var imagepostSchema = mongoose.Schema({ 
    
    img             : { 
        data        : Buffer, 
        contentType : String,
        path        : String 
    }

});
 
// create the model for users and expose it to our app  
module.exports = mongoose.model('ImagePosts',imagepostSchema);
