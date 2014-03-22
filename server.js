//
// Simple NodeJS API To Query MongoDB Database
//

//
// Mongo Database Configuration
//

// Server Address
var serverAddress  = 'localhost';
// Server Port
var serverPort     = 27017;
// MongoDB Database Name
var databaseName   = 'testdb';
// MongoDB Collection Name
var collectionName = 'col1';
// MongoDB Username
var dbUsername     = 'muser';
//MongoDB Userpass
var dbPassword     = 'muser';

//
// Modules
//
var express     = require('express');
var path        = require('path');
var earthquakes = require('./earthquakes');

//
// Init Module
//
earthquakes.connectDB(serverAddress, serverPort, databaseName, collectionName, dbUsername, dbPassword);

//
// App Init
//
var app = express();

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());
});

//
// Sever Static Files
//
app.use(express.static(path.join(__dirname, 'public')));

//
// Routes
//
app.get('/earthquakes.json', earthquakes.get);

//
// Start Server
//
var port = process.env.PORT || 3000;
app.listen(port);

console.log("Listing on port " + port);
