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
}


SVGParallelCoord.prototype.plot = function () {

	console.log("this.selectedItems = " + this.selectedAxis);
	console.log()
	var i=0,j=0;
	var pcg_data = [];
	for(i=0;i<dataCases.length;i++){
		var item = {};
		for(j=0;j<this.selectedAxis.length;j++) {
			var propValue = parseFloat(dataCases[i].getPropVal(this.selectedAxis[j])) == NaN? 0: +
							parseFloat(dataCases[i].getPropVal(this.selectedAxis[j]));
			var eval_str = "item."+this.selectedAxis[j] + " = " + propValue;
			console.log(eval_str);
			eval(eval_str);
		}
		pcg_data.push(item);
	}
	
	console.log(pcg_data);
	//this.selectedItems = this.canvasObj.selectedItems;

	this.divId = "parcoords" + Math.floor(Math.random()*10000);
	
	//console.log("g_data = " + g_data);
	//console.log("this.chartId = " + this.chartId);
	
	draw1(this.chartId+"_chart_svg",pcg_data,this.plotwidth,this.plotHeight);
	
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