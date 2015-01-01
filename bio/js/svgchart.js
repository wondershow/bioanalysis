/***
	A svg chart with 
**/
var SVGChart = function (g,type,p,anchor,id,parent){
	//svg g element
	this.g = g;
	this.param = p;
	
	this.dataX = p.x_data;
	this.dataY = p.y_data;
	this.dataZ = p.z_data;
	this.dataC = p.c_data;
	this.axisX = p.x_axis;
	this.axisY = p.y_axis;
	this.axisZ = p.z_axis;
	this.axisC = p.c_axis;
	
	
	this.chartWidth = p.chartWidth;
	this.chartHeight = p.chartHeight;
	this.legendWidth = p.legendWidth;
	this.legendHeight = p.legendHeight;
	
	//The coordinate of the leftup most point of this chart in the canvas
	this.anchorX = anchor[0];
	this.anchorY = anchor[1];
	
	//The index of this chart in all those charts locate in canvas
	//this.chartIndex = index;
	
	//The type of the chart, e.g. scatter, heatmap ....
	this.type = type;
	this.id = id;
	this.parent = parent;
	this.plotObj = null;
	
	this.ruleOutCItems = [];
}

SVGChart.prototype.selected = function(index) {
	this.plotObj.selected(index);
}

SVGChart.prototype.deSelected = function(index) {
	this.plotObj.deSelected(index);
}

SVGChart.prototype.plot = function () {
	this.draw();
	this.addSliders();
}



SVGChart.prototype.draw = function() {
	var evalStr =  "tmp = function() { mainCanvas.delete('"+ this.id +"') }";
	//.delete('" +this.id + "');}
	//var evalStr =  "console.log('ok')";
	eval(evalStr);
	
	this.chart_svg_id = this.id + "_chart_svg";
	this.mainChartSvg = this.g.append("svg")
				  .attr("id",this.chart_svg_id)
				  .attr("width", this.chartWidth )
				  .attr("height",this.chartHeight);
				  
	this.mainChartSvg.append("rect")
		.attr("width", this.chartWidth)
		.attr("height",this.chartHeight)
		.attr("fill","white");
		
	var remove = this.mainChartSvg.append("text")
		.text("X")
		.attr("x",0)//this has included anchorX
		.attr("y",20)
		.attr("font-size", "20")
		.attr("fill","red")
		
	remove.on("click", tmp );
	
	this.g.attr("transform","translate("+this.anchorX+","+this.anchorY+")");
	
	
	if(this.type=="scatter") {
		var sct = new SVGScatterChart(this.param,this.mainChartSvg,this.parent,this.id);
		sct.plot();
		this.plotObj = sct;
	}
}

SVGChart.prototype.refresh = function(){
	console.log("Refreshing");
	document.getElementById(this.chart_svg_id).innerHTML = "";
	
	//To setup the filter for the enumerative values
	if(this.param.c_filter != undefined && this.param.c_filter != null) {
		if(this.param.c_filter.filter_type =='RESUME') {
			var tmpArr = this.ruleOutCItems;
			console.log("before: " + this.ruleOutCItems )
			this.ruleOutCItems = arrayRemoveVal(this.param.c_filter.item,tmpArr);
			console.log("after: " + this.ruleOutCItems )
		} else {
			if($.inArray(this.param.c_filter.item,this.ruleOutCItems)<0 )
				this.ruleOutCItems.push(this.param.c_filter.item);
		}
		console.log("this.ruleOutCItems = " + this.ruleOutCItems);
	}
	this.param.ruleOutCItems = this.ruleOutCItems;
	this.draw();
}

SVGChart.prototype.addSliders = function() {
	
	this.legend_svg = this.g.append("svg")
				  .attr("width", this.legendWidth )
				  .attr("height",this.legendHeight)
				  .attr("x",this.chartWidth);
				  
	this.legend_svg.append("rect")
		.attr("width", this.legendWidth)
		.attr("height",this.legendHeight)
		.attr("fill","white");
	
	
	slider_height =  Math.floor(this.legendHeight * 0.45);
	
	slider_width = Math.floor(this.legendWidth*0.3);
	
	var anchor_x = 0.2*(this.legendWidth - slider_width)
	
	//var eval_str = "var refresh_function = function() {mainCanvas.refresh("+this.id+")};";
	//eval(eval_str);
	
	var min_val = d3.min(this.dataX, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var max_val = d3.max(this.dataX, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var anchor1 = { x: anchor_x, y : 5 } 
	var params1 = {anchor:anchor1,w:slider_width,h:slider_height,svg:this.legend_svg,label:this.axisX,min:min_val,max:max_val,type:'v',chart_id:this.id,axis_name:'x'}; 
	var slider = new SVGSlider(params1);
	slider.generate();
	
	
	var min_val = d3.min(this.dataY, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var max_val = d3.max(this.dataY, function(d) { return parseInt(d)==NaN? 0:parseInt(d);})
	var anchor2 = { x:anchor_x, y : Math.floor(this.legendHeight * 0.5 + 5 ) } 
	var params2 = {anchor:anchor2,w:slider_width,h:slider_height,svg:this.legend_svg,label:this.axisY,min:min_val,max:max_val,type:'v',chart_id:this.id,axis_name:'y'}; 
	var slider2 = new SVGSlider(params2);
	slider2.generate();

}