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

function drawChartBetweenTwoTracks(checkData){
  console.log(checkData);

  var rasstBetweenTwo = [];
  var R=6356863;
  // пока что не обращаем внимание на время
  var tracks = Object.keys(checkData).map(key => checkData[key]);//.forEach(function(obj1) {
   console.log(tracks[0][0]);
  var mintrack = 10000;
  for(var i=0;i<tracks.length;i++){
    if(mintrack > tracks[i].length){
      mintrack = tracks[i].length;
    }
  }

  for(var i=0;i<mintrack;i++){
    rasstBetweenTwo.push(R*Math.acos(Math.sin(tracks[0][i].latitude)*Math.sin(tracks[1][i].latitude)+Math.cos(tracks[0][i].latitude)*Math.cos(tracks[1][i].latitude)*Math.cos(tracks[0][i].longitude-tracks[1][i].longitude)));
  }  
  console.log(rasstBetweenTwo);
  
}


function drawChart(checkData){
 d3.select("#svgForSpeed").remove();
 d3.select("#svgForTemp").remove();
 d3.select("#svgForTask1").remove();

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


}



function drawAnyChart(classname,data,svgId,maxX,maxY,labelY,mainLabel){
  // Calculate Margins and canvas dimensions
  var margin = {top: 40, right: 40, bottom: 40, left: 60},
      width = 700 - margin.left - margin.right,
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
          .text("Points");

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
        .text(function (d) {
            return d.name;
    });
}


function draw2ChartsOnOne(classname,data,svgId,maxX,maxY,labelY,mainLabel){
  // Calculate Margins and canvas dimensions
  var margin = {top: 40, right: 40, bottom: 40, left: 60},
      width = 700 - margin.left - margin.right,
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
          .text("Points");

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
        .text(function (d) {
            return d.name;
    });
}
