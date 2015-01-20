var SVGHeatMap = function (params,svg,canvas_obj,chart_id) {
	this.axisX = params.x_axis;
	this.axisY = params.y_axis;
	//this.dataX = params.x_data;
	//this.dataY = params.y_data;
	
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
	
	this.XFilter = params.x_filter;
	this.YFilter = params.y_filter;
	this.ZFilter = params.z_filter;
	this.CFilter = params.c_filter;
	this.anchorX = params.anchor_x;
	this.anchorY = params.anchor_y;
}

/**
To check if a given data is ruled out or not
*/
SVGHeatMap.prototype.isValidData = function (index) {
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
SVGHeatMap.prototype.getMaxVal = function(type) {
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


SVGHeatMap.prototype.handleClickNDrag = function(type) {
	
	heatmap_svg_id = this.chartId + "_chart_svg";
	heatmap_chart_id = this.chartId;
	heatmap_anchor_x = this.anchorX;
	heatmap_anchor_y = this.anchorY;
	marquee_id = this.chartId + "_marquee_id";
	
	console.log("heatmap_svg_id = " + heatmap_svg_id)
	
	var mouse_down_function = function() {
		//console.log("test = " + test);
	
		var evt = d3.event;
		
		var bool_name = heatmap_svg_id + "_selection_enabled " ;
		var eval_str = bool_name + " = true";
		eval(eval_str);
		
		p1_x = evt.offsetX - heatmap_anchor_x;
		p1_y = evt.offsetY - heatmap_anchor_y;
		p_x = p1_x;
		p_y = p1_y;
		p1_screenX = evt.screenX;
		p1_screenY = evt.screenY;
			
			
		//console.log("evt.offsetY = " + evt.offsetY + ", this.anchorY = " + this.anchorY);
		//console.log("Client Y = " + evt.clientY + ", screenY = " + evt.screenY 
		//			+ ", offsetY = " + evt.offsetY + ", offsetX = " + evt.offsetX);
		//console.log("mousedown:p1_x = " + p1_x + ", p1_y = " + p1_y);
		//console.log(d3.event);
		console.log("mousedown： p1_x = " + p1_x + ", p1_y = " + p1_y);
	}
	
	
	var mouse_move_function = function() {
		
		var bool_name = heatmap_svg_id + "_selection_enabled " ;
		var eval_str = "if_true = typeof " + bool_name + " !== 'undefined'&& \
						" + bool_name + " == true"; 
		eval(eval_str);
		
		//handle the box-selection
		if( if_true != undefined && if_true==true) {
			var evt = d3.event;
			p_x = evt.offsetX - heatmap_anchor_x;
			p_y = evt.offsetY - heatmap_anchor_y;
			d3.event.preventDefault();
			var from_x,from_y;
			from_x = p1_x;
			from_y = p1_y;
			if(p_x < p1_x ) 
				from_x = p_x;

			if(p_y < p1_y ) 
				from_y = p_y;
			
			if(ifDomEleExists(marquee_id)) {
				d3.select("#"+marquee_id)
					.attr("x",from_x)
					.attr("y",from_y)
					.attr("width",Math.abs(p_x-p1_x))
					.attr("height",Math.abs(p_y-p1_y))
					.attr("fill-opacity",0.2)
					.attr("stroke","black")
					.attr("stroke-width",1)
					//.attr("stroke-style")
					
			} else  {
				d3.select("#"+heatmap_svg_id).append("rect")
					.attr("x",p1_x)
					.attr("y",p1_y)
					.attr("id",marquee_id)
					.attr("width",1)
					.attr("height",1)
					//.attr("fill","red");
			}
			
			console.log("2222Client Y = " + evt.clientY + ", screenY = " + evt.screenY 
						+ ", offsetY = " + evt.offsetY + ", offsetX = " + evt.offsetX);
			console.log(d3.event);
		}
	}
	
	
	var mouse_up_function = function() {
	
		var bool_name = heatmap_svg_id + "_selection_enabled " ;
		var eval_str = bool_name + " = false";
		eval(eval_str);
		var evt = d3.event;
		//console.log("11111Client Y = " + evt.clientY + ", screenY = " + evt.screenY 
		//			+ ", offsetY = " + evt.offsetY + ", offsetX = " + evt.offsetX);
		
		/**NOTE the following should be the formal way, but 
		for unknown reason, the offsetY of mouseup event cant be
		gotten correctly.So We use p_x p_y to replace here
		
		p2_x = evt.offsetX - heatmap_anchor_x;
		p2_y = evt.offsetY - heatmap_anchor_y;
		**/
		p2_screenX = evt.screenX;
		p2_screenY = evt.screenY;
		
		p2_x = p_x;
		p2_y = p_y;
		
		/*
		Use this if statement to exclude the click event
		(mouseup mousedown at same coordinate)
		**/
		if(p2_screenX == p1_screenX || p2_screenY == p1_screenY)
			return;
		
		mainCanvas.handleHeatmapBoxSelection(heatmap_chart_id,p1_x,p1_y,p2_x,p2_y);
		console.log("mouseup： p2_x = " + p2_x + ", p2_y = " + p2_y);
	}

	console.log(" this.anchorX = " + this.anchorX + " \
	this.anchorY = " + this.anchorY);
	
	this.svgContainer.on("mousedown", mouse_down_function);
	this.svgContainer.on("mouseup", mouse_up_function);
	this.svgContainer.on("mousemove", mouse_move_function);
}


SVGHeatMap.prototype.getMinVal= function(type) {
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


SVGHeatMap.prototype.plot = function () {
	var i = 0;
	this.hr = new Array(this.canvasObj.dataCaseArr.length);
	
	for(i=0; i<this.canvasObj.dataCaseArr.length; i++) {
		this.hr[i] = getHazadasratio(this.coef,this.canvasObj.dataCaseArr[i]);
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
	for (i=0;i<this.canvasObj.dataCaseArr.length;i++) {
		var x_literal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisX);
		var y_literal = this.canvasObj.dataCaseArr[i].getPropVal(this.axisY);
		//console.log("$.isNumeric("+this.dataX[i]+") = " + $.isNumeric(this.dataX[i]));
		var x = $.isNumeric(x_literal)?x_literal:0;
		var y = $.isNumeric(y_literal)?y_literal:0;
		datum.push([x,y,this.hr[i],this.canvasObj.dataCaseArr[i].js_id]);
	}
	
	var xScale = d3.scale.linear()
					 .range([this.margin.left, this.plotWidth-this.margin.left-this.margin.right])
					 .domain([this.getMinVal('x'),this.getMaxVal('x')]);
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	var yScale = d3.scale.linear()
				     .range([this.plotHeight-this.margin.top-this.margin.bottom, this.margin.top])
					 .domain([this.getMinVal('y'),this.getMaxVal('y')]);
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
	
	var eval_str = "var test_function = function (d,i) {  \
						\
						if ( $.inArray(i,["
		var j=0;
		for(j=0;j<this.canvasObj.dataCaseArr.length;j++) {
			if(this.isValidData(j)==false)
				eval_str += j + " ,";
		}
		eval_str += "]) >= 0 )       \
				return 0;  \
			else  \
				return 4;  \
		}"
		
		eval(eval_str);
	var selected_items = this.selectedItems;
	this.svgContainer.selectAll(".dot")
			.data(datum)
			.enter().append("circle")
			.attr("class","dot")
			.attr("class", function(d,i) {if( $.inArray(d[3]+"",selected_items) >=0 ) return "dot_selected"; else return "dot";} )
			.attr("r", test_function)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill",function(d){return getColorFromVal(d[2],min_hr,max_hr);})
			.attr("id", function(d,i){
					return chart_id + "_" + d[3];
					
					//return chart_id + "_" + i;
				})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.on('click',function(d,i){
				var cir_id = chart_id + "_" + d[3];
				//var cir_id = chart_id + "_" + i;
				console.log(cir_id +" is selected");
				d3.select("#"+cir_id).attr("class","dot_selected");
				mainCanvas.selected(cir_id);
				})
			.on('dblclick',function(d,i){
				//var cir_id = chart_id + "_" + i;
				var cir_id = chart_id + "_" + d[3];
				d3.select("#"+cir_id).attr("class","dot");
				mainCanvas.deSelected(cir_id);
			});
	this.handleClickNDrag();
	this.createColorBar();
	//console.log(this.svgContainer);
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

SVGHeatMap.prototype.handleBoxSelection = function(from_x,from_y,to_x,to_y) {
	var box_selected_items = [];
	this.svgContainer.selectAll("circle").each(
		function (d,i) {
			//console.log("from_x = " + from_x );
			var x = d3.select(this).attr("cx");
			var y = d3.select(this).attr("cy");
			if(inPlaneArea(x,y,from_x,from_y,to_x,to_y)) {
				var tmp_arr = d3.select(this).attr("id").split("_");
				var index = tmp_arr[1];
				box_selected_items.push(index);
				d3.select(this).attr("cx")
			}
		}
	);
	
	if(box_selected_items.length>0) {
		var content_msg = "You have choosen " + box_selected_items.length + " items, \
						  Do you want to exclude all other items and only study these items? " 
		$("#dialog-confirm-content").html(content_msg);				  
		$( "#dialog-confirm" ).dialog({
		  resizable: false,
		  height:140,
		  modal: true,
		  buttons: {
			"Ok": function() {
			  $("#"+marquee_id).remove();
			  observeSubsetData(box_selected_items);
			  $( this ).dialog( "close" );
			},
			"Cancel": function() {
			  $("#"+marquee_id).remove();
			  $( this ).dialog( "close" );
			}
		  }
		});
	}
	
	console.log(box_selected_items);
}


SVGHeatMap.prototype.selected = function (js_id) {
	var cir_id = this.chartId + "_" + js_id;
	d3.select("#" + cir_id).attr("class","dot_selected");
	//console.log(eval_str);
	//console.log(d3.select("#" + cir_id));
}