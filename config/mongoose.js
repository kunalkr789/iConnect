const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/iconnect_development');

const db = mongoose.connection;

db.on('error', console.log.bind(console, "Error in connecting MongoDB"));

db.once('open', function(){
    console.log('Connected to databse : MongoDB');
});

module.exports = db;