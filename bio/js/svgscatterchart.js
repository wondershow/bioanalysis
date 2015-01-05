var SVGScatterChart = function (params,svg,canvas_obj,chart_id) {

	this.dataX = params.x_data;
	this.dataY = params.y_data;
	this.dataZ = params.z_data;
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
}

/**
To check if a given data is ruled out or not
*/
SVGScatterChart.prototype.isValidData = function (index) {
	
	if(this.XFilter != undefined && this.XFilter != null) {
		var val = parseExcelNumber(this.dataX[index]);
		if(val<this.XFilter.from || val>this.XFilter.to)
			return false;
	}
	if(this.YFilter != undefined && this.YFilter != null) {
		var val = parseExcelNumber(this.dataY[index]);
		if(val<this.YFilter.from || val>this.YFilter.to)
			return false;
	}
	if(this.ZFilter != undefined && this.ZFilter != null) {
		var val = parseExcelNumber(this.dataZ[index]);
		if(val<this.ZFilter.from || val>this.ZFilter.to)
			return false;
	}
	if(this.CFilter != undefined && this.CFilter != null) {
		if($.inArray(this.dataC[index],this.ruleOutCItems) >= 0) 
			return false;
	}
	return true;
}

/**
	Get max value of datax,datay or dataz
**/
SVGScatterChart.prototype.getMaxVal = function(type) {
	var tmpVals = [];
	var i = 0;
	for(i=0;i<this.dataX.length;i++) {
		if(this.isValidData(i)) {
			if(type == 'x')
				tmpVals.push( this.dataX[i] );
			else if (type == 'y')
				tmpVals.push( this.dataY[i] );
			else if (type == 'z')
				tmpVals.push( this.dataZ[i] );
		}
	}
	return d3.max(tmpVals, function(d){ return parseExcelNumber(d)});
}

SVGScatterChart.prototype.getMinVal= function(type) {
	var tmpVals = [];
	var i = 0;
	for(i=0;i<this.dataX.length;i++) {
		if(this.isValidData(i)) {
			if(type == 'x')
				tmpVals.push(this.dataX[i]);
			else if (type == 'y')
				tmpVals.push(this.dataY[i]);
			else if (type == 'z')
				tmpVals.push(this.dataZ[i]);
		}
	}
	return d3.min(tmpVals, function(d){ return parseExcelNumber(d)});
}




/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */
SVGScatterChart.prototype.plot = function () {
	
    xScale = d3.scale.linear()
					 .range([this.margin.left, this.plotwidth-this.margin.left-this.margin.right])
					 .domain([this.getMinVal('x'),this.getMaxVal('x')]);				 
	
	var evalStr =  "xMap = function(d) {return $.isNumeric(d[0])? xScale(d[0]):(xScale(0)+ " + this.margin.left +" ) };"
	eval(evalStr);
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain([this.getMinVal('y'),this.getMaxVal('y')]);
	// value -> display
	
	/**
	If you want to change the constant here, 
	you may want to change the margin.top together, it should be a bug
	**/
	var evalStr =  "yMap = function(d) {return $.isNumeric(d[1])? (yScale(d[1]) + " + this.margin.top  +"): (yScale(0) +" + this.margin.top  +")};"
	eval(evalStr);
    yAxis = d3.svg.axis().scale(yScale).orient("left");
	
	var sizeMap = null;
	var sizeScale = null;
	
	//If the user selected "size" option
	if(this.axisZ != null && this.axisZ != undefined && this.axisZ.trim() != ""  ) {
		sizeScale = d3.scale.linear()
							.range([0,8])
							.domain([d3.min(this.dataZ,function(d){return parseInt(d)==NaN? 0:parseInt(d);}),d3.max(this.dataZ,function(d){return parseInt(d)==NaN? 0:parseInt(d);}) ])
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
					.attr("class", "tooltip")
					.style("opacity", 0.5);
	
	var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d,i) {
					return ("case" + i + ":" + d[0] + "," + d[1]);
				})
				
	this.svgContainer.call(tip);
	
	var i = 0;
	var dataums = []
	for(i=0;i<this.dataX.length;i++) {
		if(this.dataZ != null && this.dataC != null ) {
			dataums.push([this.dataX[i],this.dataY[i],this.dataZ[i],processStr(this.dataC[i])]);
		}else if( this.dataZ != null && this.dataC == null ) {
			dataums.push([this.dataX[i],this.dataY[i],this.dataZ[i],null]);
		}else if ( this.dataZ == null && this.dataC != null ) {
			dataums.push([this.dataX[i],this.dataY[i],null,processStr(this.dataC[i])]);
		} else {
			dataums.push([this.dataX[i],this.dataY[i],null,null]);
		}
	}
	
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
						if ( $.inArray(i,["
		var j=0;
		for(j=0;j<this.dataX.length;j++) {
			if(this.isValidData(j)==false)
				eval_str += j + " ,";
		}
		eval_str += "]) >= 0 )       \
				return 0;  \
			else  \
				return (d[2]==undefined || !isNumeric(d[2]) )? 3:sizeScale(d[2]);  \
		}"
		
		eval(eval_str);
		
		var selectedItems = this.selectedItems;
		
		console.log("The selected items are " + selectedItems);
		//console.log($.inArray(225,selectedItems));
		// draw dots
		this.svgContainer.selectAll(".dot")
			.data(dataums)
			.enter().append("circle")
			.attr("class", function(d,i) {if( $.inArray(i+"",selectedItems) >=0 ) return "dot_selected"; else return "dot";} )
			.attr("r", test_function)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.attr("id", function(d,i){
					return chart_id + "_" + i;
				})
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)
			  .on('click',function(d,i){
					var cir_id = chart_id + "_" + i;
					console.log(cir_id +" is selected");
					d3.select("#"+cir_id).attr("class","dot_selected");
					mainCanvas.selected(cir_id);
			  })
			  .on('dblclick',function(d,i){ 
					//var cir_id = chart_id + "_" + d[0] + "_" + d[1] + "_" + i;
					var cir_id = chart_id + "_" + i;
					d3.select("#"+cir_id).attr("class","dot");
					mainCanvas.deSelected(cir_id);
				  })
			  .style("fill", function(d) { return d[3]==undefined?"black":color(cValue(d));}) 
			  
			  /*
			  .on("mouseover", function(d) {
				  console.log("d3.event.pageX = " + d3.event.pageX + ",d3.event.pageY="+d3.event.pageY);
				  tooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  tooltip.html("AAAAAAAAAAAA")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  console.log("BBBBBBBBBBBBBB");	
				  tooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });*/
			  
	if(this.dataC != null) {
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
	
	//this.addSliders();
}

SVGScatterChart.prototype.generateCirId = function (x,y,index) {
	var res = this.chartId + "_" + x + "_" + y + "_" + index;
	return res; 
}

SVGScatterChart.prototype.selected = function (index) {
	var cir_id = this.chartId + "_" + index;
	d3.select("#" + cir_id).attr("class","dot_selected");
	var eval_str = 'd3.select("#" + cir_id).attr("class","dot_selected");';
	//console.log(eval_str);
	//console.log(d3.select("#" + cir_id));
}

SVGScatterChart.prototype.deSelected = function (index) {
	var cir_id = this.chartId + "_" + index;
	d3.select("#" + cir_id) . attr("class","dot");
}

SVGScatterChart.prototype.getCircleSize = function (data,index) {
	var res_function = function (d,i) {
		
	
	
	}
	
	
	
}

SVGScatterChart.prototype.getCircleColor = function () {
}

