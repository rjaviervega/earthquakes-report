//
// Earthquakes App.js
//

//
// Vars
//
var map;
var infoWindow = new google.maps.InfoWindow;
var circle;
var markerCircle;
var markersArray = [];

//
// InfoWindow Setup
//
var onMarkerClick = function() {
      var marker = this;
      var latLng = marker.getPosition();
      infoWindow.setContent(
        '<div>' +
            '<strong>Date:</strong> '+marker.dateTime+'<br />' +
            '<strong>Location:</strong> ' +latLng.lat() + ', ' + latLng.lng() + '<br />' +
            '<strong>Magnitude:</strong> '+marker.Magnitude +  '<br />' +
            '<strong>Depth:</strong> '    +marker.Depth +  '<br />' +
            '<strong>Region:</strong> '   +marker.Region +  '<br />' +
            '<strong>Timestamp:</strong> '+marker.UnixTimeStamp + 
        '</div>');
      infoWindow.open(map, marker);
};


//
// Initialization
//
$(document).ready(function() {
    
    // Init Google Map
    initializeMap();    
    
    // AJAX Get Data from API
    loadEarthQuakeData('');
    
    // Bind click to infoWindow
    google.maps.event.addListener(map, 'click', function() {
          infoWindow.close();
    });
     
     // Bind Search Button to Pull Data
    $('#search_btn').click(filterData);
});




//
// Google Map Setup
//
function initializeMap() {
  var mapOptions = {
    zoom: 1,
    center: new google.maps.LatLng(0, 0)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


/** AJAX call to get earthquake json data from server. 
 * @param query     URL Encoded String with query data 
 * @return void
 */
function loadEarthQuakeData(query) {
	
	//
	// Remove All Markers
	//
	for (var i = 0; i < markersArray.length; i++ ) {
	    markersArray[i].setMap(null);
	}
	markersArray.length = 0;
			
	// 
	// Get Data From Server
	//
	$.get('/earthquakes.json'+query, 
		function(data) {			
			for (var i=0; i<data.length;i++) {
				var marker = new google.maps.Marker({
				      position: new google.maps.LatLng(data[i].location[1],data[i].location[0]),
				      map: map
				  });				
				  marker.dateTime = data[i].Datetime;
				  marker.Magnitude = data[i].Magnitude;				
				  marker.Depth = data[i].Depth;				
				  marker.Region = data[i].Region;				
				  marker.UnixTimeStamp = data[i].UnixTimeStamp;																
				  markersArray.push(marker);	
				  google.maps.event.addListener(marker, 'click', onMarkerClick);
			}			
		}
	);	
}

//
// Process Filter Options
//
function filterData() {
	

	
	var query = '';
	
	//
	// Perferom New Query
	//
	var err = false, addCircle = false;
	
	try {
		if ($('#on').val()!='')	{
			var value = parseInt($('#on').val());
			if (isNaN(value)) err = true;
			query += 'on='+value+'&';
		}
	
		if ($('#since').val()!='')	{	
			var value = parseInt($('#since').val());
			if (isNaN(value)) err = true;			
			query += 'since='+$('#since').val()+'&';
		}
	
		if ($('#over').val()!='') {
			var value = parseFloat($('#over').val());
			if (isNaN(value)) err = true;						
			query += 'over='+$('#over').val()+'&';
		}
	
		if ($('#lat').val()!='' && $('#lon').val()) {
			
			var lat = parseFloat($('#lat').val());
			var lon = parseFloat($('#lon').val());			
									
			query += 'near='+$('#lat').val()+','+$('#lon').val();
			var miles = 5;
			
			if ($('#miles').val()!='') miles = $('#miles').val();
			query += '&miles='+miles;
			
			if (isNaN(lat) || isNaN(lon) || isNaN(miles)) err = true;
			
			addCircle = true;
		}
	} catch(e) {
		alert(e);
		return ;
	} 
	
	if (err) {
		alert('Error on input, please check your values.');
		return;
	}
	
	
	// Clear Data & UI
	for (var i = 0; i < markersArray.length; i++ ) {
	    markersArray[i].setMap(null);
	}

	markersArray.length = 0;
	markersArray = [];	
	
	if (circle!=null) circle.setMap(null);	
	//
	
	if (addCircle) 
		addCircleToMap($('#lat').val(), $('#lon').val(), miles);
	
	
	loadEarthQuakeData('?'+query);
}

//
// Overlay Circle 
//
function addCircleToMap(lat, lon, km) {
	var r = km * 1000 * 1.609;
	
	if (circle!=null) { 
		circle.setMap(null);
		if (markerCircle!=null)
			markerCircle.setMap(null);
	}
	
	circle = new google.maps.Circle({
	          map: map,
	          radius: r
	        });
	
	markerCircle = new google.maps.Marker({
	      position: new google.maps.LatLng(lat, lon),
	      map: map
    });		
	circle.bindTo('center', markerCircle, 'position');
}

