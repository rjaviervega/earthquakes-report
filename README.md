###Earthquakes Real Time Webview & API
---
[![Build Status](https://secure.travis-ci.org/rjaviervega/earthquakes-report.svg?branch=master)](https://travis-ci.org/rjaviervega/earthquakes-report.svg)

This repository implements a simple website to display earthquakes data in real time. The purpose of this project is to import real-time earthquake data into a database, expose an API for querying this database and display the results in a simple webpage. The server for API and static files is currently running on heroku.

**The project is composed on 3 parts:**

* Import Data Script in Ruby/Rake.
* Server API implemented in Node with Express and MongoDb.
* Webclient pages (HTML5, CSS, JQUERY, Twitter Bootstrap, Google Maps API 3.0)


The realtime database with earthquakes data is obtained from:

[http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M1.txt](http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M1.txt)


###Configuration

* To use these files you must first configure your 'database access' info and 'binary path' to Mongo. Edit the file 'Rakefile' and change the variables in the section '#Datbase Configuration' variables on top of the script to adjust to your settings.

* The same process must be performed on the NodeJS files. Edit the top section '#Mongo Database Configuration' on the file 'server.js' with the proper database settings.


####Import Data Script

Data of earthquakes is obtained in CSV format and it is processes by the import task to JSON format, which is then imported into MongoDB. The rake task only adds records that have not been already imported. This is achieved by writing a file with the last imported timestamp record and compared every time an import task is ran.


**Files:**

* import_db/Rakefile: Rake task to import latest records.
* import_db/lib/importqk.rb: Ruby class that implements import task.
* import_db/test/importqk_test.rb: Ruby unit test for import class.


**Usage:**

	$ cd import_db/
	$ rake
	
**Unit Test**

Testing import task is done by unit testing the import class that is used to execute the Rake import command.

	$ cd import_db/
	$ cd test/
	$ ruby importqk_test.rb


####Server API

The server API is implemented on Node.js using Express and MongoDB native driver. The server implements a simple API to get parameters to the URL '/earthquakes.json'.

**API Usage:**

	GET /earthquakes.json
	# Returns all earthquakes

	GET /earthquakes.json?on=1364582194
	# Returns earthquakes on the same day (UTC) as the unix timestamp 1364582194

	GET /earthquakes.json?since=1364582194
	# Returns earthquakes since the unix timestamp 1364582194

	GET /earthquakes.json?over=3.2
	# Returns earthquakes > 3.2 magnitude

	GET /earthquakes.json?near=36.6702,-114.8870&miles=5
	# Returns all earthquakes within 5 miles of lat: 36.6702, lng: -114.8870, 
	miles parameters can be chaned to request any number of miles radius.

	NOTES:

	The endpoint can take any combination of GET params, and filter the results properly. 
	If on and since are both present, it should return results since the timestamp until 
	the end of that day.

	EXAMPLES:

	GET /earthquakes.json?over=3.2&near=36.6702,-114.8870&since=1364582194
	# Returns all earthquakes over 3.2 magnitude within 5 miles of 36.6702,-114.8870 
	since 2013-03-29 18:36:34 UTC

	GET /earthquakes.json?over=3.2&on=1364582194&since=1364582194
	# Returns all earthquakes over 3.2 magnitude between 2013-03-29 18:36:34 UTC and
	2013-03-29 23:59:59 UTC
	
	
	
**Unit Test**

Unit test is done using 'nodeunit'.

	# Node unit installation:
	$ npm install nodeunit

	# Unit Test 
	$ cd test/
	$ nodeunit earthquakes_test.js



#### WebClient

The webclient implements a simple client to test and display the earthquakes records. The client fetches data from the server API and displays the results in a google map. The earthquakes API can be query using the sample form to request custom results. The map displays an infoWindow on each marker and shows a dark circle around specific queries for location.

A sample of the app running in heroku can be found at:

#### Live Demo on Heroku

[http://pure-shelf-1510.herokuapp.com/](http://pure-shelf-1510.herokuapp.com/)


#### API Demo on Heroku

[http://pure-shelf-1510.herokuapp.com/earthquakes.json](http://pure-shelf-1510.herokuapp.com/earthquakes.json)

#### Screenshots
<a href="http://pure-shelf-1510.herokuapp.com/">
<img src="https://raw.githubusercontent.com/rjaviervega/earthquakes-report/master/screenshots/img1.png" width="720">
</a>


#### License

This repository is licensed under GPLv3.0.


#### Author

R. Javier Vega





