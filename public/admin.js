

$.get( "/users", function( data ) {
  for(var i=0;i<data.length;i++){
    var str=$("<li><a name-user='"+data[i]+"'>"+data[i]+"</a></li>");
    $(".drop1").append(str);
  }
});


//Изменение текста кнопки выпадающего списка
function changeButtonText(currentThis,id){
	var caret=$("<span class='caret'></span>");
	if(typeof(currentThis)!="string"){
	   	$(id).text($(currentThis).text()+' ');
	    $(id).val($(currentThis).text());
	}
	else{
		$(id).text(currentThis+' ');
	    $(id).val(currentThis);
	}
    $(id).append(caret);
}

var chosenUser=-1;
//Обработка выпадающего списка "Выбор Пользователя"
$(".drop1").on('click', 'li a', function(){

   	changeButtonText(this,"#dropdownMenu1");
   	chosenUser=$(this).attr("name-user");
   	$("#dropdownMenu1").attr("name-user",chosenUser);

    var archiveUserTracks=[];
    $.get("/trackUser",{username:chosenUser},function(tracks) {
      console.log(tracks);
        archiveUserTracks.length=0;

          tracks.forEach(function(track) {
            if(track.length){
              var objFromDate=getTimeMetrics(track);
              archiveUserTracks.push({
                trackid:track[0].track,
                date:track[0].date,
                weather:track[0].weather.weather[0].description,
                weekday:objFromDate.weekday,
                duration:objFromDate.durationData,
                amountPoints:track.length
              });
            }
          });

          $("#archuserstracks-table").show();


        $("#archuserstracks-table").bootstrapTable({
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
          data: archiveUserTracks
        });
        $("#archuserstracks-table").bootstrapTable('load', archiveUserTracks);

        //Отрисовка графиков динамического габарита
        // $(".drawChartBetweenTwo2").on('click',function(){
        //   alert('В разработке!'); 
        //   console.log("push drawChartBetweenTwo");
        //   var checkData={};
        //   var selected=$("#archuserstracks-table").bootstrapTable('getSelections');
        //   for(let i=0;i<selected.length;i++){
        //     tracks.forEach(function(points) {
        //       if(points.length){
        //         if(selected[i].trackid[0]==points[0].track[0]){
        //           checkData[chosenUser+i]=points;//пока что с таким именем!
        //         }
        //       }
        //     });
        //   }
        //   drawChartBetweenTwoTracks(checkData);
        //  })
        

        $(".draw3").on('click',function(){
          var checkData={};
          var selected=$("#archuserstracks-table").bootstrapTable('getSelections');
          for(let i=0;i<selected.length;i++){
            tracks.forEach(function(points) {
              if(points.length){
                if(selected[i].trackid[0]==points[0].track[0]){
                  checkData[chosenUser+i]=points;//пока что с таким именем!
                }
              }
            });
          }
          // console.log(checkData);
         drawTracks(checkData);
         drawChart(checkData);
        })



      });
});
