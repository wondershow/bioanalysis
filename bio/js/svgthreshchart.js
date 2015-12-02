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
SVGThreshChart.prototype.drawCurve = function (data) {
	
	
	








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
	var catagories = new Set();

	/*
    for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
            if(    this.canvasObj.dataCaseArr[i].getPropVal(this.axisX) != "N/A"
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ) != "N/A"  
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisC) != "N/A") { 
            dataums.push([ this.canvasObj.dataCaseArr[i].getPropVal(this.axisX),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisC),
                           this.canvasObj.dataCaseArr[i].getPropVal('js_id') ]);
            valid_datacases.push(this.canvasObj.dataCaseArr[i]);
        }
    } */

	var xVal,yVal,zVal,cVal;

    var count = 0;
    for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
            xVal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisX);
            cVal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisC);
            zVal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ);
			if (this.axisY != "") 
            	yVal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisY);
            if( isGoodClicValue(xVal) && isGoodClicValue(cVal) && isGoodClicValue(zVal) ) { 
                dataums.push([xVal, cVal, zVal, this.canvasObj.dataCaseArr[i].getPropVal('js_id')]);
                valid_datacases.push(this.canvasObj.dataCaseArr[i]);
				if (this.axisY != "" && isGoodClicValue(yVal));
               		catagories.add(yVal);
            }   
    }   

	var plotdata = this.getPlotdata(valid_datacases, this.threshold, catagories);

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
				     .range( [this.plotHeight-this.margin.top-this.margin.bottom, 2*this.margin.top] )
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
	  .attr("transform", "translate(0," + yScale(min_y) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", (this.plotwidth-this.margin.left))
      .attr("y", 0)
      .style("text-anchor", "end")
      .text(this.axisX);

	// y-axis
	this.svgContainer.append("g")
		.attr("class", "y axis")
		//.attr("transform", "translate(0,"+ (this.margin.top) +")")
		.attr("transform", "translate("+ this.margin.left+", 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", -20)
		.attr("y", 0)
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
                          		 .y(function(d) { return yScale(d[1]); })
	                        	 .interpolate("linear");		
		
		var k =0;
		for (var key in plotdata)
			if($.isNumeric(key))  color(key);
		
		var chartid = this.chartId;
		var pathid = chartid + "_path";
		var svgid = chartid + "_chart_svg";
		var pwidth = this.plotwidth;
		var pheight = this.plotHeight;


		svg = d3.select("#" + svgid).on('mousemove', function(d,i){
                                     handleMouseOverLine(pathid, svgid, xScale, yScale, plotdata, pwidth, pheight);
                                 });

		console.log(plotdata);
		for (var key in plotdata) {	
			if ($.isNumeric(key)==false) continue;
			var rangeArr = color.range();
			var myplotdata = plotdata[key];
			console.log(myplotdata);

			var path = this.svgContainer.append("path")
							.attr("d",lineFunction(plotdata[key]))
							.attr("stroke", rangeArr[k])
							.attr("stroke-width", "2")
							.attr("fill", "none")
							.attr("id", pathid)
							.attr("color",rangeArr[k])
							.on('click',function(d,i){
							})/*
							.on('mouseover', function(d,i) {
									handleMouseOverLine(pathid,svgid,xScale,yScale,myplotdata);
								}) */
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
							.attr("cy",yScale(max_y) )
							.style("fill","red");
			
			this.svgContainer.append("text")
							.attr("x",xScale(max_y_coord) + 55)
							.attr("y",yScale(max_y))
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
							d3.select(this).remove();
                        });	

		}
		
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
        var legend = this.svgContainer.selectAll(".legend")
                        .data(color.domain())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }); 

        var ruled_out_arr = this.ruleOutCItems;
    
        legend.append("rect")
            .attr("x", rightOffset)
            .attr("width", 15) 
            .attr("height", 15) 
            .style("fill", function(d,i){ var rangeArr = color.range(); return rangeArr[i];})
            .attr("stroke-width", function(d,i){var domainArr = color.domain();if($.inArray(domainArr[i],ruled_out_arr)>=0) return 2; else return 0  })  
            .attr("stroke", "black")
            .on("click", function(d,i) {
                var domainArr = color.domain();
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
SVGThreshChart.prototype.getPlotdata1 = function(valid_datacases,threshold, grades) {
	var s = [];
	var i=0;
	
	var valid_valid_cases = [];
	var z_value;
	
	var sur_time=[],pt=[],pro=[];

	
	for(i=0;i<valid_datacases.length;i++){
		z_value = valid_datacases[i].getPropVal(this.axisZ);		
		if($.isNumeric( z_value )) {
			valid_valid_cases.push(valid_datacases[i]);
			sur_time.push(  parseFloat( valid_datacases[i].getPropVal(this.axisZ) )    );
			pro.push(  parseFloat( valid_datacases[i].getPropVal(this.axisX))      );
			pt.push(   $.isNumeric(valid_datacases[i].getPropVal(this.axisC))?parseFloat( valid_datacases[i].getPropVal(this.axisC)):0 );
		}
	}

	//console.log("The length before is " + valid_datacases.length + ", the length after is " + valid_valid_cases.length);
	res = getplot(sur_time,pt,pro,threshold);
	//console.log(res);
	return res;
}


/**
    Since in this plotting, all the datas are not directly plottable, we need to do some
    calculation then plot based on the calculation results
**/
SVGThreshChart.prototype.getPlotdata = function(valid_datacases,threshold,grades) {
    var num_grades = grades.length;
    var res = new Array();
    var i=0,j=0;
    var valid_valid_cases = []; 
    var z_value,y_value;
    var sur_time=[],pt=[],pro=[];

	if (this.axisY != "") { //multi optimal analysis line
		for (var v of grades) {
			console.log("v value is " + v);
			var sur_time=[],pt=[],pro=[];
			var count = 0;
			for(i=0;i<valid_datacases.length;i++){
				y_value = valid_datacases[i].getPropVal(this.axisY);
			    z_value = valid_datacases[i].getPropVal(this.axisZ);
				console.log("y value is " + y_value + ", v value is " + v + " i = " + i);
				if($.isNumeric( y_value ) && y_value == v) {
					valid_valid_cases.push( valid_datacases[i] );
					sur_time.push (  parseFloat( valid_datacases[i].getPropVal(this.axisZ) )    );
					pro.push (  parseFloat( valid_datacases[i].getPropVal(this.axisX))      );
					pt.push  (   $.isNumeric(valid_datacases[i].getPropVal(this.axisC))?parseFloat( valid_datacases[i].getPropVal(this.axisC)):0  );
				}
			}
			res[v] = getplot(sur_time,pt,pro,threshold);
			console.log("pro length = " + pro.length + "v = " + v + ", length = " + res[v].length)
		}
	} else { // single optimal analysis line
		 for(i=0;i<valid_datacases.length;i++){
			 z_value = valid_datacases[i].getPropVal(this.axisZ);
			 if($.isNumeric( z_value )) {
				 valid_valid_cases.push(valid_datacases[i]);
				 sur_time.push(  parseFloat( valid_datacases[i].getPropVal(this.axisZ) )    );
				 pro.push(  parseFloat( valid_datacases[i].getPropVal(this.axisX))      );
				 pt.push(   $.isNumeric(valid_datacases[i].getPropVal(this.axisC))?parseFloat( valid_datacases[i].getPropVal(this.axisC)):0 );
			 }
		 }
		res[0] = getplot(sur_time,pt,pro,threshold);
	}
  
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
	d3.select("#" + cir_id).attr("class","dot");
}

SVGThreshChart.prototype.getCircleSize = function (data,index) {
	var res_function = function (d,i) {
		
	
	
	}
}

SVGThreshChart.prototype.getCircleColor = function () {
}

SVGThreshChart.prototype.handleMouseOverLine = function (d,i) {
	console.log("d is " + d + ", i is " + i );
}


/**

	@pwidth parenet svg container width
	@pheight parent svg containder height
***/
var handleMouseOverLine = function(pathid,svgid,xscale,yscale,plotdata, pwidth, pheight) {	
	svg = d3.select("#" + svgid)[0][0];
	path = d3.select("#" + pathid)[0][0];
	var pt  = svg.createSVGPoint();
	pt.x =  d3.event.x;
	pt.y = d3.event.y;
	pt = pt.matrixTransform(svg.getScreenCTM().inverse());
	console.log("pt.x = " + xscale.invert(pt.x));

	fromx = pt.x;
	tox = pt.x;

	console.log(plotdata);

	fromy = yscale.range()[0];
	toy = yscale.range()[1];

	
	lineid = svgid + "_interactive_line";
	circleid = svgid + "_interactive_cicle";
	gid = svgid + "_addional_group";

	if (pt.x > xscale.range()[1] || pt.x < xscale.range()[0]) {
		console.log("remove");
		d3.select("#"+lineid).remove();
		d3.select("#"+circleid).remove();
		d3.select("#"+gid).remove();
		return;
	}

	circylex = xscale.invert(pt.x);
	liney = getYfromX(plotdata[0], xscale.invert(pt.x));
	
	console.log("liney = " + liney);
	
	if ( d3.select("#"+lineid).empty() ) {
		d3.select("#" + svgid).append("line")
                         .attr("x1", fromx)
                         .attr("y1", fromy)
                         .attr("x2", tox)
                         .attr("y2", toy)
						 .attr("id", lineid)
                         .attr("stroke-width", 1)
						 .style("stroke-dasharray", ("3, 3"))
                         .attr("stroke", "red");

		d3.select("#" + svgid).append("circle")
                             .attr("r", 5)
							 .attr("id",circleid)
                             .attr("cx",xScale(circylex))
                             .attr("cy",yScale(liney) )
                             .style("fill","grey");
		
	} else {
		d3.select("#"+lineid)
					.attr("x1", fromx)
                    .attr("y1", fromy)
                    .attr("x2", tox)
                    .attr("y2", toy);
						  //.attr("d", line);
		d3.select("#" +  circleid )
					.attr("cx",xScale(circylex))
					.attr("cy",yScale(liney) )

	}
	floatingPlot(svgid, xScale(circylex), yScale(liney),gid, pwidth, pheight );
} 

var getYfromX = function(plotdata, x){
	mindelta = 100000;
	res = 0;
	i = 0;
	for (i = 0; i< plotdata.length; i++) {
		if (Math.abs(plotdata[i][0] - x) < mindelta) {
			mindelta = Math.abs(plotdata[i][0] - x);
			res = plotdata[i][1];
		}
	}
	return res;
}

/***
	pwidth --- parent container width
    pheight --- parent container height
***/
var floatingPlot = function(svgid, x, y, gid, pwidth, pheight) {
	fromx = 50
	fromy = 50
	tox = 100
	toy = 100
	
	group = null;
	if (d3.select("#" + gid).empty()) {
		group = d3.select("#" + svgid).append('g')
									  .attr("id", gid);
		/*
		group.append("line")
         	.attr("x1", fromx)
         	.attr("y1", fromy)
         	.attr("x2", tox)
         	.attr("y2", toy)
		 	.attr("id", gid)
		 	.attr("stroke-width", 2)
         	.attr("stroke", "red")*/
	} else {
		d3.select("#"+gid).html("");
		group = d3.select("#"+gid);
	}
		group.append("line")
         	.attr("x1", 0)
         	.attr("y1", 0)
         	.attr("x2", tox)
         	.attr("y2", toy)
		 	.attr("stroke-width", 2)
         	.attr("stroke", "red")

	
	xScale1 = d3.scale.linear().range([0, pwidth/2]).domain([0, 100]);
    xAxis1 = d3.svg.axis().scale(xScale1).orient("bottom");
	group.append("g")
         .attr("class", "x axis")
	     .attr("transform", "translate(0,"+pheight/2+")")
         .call(xAxis1)

    yScale1 = d3.scale.linear()
				     .range( [0, pheight/2])
					 .domain([100, 0]);
    yAxis1 = d3.svg.axis().scale(yScale1).orient("left");//.tickValues(d3.range(20,80,4));
	group.append("g")
		.attr("class", "y axis")
		//.attr("transform", "translate(0,"+ (this.margin.top) +")")
		.attr("transform", "translate(0, 0)")
		.call(yAxis1)

	group.append("line")
		.attr("x1", xScale1(0))
		.attr("y1", yScale1(0))
		.attr("x2", xScale1(50))
		.attr("y2", yScale1(50))
		.attr("stroke-width", 2)
        .attr("stroke", "red")

	group.append("line")
		.attr("x1", xScale1(50))
		.attr("y1", yScale1(50))
		.attr("x2", xScale1(70))
		.attr("y2", yScale1(70))
		.attr("stroke-width", 2)
        .attr("stroke", "green")


	x = pwidth * 0.25;
	y = pheight * 0.25;

	group.attr("transform", "translate(" + x + "," + y +")");
	console.log("translating (" + x + "," + y + ")");
}
