//
// EarthQuakes Module
//
var mongo 	= require('mongodb');
var url 	= require('url');

var Server  = mongo.Server,
 	Db  = mongo.Db,
      BSON  = mongo.BSONPure;
//
// Constants
//
var KM_PER_MILE = 1.609;        // Kilomers per Mile Approximation
var RADS_PER_KM = 111.12;       // Kilometers per Radians
//

//
// Module Implementation Begins
//
var _server;
var _db;
var _dbName;
var _colName; 
var _connected = false;  // Flag when connect to DB.

/**
 * Module Exports initializes connection to database and collection.
 * @returns void       
 */
exports.connectDB = function(serverAddr, serverPort, dbName, colName, username, password) {
	
	_server  = new Server(serverAddr, serverPort, {auto_reconnect: true});
	_db      = new Db(dbName, _server);
	_dbName  = dbName;
	_colName = colName;
	
	_db.open(function(err, db) {
		if(!err) {		
			console.log("Connected to '"+_dbName+"' database!");				
			db.authenticate(username, password,function(err2, db2){
	             if(db2){
					_connected = true;
					db.collection(_colName, {strict:true}, function(err3, collection) {
						if (err3) console.log("The "+_colName+" collection doesn't exist.");							
					});
				  	//Ensure Index for Geolocation Query
				  	var collection = db.collection(_colName);
				  	collection.ensureIndex({location: "2d"}, {min: -500, max: 500, w:1}, function(err3, result) {
				      if(err3) return console.dir(err3);
				  	});
	             }
	             else {
	                 console.log(err2);
	             }
	         });
		}
	});
}

/**
 * Returns filter object to query Earthquales Collection in MongoDB
 * @param query     Query Object from Express Route Call
 * @returns         JS Object with 'GET' query parsed to MongoDB Filter format.
 */
function createFilter(query) {
	var filter = {};
	
	try {	
		if (!query) return filter;
	
		// Parse 'on' parameter
		if (query['on']!=null) {
			filter.UnixTimeStamp = parseInt(query['on']);
		}
	
		// Parse 'since' parameter
		if (query['since']!=null) {
			filter.UnixTimeStamp = { $gte: parseInt(query['since']) };
		}
	
		// Parse 'on' and 'since' are set, return results from since to end of day
		if (query['on']!=null && query['since']!=null) {
			// Conver since to Date // Get Max Date // Set Range
			var timestamp = query['on'];
			var date = new Date(timestamp*1000);
			date.setHours(23,59,59,000);
			var endTimestamp = date.getTime()/1000;			
			filter.UnixTimeStamp = { $gte: parseInt(query['since']), $lt: parseInt(endTimestamp)};			
		}
	
		// Parse 'over' magnitude parameter
		if (query['over']!=null) {
			filter.Magnitude = { $gt: query['over'] };
		}

	    // Parse 'near' distance parameter
		if (query['near']!=null) {
	    
		    // Split near into latitude & longitude
			var geo = query['near'].split(',');		
			var lng = parseFloat(geo[1]);
			var lat = parseFloat(geo[0]);
		
			// Calculate Miles Distance (defaul 5 miles)
			var miles = 5;
		
			// Parse 'miles' parameter 
			if (query['miles']!=null) miles = parseFloat(query['miles']);
		
			// Calculate distance formula for MongoDB Geo Query
			var distance = miles*KM_PER_MILE/RADS_PER_KM;
		
			filter.location = { $near:[lng,lat], $maxDistance: distance };			
		}
	} catch (err) {
		console.log('Error parsing query. Check input.')
		console.log(query);		
		filter = {};		
	} 
	
	console.log(filter);
	return filter;
}


exports.createFilter = createFilter;



/**
 * Module Exports route function to perform database query
 * and output JSON data.
 * @param req		request param from express route.
 * @param res		response param from express route.
 * @returns void       
 */
exports.get = function(req, res) {
	
	if (!_connected) {
		console.log('Error module Earthquakes: not connected to database. Call conenct() on module first.');
		res.send();
		return;
	}
	
	// Create Filter From Query Params
	var query = createFilter(req.query);
	
	// Perform Database Query
	_db.collection(_colName, function(err, collection) {
		collection.find(query, {limit: 2000}).toArray(function(err, items) {
			res.send(items);
		});
	});
};
