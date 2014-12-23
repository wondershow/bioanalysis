/***
	A svg chart with 
**/
var SVGChart = function (g,type,p,anchor,id,parent){
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
	this.id = id;
	this.parent = parent;
	this.plotObj = null;
}

SVGChart.prototype.selected = function(index) {
	this.plotObj.selected(index);
}

SVGChart.prototype.deSelected = function(index) {
	this.plotObj.deSelected(index);
}

SVGChart.prototype.plot = function() {

	var evalStr =  "tmp = function() { mainCanvas.delete('"+ this.id +"') }";
	//.delete('" +this.id + "');}
	//var evalStr =  "console.log('ok')";
	eval(evalStr);
	console.log(evalStr);

	var svg_ele = this.g.append("svg")
		  .attr("width", this.chartWidth )
		  .attr("height",this.chartHeight);
	svg_ele.append("rect")
		.attr("width", this.chartWidth)
		.attr("height",this.chartHeight)
		.attr("fill","white");
	var remove = svg_ele.append("text")
		.text("X")
		.attr("x",0)//this has included anchorX
		.attr("y",20)
		.attr("font-size", "20")
		.attr("fill","red")
		remove.on("click",   tmp    );
//		.on("mouseover",function() {} )
	
	//console.log(remove.size());

	this.g.attr("transform","translate("+this.anchorX+","+this.anchorY+")");
	
	console.log("this.anchorX = " + this.anchorX);
	console.log("this.anchorY = " + this.anchorY);
	
	if(this.type=="scatter") {
		var sct = new SVGScatterChart(this.param,svg_ele,this.id);
		sct.plot();
		this.plotObj = sct;
	}
}

