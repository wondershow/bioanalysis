var SVGScatterChart = function (params,svg,chart_id) {

	this.dataX = params.x_data;
	this.dataY = params.y_data;
	this.dataZ = params.z_data;
	this.dataC = params.c_data;
	this.axisX = params.x_axis;
	this.axisY = params.y_axis;
	this.axisZ = params.z_axis;
	this.axisC = params.c_axis;
	
	this.margin = {top:20,right:20,bottom:10,left:40};
	
	this.plotwidth = params.chartWidth - this.margin.right - this.margin.left;
	this.plotHeight = params.chartHeight - this.margin.top - this.margin.bottom;
	
	this.svgContainer = svg;
	this.chartId = chart_id;
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
					 .domain([0,d3.max(this.dataX, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})]);				 
	
	var evalStr =  "xMap = function(d) {return $.isNumeric(d[0])? xScale(d[0]):(xScale(0)+ " + this.margin.left +" ) };"
    //xMap = function(d) {return xScale(d[0]);}; // data -> display
	eval(evalStr);
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain([0,d3.max(this.dataY, function(d){return parseInt(d)==NaN? 0:parseInt(d);})]);
	// value -> display
	
	/**
	If you want to change the constant here, 
	you may want to change the margin.top together, it should be a bug
	**/
	var evalStr =  "yMap = function(d) {return $.isNumeric(d[1])? (yScale(d[1]) + " + this.margin.top  +"): (yScale(0) +" + this.margin.top  +")};"
	//var evalStr =  "yMap = function(d) {var res; if ($.isNumeric(d[1])) res = d[1]+20; else res = 20; return res; return $.isNumeric(d[1])? (yScale(d[1]) + " + this.margin.top  +"):" + this.margin.top + "};"
    //yMap = function(d) {return yScale(d[1]) + 20};// data -> display
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
	var cValue = function(d) { return d[3];}
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
				.html(function(d) {
					return (d[0] + "," + d[1]);
				})
				
	this.svgContainer.call(tip);
	
	var i = 0;
	var dataums = []
	for(i=0;i<this.dataX.length;i++) {
		if(this.dataZ != null && this.dataC != null ) {
			dataums.push([this.dataX[i],this.dataY[i],this.dataZ[i],this.dataC[i]]);
		}else if( this.dataZ != null && this.dataC == null ) {
			dataums.push([this.dataX[i],this.dataY[i],this.dataZ[i],null]);
		}else if ( this.dataZ == null && this.dataC != null ) {
			dataums.push([this.dataX[i],this.dataY[i],null,this.dataC[i]]);
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
		// draw dots
		this.svgContainer.selectAll(".dot")
			.data(dataums)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("r", function(d){return (d[2]==undefined || !isNumeric(d[2]) )? 3:sizeScale(d[2])})
			.attr("cx", xMap)
			.attr("cy", yMap)
			.attr("id", function(d,i){
					return chart_id + "_" + i;
				})
			  .on('mouseover', tip.show)
			  .on('mouseout', tip.hide)
			  .on('click',function(d,i){
					var cir_id = chart_id + "_" + i;
					//console.log(cir_id);
					//d3.select("#"+cir_id).attr("class","dot_selected");
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
		var legend = this.svgContainer.selectAll(".legend")
						.data(color.domain())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
						//.attr("transform", function(d, i) { return "translate("+rightOffset+"," + i * 20 + ")"; });

		// draw legend colored rectangles
		
		legend.append("rect")
			.attr("x", rightOffset)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color)
			.on("click", function(d) {
				console.log("This color is clicked")
			});

		// draw legend text
		legend.append("text")
			.attr("x", rightOffset - 6)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d;});
	}
	
	this.addSliders();
}

SVGScatterChart.prototype.generateCirId = function (x,y,index) {
	var res = this.chartId + "_" + x + "_" + y + "_" + index;
	return res; 
}

SVGScatterChart.prototype.selected = function (index) {
	var cir_id = this.chartId + "_" + index;
	d3.select("#" + cir_id). attr("class","dot_selected");
}

SVGScatterChart.prototype.deSelected = function (index) {
	var cir_id = this.chartId + "_" + index;
	d3.select("#" + cir_id) . attr("class","dot");
}

SVGScatterChart.prototype.getCircleSize = function () {
	
}

SVGScatterChart.prototype.getCircleColor = function () {
}

SVGScatterChart.prototype.addSliders = function() {
	
	slider_height =  this.plotHeight / 2;
	slider_width = Math.floor(this.plotwidth*0.05);
	
	
	//var eval_str = "var refresh_function = function() {mainCanvas.refresh("+this.id+")};";
	//eval(eval_str);
	
	var min_val = d3.min(this.dataX, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var max_val = d3.max(this.dataX, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var anchor1 = { x:Math.floor(this.plotwidth * 0.8 + this.margin.left + 5 ), y : Math.floor(this.plotHeight*0.3) } 
	var params1 = {anchor:anchor1,w:slider_width,h:slider_height,svg:this.svgContainer,label:this.axisX,min:min_val,max:max_val,type:'v',chart_id:this.chartId}; 
	var slider = new SVGSlider(params1);
	slider.generate();
	
	
	var min_val = d3.min(this.dataY, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var max_val = d3.max(this.dataY, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var anchor2 = { x:Math.floor(this.plotwidth * 0.9 + this.margin.left + 5 ), y : Math.floor(this.plotHeight*0.3) } 
	var params2 = {anchor:anchor2,w:slider_width,h:slider_height,svg:this.svgContainer,label:this.axisY,min:min_val,max:max_val,type:'v',chart_id:this.chartId}; 
	var slider2 = new SVGSlider(params2);
	slider2.generate();
	
	//if the size option is selected
	//if(this.axisZ != null && this.axisZ != undefined && this.axisZ.trim() != "" ) 
	//var anchor2 = {x:Math.floor(this.plotwidth*0.85),y:Math.floor(this.plotHeight*0.3)} 
	//else
}