/***
	A svg chart with 
**/
var SVGChart = function (g,type,p,anchor,id,parent){
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
	this.chart_svg_id = this.id + "_chart_svg";
	this.parentCanvas = parent;
	this.plotObj = null;
	this.ruleOutCItems = [];
}

SVGChart.prototype.selected = function(index) {
	this.plotObj.selected(index);
}

SVGChart.prototype.deSelected = function(index) {
	this.plotObj.deSelected(index);
}

SVGChart.prototype.addAxis = function(axisName) {
	var selected_items = this.param.items;
	if( $.inArray(axisName,selected_items)<0 ) {
		this.param.items.push(axisName);
		this.parentCanvas.refresh();
	}
	//this.plotObj.addAxis(axisName);
}

SVGChart.prototype.delAxis = function(axisName) {
	var selected_items = this.param.items;
	//console.log("current_items = " + current_items);
	//console.log(current_items);
	if($.inArray(axisName,selected_items)>=0) {
		this.param.items = arrayRemoveVal(axisName,selected_items);
		this.parentCanvas.refresh();
	}
	//this.refresh();
	//this.plotObj.delAxis(axisName);
}

SVGChart.prototype.plot = function () {
	this.draw();
	//add sliders when necessary
	if(this.type == 'scatter'||this.type == 'heatmap')
		this.addSliders();
	else if(this.type == 'pc')
		this.addDimSelector();
}

SVGChart.prototype.draw = function() {
	//create a js function that can be used as an delete event listener 
	var evalStr =  "tmp = function() { mainCanvas.delete('"+ this.id +"') }";
	eval(evalStr);
	
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
	
	this.g.attr("transform","translate(" + this.anchorX + "," + this.anchorY +")");
	
	console.log("this.anchorX = " + this.anchorX + ", this.anchorY = " + this.anchorY);
	
	if(this.type=="scatter") {
		var sct = new SVGScatterChart(this.param,this.mainChartSvg,this.parentCanvas,this.id);
		sct.plot();
		this.plotObj = sct;
	} else if(this.type=="heatmap") {
		var sct = new SVGHeatMap(this.param,this.mainChartSvg,this.parentCanvas,this.id);
		sct.plot();
		this.plotObj = sct;
	} else if(this.type=="pc") {
		var sct = new SVGParallelCoord(this.param,this.mainChartSvg,this.parentCanvas,this.id);
		sct.plot();
		this.plotObj = sct;
	}
}

SVGChart.prototype.refresh = function(){
	console.log("Refreshing");
	
	document.getElementById(this.chart_svg_id).innerHTML = "";
	
	$('#'+this.chart_svg_id).remove();
	
	//To setup the filter for the enumerative values
	if(this.param.c_filter != undefined && this.param.c_filter != null) {
		if(this.param.c_filter.filter_type =='RESUME') {
			var tmpArr = this.ruleOutCItems;
			//console.log("before: " + this.ruleOutCItems )
			this.ruleOutCItems = arrayRemoveVal(this.param.c_filter.item,tmpArr);
			//console.log("after: " + this.ruleOutCItems )
		} else {
			if($.inArray(this.param.c_filter.item,this.ruleOutCItems)<0 )
				this.ruleOutCItems.push(this.param.c_filter.item);
		}
		//console.log("this.ruleOutCItems = " + this.ruleOutCItems);
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

SVGChart.prototype.addDimSelector = function() {
	var actual_width = $("#"+this.chart_svg_id).attr("width");
	var actual_height = $("#"+this.chart_svg_id).attr("height");

	this.legend_svg = this.g.append("svg")
				  .attr("width", this.legendWidth )
				  .attr("height",actual_height)
				  .attr("x",actual_width);
	
	this.legend_svg.append("rect")
		.attr("width", this.legendWidth)
		.attr("height",actual_height)
		.attr("fill","white");
	
	var exist_axis_selection_id = this.chart_svg_id + "_existing_axis_selection";
	var exist_axis_html = "<select id='"+ exist_axis_selection_id +"'>";
	var j = 0;
	for(j=0;j<this.param.items.length;j++) {
		exist_axis_html += "<option value'" + this.param.items[j] + "'>"+this.param.items[j]+" </option> ";
	}
	exist_axis_html += "</select>";
	
	var onclick_function_str =  '\
								var select = document.getElementById(\''+exist_axis_selection_id+'\');\
								var select_value = select.options[select.selectedIndex].value; \
								mainCanvas.delAxis(\''+this.chart_svg_id+'\',select_value);';
	
	exist_axis_html += '<br><button onclick="' + onclick_function_str+'"> - </button>'
	
	
	
	var available_axis_selection_id = this.chart_svg_id + "_available_axis_selection_id";
	var available_axis_html = "<select id='"+ available_axis_selection_id +"'>";
	var j = 0;
	var all_prop_names = dataCases[0].getAllPropNames();
	for(j=0;j<all_prop_names.length;j++) {
		if($.inArray(all_prop_names[j],this.param.items)<0) 
		available_axis_html += "<option value'"+all_prop_names[j]+"'>"+all_prop_names[j]+" </option> ";
		
	}
	available_axis_html += "</select>";

	var onclick_function_str =  '\
								var select = document.getElementById(\''+available_axis_selection_id+'\');\
								var select_value = select.options[select.selectedIndex].value; \
								mainCanvas.addAxis(\''+this.chart_svg_id+'\',select_value);';
	//exist_axis_html += onclick_function_str;
	//onclick_function_str = "";
	available_axis_html += '<br><button onclick="' + onclick_function_str+'"> + </button>'

	var order_adjustment_html = this.axisOrderHtml();
	this.legend_svg.append("foreignObject")
		.attr("width", this.legendWidth)
		.attr("height",actual_height)
		.append("xhtml")
		.style("font", "14px 'Helvetica Neue'")
		.html("<html style='background-color:green'>"+exist_axis_html + "<br><br><br>"+ available_axis_html + "<br><br><br>"+ order_adjustment_html + " </html>");
		//.html("<html style='background-color:green'>"+"<br><br><br>"+  + " </html>");
	
	
	
	return;
}

SVGChart.prototype.axisOrderHtml = function() {
	var html = "";
	
	var j = 0;
	var max_len = this.getMaxLen(this.param.items);
	for(j=0;j<this.param.items.length;j++) {
		html += "<button onclick='mainCanvas.adjustAxisOrder(\""+this.chart_svg_id+"\",\""+this.param.items[j]+"\",\"up\" )'> < </button> " 
				+ this.getFixedLenStr(this.param.items[j],max_len) + 
				"<button onclick='mainCanvas.adjustAxisOrder(\""+this.chart_svg_id+"\",\""+this.param.items[j]+"\",\"down\" )'> > </button> <br>";
	}
	
	return html;
}

SVGChart.prototype.getFixedLenStr = function(str,len) {
	var diff = len - str.length;
	var i = 0;
	var res = str;
	for(i=0;i<diff;i++){
		
		res += "&nbsp;";
	}
	
	return res;
}

SVGChart.prototype.getMaxLen = function(str_arr) {
	var max = 0;
	var i = 0;
	for(i=0;i<str_arr.length;i++) {
		if(str_arr[i].length>max)
			max = str_arr[i].length;
	}
	return max;
}

SVGChart.prototype.handleBoxSelection = function(from_x,from_y,to_x,to_y) {
		this.plotObj.handleBoxSelection(from_x,from_y,to_x,to_y);
}

SVGChart.prototype.higlightBoxSelection = function() {
		this.plotObj.higlightBoxSelection(from_x,from_y,to_x,to_y);
}

SVGChart.prototype.switchAxisOrder = function (axis_name,direction) {
	var arr = this.param.items;
	var i = 0;
	var pos = 0;
	for(i=0;i<arr.length;i++) {
		if(arr[i] === axis_name)
			pos = i;
	}
	var tmp = arr[pos];
	if(direction == "up") {
		if(pos>0) {
			arr[pos] = arr[pos-1];
			arr[pos-1] = tmp;
		}
	}
	if(direction == "down") {
		if(pos < arr.length-1) {
			arr[pos] = arr[pos+1];
			arr[pos+1] = tmp;
		}
	}
	return arr;
}

SVGChart.prototype.adjustAxisOrder = function (axis_name,direction) {
	this.param.items = this.switchAxisOrder(axis_name,direction);
	this.parentCanvas.refresh();
}