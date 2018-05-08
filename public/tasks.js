function task1(data){
	//console.log(data);
	var objectsFromTask =[];

	Object.keys(data).map(key => data[key]).forEach(function(data_points,key) {

		var j,a,b,c,p,S,sina,alpha2;
		var out1 = [];

		if(data_points && data_points.length>1){
			j=data_points.length-2;
			for(var i=0;i<j;i++){
				a = Math.sqrt(Math.pow(data_points[i+1].latitude-data_points[i].latitude,2) + Math.pow(data_points[i+1].longitude-data_points[i].longitude,2));
				b = Math.sqrt(Math.pow(data_points[i+2].latitude-data_points[i+1].latitude,2) + Math.pow(data_points[i+2].longitude-data_points[i+1].longitude,2));
				c = Math.sqrt(Math.pow(data_points[i+2].latitude-data_points[i].latitude,2) + Math.pow(data_points[i+2].longitude-data_points[i].longitude,2));

				p = (a+b+c)/2;
				S = Math.sqrt(p*(p-a)*(p-b)*(p-c));
				sina = 2*S/(a*b);
				if(sina>=-1 && sina<=1){
					alpha2 = Math.sin(sina);
					out1.push(Math.round((alpha2*180)/Math.PI));
				}
			}
			//console.log('out1', out1);
			var ysrednen =[];
			ysrednen.push({pointNumber:0, y:out1[0]});
			for(var i=0;i<out1.length-1;i++){
				ysrednen.push({pointNumber:i, y: (out1[i]+out1[i+1])/2});
			}
			//console.log('ysrednen', ysrednen);
			var speeds = [];
			for(var i=0;i<data_points.length;i++){
				speeds.push({pointNumber:i, y: data_points[i].speed});
			}
			//console.log('speeds', speeds);
			objectsFromTask.push({UserName:Object.keys(data)[key],Data:ysrednen,Speeds: speeds});
		}
	});	
return objectsFromTask;
}

function task3(data){
	var objectsFromTask =[];
	
	var R=6356863;
	Object.keys(data).map(key => data[key]).forEach(function(data_points,key) {
		var rasst=[{ PointNumber:0, Rasst: 0 }];
		var S=0;
		for(var i=0;i<data_points.length-1;i++){
			S += R*Math.acos(Math.sin(data_points[i].latitude)*Math.sin(data_points[i+1].latitude)+Math.cos(data_points[i].latitude)*Math.cos(data_points[i+1].latitude)*Math.cos(data_points[i].longitude-data_points[i+1].longitude));
      		rasst.push({ PointNumber:i, Rasst: S/1000 });//S в км, поэтому /1000
		}
		objectsFromTask.push({UserName: Object.keys(data)[key],Data: rasst});
	});
return objectsFromTask;	
}



	// var objectsFromTask =[];
	// var rasst=[{ PointNumber:0, Rasst: 0 }];
	// var R=6356863;
	// Object.keys(data).map(key => data[key]).forEach(function(data_points,key) {
	// 	var zeroPoint={latitude: data_points[0].latitude, longitude: data_points[0].longitude};
	// 	for(var i=1;i<data_points.length;i++){
	// 		var S = R*Math.acos(Math.sin(zeroPoint.latitude)*Math.sin(data_points[i].latitude)+Math.cos(zeroPoint.latitude)*Math.cos(data_points[i].latitude)*Math.cos(zeroPoint.longitude-data_points[i].longitude));
 //      		rasst.push({ PointNumber:i, Rasst: S/1000 });//S в км, поэтому /1000
	// 	}
	// 	objectsFromTask.push({UserName: Object.keys(data)[key],Data: rasst});
	// });