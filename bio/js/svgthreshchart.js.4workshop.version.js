var SVGThreshChart = function (params,svg,canvas_obj,chart_id) {

	this.dataC = params.c_data;
	this.axisX = params.x_axis;
	this.axisY = params.y_axis;
	this.axisZ = params.z_axis;
	this.axisC = params.c_axis;
	
	this.margin = {top:20,right:10,bottom:10,left:40};
	
	this.plotwidth = params.chartWidth - this.margin.right - this.margin.left;
	this.plotHeight = params.chartHeight - this.margin.top - this.margin.bottom;
	
	this.svgContainer = svg;
	this.chartId = chart_id;
	
	this.XFilter = params.x_filter;
	this.YFilter = params.y_filter;
	this.ZFilter = params.z_filter;
	this.CFilter = params.c_filter;
	
	this.ruleOutCItems = params.ruleOutCItems;
	
	this.canvasObj = canvas_obj;
	this.selectedItems = this.canvasObj.selectedItems;
	if(params.a_filter  == undefined ||  params.a_filter == null)
		this.threshold = -1;//params.a_filter.threshold;
	else
		this.threshold = params.a_filter.threshold;
	this.threshold_from = params.bar_from;
    this.threshold_to = params.bar_to;
	console.log("this.threshold = " + this.threshold);
}

/**
To check if a given data is ruled out or not
*/
SVGThreshChart.prototype.isValidData = function (index) {
	if(this.XFilter != undefined && this.XFilter != null) {
		var val = parseExcelNumber( this.canvasObj.dataCaseArr[index].getPropVal(this.axisX));
		if(val<this.XFilter.from || val>this.XFilter.to)
			return false;
	}
	if(this.YFilter != undefined && this.YFilter != null) {
		var val = parseExcelNumber(this.canvasObj.dataCaseArr[index].getPropVal(this.axisY));
		if(val<this.YFilter.from || val>this.YFilter.to)
			return false;
	}
	if(this.ZFilter != undefined && this.ZFilter != null) {
		var val = parseExcelNumber(this.canvasObj.dataCaseArr[index].getPropVal(this.axisZ));
		if(val<this.ZFilter.from || val>this.ZFilter.to)
			return false;
	}
	if(this.CFilter != undefined && this.CFilter != null) {
		if($.inArray(processStr( this.canvasObj.dataCaseArr[index].getPropVal(this.axisC) ),
					 this.ruleOutCItems) >= 0) 
			return false;
	}
	return true;
}

/**
	Get max value of datax,datay or dataz
**/
SVGThreshChart.prototype.getMaxVal = function(type) {
	var tmpVals = [];
	var i = 0;
	for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
		if(this.isValidData(i)) {
			if(type == 'x')
				tmpVals.push( this.canvasObj.dataCaseArr[i].getPropVal(this.axisX) );
			else if (type == 'y')
				tmpVals.push( this.canvasObj.dataCaseArr[i].getPropVal(this.axisY) );
			else if (type == 'z')
				tmpVals.push( this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ) );
		}
	}
	return d3.max(tmpVals, function(d){ return parseExcelNumber(d)});
}

SVGThreshChart.prototype.getMinVal= function(type) {
	var tmpVals = [];
	var i = 0;
	
	for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
		if(this.isValidData(i)) {
			if(type == 'x')
				tmpVals.push(this.canvasObj.dataCaseArr[i].getPropVal(this.axisX));
			else if (type == 'y')
				tmpVals.push(this.canvasObj.dataCaseArr[i].getPropVal(this.axisY));
			else if (type == 'z')
				tmpVals.push(this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ));
		}
	}
	return d3.min(tmpVals, function(d){ return parseExcelNumber(d)});
}

/**
    Since in this plotting, as we change the throttle/threshold, the max and min value of yaxis 
    vary a lot. To make the viewport more stable, here we calculate a max of maxs, min of mins, so 
    that even when we are dragging the slider, the ysclale can still be stable.
**/
SVGThreshChart.prototype.getYScale = function (valid_cases) {
    var max_of_maxs = -1;
    var min_of_mins = 10000;
    var i,j;
    var max,min;
    var tmpdata;
    for(i=this.threshold_from;i<=this.threshold_to;i +=4 ) {
        max = -1;
        min = 10000;
        tmpdata = this.getPlotdata(valid_cases,i);
        for(j=0;j<tmpdata.length;j += 4) {
            if(tmpdata[j][1]>max) max = tmpdata[j][1];
            if(tmpdata[j][1]<min) min = tmpdata[j][1];
        }
        if(max_of_maxs < max) max_of_maxs = max;
        if(min_of_mins > min) min_of_mins = min;
    }
	//console.log();
    return [min_of_mins,max_of_maxs];
}

/*
	This function draws one curve to the canvase.
**/
SVGThreshChart.prototype.drawCurve = function (plotData,xScale,a) {
	



    for(i=0;i<plotdata.length;i++){
        if(plotdata[i][1] > max_y) {
            max_y = plotdata[i][1];
            max_y_coord = i;
        }   
        if(plotdata[i][1] < min_y)
            min_y = plotdata[i][1];
    
    }
	
	if(typeof svg_thresh_chart_y_up_limit !== 'undefined') {
        if( svg_thresh_chart_y_up_limit < max_y)
            svg_thresh_chart_y_up_limit = max_y;
    } else
        svg_thresh_chart_y_up_limit = 100;


    if(typeof svg_thresh_chart_y_down_limit !== 'undefined') {
        if( svg_thresh_chart_y_down_limit > min_y)
            svg_thresh_chart_y_down_limit = min_y;
    } else
        svg_thresh_chart_y_down_limit = -100;

	//var YLimits = [min_y,max_y];
	var YLimits = [0,max_y];

	yScale = d3.scale.linear()
                     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
                     .domain(YLimits);
}  


/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */
SVGThreshChart.prototype.plot = function () {
    xScale = d3.scale.linear()
					 .range([this.margin.left, this.plotwidth-this.margin.left-this.margin.right])
					 .domain([this.getMinVal('x'),this.getMaxVal('x')]);				 
	
	var evalStr =  "xMap = function(d) {return $.isNumeric(d[0])? xScale(d[0]):(xScale(0)+ " + this.margin.left +" ) };"
	eval(evalStr);
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	var i = 0;
    var dataums = [];
    var valid_datacases = [];
	var y_values = [];

    for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
            if(    this.canvasObj.dataCaseArr[i].getPropVal(this.axisX) != -1 
                //&& this.canvasObj.dataCaseArr[i].getPropVal(this.axisY) != -1  
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisC) != -1  
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ) != -1) { 
            dataums.push([ this.canvasObj.dataCaseArr[i].getPropVal(this.axisX),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisY),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ),
                           this.canvasObj.dataCaseArr[i].getPropVal('js_id') ]);
            valid_datacases.push(this.canvasObj.dataCaseArr[i]);
			y_values.push(this.canvasObj.dataCaseArr[i].getPropVal("mitosisc"));
        }
    }

		
	//y_values = removeDuplicatesInPlace(y_values);
	
	var plotdata = this.getPlotdata(valid_datacases,this.threshold,y_values);
	plotdata[1] = [
					[0.654020773,0],
[0.805587597,0.9932203389830508],
[0.847362198,1.979614739399549],
[0.872787382,2.95913628758237],
[0.953520376,3.945436854061324],
[1.036395766,4.911093542574787],
[1.047197075,5.890425383335015],
[1.069716588,6.866248452165419],
[1.083400123,7.838550394235258],
[1.139375774,8.807318767400503],
[1.187755448,9.77254104127497],
[1.188211479,10.734204596288226],
[1.214455636,11.692296722730056],
[1.240501637,12.646804619781202],
[1.317805763,13.597715394530189],
[1.355321646,14.545016060975932],
[1.436594512,15.432371017055814],
[1.463971961,16.37239886005926],
[1.484012722,17.308763699399705],
[1.504031673,18.241452068151908],
[1.520207167,19.028447063707425],
[1.524433052,19.95371405227568],
[1.52610628,20.875235722491876],
[1.561019422,21.381809352811608],
[1.564886647,22.295725470685408],
[1.611839737,23.025890812723805],
[1.689592821,23.18123058883898],
[1.879189975,20.7547404244286],
[1.901029649,20.933806823506767],
[2.008974693,19.675914944616366],
[2.257559131,17.39940383317443],
[2.38758264,16.487777460896563],
[2.487658411,16.347270235185913],
[2.573805725,16.674895419868637],
[2.587935758,17.532355940676144],
[3.191112186,12.95758220242397],
[3.229821525,13.308392332543786],
[3.324577293,13.610421974858722],
[3.347290221,14.235795770375166],
[3.472021269,13.632027794546204],
[4.3438507,11.189197725241211],
[5.212311717,8.673082996806247],
					];
	plotdata[2] = [
					[0.654020773,0],
[0.772256966,0.9966101694915255],
[0.805587597,1.9898189784388332],
[0.820598151,2.9796148181028643],
[0.847362198,3.965986000232649],
[0.857897087,4.948920756245595],
[0.872787382,5.928407236396473],
[0.953520376,6.904433508934893],
[0.959616319,7.876987559251092],
[1.036395766,8.846057289009797],
[1.047197075,9.811630515272002],
[1.069716588,10.77369496960438],
[1.083400123,11.732238297176195],
[1.139375774,12.68724805584342],
[1.187755448,13.63871171521986],
[1.188211479,14.586616655735089],
[1.214455636,15.530950167678897],
[1.240501637,16.471699450232016],
[1.317805763,17.408851610482984],
[1.355321646,18.342393662430695],
[1.436594512,19.20223138951453],
[1.463971961,20.128500618019952],
[1.484012722,21.051106842862374],
[1.504031673,21.970036597116554],
[1.520207167,22.715755749177994],
[1.524433052,23.627264123248224],
[1.52610628,24.535027178966395],
[1.528243675,25.439030836188326],
[1.555908033,26.03995112545341],
[1.561019422,26.936349780145157],
[1.564886647,27.82890228099075],
[1.612319421,28.27235976591371],
[1.617982792,29.157114255024293],
[1.635897468,29.91871809490551],
[1.662577288,30.79553595110111],
[1.677658882,31.541171663492307],
[1.689592821,32.409957261623376],
[1.703266621,33.139431291893644],
[1.714509253,33.72139743933984],
[1.721762484,34.43444374149406],
[1.727741562,35.28680022590449],
[1.788937366,35.37583452985669],
[1.790850892,36.06359560685362],
[1.809540948,36.100904811870414],
[1.823319456,36.4413331707705],
[1.854068131,36.93307977931208],
[1.856082702,37.58506987307985],
[1.857965457,38.227800707588365],
[1.879189975,38.86118574770437],
[1.885230221,39.67316128663029],
[1.889601435,40.48039748906332],
[1.901029649,40.29524327509007],
[1.917627511,40.48553262263733],
[1.92998078,41.27810495952414],
[1.941271227,41.8531993820415],
[1.954452679,41.76555472767494],
[1.962991523,42.54281746346831],
[1.973526528,43.31484459716744],
[1.977922201,44.08160857297182],
[1.999099059,43.888973425538694],
[2.008974693,44.6450116134434],
[2.010325459,45.39558532047375],
[2.037750788,45.37590212661719],
[2.07170454,45.854824574632715],
[2.099630727,46.05616279211059],
[2.11713875,46.51216091012085],
[2.121242146,47.23431201590962],
[2.124226644,47.95058076875721],
[2.132641057,48.371283954925765],
[2.168777173,48.484374662322296],
[2.169385109,49.18264067047888],
[2.171620197,49.874771709310295],
[2.186634507,50.56072990863554],
[2.19505911,50.920223947037584],
[2.21308794,51.5936816580625],
[2.230087482,52.26081025516336],
[2.257559131,52.24308776621122],
[2.258729982,52.89735343006699],
[2.333196967,51.07919115921383],
[2.337459269,51.72002432363301],
[2.338000196,52.353913043607804],
[2.353170114,52.98080875658957],
[2.368358953,53.22051567551082],
[2.38758264,53.4459368801464],
[2.399923195,53.65686533115874],
[2.41308285,53.85308789981818],
[2.414942558,54.44373649758075],
[2.472775594,54.19312589989095],
[2.527470005,53.91943837912425],
[2.551039495,54.487001856453944],
[2.587935758,54.165882764633636],
[2.590000345,54.71737965272606],
[2.598499774,54.80397998628792],
[2.67306263,53.47881415352594],
[2.716074311,52.58389887862065],
[2.764064446,53.10116105088533],
[2.8041864,53.117503577232874],
[2.901923335,51.11097560071995],
[2.955334437,50.06740793010349],
[3.043766919,49.50411993224318],
[3.078321355,49.44087530209067],
[3.138641924,49.35612529559411],
[3.171580709,49.80276128135684],
[3.191112186,48.544860779963166],
[3.258409545,46.08824258601224],
[3.287936646,46.4996395536871],
[3.324577293,46.898378293513844],
[3.347290221,46.67021474752629],
[3.385016585,45.7884957443345],
[3.399451182,45.506619148599306],
[3.410406766,45.85159634368944],
[3.578209098,44.17436226690721],
[3.62351234,44.48990223256012],
[3.631106305,44.790057582828396],
[3.700590506,44.35911828336502],
[4.050703123,40.969526191426475],
[4.07430812,41.22007036657956],
[4.307224665,40.68479508052214],
[4.35045921,40.11178394540809],
[4.48017836,38.69344371332525],
[4.485768687,38.03955022527003],
[4.540421323,38.19086435080767],
[4.919306891,34.83632386738458],
[5.212311717,33.148599577330735],
[5.215295027,33.2256644536191],
[5.586516437,29.472099946171994],
[6.209961132,22.6083322181276],
[6.230681801,22.58188299125249],
[6.247068459,22.50997921892283],
[6.631347261,21.27093357902542],
[6.687241362,19.926624781233272],
[7.353352826,11.07880135477056],
[7.907959303,5.368356157675803],
[9.066409943,1.5920890394189509]					

					];
	plotdata[3] = [
					[0.959616319,0],
[1.555908033,0.09242170549786288],
[1.809540948,0.6179511915811016],
[1.885230221,0.3866904926505875],
[1.999099059,0.1938949587488079],
[2.11713875,1.2615083198780668],
[2.132641057,0.5581720049394941],
[2.168777173,0.6005975156497204],
[2.169385109,0.10442716391584395],
[2.21308794,0.6083306923850769],
[2.230087482,1.5416102796168842],
[2.258729982,2.429407469344235],
[2.598499774,0.7127015795834873],
[2.67306263,1.2626068456421398],
[3.043766919,1.5235597528822171],
[3.138641924,2.1928393483135724],
[3.258409545,2.3010177390891315],
[3.287936646,3.172685896558418],
[3.399451182,3.112115870417121],
[3.62351234,3.759102979006487],
[4.07430812,4.459812642536323],
[4.35045921,3.1650931541814873],
[6.209961132,0.5310109001035697],
[6.230681801,1.0938479185041128],
[6.631347261,1.3014300174508653],
[6.687241362,2.263488072591575],
[7.907959303,0.053416675344853615],
[9.066409943,0.22480283036635507],
					];
    var max_y = -100, min_y = 10000;
	var max_y_coord = 0;
	var j=0;
	
	for (var key in plotdata) {
		if( $.isNumeric(key) ) {
			for(i=0;i<plotdata[key].length;i++){
				if(plotdata[key][i][1] > max_y) {
					max_y = plotdata[key][i][1];
				}
				if(plotdata[key][i][1] < min_y)
					min_y = plotdata[key][i][1];
			}
		}
	}
	
	/**The following parts is to make fake data curves ***/
	
	
		



		

	//var YLimits = this.getYScale(valid_datacases);	
	if(typeof svg_thresh_chart_y_up_limit !== 'undefined') {
		if( svg_thresh_chart_y_up_limit < max_y)
			svg_thresh_chart_y_up_limit = max_y;
	} else 
		svg_thresh_chart_y_up_limit = 100;

	
	if(typeof svg_thresh_chart_y_down_limit !== 'undefined') {
		if( svg_thresh_chart_y_down_limit > min_y)
			svg_thresh_chart_y_down_limit = min_y;
	} else 
		svg_thresh_chart_y_down_limit = -100;


	
	//var YLimits = [svg_thresh_chart_y_down_limit,svg_thresh_chart_y_up_limit];
	var YLimits = [min_y,max_y];

	/*
    yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain([this.getMinVal('y'),this.getMaxVal('y')]);
	*/

    yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain(YLimits);
	
	
	/**
	If you want to change the constant here, 
	you may want to change the margin.top together, it should be a bug
	**/
	var evalStr =  "yMap = function(d) {return $.isNumeric(d[1])? (yScale(d[1]) + " + this.margin.top  +"): (yScale(0) +" + this.margin.top  +")};"
	eval(evalStr);
    yAxis = d3.svg.axis().scale(yScale).orient("left");//.tickValues(d3.range(20,80,4));

	
	var sizeMap = null;
	var sizeScale = null;
	
	
	var z_arr = [];
	var i=0;
	
	//d3.min(this.dataZ,function(d){return parseInt(d)==NaN? 0:parseInt(d);}),d3.max(this.dataZ,function(d){return parseInt(d)==NaN? 0:parseInt(d);}) 
	//If the user selected "size" option
	if(this.axisZ != null && this.axisZ != undefined && this.axisZ.trim() != ""  ) {
		sizeScale = d3.scale.linear()
							.range([0,8])
							.domain([this.getMinVal('z'),this.getMaxVal('z')])
	} else {
		sizeScale = d3.scale.linear()
							.range([3,3])
							.domain([-10000,100000])
	}
	
	// setup fill color
	var cValue = function(d) { return d[3]; }
    color = d3.scale.category10();
	
	//TODO add the tooltip area to the webpage
	var tooltip = this.svgContainer
					.append("div")
					.attr("class", "tooltip")
					.style("opacity", 0.5);
	
	var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d,i) {
					return ("case" + i + ":" + d[0] + "," + d[1]);
				})
				
	this.svgContainer.call(tip);
	
	
	// x-axis
	this.svgContainer.append("g")
      .attr("class", "x axis")
	  .attr("transform", "translate(0," + (this.plotHeight-this.margin.bottom) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", (this.plotwidth-this.margin.left))
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(this.axisX);

	// y-axis
	this.svgContainer.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate("+ this.margin.left+","+ (this.margin.top) +")")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", -6)
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("|Lk|");

		chart_id = this.chartId;
		
		
		//console.log('d = ' + d + ', i = ' + i ); 
		var eval_str = "var test_function = function (d,i) {  \
						\
						if ( $.inArray(parseInt(d[4]),["
		var j=0;
		for(j=0; j<this.canvasObj.dataCaseArr.length; j++) {
			if( this.isValidData( j )==false )
				eval_str += this.canvasObj.dataCaseArr[j].getPropVal("js_id") + ",";
		}
		eval_str += "]) >= 0 )       \
				return 0;  \
			else  {\
				var res = (d[2]==undefined || !isNumeric(d[2]) )? 3:sizeScale(d[2]); \
				return  res; }\
		}"
		
		eval(eval_str);
		
		var selected_items = this.selectedItems;
		
		//console.log($.inArray(225,selectedItems));
		// draw dots

		var lineFunction = d3.svg.line()
                          		 .x(function(d) { return xScale(d[0]); })
                          		 .y(function(d) { return yScale(d[1]-4); })
	                        	 .interpolate("linear");		
		
		var k =0;
		for (var key in plotdata)
			if($.isNumeric(key))  color(key);
		for (var key in plotdata) {	
			if ($.isNumeric(key)==false) continue;
			var rangeArr = color.range();
			var path = this.svgContainer.append("path")
							.attr("d",lineFunction(plotdata[key]))
							.attr("stroke", rangeArr[k])
							.attr("stroke-width", "2")
							.attr("fill", "none")
							.attr("color",rangeArr[k])
							.on('click',function(d,i){
							})
							.on("dblclick",function(d,i){
								if(d3.select(this).attr("stroke")!='grey') {
									mainCanvas.addAnalysisCurve(d3.select(this).attr("d"));
									d3.select(this).attr("stroke","grey");	
								} else {
									//d3.select(this).attr("stroke","steeblue");	
								}
							});
			k++;
			max_y = -100, min_y = 10000;
			max_y_coord = 0;
			for(i=0;i<plotdata[key].length;i++){
				if(plotdata[key][i][1] > max_y) {
					max_y = plotdata[key][i][1];
					max_y_coord = plotdata[key][i][0];
				}   
				if(plotdata[key][i][1] < min_y)
					min_y = plotdata[key][i][1];
        	}



			
			this.svgContainer.append("circle")
							.attr("r", 5)
							.attr("cx",xScale(max_y_coord))
							.attr("cy",yScale(max_y-4))
							.style("fill","red");
			
			this.svgContainer.append("text")
							.attr("x",xScale(max_y_coord+1))
							.attr("y",yScale(max_y-1))
							.attr("dy", ".65em")
							//.text(max_y_coord);
							.style("text-anchor", "end")
							.text("(" + Math.round(max_y_coord*100)/100 + "," + Math.round(max_y*100)/100 + ")");
		}
		var i=0;
		var tmp_path;
		for(i=0;i<mainCanvas.saved_path_arr.length;i++){
			tmp_path = mainCanvas.saved_path_arr[i];
			this.svgContainer.append("path")
                        .attr("d",tmp_path)
                        .attr("stroke", "grey")
                        .attr("stroke-width", "2")
						.style("stroke-dasharray", ("1, 1"))
                        .attr("fill", "none")
                        .on('click',function(){
                        })
                        .on("dblclick",function(d,i){
                            mainCanvas.delAnalysisCurve(d3.select(this).attr("d"));
                            //d3.select(this).attr("stroke","grey");
                            //d3.select(this).style("stroke-dasharray", ("1, 1"));
							d3.select(this).remove();
                        });	

		}
		
		console.log("path");
		

		/*
		this.svgContainer.selectAll(".dot")
			.data(dataums)
			.enter().append("circle")
			.attr("class", function(d,i) {if( $.inArray(d[4]+"",selected_items) >=0 ) return "dot_selected"; else return "dot";} )
			.attr("r", test_function)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.attr("id", function(d,i){
					return chart_id + "_" + d[4];
				})
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)
			  .on('click',function(d,i){
					var cir_id = chart_id + "_"  + d[4];
					console.log(cir_id +" is selected");
					d3.select("#"+cir_id).attr("class","dot_selected");
					mainCanvas.selected(cir_id);
			  })
			  .on('dblclick',function(d,i){ 
					//var cir_id = chart_id + "_" + d[0] + "_" + d[1] + "_" + i;
					var cir_id = chart_id + "_" + d[4];
					d3.select("#"+cir_id).attr("class","dot");
					mainCanvas.deSelected(cir_id);
				  })
			  .style("fill", function(d) { return d[3]==undefined?"black":color(cValue(d));}) 
		*/
		if(this.axisC != null) {
        rightOffset = this.plotwidth;
        //console.log(color);
        var legend = this.svgContainer.selectAll(".legend")
                        .data(color.domain())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }); 
                        //.attr("transform", function(d, i) { return "translate("+rightOffset+"," + i * 20 + ")"; });

        // draw legend colored rectangles
        var ruled_out_arr = this.ruleOutCItems;
    
    	console.log("zcd is a pig");
        legend.append("rect")
            .attr("x", rightOffset)
            .attr("width", 15) 
            .attr("height", 15) 
            .style("fill", function(d,i){ var rangeArr = color.range(); return rangeArr[i];})
            .attr("stroke-width", function(d,i){var domainArr = color.domain();if($.inArray(domainArr[i],ruled_out_arr)>=0) return 2; else return 0  })  
            .attr("stroke", "black")
            .on("click", function(d,i) {
    
                //console.log(color.domain())
                //var rangeArr = color.range();
                var domainArr = color.domain();
                //console.log("This color is clicked, " + domainArr[i]);
                //mainCanvas.updateChart('"+this.chartId +"','"+this.axis_name+"', "+this.containerid+"_range_from ,"+this.containerid+"_range_to );
                //console.log(super);
                agent_function(domainArr[i]);
            }); 

        // draw legend text
        legend.append("text")
            .attr("x", rightOffset - 6)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;});
    	}
			  
}


/**
	Since in this plotting, all the datas are not directly plottable, we need to do some
	calculation then plot based on the calculation results
**/
SVGThreshChart.prototype.getPlotdata= function(valid_datacases,threshold,Y_grades) {


	var num_grades = Y_grades.length;

	var res = new Array();
	var i=0,j=0;
	var valid_valid_cases = [];
	var z_value,y_value;
	var sur_time=[],pt=[],pro=[];
	

	for(j=0;j<num_grades;j++){
		for(i=0;i<valid_datacases.length;i++){
			z_value = valid_datacases[i].getPropVal(this.axisZ);
			y_value = valid_datacases[i].getPropVal("mitosisc");
			if($.isNumeric( z_value ) && y_value == Y_grades[j] ) {
				valid_valid_cases.push(valid_datacases[i]);
				sur_time.push (  parseFloat( valid_datacases[i].getPropVal(this.axisZ) )    );
				pro.push (  parseFloat( valid_datacases[i].getPropVal(this.axisX))      );
				pt.push  (   $.isNumeric(valid_datacases[i].getPropVal(this.axisC))?parseFloat( valid_datacases[i].getPropVal(this.axisC)):0  );
			}
		}
		res[Y_grades[j]] = getplot(sur_time,pt,pro,threshold);
	}
	//console.log("The length before is " + valid_datacases.length + ", the length after is " + valid_valid_cases.length);
	//console.log(res);
	return res;
}





SVGThreshChart.prototype.generateCirId = function (x,y,index) {
	var res = this.chartId + "_" + x + "_" + y + "_" + index;
	return res; 
}

SVGThreshChart.prototype.selected = function (js_id) {
	var cir_id = this.chartId + "_" + js_id;
	d3.select("#" + cir_id).attr("class","dot_selected");
	//console.log(eval_str);
	//console.log(d3.select("#" + cir_id));
}

SVGThreshChart.prototype.deSelected = function (index) {
	var cir_id = this.chartId + "_" + index;
	d3.select("#" + cir_id) . attr("class","dot");
}

SVGThreshChart.prototype.getCircleSize = function (data,index) {
	var res_function = function (d,i) {
		
	
	
	}
	
	
	
}

SVGThreshChart.prototype.getCircleColor = function () {
}

