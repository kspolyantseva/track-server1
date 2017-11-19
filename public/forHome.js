
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

//обновление треков на карте
setInterval(function(){
var trackLines=[];
  $.get("/track",function(data){
    console.log(data);

    if (trackLines.length) {
      for (let line;line<trackLines.length;line++){
        mymap.removeLayer(trackLines[line]);
      }
    }

      Object.keys(data).map(key => data[key]).forEach(function(data_points) {
      //console.log(data_points);

      trackLines.push(L.multiOptionsPolyline(data_points.map(p => [p.latitude, p.longitude]), {
          multiOptions: {
              optionIdxFn: function (latLng, prevLatLng, index) {
                //return index;
                var i, speed,
                    speedThresholds = [30, 35, 40, 45, 50, 55, 60, 65];

                speed=data_points[index].speed;

                for (i = 0; i < speedThresholds.length; ++i) {
                    if (speed <= speedThresholds[i]) {
                        return i;
                    }
                }
                return speedThresholds.length;
            },
            options: [
                {color: '#0000FF'}, {color: '#0040FF'}, {color: '#0080FF'},
                {color: '#00FFB0'}, {color: '#00E000'}, {color: '#80FF00'},
                {color: '#FFFF00'}, {color: '#FFC000'}, {color: '#FF0000'}
            ]
          },
          weight: 5,
          lineCap: 'butt',
          opacity: 0.75,
          smoothFactor: 1}).addTo(mymap));

      // zoom the map to the polyline
      mymap.fitBounds(trackLines[0].getBounds());
      $("#weather").empty();
      var currentIconWeather=data_points[0].weather.weather[0].icon;
      var temp=Math.round(data_points[0].weather.main.temp-273);
      $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C');
    });

  });
},5000);

//Добавление списка треков этого пользователя
    // $.get("/track", function(data) {
    //   $('.tracks').empty();
    //   data.tracks.forEach(function(track) {
    //     $('.tracks').append($('<option/>').text('track #' + track._id).attr({value: track._id}));
    //   });
    //   $('.tracks').change();
    // });
  }
});


// var trackLine;
//
// $('.tracks').on('change', function(){
//   $.get("/track/" + $('.tracks').val(),function(data){
//     console.log(data);
//     if (trackLine) {
//       mymap.removeLayer(trackLine);
//     }
//     trackLine = L.polyline(data.points.map(p => [p.latitude, p.longitude]), {color: 'red'}).addTo(mymap);
//     // zoom the map to the polyline
//     mymap.fitBounds(trackLine.getBounds());
//     $("#weather").empty();
//     var currentIconWeather=data.points[0].weather.weather[0].icon;
//     var temp=Math.round(data.points[0].weather.main.temp-273);
//     $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C');
//
//     //метка
//   });
// });

$("#addTrack").on('click',function(){

  $.post({url: '/track', data: JSON.stringify({

  }), contentType: 'application/json; charset=utf-8'}, function (data) {
    alert("added"+data.url);
    var counter=3;
    setInterval(function(){
      console.log(data.url);
      $.post({url: data.url, data: JSON.stringify({
        point: {latitude:55.80267076+counter*2, longitude:37.52918379+counter, speed: 30, date: new Date()},
      }), contentType: 'application/json; charset=utf-8'}, function (data) {
        counter++;
        alert("point added");
      });
    },5000);
  });


});
