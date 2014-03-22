/**
 * Unit Testing Module
 * Test Framework: Nodeunit
 * Usage: $ nodeunit example.js
 * URL: https://github.com/caolan/nodeunit
 * Installation: $ npm install nodeunit -g
 */


//
// Unit Test: Test Cases
//

var earthquakes = require('../earthquakes');

//
// Test Cases for Create Filter Function
//
exports.testCreateFilter = function(test) {
	
	var filter = earthquakes.createFilter(null);
	
	// Emtpy Object for null query
	test.equal(Object.keys(filter).length, Object.keys({}).length);
	//
	
	// Parsing ON Query
	var onQuery = {"UnixTimeStamp": 1395037752};
	var onFilter = earthquakes.createFilter({"on": 1395037752});
	test.equal(onQuery[0], onFilter[0]);
	//

	// Parsing Since Query
	onQuery = {"since": 1395037752};
	onFilter = earthquakes.createFilter({"since": 1395037752});
	test.equal(onQuery[0], onFilter[0]);
	//
	
	// Parsing Magnitude Query
	onQuery = { "Magnitude": { "$gt": "3.0"} };
	onFilter = earthquakes.createFilter( {"over": "3.0"} );
	test.deepEqual(onQuery, onFilter, "Error on Magnitud object.");
	//

	// Parsing Near Query
	onQuery = { "location": { "$near": [-10, 10], "$maxDistance": 0.07239920806335493 } } ;
	onFilter = earthquakes.createFilter( {"near": "10,-10"} );
	test.deepEqual(onQuery, onFilter, "Error on Near object.");
	//

	test.done();
}