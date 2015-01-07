var SVGParallelCoord = function (params,svg,canvas_obj,chart_id) {

	this.margin = {top:20,right:10,bottom:10,left:40};
	
	this.plotwidth = params.chartWidth - this.margin.right - this.margin.left;
	this.plotHeight = params.chartHeight - this.margin.top - this.margin.bottom;
	
	this.svgContainer = svg;
	this.chartId = chart_id;

	this.ruleOutCItems = params.ruleOutCItems;
	console.log(params);
	this.canvasObj = canvas_obj;
	this.selectedItems = this.canvasObj.selectedItems;
	this.selectedAxis = params.items;
	this.pcgId = "pcg_" + Math.floor(Math.random()*10000);
}


SVGParallelCoord.prototype.plot = function () {

	console.log("this.selectedItems = " + this.selectedItems);
	console.log()
	var i=0,j=0;
	var pcg_data = [];
	for(i=0;i<dataCases.length;i++){
		var item = {};
		for(j=0;j<this.selectedAxis.length;j++) {
			var propValue = parseFloat(dataCases[i].getPropVal(this.selectedAxis[j])) == NaN? 0: +
							parseFloat(dataCases[i].getPropVal(this.selectedAxis[j]));
			var eval_str = "item."+this.selectedAxis[j] + " = " + propValue;
			//console.log(eval_str);
			eval(eval_str);
		}
		pcg_data.push(item);
	}
	
	console.log(pcg_data);
	//this.selectedItems = this.canvasObj.selectedItems;

	this.divId = "parcoords" + Math.floor(Math.random()*10000);
	
	console.log("this.chartId = " + this.chartId);
	//console.log("this.chartId = " + this.chartId);
	
	this.draw(this.chartId + "_chart_svg",pcg_data,this.plotwidth,this.plotHeight);
	
	/*
	this.PCCanvasDiv = this.svgContainer.append("div")
							.attr("class", "parcoords")
							.attr("id",this.divId)
							.attr("width",500)
							.attr("height",200);*/
	
	/*
	this.PCCanvasDiv = 	this.svgContainer.append("foreignObject")
							  .attr("width", 480)
							  .attr("height", 500)
							  .append("xhtml:body")
							  .style("font", "14px 'Helvetica Neue'")
							  .html("<div id='nidaye'>\
							  <div id='test_zcd' class='parcoords' style='width:500px;height:150px;background-color:yellow'> </div>\
							  </div>");

	console.log(this.svgContainer);
	console.log($("#"+this.divId));
	console.log($("#zcd"));
	//console.log($("#"+this.divId));
	var div_id = this.divId;
	var parcoords = d3.parcoords()("#test_zcd")
	.data([
    [0,-0,0,0,0,3 ],
    [1,-1,1,2,1,6 ],
    [2,-2,4,4,0.5,2],
    [3,-3,9,6,0.33,4],
    [4,-4,16,8,0.25,9]
			])
	.render()
	.createAxes();*/
}

SVGParallelCoord.prototype.selected = function(index) {
	//a dummy function;
}

SVGParallelCoord.prototype.deSelected = function(index) {
	//a dummy function;
}

SVGParallelCoord.prototype.addAxis = function(axisName) {
	
}

SVGParallelCoord.prototype.delAxis = function(axisName) {
	
}

SVGParallelCoord.prototype.draw = function(svg_id,cars,total_width,total_height) {
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
		width = total_width - margin.left - margin.right,
		height = total_height - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
		y = {};
	
	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;

	var svg = d3.select("#"+svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Extract the list of dimensions and create a scale for each.
	x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
    return d != "name" && (y[d] = d3.scale.linear()
        .domain(d3.extent(cars, function(p) { return +p[d]; }))
        .range([height, 0]));
	}));
	
  
	var bg_id = this.pcgId + "_bg_path";
	// Add grey background lines for context.
	var selected_items = this.selectedItems;
	background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path)
	  .attr("style",function(d,i){if($.inArray(i+"",selected_items)>=0) return "stroke:red;stroke-width:2"; else return "";   })
	  .on('click',function(d,i){
			console.log("single click");
			//var cir_id = chart_id + "_" + d[0] + "_" + d[1] + "_" + i;
			//var path_id = fg_id + "_" + i;
			//d3.select("#"+path_id).attr("style","stroke:red;stroke-width:2");
			var path_id = fg_id + "_" + i;
			mainCanvas.selected(path_id);
		  });
		  
	var fg_id = this.pcgId + "_fg_path";
	// Add blue foreground lines for focus.
	foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path)
	  .attr("id",function(d,i){return fg_id+"_"+i})
	  .attr("style",function(d,i){if($.inArray(i+"",selected_items)>=0) return "stroke:red;stroke-width:2"; else return "";   })
	  .on('click',function(d,i){
			
			//var cir_id = chart_id + "_" + d[0] + "_" + d[1] + "_" + i;
			//var path_id = fg_id + "_" + i;
			//d3.select("#"+path_id).attr("style","stroke:red;stroke-width:2");
			var path_id = fg_id + "_" + i;
			console.log("single click on path_id = " + path_id);
			mainCanvas.selected(path_id);
		  });

	// Add a group element for each dimension.
	var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

	// Add an axis and title.
	g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

	// Add and store a brush for each axis.
	g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
	
	// Returns the path for a given data point.
	function path(d) {
	  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
	}

	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
	  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
		  extents = actives.map(function(p) { return y[p].brush.extent(); });
	  foreground.style("display", function(d) {
		return actives.every(function(p, i) {
		  return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) ? null : "none";
	  });
	}
}