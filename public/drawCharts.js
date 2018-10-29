// var data=[
//   {
//     "UserName":"Alex",
//     "Data":[
//       {"PointNumber":"0","Speed":"10"},
//       {"PointNumber":"1","Speed":"15"},
//       {"PointNumber":"2","Speed":"30"}
//     ]
//   },
//   {
//     "UserName":"Test",
//     "Data":[
//       {"PointNumber":"0","Speed":"8"},
//       {"PointNumber":"1","Speed":"7"},
//       {"PointNumber":"2","Speed":"40"}
//     ]
//   }
// ]

function drawChartBetweenTwoTracks(checkData){// task 2.05
  d3.select("#svgForRasstBetweenTwo").remove();
  d3.select("#svgForRasstBetweenTwoFromV1").remove();
  //console.log(checkData);

  var data=[];
  var rasstBetweenTwo = [];
  var rasstBetweenTwoFromV1 = [];
  var Rsst=[];
  var Sp=[];
  var R=6356863;// м
  // пока что не обращаем внимание на время
  var tracks = Object.keys(checkData).map(key => checkData[key]);//.forEach(function(obj1) {
   console.log(tracks);
   //var newD= new Date(tracks[0][0].date);
   //console.log(newD.getTime(), tracks[1][55].date);

  if(tracks.length<2 || tracks.length>2){
    alert('Выберите 2 трека, первым ведущий, затем ведомый!');
  } else {

    // калибровка по времени
  var trackInTime1=[];
  var trackInTime2=[];
  for(var i=0;i<tracks[0].length;i++){
   for(var j=0;j<tracks[1].length;j++){
    if(tracks[0][i].date === tracks[1][j].date){
      trackInTime1.push({latitude: tracks[0][i].latitude, longitude: tracks[0][i].longitude, speed: tracks[0][i].speed});
      trackInTime2.push({latitude: tracks[1][j].latitude, longitude: tracks[1][j].longitude, speed: tracks[1][j].speed});
    }
   }
  }
 //console.log(trackInTime1,trackInTime2);

    // var mintrack = 10000;
    // for(var i=0;i<tracks.length;i++){
    //   if(mintrack > tracks[i].length){
    //     mintrack = tracks[i].length;
    //   }
    // }

    for(var i=0;i<trackInTime1.length;i++){
      var S = R*Math.acos(Math.sin(trackInTime1[i].latitude)*Math.sin(trackInTime2[i].latitude)+Math.cos(trackInTime1[i].latitude)*Math.cos(trackInTime2[i].latitude)*Math.cos(trackInTime1[i].longitude-trackInTime2[i].longitude));
      rasstBetweenTwo.push({ PointNumber:i, Rasst: S });
      var sp=0;
      if(trackInTime1[i].speed<0){
        sp=0;
      } else {
        sp=trackInTime1[i].speed;
      }
      rasstBetweenTwoFromV1.push({ Speed: sp, Rasst: S });
      //Rsst.push(S);
      //Sp.push(sp);
    }  
    console.log(rasstBetweenTwo, rasstBetweenTwoFromV1);

    var maxX=0;
    if(rasstBetweenTwo.length>maxX){
      maxX=rasstBetweenTwo.length;
    }
    var names = Object.keys(checkData)[0]+' и '+Object.keys(checkData)[1];
    data.push({ UserName: names,Data:rasstBetweenTwo });
    drawAnyChart(".mysvg3",data,"svgForRasstBetweenTwo",maxX,3000,"Расстояние, м","Зависимость расстояния от времени");

    data.length=0;
    var speeds = Object.keys(rasstBetweenTwoFromV1).map(key => rasstBetweenTwoFromV1[key]);

    var maxspeed = 0;
    console.log(speeds);
    for(var i=0;i<speeds.length;i++){
      if(maxspeed < speeds[i].Speed){
        maxspeed = speeds[i].Speed;
      }
    }

console.log(maxspeed);
    data.push({ UserName: names, Data:rasstBetweenTwoFromV1 });//Data:rasstBetweenTwoFromV1
    drawPointsChart(".mysvg4",data,"svgForRasstBetweenTwoFromV1",maxspeed,3000,"Расстояние, м","Зависимость расстояния от скорости ведомого","Скорость, км/ч");
  } 
}


function drawChart(checkData){
 d3.select("#svgForSpeed").remove();
 d3.select("#svgForTemp").remove();
 d3.select("#svgForTask1").remove();
 d3.select("#svgForTask3").remove();

  var data=[];
  var maxX=0;
  //console.log(checkData);

  //формирования массива data для графика 1
  Object.keys(checkData).map(key => checkData[key]).forEach(function(data_points,key) {
    //console.log(data_points);
    var dataArray=[];
    if(data_points.length>maxX){
      maxX=data_points.length;
    }

    for(var i=0;i<data_points.length;i++){
      dataArray.push({PointNumber:i,Speed:data_points[i].speed});
    }
    data.push({UserName:Object.keys(checkData)[key],Data:dataArray})
  });
  //console.log(data,maxX);
  drawAnyChart(".mysvg",data,"svgForSpeed",maxX,200,"Скорость км/ч","Зависимость скорости от времени");

  //формирования массива data для графика 2
  data.length=0;
  Object.keys(checkData).map(key => checkData[key]).forEach(function(data_points,key) {
    var dataArray=[];
    if(data_points.length>maxX){
      maxX=data_points.length;
    }

    for(var i=0;i<data_points.length;i++){
      dataArray.push({PointNumber:i,Temperature:Math.round(data_points[i].weather.main.temp-273)});
    }
    data.push({UserName:Object.keys(checkData)[key],Data:dataArray})
  });
  drawAnyChart(".mysvg1",data,"svgForTemp",maxX,30,"Температура °C","Изменение температуры от времени");

                  

  //формирования массива data для графика 3 (task 2.04)
  data.length=0;
  var objtask1=task1(checkData);
  objtask1.forEach(function(obj) {
    //console.log(obj);
    if(obj.Data.length>maxX){
      maxX=obj.Data.length;
    }

    data.push({UserName:obj.UserName,Data:obj.Data,Speeds:obj.Speeds})
  });
  draw2ChartsOnOne(".mysvg2",data,"svgForTask1",maxX,200,"Угол поворота, ° и скорость, км/ч","Изменение угла поворота и скорости от времени");                  

  // траектория пути каждой из машин
  data.length=0;
  var objtask3=task3(checkData);
  objtask3.forEach(function(obj) {
    //console.log(obj);
    if(obj.Data.length>maxX){
      maxX=obj.Data.length;
    }

    data.push({UserName:obj.UserName,Data:obj.Data})
  });
  console.log(data);
  drawAnyChart(".mysvg5",data,"svgForTask3",maxX,3000,"Пройденный путь","Зависисмость пройденного пути от времени");

}

function drawPointsChart(classname,data,svgId,maxX,maxY,labelY,mainLabel,TextX='Время, с'){
  // Calculate Margins and canvas dimensions
  var margin = {top: 40, right: 40, bottom: 40, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var countX;
    if(maxX<100){
      countX=maxX;
    }else{
      countX=maxX/60;
    }
    var xAxis = d3.axisBottom(x).ticks(countX, ",f");//maxX-количество делений по оси х



    var yAxis = d3.axisLeft(y)


    var svg = d3.select(classname+" > svg")
    .style("background-color", '#fff')
    .attr("width", width + margin.left + margin.right+100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id",svgId);

    color.domain(data.map(function (d) { return d.UserName; }));

    var usernames = data;

    x.domain([0, maxX]);
    y.domain([-20, maxY]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

        // Labels
        svg.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .attr("transform", "translate("+ (margin.left - 100 ) +","+(height/2)+")rotate(-90)")
          .text(labelY);

        svg.append("text")
          .style("font-size", "14px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
          .text(TextX);

        //  Chart Title
        svg.append("text")
       .attr("x", (width / 2))
       .attr("y", 20 - (margin.top / 2))
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text(mainLabel);

        var points = svg.selectAll(".dot")
        .data(data[0].Data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.Speed); })
        .attr("cy", function(d, i) { return y(d.Rasst); })
        .style("fill", function(d) { return color(data[0].UserName); });

        
        const result = regression('linear',data[0].Data.map((item) => [item.Speed, item.Rasst]));
        const k = result.equation[0];
const b = result.equation[1];
console.log(result);
        svg.append("line")
        .attr("x1", x(0))
        .attr("y1", y(b))
        .attr("x2", x(maxX))
        .attr("y2", y(maxX*k+b))

        .style("stroke", color(data[0].UserName))
        .style("stroke-width", "3");
}

function drawAnyChart(classname,data,svgId,maxX,maxY,labelY,mainLabel,TextX='Время, с'){
  // Calculate Margins and canvas dimensions
  var margin = {top: 40, right: 40, bottom: 40, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var countX;
    if(maxX<100){
      countX=maxX;
    }else{
      countX=maxX/60;
    }
    var xAxis = d3.axisBottom(x).ticks(countX, ",f");//maxX-количество делений по оси х



    var yAxis = d3.axisLeft(y)

    var line = d3.line()
        .x(function (d) {
          var keys=Object.keys(d);
        return x(d[keys[0]]);
    })
        .y(function (d) {
          var keys=Object.keys(d);
        return y(d[keys[1]]);
    });


    var svg = d3.select(classname+" > svg")
    .style("background-color", '#fff')
    .attr("width", width + margin.left + margin.right+100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id",svgId);

    color.domain(data.map(function (d) { return d.UserName; }));

    var usernames = data;

    x.domain([0, maxX]);
    y.domain([-20, maxY]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

        // Labels
        svg.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .attr("transform", "translate("+ (margin.left - 100 ) +","+(height/2)+")rotate(-90)")
          .text(labelY);

        svg.append("text")
          .style("font-size", "14px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
          .text(TextX);

        //  Chart Title
        svg.append("text")
       .attr("x", (width / 2))
       .attr("y", 20 - (margin.top / 2))
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text(mainLabel);

    var username = svg.selectAll(".username")
        .data(usernames)
        .enter().append("g")
        .attr("class", "username")
    .attr("class", function(d){
        return d.UserName}    );

    username.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
        return line(d.Data);
    })
        .style("stroke", function (d) {
        return color(d.UserName);
    })

    username.append("text")
        .datum(function (d) {
          var newD=d.Data[d.Data.length - 1];
          var keys=Object.keys(newD);
          //console.log(newD[keys[0]],newD[keys[1]]);
        return {
            name: d.UserName,
            x: newD[keys[0]],
            y: newD[keys[1]]
        };
    })
        .attr("transform", function (d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    })
        // .attr("x", 3)
        // .attr("dy", ".35em")
    //     .text(function (d) {
    //         return d.name;
    // });


        var legend = svg.selectAll(".legend")
      .data(usernames)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) {
        return color(d.UserName);});

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.UserName; });

//});
}


function draw2ChartsOnOne(classname,data,svgId,maxX,maxY,labelY,mainLabel,TextX='Время, с'){
  // Calculate Margins and canvas dimensions
  var margin = {top: 40, right: 40, bottom: 40, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var countX;
    if(maxX<100){
      countX=maxX;
    }else{
      countX=maxX/60;
    }
    var xAxis = d3.axisBottom(x).ticks(countX, ",f");//maxX-количество делений по оси х



    var yAxis = d3.axisLeft(y)

    var line = d3.line()
        .x(function (d) {
          var keys=Object.keys(d);
        return x(d[keys[0]]);
    })
        .y(function (d) {
          var keys=Object.keys(d);
        return y(d[keys[1]]);
    });


    var svg = d3.select(classname+" > svg")
    .style("background-color", '#fff')
    .attr("width", width + margin.left + margin.right+100)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id",svgId);

    color.domain(data.map(function (d) { return d.UserName; }));

    var usernames = data;

    x.domain([0, maxX]);
    y.domain([-20, maxY]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

        // Labels
        svg.append("text")
          .attr("text-anchor", "middle")
          .style("font-size", "14px")
          .attr("transform", "translate("+ (margin.left - 94 ) +","+(height/2)+")rotate(-90)")
          .text(labelY);

        svg.append("text")
          .style("font-size", "14px")
          .attr("text-anchor", "middle")
          .attr("transform", "translate("+ (width/2) +","+(height-(margin.bottom -74))+")")
          .text(TextX);

        //  Chart Title
        svg.append("text")
       .attr("x", (width / 2))
       .attr("y", 20 - (margin.top / 2))
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text(mainLabel);

    var username = svg.selectAll(".username")
        .data(usernames)
        .enter().append("g")
        .attr("class", "username")
    .attr("class", function(d){
        return d.UserName}    );

    username.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
        return line(d.Data);
    })
        .style("stroke", function (d) {
        return color(d.UserName);
    })

    username.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
        return line(d.Speeds);
    })
        .style("stroke", function (d) {
        return color(d.UserName);
    })
    .style("opacity", 0.4) ;     

    username.append("text")
        .datum(function (d) {
          var newD=d.Data[d.Data.length - 1];
          var keys=Object.keys(newD);
          //console.log(newD[keys[0]],newD[keys[1]]);
        return {
            name: d.UserName,
            x: newD[keys[0]],
            y: newD[keys[1]]
        };
    })
        .attr("transform", function (d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    })
        // .attr("x", 3)
        // .attr("dy", ".35em")
    //     .text(function (d) {
    //         return d.name;
    // });


                var legend = svg.selectAll(".legend")
      .data(usernames)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) {
        return color(d.UserName);});

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d.UserName; });
}
