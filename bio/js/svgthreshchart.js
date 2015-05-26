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
	if(params.a_filter!==undefined&&params.a_filter!=null)
		this.threshold = params.a_filter.threshold;
	else
		this.threshold = params.bar_from;
	this.threshold_from = params.bar_from;
    this.threshold_to = params.bar_to;
	console.log("this.threshold = "+this.threshold);
}


SVGThreshChart.prototype.purifydata = function () {
	var purifiedX = [];
	var purifiedY = [];
	var purifiedZ = [];

	var i=0;
	//for(i=0;i<this.)



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

    for(i=0;i<this.canvasObj.dataCaseArr.length;i++) {
            if(    this.canvasObj.dataCaseArr[i].getPropVal(this.axisX) != "N/A"
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisY) != "N/A"  
                && this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ) != "N/A") { 
            dataums.push([ this.canvasObj.dataCaseArr[i].getPropVal(this.axisX),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisY),
                           this.canvasObj.dataCaseArr[i].getPropVal(this.axisZ),
                           this.canvasObj.dataCaseArr[i].getPropVal('js_id') ]);
            valid_datacases.push(this.canvasObj.dataCaseArr[i]);
        }
    }

	var plotdata = this.getPlotdata(valid_datacases,this.threshold);
	console.log("this.threshold = "+ this.threshold);

    var max_y = -100, min_y = 10000;
    for(i=0;i<plotdata.length;i++){
		if(plotdata[i][1] > max_y)
			max_y = plotdata[i][1];
		if(plotdata[i][1] < min_y)
			min_y = plotdata[i][1];
    }

	//var YLimits = this.getYScale(valid_datacases);	
	if(typeof svg_thresh_chart_y_up_limit !== 'undefined') {
		if( svg_thresh_chart_y_up_limit < max_y)
			svg_thresh_chart_y_up_limit = max_y;
	} else 
		svg_thresh_chart_y_up_limit = 30;

	
	if(typeof svg_thresh_chart_y_down_limit !== 'undefined') {
		if( svg_thresh_chart_y_down_limit > min_y)
			svg_thresh_chart_y_down_limit = min_y;
	} else 
		svg_thresh_chart_y_down_limit = -30;


	
	var YLimits = [svg_thresh_chart_y_down_limit,svg_thresh_chart_y_up_limit];

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
		.text(this.axisY);

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
		
		console.log("The selected items are " + selected_items);
		//console.log($.inArray(225,selectedItems));
		// draw dots

		var lineFunction = d3.svg.line()
                          		 .x(function(d) { return xScale(d[0]); })
                          		 .y(function(d) { return yScale(d[1]); })
	                        	 .interpolate("linear");		
		
		console.log(plotdata);
		var testdata = [ [1,7], [2,7],[3,7],[50,7],[60,7]];
		this.svgContainer.append("path")
						.attr("d",lineFunction(plotdata))
						//.attr("d",lineFunction(testdata))
						.attr("stroke", "steelblue")
					    .attr("stroke-width", "2")
					    .attr("fill", "none");
					   // .attr("class", "dataline");
		

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
		
		
		
		var eval_str = " var agent_function = function(value) { \
			if($.inArray(value,ruled_out_arr) < 0 ) \
				mainCanvas.updateChart('"+this.chartId +"','c', 'REMOVE', value); \
			else \
				mainCanvas.updateChart('"+this.chartId +"','c', 'RESUME', value); \
		};" 
		
		eval(eval_str)
		
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
SVGThreshChart.prototype.getPlotdata= function(valid_datacases,threshold) {
	var res = [];
	var i=0;

	//get the upper and lower limit of x axis
	var max_x=-100,min_x=10000;
	for(i=0;i<valid_datacases.length;i++) {
		if(valid_datacases[i].getPropVal(this.axisX)>max_x)
			max_x = valid_datacases[i].getPropVal(this.axisX);
		if(valid_datacases[i].getPropVal(this.axisX)<min_x)
			min_x = valid_datacases[i].getPropVal(this.axisX);
	}
	
	
	var greater_group_count = 0;
	var greater_group_survival = 0;
	var smaller_group_count = 0;
	var smaller_group_survival = 0;

	
	//This array holds survival rate with some criteria
	//e.g. survival_rate_up['10'] means the survival rate for all those samples who
	//has a property value larger than 10. The property is assigned by a user input
	
	/*
		This is an associative array, its index from 0-max_x. at each distribute, 
		e.g. 15, that means survivals between 15 and 15.99(the propery is selected by 
		the user). 
	**/
	var survival_rate_distribute = [];
	var death_rate_distribute = [];
	

	for(i=0;i<=max_x;i++){
		survival_rate_distribute[i]=0;
		death_rate_distribute[i] = 0;
	}

	for(i=0;i<valid_datacases.length;i++){
		var tmp_index = Math.floor(valid_datacases[i].getPropVal(this.axisX));
		if(valid_datacases[i].isDead(this.axisZ,this.axisC,threshold))
			death_rate_distribute[tmp_index]++;
		else 
			survival_rate_distribute[tmp_index]++;
	} 

	/**
		This array holds an summary of survival numbers.
		e.g. if index is 15, that means the survials with property 
		smaller than 15. The property is assigned by user input
	***/
	var accumulated_rate_distribute_down = [];
	var accumulated_death_rate_distribute_down = [];
	accumulated_rate_distribute_down[0] = survival_rate_distribute[0];
	accumulated_death_rate_distribute_down[0] = death_rate_distribute[0];


	for(i=1;i<=max_x;i++){
		accumulated_rate_distribute_down[i] = accumulated_rate_distribute_down[i-1] + survival_rate_distribute[i];
		accumulated_death_rate_distribute_down[i] = accumulated_death_rate_distribute_down[i-1] + death_rate_distribute[i];
	}
	

	/**
		This array holds an summary of survival numbers.
		e.g. if index is 15, that means the survials with property 
		larger than 15. The property is assigned by user input
	***/
	var accumulated_rate_distribute_up = [];
	var accumulated_death_rate_distribute_up = [];
	accumulated_rate_distribute_up[max_x] = survival_rate_distribute[max_x];
	accumulated_death_rate_distribute_up[max_x] = death_rate_distribute[max_x];
	
	for(i=max_x-1;i>=0;i--) {
		accumulated_rate_distribute_up[i] = accumulated_rate_distribute_up[i+1] + survival_rate_distribute[i];	
		accumulated_death_rate_distribute_up[i] =  accumulated_death_rate_distribute_up[i+1] + death_rate_distribute[i];
	}
	
	/*
		now we have all the essential information, let us
		do our job.
	***/
	var total_valid_cases = valid_datacases.length;
	for(i= min_x;i<max_x;i++) {
		var difference = 100* accumulated_rate_distribute_up[i]/(accumulated_rate_distribute_up[i] + accumulated_death_rate_distribute_up[i]) 
						- 100*accumulated_rate_distribute_down[i]/(accumulated_rate_distribute_down[i] + accumulated_death_rate_distribute_down[i]);
		//console.log("difference = " + difference);
		res.push([i,difference]);
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
	d3.select("#" + cir_id) . attr("class","dot");
}

SVGThreshChart.prototype.getCircleSize = function (data,index) {
	var res_function = function (d,i) {
		
	
	
	}
	
	
	
}

SVGThreshChart.prototype.getCircleColor = function () {
}

