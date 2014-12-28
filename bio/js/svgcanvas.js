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
	
	/**
		The height and width of each individual chart.
		might be adjusted by a function instead of hardcoding
	**/
	this.chartWidth = this.getChartWidth();
	this.chartHeight = this.getChartHeight();
	
	//Array of all anchor points, no matter if it has been allocated or not
	this.existingAnchors = [];
	
	//List of All those Anchors have been allocated
	this.allocatedAnchors = [];
	
	this.horizPadding = 20;
	
	
	this.selectedItems = [];
	
	this.tableObj = table;
}

/**
	To re-draw everything on this canvas
**/
SVGCanvas.prototype.refresh = function() {
	this.allocatedAnchors = [];
	this.selectedItems = [];
	var i = 0;
	//var len = this.chartsArr.length;
	
	//clean canvas
	document.getElementById(this.canvasId).innerHTML = "";
	//var tmpArr = this.chartsArr;
	console.log("before : " + this.chartsArr);
	var tmpArr = this.chartsArr.slice(0);//jQuery.extend({}, this.chartsArr);
	console.log("before : tmpArr " + tmpArr);
	this.chartsArr = [];
	console.log("before : tmpArr111 " + tmpArr);
	console.log("before : tmpArr.length " + tmpArr.length);
	for(i=0;i<tmpArr.length;i++) {
		console.log("Adding id = " + tmpArr[i].id )
		this.add(tmpArr[i].param);		
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
			return  Math.floor( screen.height * 0.45 ) * 1.35;
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
	var window_width = $(window).width();
	var grid_width = window_width/this.chartsPerRow;
	var grid_height = this.chartHeight + 2 * this.horizPadding;
	for(i=0;i<this.chartsPerRow;i++) {
		anchor_x = i* grid_width + (grid_width - this.chartWidth)/2;
		anchor_y = this.gridRow * grid_height  + this.horizPadding;
		this.existingAnchors.push([anchor_x,anchor_y]);
	}
	//console.log("After adding a new row" + this.existingAnchors);
	this.gridRow++;
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
	var item_index = id_pieces[1];
	var i = 0;
	for(i = 0;i<this.chartsArr.length;i++) {
		this.chartsArr[i].selected(item_index);
		this.tableObj.selected(item_index);
	}
	this.selectedItems.push(item_index);
}

/**
	Handle the event when an item is de_selected
**/
SVGCanvas.prototype.deSelected = function (item_id) {
	var id_pieces = item_id.split("_");
	var chart_id = id_pieces[0];
	var item_index = id_pieces[1];
	var i = 0;
	for(i = 0;i<this.chartsArr.length;i++) {
		this.chartsArr[i].deSelected(item_index);
		this.tableObj.deSelected(item_index);
	}
	this.selectedItems.splice(item_index, 1);
}

/**
	To toggle the status of an item, if its 
	selected, to deselected, if its deselected, 
	to selected.
**/
SVGCanvas.prototype.toggle = function(index) {
	var i = 0;
	
	if(inArrayGSU(index, this.selectedItems)) {
		console.log("Removing table index = " + index + ", this.selectedItems  " + this.selectedItems);
		for(i = 0;i<this.chartsArr.length;i++) {
			this.chartsArr[i].deSelected(index);
			this.tableObj.deSelected(index);
			this.selectedItems  = arrayRemove(index, this.selectedItems);
		}
	} else {
		console.log("Adding table");
		for(i = 0;i<this.chartsArr.length;i++) {
			this.chartsArr[i].selected(index);
			this.tableObj.selected(index);
		}
		this.selectedItems.push(index);
	}
}


/**
	To delete a diagram from this canvas
**/
SVGCanvas.prototype.getNextAnchorPoint = function() {
	var i = 0;
	if( this.existingAnchors.length == this.allocatedAnchors.length ) //
		this.addOneGridRow();
	for(i=0;i<this.existingAnchors.length;i++) {
		//console.log(this.existingAnchors[i]);
		//console.log(this.allocatedAnchors);
		//console.log($.inArray(this.existingAnchors[i], this.allocatedAnchors));
		if( ($.inArray(this.existingAnchors[i], this.allocatedAnchors)) < 0  ) {
			this.allocatedAnchors.push(this.existingAnchors[i]);
			return this.existingAnchors[i];
		}
	}
	console.log("Ooops, nothing allocated")
}

/**
	To add a new diagram to this canvas
**/
SVGCanvas.prototype.add = function(params) {
	params.chartWidth = this.chartWidth;
	params.chartHeight = this.chartHeight;
	var anchor = this.getNextAnchorPoint();
	params.anchor_x = anchor[0];
	params.anchor_y = anchor[1];
	
	var g = d3.select("#"+this.canvasId).append("g");
	
	var chart_id = "chart" + Math.floor(Math.random()*10000);
	
	if(params.type == "scatter") {
		var chart1 = new SVGChart(g,"scatter",params,anchor,chart_id,this);
		chart1.plot();
		this.chartsArr.push(chart1);
	}
}