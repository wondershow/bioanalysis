var SVGCanvas = function(id,table) {
	this.canvasId = id;
	
	//The array to keep references to all the 
	this.chartsArr = [];
	
	/*how many charts we put on a row, 
	  this might be changed when we take
	  big screen into account. 
	  TODO, maybe we can write a function to detect the 
	  screen width and automatically set the param here,
	*/
	this.chartsPerRow = 2;
	
	//How many rows of diagrams we have, at the very beginning, we have 0 row.
	this.gridRow = 0;
	
	this.gridWidth = Math.floor($(window).width()/this.chartsPerRow);
	this.gridHeight = Math.floor(this.gridWidth*0.6);
	
	
	/**
		The height and width of each individual chart.
		might be adjusted by a function instead of hardcoding
	**/
	this.chartWidth = Math.floor(this.gridWidth*0.9);
	this.chartHeight = Math.floor(this.gridHeight*0.9);
	
	//Array of all anchor points, no matter if it has been allocated or not
	this.existingAnchors = [];
	
	//List of All those Anchors have been allocated
	this.allocatedAnchors = [];
	
	this.vPadding = Math.floor(this.gridHeight*0.05);
	this.hPadding = Math.floor(this.gridWidth*0.05);
	
	
	//console.log("$(window).width()="+$(window).width());
	//console.log("this.hPadding = "+this.hPadding);
	//console.log("this.chartWidth = " + this.chartWidth);
	
	
	this.selectedItems = [];
	this.tableObj = table;
	this.dataCaseArr = null;
}

/**
	To re-draw everything on this canvas
**/
SVGCanvas.prototype.refresh = function() {
	this.allocatedAnchors = [];
	this.selectedItems = [];
	var i = 0;
	
	//clean canvas
	document.getElementById(this.canvasId).innerHTML = "";
	var tmpArr = this.chartsArr.slice(0);
	this.chartsArr = [];
	for(i=0;i<tmpArr.length;i++) {
		this.add(tmpArr[i].param);		
	}
}

SVGCanvas.prototype.updateDataCase = function(case_arr) {
	this.dataCaseArr = case_arr;
}

SVGCanvas.prototype.handleHeatmapBoxSelection = function(chart_id, from_x,from_y,to_x,to_y) {
	var i = 0;
	for(i=0;i<this.chartsArr.length;i++) {
		if(this.chartsArr[i].id == chart_id)
			this.chartsArr[i].handleBoxSelection(from_x,from_y,to_x,to_y);
	}
}


SVGCanvas.prototype.higlightHeatmapSelections = function(chart_id, index_arr) {
	var i = 0;
	for(i=0;i<this.chartsArr.length;i++) {
		if(this.chartsArr[i].id == chart_id)
			this.chartsArr[i].higlightBoxSelection(index_arr);
	}
} 

/**
	To re-draw everything on this canvas
**/
SVGCanvas.prototype.getChartWidth = function() {
	var widow_width = $(window).width(),window_height = $(window).height();
	//console.log("$(window).width() = " + $(window).width() + ",$(window).height() = " + $(window).height())
	if( widow_width > 2000)
		return Math.floor(window_height/300)*100;
	else {
		var standardHeight = screen.height * 0.45;
		if($(window).width() < standardHeight * 2.7)
			return  Math.floor( $(window).width() / 2.2 );
		else
			return  Math.floor( screen.height * 0.45 * 1.35 ) ;
	}
}

SVGCanvas.prototype.getChartHeight = function() {
	var widow_width = $(window).width(),window_height = $(window).height();
	if( widow_width > 2000)
		return Math.floor(screen.height * 0.45);
	else  {
		var standardHeight = screen.height * 0.45;
		if($(window).width() < standardHeight * 2.7) 
			return  Math.floor( $(window).width()* 0.75 / 2.2 );
		else
			return  Math.floor(screen.height * 0.45);
	}
}

/**
add a new gridRow When necessary , e.g. when we already have two diagrams 
on board, and chartsPerRow=2, when we add a new diagram, this function should
be called first
**/
SVGCanvas.prototype.addOneGridRow = function() {
	var i = 0,anchor_x,anchor_y;
	
	var res = [];
	for(i=0;i<this.chartsPerRow;i++) {
		anchor_x = i * this.gridWidth + this.hPadding;
		anchor_y = this.gridRow * this.gridHeight  + this.vPadding;
		res.push([anchor_x,anchor_y]);
		this.existingAnchors.push([anchor_x,anchor_y]);
	}
	//console.log("After adding a new row" + this.existingAnchors);
	this.gridRow++;
	return res;
}

/**
	To delete a diagram from this canvas
**/
SVGCanvas.prototype.delete = function(chart_id) {
	console.log("Deleting id = " + chart_id);
	var tmpArr = [];
	var i = 0;
	console.log(this.chartsArr);
	for(i = 0;i < this.chartsArr.length;i++) {
		//console.log("Id = " + this.chartsArr[i].id);
		if( this.chartsArr[i].id != chart_id )
			tmpArr.push(this.chartsArr[i]);
		//this.chartsArr.splice(i, 1);
	}
	this.chartsArr = tmpArr;
	console.log(this.chartsArr);
	this.refresh();
}

/**
	Handle the event when an item is selected
**/
SVGCanvas.prototype.selected = function (item_id) {
	var id_pieces = item_id.split("_");
	var chart_id = id_pieces[0];
	var js_id = id_pieces[id_pieces.length-1];
	var i = 0;
	if($.inArray(js_id,this.selectedItems) < 0)
		this.selectedItems.push(js_id);
	for(i = 0;i<this.chartsArr.length;i++) {
		this.chartsArr[i].selected(js_id);
		this.tableObj.selected(js_id);
		this.chartsArr[i].refresh();
	}
	console.log("Select " + js_id);
}

/**
	Handle the event when an item is de_selected
**/
SVGCanvas.prototype.deSelected = function (item_id) {
	var id_pieces = item_id.split("_");
	var chart_id = id_pieces[0];
	var item_index = id_pieces[1];
	var i = 0;
	//console.log("before: canvas.selectedItems = " + this.selectedItems);
	this.selectedItems  = arrayRemoveVal(item_index, this.selectedItems);
	//console.log("after: canvas.selectedItems = " + this.selectedItems);
	for(i = 0;i<this.chartsArr.length;i++) {
		//this.chartsArr[i].deSelected(item_index);
		this.tableObj.deSelected(item_index);
		this.chartsArr[i].refresh();
	}
	console.log("Deselect " + item_index);
}

/**
	To toggle the status of an item, if its 
	selected, to deselected, if its deselected, 
	to selected. This function is mainly called when
	an item in the table is doubleclicked. 
**/
SVGCanvas.prototype.toggle = function(index) {
	var i = 0;
	
	if(inArrayGSU(index, this.selectedItems)) {
		console.log("Removing table index = " + index + ", this.selectedItems  " + this.selectedItems);
		for(i = 0;i<this.chartsArr.length;i++) {
			//this.chartsArr[i].deSelected(index);
			this.tableObj.deSelected(index);
			this.selectedItems  = arrayRemoveVal(index, this.selectedItems);
			this.chartsArr[i].refresh();
		}
	} else {
		console.log("Adding table");
		if($.inArray(index,this.selectedItems) < 0)
			this.selectedItems.push(index);
		for(i = 0;i<this.chartsArr.length;i++) {
			this.chartsArr[i].refresh();
			this.tableObj.selected(index);
		}
	}
}


/**
	Get next anchor point for the canvas,
	slot_num is how many slots you need for a plotting. normally you 
	need one, but you might need two if you are plotting parallel coordinate
	diagram
**/
SVGCanvas.prototype.getNextAnchorPoint = function(slot_num) {
	var i = 0;
	var new_added_anchors;
	
	//console.log("this.existingAnchors.length = " + this.existingAnchors.length);
	//console.log("this.allocatedAnchors.length = " + this.allocatedAnchors.length);
	
	
	if( this.existingAnchors.length == this.allocatedAnchors.length) //
		new_added_anchors = this.addOneGridRow();
	/*	
	if(slot_num == 2) { //handle the situation of two slots application
		this.allocatedAnchors.push(new_added_anchors[0]);
		this.allocatedAnchors.push(new_added_anchors[1]);
		return new_added_anchors[0];
	}*/
	if(slot_num == 2) {
		for(i=0;i<this.existingAnchors.length;i++){
			var x = this.existingAnchors[i][0];
			var y = this.existingAnchors[i][1];
			
			var tuple = [x+this.gridWidth,y];
			var tuple_index = inTupleArray(tuple,this.existingAnchors);
			
			//allocate when both the current anchor point and the tuple point are not allocated
			if(tuple_index >= 0 && inTupleArray(this.existingAnchors[i],this.allocatedAnchors)<0 && inTupleArray(tuple,this.allocatedAnchors)) {
				this.allocatedAnchors.push(this.existingAnchors[i]);
				this.allocatedAnchors.push(this.existingAnchors[tuple_index]);
				return this.existingAnchors[i];
			}
		}
		//when there is no qualified anchors in the existing anchors, 
		//we have to add new anchors
		new_added_anchors = this.addOneGridRow();
		this.allocatedAnchors.push(new_added_anchors[0]);
		this.allocatedAnchors.push(new_added_anchors[1]);
		return new_added_anchors[0];
	}
	
	//handle the situation of one slot application
	for(i=0;i<this.existingAnchors.length;i++) {
		if( (inTupleArray(this.existingAnchors[i], this.allocatedAnchors)) < 0  ) {
			this.allocatedAnchors.push(this.existingAnchors[i]);
			return this.existingAnchors[i];
		}
	}
}

/**
	To add a new diagram to this canvas
**/
SVGCanvas.prototype.add = function(params) {
	
	if(params.type == "pc") {
		params.chartWidth = this.chartWidth * 1.8;
		params.chartHeight = this.chartHeight;
		
		params.legendWidth = this.hPadding * 2 + this.chartWidth * 0.2;
		params.legendHeight = this.chartHeight;
		
		var anchor = this.getNextAnchorPoint(2);
		
		params.anchor_x = anchor[0];
		params.anchor_y = anchor[1];
		
		var g = d3.select("#"+this.canvasId).append("g");
		var chart_id = "chart" + Math.floor(Math.random()*10000);
		
		var chart1 = new SVGChart(g,"pc",params,anchor,chart_id,this);
		chart1.plot();
		this.chartsArr.push(chart1);
		
	} else {
		params.chartWidth = this.chartWidth * 0.9;
		params.chartHeight = this.chartHeight;
		params.legendWidth = this.chartWidth * 0.1;
		params.legendHeight = this.chartHeight;
		
		var anchor = this.getNextAnchorPoint(1);
		params.anchor_x = anchor[0];
		params.anchor_y = anchor[1];
		console.log("params.anchor_x=" + params.anchor_x);
		
		var g = d3.select("#"+this.canvasId).append("g");
		
		var chart_id = "chart" + Math.floor(Math.random()*10000);
		
		if(params.type == "scatter") {
			var chart1 = new SVGChart(g,"scatter",params,anchor,chart_id,this);
			chart1.plot();
			this.chartsArr.push(chart1);
		}else if(params.type == "heatmap") {
			var chart1 = new SVGChart(g,"heatmap",params,anchor,chart_id,this);
			chart1.plot();
			this.chartsArr.push(chart1);
		}
	}
	var canvas_height = params.chartHeight + params.anchor_y + this.vPadding;
	$("#test").attr("height",canvas_height);
}

/**
Handles the filter(slider bar) drag event.
**/
SVGCanvas.prototype.updateChart = function(id,type,from,to) {
	console.log("id = "+ id +"type = " + type + ", from = " + from + ", to = " + to);

	for(i=0;i<this.chartsArr.length;i++) {
		if(this.chartsArr[i].id == id) {
			if (type == 'x')
				this.chartsArr[i].param.x_filter = {from:from,to:to};
			else if( type == 'y')
				this.chartsArr[i].param.y_filter = {from:from,to:to};
			else if (type == 'z')
				this.chartsArr[i].param.z_filter = {from:from,to:to};
			else if (type == 'c') 
				this.chartsArr[i].param.c_filter = {filter_type:from,item:to};
			this.chartsArr[i].refresh();
		}
	}
}

SVGCanvas.prototype.addAxis = function(chart_id,axis_name) {
	var i=0;
	for(i=0;i<this.chartsArr.length;i++) {
		if( this.chartsArr[i].chart_svg_id == chart_id )
			this.chartsArr[i].addAxis(axis_name);
	}
	console.log("addAxis: chart_id = " + chart_id + ", axis_name = " + axis_name );
}


SVGCanvas.prototype.delAxis = function(chart_id,axis_name) {
	var i=0;
	for(i=0;i<this.chartsArr.length;i++) {
		if( this.chartsArr[i].chart_svg_id == chart_id )
			this.chartsArr[i].delAxis(axis_name);
	}
	console.log("delAxis: chart_id = " + chart_id + ", axis_name = " + axis_name );
}

SVGCanvas.prototype.updateTblObj = function(tbl) {
	this.tableObj = tbl;
}
