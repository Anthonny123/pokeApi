const mongoose = require('mongoose');
let password = 'admin';
let database = 'db';

if(process.env.NODE_ENV === 'test'){
    database = 'testdb';
}

mongoose.connect(`mongodb+srv://admin:${password}@cluster0.v7qat.mongodb.net/${database}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true});
