/*Objective: Use GoogleMaps API and allow users to PinInterest any place in the world. I intend to build an application and understanding APIs
is critical. Therefore, wanted to explore it with using the following techniques: 
   (i) DOM element creation, deletion or modification
   (ii)Capturing and handling events
   (iii)Form Validation
   (iv) Closures
   (v) jquery
There are number of extensions that I have planned for this work like calculating distance between two points, integrate additional APIs to
provide more information about the geolocation etc. The code is inspired from the help available at Google's developer's platform.
*/
//Set-up Landing Point
const Harvard = new google.maps.LatLng(42.3770, -71.1167);
var map_property = {
  center:Harvard,
  zoom:15,
  mapTypeId:google.maps.MapTypeId.ROADMAP
};

//Initializes the information window
var infoCallout = new google.maps.InfoWindow({
  text: ""
})

//Set up google maps
function set_up() {
  //Drop Landing Pin
  var pointer=new google.maps.Marker({
    position: Harvard,
    draggable:true,// From https://developers.google.com/ assessed on 12/2/2016
    title:"Harvard U"
  });
  var map=new google.maps.Map(document.getElementById("googleMap"),map_property);
  pointer.setMap(map);
  
  //Welcome to Harvard U! message
  var text = "Welcome to Harvard U!"
  infoCallout.setContent(text);
  infoCallout.open(map,pointer);

  //On Click event listener to place pointers on map
  google.maps.event.addListener(map, 'click', function(evt){
    infoCallout.close();
    dropPointer(evt.latLng, map);
  });
};

//Form Validations (Parts of the code adapted from class lectures)
$('#mapform').validate({
      submitHandler: function(form) {
      //Setting-up the lat/long coordinates
      var latitude = document.getElementById('latitude').value;
      var longitude = document.getElementById('longitude').value;
      const latlong = new google.maps.LatLng(latitude, longitude);
      dropPointer(latlong, map);
      google.maps.event.addListener(map, 'click', function(evt){
      infoCallout.close();
      dropPointer(evt.latlong, map);
      });
      return false; //prevents reloading of page (idea suggested from a developer friend)
    },

    //Error display when latlongs not within prescribed limits (Coding style adapted from www.stackoverflow.com assessed on 12/9/2016)
    invalidHandler: function(event, validator) {
      var errors = validator.numberOfInvalids();
      if( errors ) {
        var message = ( errors === 1 ) ? 'highlighted field'
                                       : errors + ' highlighted fields';
        $('.submit-error').show().find('span').html(message);
      }
    },

    //Validation guidance
    validationRules: {
      latitude: {
        required: true,
        max: 90,
        min: -90
      },
      longitude: {
        required: true,
        max: 180,
        min: -180
      }
    },
    //Error messages displayed 
    errorMessage:{
      latitude: {
        required: "Latitude cannot be blank",
        max: "The max is 90",
        min: "The min is -90"
      },
      longitude: {
        required: "Longitude cannot be blank",
        max: "The max is 180",
        min: "The min is -180"
      }
    }
  });

// Adding local time
window.onload = digitalClock;
function digitalClock() {
  var localTime = new Date();
  var hour  = localTime.getHours();
  var minutes = localTime.getMinutes();
  var second = localTime.getSeconds();
  if (minutes < 10) minutes = "0" + minutes; // Reference: www.stackoverflow.com assessed on 12/9/2016
  if (second < 10) second = "0" + second; // Reference: www.stackoverflow.com assessed on 12/9/2016
  document.getElementById('clockDisplay').innerHTML
        = "Your Local Time is " + hour + ":" + minutes + ":" + second;
  setTimeout('digitalClock()', 1000);
}

//Drops a pointer on the user clicked place
function dropPointer(position, map){
  var pointer= new google.maps.Marker({
    position: position,
    map: map
  });
  map.panTo(position);

  //Updates the infoCallout
  var text = "Latitude: " + position.lat()+
      '<br>Longitude: ' + position.lng(); 
    infoCallout.setContent(text);
    infoCallout.open(map,pointer);
};

//Initializes map on page load
google.maps.event.addDomListener(window, 'load', set_up);