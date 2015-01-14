var SVGHeatMap = function (params,svg,canvas_obj,chart_id) {
	this.axisX = params.x_axis;
	this.axisY = params.y_axis;
	this.dataX = params.x_data;
	this.dataY = params.y_data;
	
	this.coef = params.coef;
	
	this.axisC = params.c_axis;

	this.margin = {top:20,right:10,bottom:10,left:40};
	
	this.plotWidth = params.chartWidth - this.margin.right - this.margin.left;
	this.plotHeight = params.chartHeight - this.margin.top - this.margin.bottom;

	this.svgContainer = svg;
	this.chartId = chart_id;
	this.canvasObj = canvas_obj;
	this.selectedItems = this.canvasObj.selectedItems;
	this.fullData = params.full_data;
}

SVGHeatMap.prototype.plot = function () {
	var i = 0;
	this.hr = new Array(this.fullData.length);
	
	for(i=0; i<this.fullData.length; i++) {
		this.hr[i] = getHazadasratio(this.coef,this.fullData[i]);
		if(isNaN(this.hr[i]))
			this.hr[i] = Math.random();
		this.hr[i] = this.hr[i].toFixed(3);	
		//console.log("i = " + i + ", hr = " + getHazadasratio(this.coef,this.fullData[i]));
	}
	
	var evalStr =  "xMap = function(d) {return $.isNumeric(d[0])? xScale(d[0]):(xScale(0)+ " + this.margin.left +" ) };"
	eval(evalStr);
	
	var evalStr =  "yMap = function(d) {return $.isNumeric(d[1])? (yScale(d[1]) + " + this.margin.top  +"): (yScale(0) +" + this.margin.top  +")};"
	eval(evalStr);
	
	
	var datum = [];
	var i=0;
	for (i=0;i<this.fullData.length;i++) {
		//console.log("$.isNumeric("+this.dataX[i]+") = " + $.isNumeric(this.dataX[i]));
		var x = $.isNumeric(this.dataX[i])?this.dataX[i]:0;
		var y = $.isNumeric(this.dataY[i])?this.dataY[i]:0;
		var case_num = this.fullData[i].casenumn;
		datum.push([x,y,this.hr[i],case_num]);
	}
	
	var xScale = d3.scale.linear()
					 .range([this.margin.left, this.plotWidth-this.margin.left-this.margin.right])
					 .domain([     d3.min(this.dataX,function(d){return $.isNumeric(d)?parseInt(d):0}),    d3.max(this.dataX,function(d){return $.isNumeric(d)?parseInt(d):0})     ]);
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	var yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain([d3.min(this.dataY,function(d){return $.isNumeric(d)?parseInt(d):0}),d3.max(this.dataY,function(d){return $.isNumeric(d)?parseInt(d):0})]);
	var yAxis = d3.svg.axis().scale(yScale).orient("left");
	
	
	//console.log("d3.min(this.dataX) = " + d3.min(this.dataX,function(d){return $.isNumeric(d)?parseInt(d):0}));
	//console.log("d3.max(this.dataX) = " + d3.max(this.dataX,function(d){return $.isNumeric(d)?parseInt(d):0}));
	
	var max_hr = d3.max(this.hr);
	var min_hr = d3.min(this.hr);

	chart_id = this.chartId;
	// x-axis
	this.svgContainer.append("g")
      .attr("class", "x axis")
	  .attr("transform", "translate(0," + (this.plotHeight-this.margin.bottom) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", (this.plotWidth-this.margin.left))
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
					return ("case" + ":" + d[3] + ", hr:" + d[2]);
				})
				
	this.svgContainer.call(tip);
	
	this.svgContainer.selectAll(".dot")
			.data(datum)
			.enter().append("circle")
			.attr("class","dot")
//			.attr("class", function(d,i) {if( $.inArray(i+"",selectedItems) >=0 ) return "dot_selected"; else return "dot";} )
			.attr("r", 4)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill",function(d){return getColorFromVal(d[2],min_hr,max_hr);})
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
			});
	this.createColorBar();
}

SVGHeatMap.prototype.createColorBar = function() {
		var i = 0;
		var delta_x = this.plotWidth ;
		var delta_y = this.plotHeight * 0.1;
		var bar_width = this.plotWidth * 0.05;
		var band_height = 1;
		
		this.svgContainer.append("text")
			.text("0.00")
			.attr("x",delta_x+2)
			.attr("y",delta_y-2);
			
		this.svgContainer.append("text")
			.text("1.00")
			.attr("x",delta_x + 2)
//			.style("text-anchor", "end")
			.attr("y",delta_y + band_height * 100 + 10);
			
		for(i=0;i<100;i++) {
			this.svgContainer.append("rect")
						.attr("x",0)
						.attr("y",0)
						.attr("width",bar_width)
						.attr("height",band_height)
						.attr("transform", "translate("+delta_x+"," + (delta_y + i*band_height)+")")
						.style("fill",getColorFromVal(i*0.01,0,1));
						//.attr("fill","red");
		}
		
}