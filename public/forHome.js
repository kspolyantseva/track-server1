
$.get( "/user", function( data ) {
  for(var i=0;i<Object.keys(data).length;i++){
    if(Object.keys(data)[i]!='_id' && Object.keys(data)[i]!='_v' && Object.keys(data)[i]!='hashedPassword' && Object.keys(data)[i]!='salt'){
      $('#home p.'+Object.keys(data)[i]).append("<p>"+data[Object.keys(data)[i]]+"</p>");
    }
  }
});

var dataTable=[];
var archiveUserTracks=[];
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
//setInterval(function(){
var trackLines=[];
var markers=[];
  $.get("/track",function(data){
    //console.log(data);

//данные для таблицы
  dataTable.length=0;
      for(let i=0;i<Object.keys(data).length;i++){
        let key=Object.keys(data)[i];
        if(data[key].length){
          dataTable.push({userid:data[key][i]._id,username:key,date:data[key][i].date});

        }
      }



    if (trackLines.length) {
      for (let line;line<trackLines.length;line++){
        mymap.removeLayer(trackLines[line]);
        mymap.removeLayer(markers[line]);
      }
    }

      Object.keys(data).map(key => data[key]).forEach(function(data_points,key) {
    //  console.log(data_points.length);
      if(data_points.length){
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

    //маркеры с popup
      markers.push(L.marker(data_points.map(p => [p.latitude, p.longitude])[data_points.length-1],{title:Object.keys(data)[key]}).addTo(mymap).bindPopup('<p>'+Object.keys(data)[key]+'</p>').openPopup());

  //просто popup
      // markers.push(L.popup({closeOnClick:false})
      // .setLatLng(data_points.map(p => [p.latitude, p.longitude])[data_points.length-1])
      // .setContent('<p>'+Object.keys(data)[key]+'</p>')
      // .addTo(mymap));

        // zoom the map to the polyline
        mymap.fitBounds(trackLines[0].getBounds());
        $("#weather").empty();
        var currentIconWeather=data_points[0].weather.weather[0].icon;
        var temp=Math.round(data_points[0].weather.main.temp-273);
        var description=data_points[0].weather.weather[0].description;
        $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C '+description);
      }
    });

  });
//},5000);


  }



  $.get("/trackUser", function(data) {
    archiveUserTracks.length=0;
    data.forEach(function(track) {
     archiveUserTracks.push({trackid:track[0].track,date:track[0].date,weather:track[0].weather.weather[0].description});
    });
  });

  if (target === '#archive-user-tracks'){
    //Добавление списка треков этого пользователя
      //$('.bootstrap-table').empty();
      $("#archtracks-table").bootstrapTable({
        classes:"table table-hover",
        striped:false,
        search:true,
        showToggle:true,
        showColumns:true,
        //pagination:true,
        columns: [{
          checkbox:true,
        }, {
          sortable:true,
          searchable:true,
            field: 'trackid',
            title: 'TrackId'
        }, {
          sortable:true,
          searchable:true,
          field: 'date',
          title: 'Дата и время'
        },{
          sortable:true,
          searchable:true,
          field: 'weather',
          title: 'Погода'
        }],
        data: archiveUserTracks
      });


  }
  if (target === '#last-tracks'){
    //отображение таблицы последних треков
      //$('.bootstrap-table').remove();
      $("#tracks-table").bootstrapTable({
        classes:"table table-hover",
        striped:false,
        search:true,
        showToggle:true,
        showColumns:true,
        //pagination:true,
        columns: [{
          checkbox:true,
        }, {
          sortable:true,
          searchable:true,
            field: 'userid',
            title: 'UserId'
        }, {
          sortable:true,
          searchable:true,
            field: 'username',
            title: 'Имя пользователя'
        },{
          sortable:true,
          searchable:true,
            field: 'date',
            title: 'Дата и время'
        }],
        data: dataTable
      });
      $(".draw1").on('click',function(){
        var selected=$("#tracks-table").bootstrapTable('getSelections');
        console.log(selected);
      })
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
      //console.log(data.url);
      $.post({url: data.url, data: JSON.stringify({
        point: {latitude:55.80267076+counter*2, longitude:37.52918379+counter, speed: 30, date: new Date()},
      }), contentType: 'application/json; charset=utf-8'}, function (data) {
        counter++;
        alert("point added");
      });
    },5000);
  });


});
