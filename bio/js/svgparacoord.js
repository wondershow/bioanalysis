var SVGParallelCoord = function (params,svg,canvas_obj,chart_id) {

	this.margin = {top:20,right:10,bottom:10,left:40};
	
	this.plotwidth = params.chartWidth - this.margin.right - this.margin.left;
	this.plotHeight = params.chartHeight - this.margin.top - this.margin.bottom;
	
	this.svgContainer = svg;
	this.chartId = chart_id;

	this.ruleOutCItems = params.ruleOutCItems;
	
	this.canvasObj = canvas_obj;
	this.selectedItems = this.canvasObj.selectedItems;
	this.selectedAxis = params.items;
	this.pcgId = "pcg_" + Math.floor(Math.random()*10000);
}


SVGParallelCoord.prototype.plot = function () {
	var i=0,j=0;
	var pcg_data = [];
	for(i=0;i<dataCases.length;i++){
		var item = {};
		for(j=0;j<this.selectedAxis.length;j++) {
			var propValue = parseFloat(dataCases[i].getPropVal(this.selectedAxis[j])) == NaN? 0: +
							parseFloat(dataCases[i].getPropVal(this.selectedAxis[j]));
			if(this.selectedAxis[j].endsWith("c"))
				propValue = dataCases[i].getPropVal(this.selectedAxis[j]);
			var eval_str = "item."+this.selectedAxis[j] + " = '" + propValue + "'";
			eval(eval_str);
		}
		pcg_data.push(item);
	}
	this.divId = "parcoords" + Math.floor(Math.random()*10000);
	this.drawCoord(this.chartId + "_chart_svg",pcg_data,this.plotwidth,this.plotHeight);
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


SVGParallelCoord.prototype.drawCoord = function(svg_id,cars,total_width,total_height) {
	var margin = {top: 30, right: 10, bottom: 10, left: 10},
		width = total_width - margin.left - margin.right,
		height = total_height - margin.top - margin.bottom;

	var x = d3.scale.ordinal().rangePoints([0, width], 1),
		y = {	};
	
	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left"),
		background,
		foreground;

	//
	var svg = d3.select("#"+svg_id)
			    .attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Extract the list of dimensions and create a scale for each.
	x.domain(
		dimensions = d3.keys(cars[0]).filter(	function(d) {
			var domain_range = null;
			if(d.endsWith("n")) {
				domain_range = d3.extent(cars,function(p){ return +p[d];});
				res = d != "name" && ( y[d] = d3.scale.linear()
				.domain(domain_range)
				.range([height, 0]) );
			}
			else {
				var tmp_arr = [];
				var j = 0;
				for (j = 0;j<cars.length;j++) {
					var tmp_obj = cars[j]
					tmp_arr.push(tmp_obj[d]);
				}
				domain_range = tmp_arr.unique();
				res = d != "name" && ( y[d] = d3.scale.ordinal()
				.domain(domain_range)
				.rangeRoundPoints([height, 0]));
			}
			
			//console.log("d = " + d + ", res = " + res);
			//console.log(d);
			//console.log(res);
			return res;
		}));
	
  
	var bg_id = this.pcgId + "_bg_path";
	//Add grey background lines for context.
	var selected_items = this.selectedItems;
	background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cars)
    .enter().append("path")
      .attr("d", path)
	  .attr("style",function(d,i){if($.inArray(i+"",selected_items)>=0) return "stroke:red;stroke-width:2"; else return "";   })
	  .on('click',function(d,i){
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
			var path_id = fg_id + "_" + i;
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
	  //console.log("in path, d is ");
	  //console.log(d);
	  return line(dimensions.map(function(p) { 
		/*
		console.log("P is " + p + " + x(p) = "
					 + x(p) + ", d[p] = " + d[p] + 
					", y[p] = " + y[p] + ", y[p](d[p]) = " + y[p](d[p]));*/
		return [x(p), y[p](d[p])]; 
		}));
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