
$.get( "/user", function( data ) {
  //console.log(data);
  for(var i=0;i<Object.keys(data).length;i++){
    if(Object.keys(data)[i]!='_id' && Object.keys(data)[i]!='_v' && Object.keys(data)[i]!='hashedPassword' && Object.keys(data)[i]!='salt'){
      $('#home p.'+Object.keys(data)[i]).append("<p>"+data[Object.keys(data)[i]]+"</p>");
    }
  }
if(data.name!="admin"){
  $.get("/trackUser", function(tracks) {


//отображение выделенных из архива треков пользователя
      $(".draw2").on('click',function(){
        var checkData={};
        var selected=$("#archtracks-table").bootstrapTable('getSelections');
        for(let i=0;i<selected.length;i++){
          tracks.forEach(function(points) {
            if(points.length){
              if(selected[i].trackid[0]==points[0].track[0]){
                checkData[data.name+i]=points;//пока что с таким именем!
              }
            }
          });
        }
      //  console.log(checkData);
       drawTracks(checkData);
       drawChart(checkData);
      })

    });
}


});


var mymap;
var trackLines=[];
var markers=[];

function clearTracksOnMap(){
  if (trackLines.length) {
    for (let line=0;line<trackLines.length;line++){
      mymap.removeLayer(trackLines[line]);
    }
    for (let line=0;line<markers.length;line++){
      mymap.removeLayer(markers[line]);
    }
  }
  trackLines.length=0;
  markers.length=0;
}

//отрисовка на карте
function drawTracks(data){

  // if (trackLines.length) {
  //   for (let line=0;line<trackLines.length;line++){
  //     mymap.removeLayer(trackLines[line]);
  //     mymap.removeLayer(markers[line]);
  //   }
  // }
  // trackLines.length=0;
  // markers.length=0;

//привязка точек к дорогам
  var apiKey = 'AIzaSyB2kfbulpE0wJURINPHN7nMRuIMfLaGZow';
  Object.keys(data).map(key => data[key]).forEach(function(data_points,key) {
    //console.log(data_points);
  var pathValues;

  if(data_points.length){
    var name=Object.keys(data)[key];

    var numberOfHundreds=Math.floor(data_points.length/100);
    //console.log(numberOfHundreds);
    var tempHundred=0;
    //console.log(data_points);
    var lastHundred=[];

    //for(var i=0;i<=numberOfHundreds;i++){
    var lastPoint;
    var sendNextHundred = function() {
        var tempMas=[];
        if (lastPoint) {
          tempMas.push(lastPoint);
        }
 
        tempHundred=tempHundred+98;
        //console.log(tempHundred-98,tempHundred);
        for(var j=tempHundred-98;j<=tempHundred;j++){
          if(j<data_points.length){
            tempMas.push(data_points[j].latitude+', '+data_points[j].longitude);
            //console.log(i,numberOfHundreds,j,data_points.length-1);

          }
        }


        $.get('https://roads.googleapis.com/v1/snapToRoads', {
            interpolate: true,
            key: apiKey,
            path: tempMas.join('|')
          }, function(datanew) {

              var pointsToRoad=datanew.snappedPoints.map(p => [p.location.latitude, p.location.longitude]);
              if (lastPoint){
                pointsToRoad.unshift(lastPoint.split(', '));
              }
              //console.log(pointsToRoad);
              pushPointsToRoad(data_points,pointsToRoad);

              lastPoint=pointsToRoad[pointsToRoad.length-1][0]+', '+pointsToRoad[pointsToRoad.length-1][1];
              if (data_points.length > tempHundred) {
                sendNextHundred();
              } else {
                //console.log('last is ', pointsToRoad[pointsToRoad.length-1]);
                drawWeatherAndMarker(pointsToRoad,data_points,data,key);
              }
               

          });


    };
    sendNextHundred();
      //}

        //для маркера берем только последнюю сотню
        // $.get('https://roads.googleapis.com/v1/snapToRoads', {
        //     interpolate: true,
        //     key: apiKey,
        //     path: lastHundred.join('|')
        //   }, function(datanew) {

        //       var pointsToRoad=datanew.snappedPoints.map(p => [p.location.latitude, p.location.longitude,p.originalIndex]);
        //       drawWeatherAndMarker(pointsToRoad,data_points,data,key);
            
        //   });

    }
  });
}

function drawWeatherAndMarker(pointsToRoad,data_points,data,key){
    //маркеры с popup
      //console.log('marker',pointsToRoad,pointsToRoad[pointsToRoad.length-1]);
      markers.push(L.marker(pointsToRoad[pointsToRoad.length-1],{title:Object.keys(data)[key]}).addTo(mymap).bindPopup('<p>'+Object.keys(data)[key]+'</p>',{autoPan:false}).openPopup());

        $("#weather").empty();
        var currentIconWeather=data_points[0].weather.weather[0].icon;
        var temp=Math.round(data_points[0].weather.main.temp-273);
        var description=data_points[0].weather.weather[0].description;
        $("#weather").append('<img class="weather-widget__img" src="http://openweathermap.org/img/w/'+currentIconWeather+'.png" alt="Weather Moscow , RU" width="50" height="50">' +temp+ ' °C '+description);

}

function pushPointsToRoad(data_points,pointsToRoad){
  //console.log(pointsToRoad);
  var prevspeed=0;
  trackLines.push(L.multiOptionsPolyline(pointsToRoad, {
      multiOptions: {
          optionIdxFn: function (latLng, prevLatLng, index) {
            //console.log(latLng,index);
            //console.log(index);
            //return index;

            var i, speed,
                speedThresholds = [30, 35, 40, 45, 50, 55, 60, 65];

            if(index>=data_points.length){
              if(prevspeed==0)
              {prevspeed=data_points[index-1].speed; }
              speed=prevspeed;
            }else
            {
              speed=data_points[index].speed;
            }
            //speed=50;

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
}


var interval=-1;
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var target = $(e.target).attr("href"); // activated tab
//  if (target === '#menu1' && !mymap) {
  if (target === '#menu1') {
    if(!mymap){
      mymap = L.map('map').setView([ 55.803045, 37.523525], 10);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 18,
      }).addTo(mymap);
    }



    //обновление треков на карте
    $("#start").on('click',function(){
      if(interval == -1){
        interval=setInterval(function(){
          $.get("/track",function(data){
               //отрисовка треков при открытии карты
              clearTracksOnMap();//очистка карты от треков
              drawTracks(data);
          });
        },5000);
      }
      
    });

    $("#stop").on('click',function(){
      console.log(interval);
      clearInterval(interval);//остановка реал-тайм режима отрисовки
    });

    $("#clearMap").on('click',function(){
      clearTracksOnMap();//очистка карты от треков
    });



  }





  if (target === '#archive-user-tracks'){

    //Добавление списка треков этого пользователя
      var archiveUserTracks=[];
      $.get("/trackUser", function(tracks) {
        console.log(tracks);
          archiveUserTracks.length=0;

            tracks.forEach(function(track) {
              if(track.length){

                var objFromDate=getTimeMetrics(track);
                archiveUserTracks.push({
                  trackid:track[0].track,
                  date:track[0].date,
                  weekday:objFromDate.weekday,
                  weather:track[0].weather.weather[0].description,
                  duration:objFromDate.durationData,
                  amountPoints:track.length
                });
              }
            });
            $("#archuserstracks-table").show();


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
              field: 'weekday',
              title: 'День недели'
            },{
              sortable:true,
              searchable:true,
              field: 'weather',
              title: 'Погода'
            },{
              sortable:true,
              searchable:true,
              field: 'duration',
              title: 'Время в пути'
            },{
              sortable:true,
              searchable:true,
              field: 'amountPoints',
              title: 'Количество точек'
            }],
            data: archiveUserTracks
          });
          $("#archtracks-table").bootstrapTable('load', archiveUserTracks);
        });

  }
  if (target === '#last-tracks'){

    //отображение таблицы последних треков
  var dataTable=[];
      $.get("/track",function(data){
        console.log(data);

        //Отрисовка графиков динамического габарита
        $(".drawChartBetweenTwo").on('click',function(){
           alert('В разработке!'); 
           console.log("push drawChartBetweenTwo");
           var checkData={};
           var selected=$("#tracks-table").bootstrapTable('getSelections');
           for(let i=0;i<selected.length;i++){
             checkData[selected[i].username]=data[selected[i].username];
           }
          drawChartBetweenTwoTracks(checkData);
         })

        //отображение выделенных последних треков
               $(".draw1").on('click',function(){
                 console.log("push draw1");
                 var checkData={};
                 var selected=$("#tracks-table").bootstrapTable('getSelections');
                 for(let i=0;i<selected.length;i++){
                   checkData[selected[i].username]=data[selected[i].username];
                 }
                drawTracks(checkData);
                drawChart(checkData);
               })



    //данные для таблицы последних треков
        dataTable.length=0;
          for(let i=0;i<Object.keys(data).length;i++){

            let key=Object.keys(data)[i];

            if(data[key].length){
              var objFromData=getTimeMetrics(data[key]);
              dataTable.push({
                userid:data[key][0]._id,
                username:key,
                date:data[key][0].date,
                duration:objFromData.durationData,
                weekday:objFromData.weekday,
                amountPoints:data[key].length
              });
            }
          }

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
            },{
              sortable:true,
              searchable:true,
              field: 'weekday',
              title: 'День недели'
            },{
              sortable:true,
              searchable:true,
              field: 'duration',
              title: 'Время в пути'
            },{
              sortable:true,
              searchable:true,
              field: 'amountPoints',
              title: 'Количество точек'
            }],
            data: dataTable
          });
          $("#tracks-table").bootstrapTable('load', dataTable);

      });



  }

});


function getTimeMetrics(track){
  var timestart=Date.parse(track[0].date);
  var timeend=Date.parse(track[track.length-1].date);
  var msDuration=(timeend-timestart);
  var durationData=new Date(msDuration);
  var options = {
    // era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  var weekday=new Date(timestart).toLocaleString("ru", options).split(',')[0];
  return {durationData:durationData.toUTCString().split(' ')[4],weekday:weekday};
}


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
    var counter=0.5;
    setInterval(function(){
      //console.log(data.url);
      $.post({url: data.url, data: JSON.stringify({
        point: {latitude:55.80267076+counter, longitude:37.52918379+counter*0.5, speed: 30, date: new Date()},
      }), contentType: 'application/json; charset=utf-8'}, function (data) {
        counter++;
        alert("point added");
      });
    },5000);
  });


});


$("#addPointFromAccelerometer").on('click',function(){
  $.post({url:'/addNewPointOfAllegedViolations', data: JSON.stringify({
    latitude:55.80267076,
    longitude:37.52918379,
    changeX:30,
    changeY:20,
    changeZ:10,
    date:'2017-11-29T18:18:09.000Z',
  }), contentType: 'application/json; charset=utf-8'}, function (data,err) {
    if(!err) alert("point added");
  });
  return false;
});
