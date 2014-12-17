/***
	A svg chart with 
**/
var SVGChart = function (g,type,p,anchor){
	//svg g element
	this.g = g;
	this.param = p;
	
	
	this.chartWidth = p.chartWidth;
	this.chartHeight = p.chartHeight;
	
	//The coordinate of the leftup most point of this chart in the canvas
	this.anchorX = anchor[0];
	this.anchorY = anchor[1];
	
	//The index of this chart in all those charts locate in canvas
	//this.chartIndex = index;
	
	//The type of the chart, e.g. scatter, heatmap ....
	this.type = type;
}

SVGChart.prototype.plot = function() {
	var svg_ele = this.g.append("svg")
		  .attr("width", this.chartWidth )
		  .attr("height",this.chartHeight);
	svg_ele.append("rect")
		.attr("width", this.chartWidth)
		.attr("height",this.chartHeight)
		.attr("fill","CadetBlue");
	this.g.attr("transform","translate("+this.anchorX+","+this.anchorY+")");
	
	if(this.type=="scatter") {
		var sct = new SVGScatterChart(this.param,svg_ele);
		sct.plot();
	}
}