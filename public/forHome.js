
$.get( "/user", function( data ) {
  for(var i=0;i<Object.keys(data).length;i++){
    if(Object.keys(data)[i]!='_id' && Object.keys(data)[i]!='_v' && Object.keys(data)[i]!='hashedPassword' && Object.keys(data)[i]!='salt'){
      $('#home p.'+Object.keys(data)[i]).append("<p>"+data[Object.keys(data)[i]]+"</p>");
    }
  }
});

var mymap;
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("href"); // activated tab
  if (target === '#menu1' && !mymap) {
    mymap = L.map('map').setView([ 55.803045, 37.523525], 17);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(mymap);

    $.get("/track", function(data) {
      $('.tracks').empty();
      data.tracks.forEach(function(track) {
        $('.tracks').append($('<option/>').text('track #' + track._id).attr({value: track._id}));
      });
      $('.tracks').change();
    });
  }
});

var trackLine;

$('.tracks').on('change', function(){
  $.get("/track/" + $('.tracks').val(),function(data){
    console.log(data);
    if (trackLine) {
      mymap.removeLayer(trackLine);
    }
    trackLine = L.polyline(data.points.map(p => [p.latitude, p.longitude]), {color: 'red'}).addTo(mymap);
    // zoom the map to the polyline
    mymap.fitBounds(trackLine.getBounds());

    var currentIconWeather=data.points[0].weather.weather[0].icon;
    var temp=Math.round(data.points[0].weather.main.temp-273);
    $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C');

    //метка
  });
});

$("#addTrack").on('click',function(){
  $.post({url: '/track', data: JSON.stringify({
    points: [
      {latitude:55.80267072, longitude:37.52918379, speed: 20, date: new Date()},
      {latitude:55.80279228, longitude:37.52910901, speed: 25, date: new Date()},
      {latitude:55.80278809, longitude:37.52906343, speed: 30, date: new Date()},
      {latitude:55.80294595, longitude:37.52850485, speed: 35, date: new Date()},
    ],
  }), contentType: 'application/json; charset=utf-8'}, function (data) {
    alert("added");
  });
});

/*
$.post('/weather',function(data){
  var currentIconWeather=data[0].weather[0].icon;
  console.log(data);
  var temp=Math.round(data[0].main.temp-273);
  $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C');
});
*/
