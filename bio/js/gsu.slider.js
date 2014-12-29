/**
	This class defines a pure svg based slider.
**/
var SVGSlider  = function (params) {
	this.anchor = params.anchor;
	this.width = params.w;
	this.height = params.h;
	this.svgParent = params.svg;
	this.label = params.label;
	this.from = params.min;
	this.to = params.max;
	this.up = this.from;
	this.down = this.to;
	this.chartId = params.chart_id;
	
	//Horizontal or vertical
	this.type = params.type;
	this.axis_name = params.axis_name;
	this.containerid = null;
	
	if(this.type == 'h') { //horizontal
	
		//The width of the label
		this.labelWidth = Math.floor(this.width*0.25);
		
		//The width of middle long bar
		this.sliderWidth = Math.floor(this.width*0.7);
		this.sliderHeight = Math.floor(this.height*0.4);
		//the anchor point of the long bar
		this.barAnchorX = this.labelWidth + 3;
		this.barAnchorY = Math.floor(this.height*0.25);
		
		this.handleWidthOffset = 8;
		//The width and height of the rectangle box(which you can drag with cursor)
		this.handleWidth = this.sliderHeight + this.handleWidthOffset;
		this.handleHeight = this.sliderHeight + this.handleWidthOffset;
		
	} else {
		this.labelHeight = Math.floor(this.height*0.2);
		
		this.sliderHeight = Math.floor(this.height*0.7);
		this.sliderWidth = Math.floor(this.width*0.4);
		
		//the anchor point of the long bar
		this.barAnchorX = Math.floor(this.width*0.25)
		this.barAnchorY = this.labelHeight + 3;
		
		this.handleWidthOffset = 8;
		//The width and height of the rectangle box(which you can drag with cursor)
		this.handleWidth = this.sliderWidth + this.handleWidthOffset;
		this.handleHeight = this.sliderWidth + this.handleWidthOffset;
	}
}

SVGSlider.prototype.generate = function () {
	var id = "slider_container_" + Math.floor(Math.random()*100000);
	this.container = this.svgParent.append('g')
								   .attr("transform","translate("+this.anchor.x+ ","+this.anchor.y+")")
								   .attr("id",id);
	this.containerid = id;
	
	//console.log("this.from = " + this.from);
	
	if(this.type == 'h')
		this.genHorizontal();
	else
		this.genVertical();
}

SVGSlider.prototype.addHLabel = function() {
	var label_height = this.height*0.8;
	var half_height = Math.floor(this.height/2);
	
	//To add label
	var test = d3.select("#"+this.containerid).append("text")
							 .attr("x",2)
							 .attr("y",half_height)
							 .text(this.label+":")
							 .style("text-anchor", "start");
}

/**
To draw left handler and its label,
after that set up listeners
**/
SVGSlider.prototype.drawLeftHandle = function () {

	var from_handle_id = "handle_from_" + Math.floor(Math.random()*10000)
	var from_text_id = "from_text_" + Math.floor(Math.random()*10000);
	
	d3.select("#"+this.containerid).append('rect')
								.attr("x",this.barAnchorX - this.handleWidthOffset/2)
								.attr("y",this.barAnchorY - this.handleWidthOffset/2)
								.attr("rx",1)
								.attr("ry",1)
								.attr("id",from_handle_id)
								//.attr("id","asdfasdfasdf")
								.attr("width",this.handleWidth)
								.attr("height",this.handleHeight)
								.attr("transform","translate(0,0)")
								.style("fill","yellow")
								.style("stroke","black");
								
	d3.select("#"+this.containerid).append('text')						
								.attr("x",this.barAnchorX)
								.attr("y",this.height - 1)
								.text(this.from)
								.attr("id",from_text_id)
								.attr("transform","translate(0,0)")
								.style("text-anchor", "start");

	//set up listner for left drag handler
	var evalStr = "var tmp_function = function(e){  \
			"+from_handle_id+"slider_on = true; \
			slider_orig_left_x = e.clientX; \
			slider_orig_y = e.clientY; \
			if (typeof "+this.containerid+"_range_from === 'undefined' )  \
				"+this.containerid+"_range_from =  "+this.from+";     \
			if (typeof "+this.containerid+"_range_to === 'undefined' )  \
				"+this.containerid+"_range_to =  "+this.to+";     \
			slider_x_from = " + this.barAnchorX + "; \
			"+this.containerid + "_slider_length = " + (this.sliderWidth - this.handleWidth + 2) + "; \
	}";
	eval(evalStr);
	
	$("#"+from_handle_id).bind("mousedown",tmp_function);
	//$("#"+from_handle_id).bind("mousedown",function (){console.log("asdf")});

	var evalStr = "var tmp_function1 = function(e){ \
			if( (typeof "+from_handle_id+"slider_on !== 'undefined')  && "+from_handle_id+"slider_on) { \
				dx = e.clientX - slider_orig_left_x; \
				slider_orig_left_x =  e.clientX; \
				var tmpStr = $('#" + from_handle_id + "').attr('transform');\
				var oldTransformXY = getParameters(tmpStr);					\
				var newTransformX = parseInt(oldTransformXY[0]) +  dx; \
				var bar_length = " + this.containerid + "_slider_length; \
				if(newTransformX > bar_length ) newTransformX =  bar_length;\
				if(newTransformX < 0 ) newTransformX =  0;\
				"+this.containerid+"_range_from = "+ this.from +  " + Math.floor("+(this.to - this.from)+"*(newTransformX/bar_length));\
				var newTransformY = parseInt(oldTransformXY[1])	;			\
				$('#" + from_handle_id + "').attr('transform','translate('+newTransformX+','+newTransformY+')'); \
				d3.select('#" + from_text_id + "').text( "+this.containerid+"_range_from ); \
				}\
	}";
	
	//mainCanvas.refresh('"+this.chartId +"','y', range_from ,range_to );	\
	/**
	//console.log('newTransformX = ' + newTransformX + ',' + );\ 
	//console.log('slider_orig_left_x = ' + slider_orig_left_x); \
				//console.log('dx = ' + dx); \
	//console.log('translate('+newTransformX+','+newTransformY+')');    \
	console.log('newTransformX = ' + newTransformX + ',' + " + this.containerid + "_slider_length" + 0 +" );\
	*/
	
	eval(evalStr);
	
	$("#"+from_handle_id).bind("mousemove",tmp_function1);
	
	var evalStr = 'tmp_function2 = function(){'+from_handle_id+'slider_on = false;}';
	eval(evalStr)
	$("#"+from_handle_id).mouseout(tmp_function2)
	//$("body")[].bind("mouseup",function(){console.log("this.abc")})
	$("body").bind("mouseup",tmp_function2);
}




SVGSlider.prototype.drawUpperHandle = function () {

	var from_handle_id = "handle_from_" + Math.floor(Math.random()*10000)
	var from_text_id = "from_text_" + Math.floor(Math.random()*10000);
	
	d3.select("#"+this.containerid).append('rect')
								.attr("x",this.barAnchorX - this.handleWidthOffset/2)
								.attr("y",this.barAnchorY - this.handleWidthOffset/2)
								.attr("rx",1)
								.attr("ry",1)
								.attr("id",from_handle_id)
								//.attr("id","asdfasdfasdf")
								.attr("width",this.handleWidth)
								.attr("height",this.handleHeight)
								.attr("transform","translate(0,0)")
								.style("fill","yellow")
								.style("stroke","black");
								
	d3.select("#"+this.containerid).append('text')						
								.attr("x",this.barAnchorX + this.handleWidth + 2)
								.attr("y",this.barAnchorY)
								.text(this.from)
								.attr("id",from_text_id)
								.attr("transform","translate(0,0)")
								.style("text-anchor", "start");

	//set up listner for left drag handler
	var evalStr = "var tmp_function = function(e){  \
			"+from_handle_id+"slider_on = true; \
			slider_orig_x = e.clientX; \
			slider_orig_upper_y = e.clientY; \
			console.log('I am here11111'); \
			if (typeof "+this.containerid+"_range_from === 'undefined' )  \
				"+this.containerid+"_range_from =  "+this.from+";     \
			if (typeof "+this.containerid+"_range_to === 'undefined' )  \
				"+this.containerid+"_range_to =  "+this.to+";     \
			"+this.containerid + "_slider_length = " + (this.sliderHeight - this.handleHeight + 2) + "; \
	}";
	eval(evalStr);
	$("#"+from_handle_id).bind("mousedown",tmp_function);
	

	var evalStr = "var tmp_function1 = function(e){ \
			if( (typeof "+from_handle_id+"slider_on !== 'undefined')  && "+from_handle_id+"slider_on) { \
				dy = e.clientY - slider_orig_upper_y; \
				slider_orig_upper_y =  e.clientY; \
				var tmpStr = $('#" + from_handle_id + "').attr('transform');\
				var oldTransformXY = getParameters(tmpStr);	\
				console.log('I am here22222'); \
				var newTransformY = parseInt(oldTransformXY[1])+dy;\
				var newTransformX = parseInt(oldTransformXY[0]); \
				var bar_length = " + this.containerid + "_slider_length; \
				if(newTransformY > bar_length ) newTransformY =  bar_length;\
				if(newTransformY < 0 ) newTransformY =  0;\
				"+this.containerid+"_range_from = "+ this.from +  " + Math.floor("+(this.to - this.from)+"*(newTransformY/bar_length));\
				$('#" + from_handle_id + "').attr('transform','translate('+newTransformX+','+newTransformY+')'); \
				d3.select('#" + from_text_id + "').text( "+this.containerid+"_range_from ); \
				mainCanvas.updateChart('"+this.chartId +"','"+this.axis_name+"', "+this.containerid+"_range_from ,"+this.containerid+"_range_to );	\
				}\
	}";
	
	
	eval(evalStr);
	$("#"+from_handle_id).bind("mousemove",tmp_function1);
	
	var evalStr = 'tmp_function2 = function(){'+from_handle_id+'slider_on = false;}';
	eval(evalStr)
	$("#"+from_handle_id).mouseout(tmp_function2)
	$("body").bind("mouseup",tmp_function2);
}

SVGSlider.prototype.drawRightHandle = function () {
	var offset = this.sliderWidth - this.handleWidth + 2;
	var to_handle_id = "handle_to_" + Math.floor(Math.random()*10000)
	d3.select("#"+this.containerid).append('rect')
								.attr("x",this.barAnchorX - this.handleWidthOffset/2)
								.attr("y",this.barAnchorY - this.handleWidthOffset/2)
								.attr("rx",1)
								.attr("ry",1)
								.attr("id",to_handle_id)
								.attr("width",this.handleWidth)
								.attr("height",this.handleHeight)
								.attr("transform","translate("+offset+",0)")
								.style("fill","yellow")
								.style("stroke","black");
	
	var to_text_id = "to_text_" + Math.floor(Math.random()*10000);
	d3.select("#"+this.containerid).append('text')						
								.attr("x",this.barAnchorX + offset)
								.attr("y",this.height - 1)
								.attr("id",to_text_id)
								//.attr("transform","translate(0,0)")
								.text(this.to)
								.style("text-anchor", "start");
														
	//set up listner for right drag handler
	var evalStr = "var tmp_function = function(e){  \
			"+ to_handle_id +"slider_on = true; \
			slider_orig_right_x = e.clientX; \
			slider_orig_y = e.clientY; \
			slider_x_from = e.clientX; \
			if (typeof "+this.containerid+"_range_from === 'undefined' )  \
				"+this.containerid+"_range_from =  "+this.from+";     \
			if (typeof "+this.containerid+"_range_to === 'undefined' )  \
				"+this.containerid+"_range_to =  "+this.to+";     \
			" + this.containerid + "_slider_length = " + (this.sliderWidth - this.handleWidth + 2) + "; \
	}";
	
	eval(evalStr);
	
	$("#"+to_handle_id).bind("mousedown",tmp_function);

	var evalStr = "var tmp_function1 = function(e){ \
			if( (typeof "+to_handle_id+"slider_on !== 'undefined')  && "+to_handle_id+"slider_on) { \
				dx = e.clientX - slider_orig_right_x; \
				slider_orig_right_x =  e.clientX; \
				var tmpStr = $('#" + to_handle_id + "').attr('transform');\
				var oldTransformXY = getParameters(tmpStr);			\
				var oldTransformXY = getParameters(tmpStr);			\
				var newTransformX = parseInt(oldTransformXY[0]) +  dx; \
				var bar_length = " + this.containerid + "_slider_length; \
				if(newTransformX > bar_length ) newTransformX =  bar_length;\
				if(newTransformX < 0 ) newTransformX =  0;\
				var newTransformY = parseInt(oldTransformXY[1])	;			\
				$('#" + to_handle_id + "').attr('transform','translate('+newTransformX+','+newTransformY+')'); \
				"+this.containerid+"_range_to = "+ this.from +  " + Math.floor("+(this.to - this.from)+"*(newTransformX/bar_length));\
				d3.select('#" + to_text_id + "').text( "+this.containerid+"_range_to ); \
				console.log($('#" + to_handle_id + "')) \
				mainCanvas.refresh('"+this.chartId +"','"+this.axis_name+"', "+this.containerid+"_range_from ,"+this.containerid+"_range_to );	\
				}\
	}";
	
	eval(evalStr);
	
	$("#"+to_handle_id).bind("mousemove",tmp_function1);
	var evalStr = 'tmp_function2 = function(){'+to_handle_id+'slider_on = false;}';
	eval(evalStr)
	$("#"+to_handle_id).mouseout(tmp_function2)
	$("body").bind("mouseup",tmp_function2);
}

SVGSlider.prototype.drawLowerHandle = function () {

	var to_handle_id = "handle_to_" + Math.floor(Math.random()*10000)
	var to_text_id = "to_text_" + Math.floor(Math.random()*10000);
	var offset = this.sliderHeight - this.handleHeight + 2;
	
	d3.select("#"+this.containerid).append('rect')
								.attr("x",this.barAnchorX - this.handleWidthOffset/2)
								.attr("y",this.barAnchorY - this.handleWidthOffset/2)
								.attr("rx",1)
								.attr("ry",1)
								.attr("id",to_handle_id)
								.attr("width",this.handleWidth)
								.attr("height",this.handleHeight)
								.attr("transform","translate(0,"+offset+")")
								.style("fill","yellow")
								.style("stroke","black");
								
	d3.select("#"+this.containerid).append('text')						
								.attr("x",this.barAnchorX + this.handleWidth + 2)
								.attr("y",this.sliderHeight+this.barAnchorY)
								.text(this.to)
								.attr("id",to_text_id)
								.attr("transform","translate(0,0)")
								.style("text-anchor", "start");

	//set up listner for lower drag handler
	var evalStr = "var tmp_function = function(e){  \
			"+to_handle_id+"slider_on = true; \
			slider_orig_x = e.clientX; \
			slider_orig_lower_y = e.clientY; \
			if (typeof "+this.containerid+"_range_from === 'undefined' )  \
				"+this.containerid+"_range_from =  "+this.from+";     \
			if (typeof "+this.containerid+"_range_to === 'undefined' )  \
				"+this.containerid+"_range_to =  "+this.to+";     \
			"+this.containerid + "_slider_length = " + (this.sliderHeight - this.handleHeight + 2) + "; \
	}";
	
	eval(evalStr);
	
	$("#"+to_handle_id).bind("mousedown",tmp_function);

	var evalStr = "var tmp_function1 = function(e){ \
			if( (typeof "+to_handle_id+"slider_on !== 'undefined')  && "+to_handle_id+"slider_on) { \
				dy = e.clientY - slider_orig_lower_y; \
				slider_orig_lower_y =  e.clientY; \
				var tmpStr = $('#" + to_handle_id + "').attr('transform');\
				var oldTransformXY = getParameters(tmpStr);	\
				var newTransformY = parseInt(oldTransformXY[1])+dy;\
				var newTransformX = parseInt(oldTransformXY[0]); \
				var bar_length = " + this.containerid + "_slider_length; \
				if(newTransformY > bar_length ) newTransformY =  bar_length;\
				if(newTransformY < 0 ) newTransformY =  0;\
				"+this.containerid+"_range_to = "+ this.from +  " + Math.floor("+(this.to - this.from)+"*(newTransformY/bar_length));\
				$('#" + to_handle_id + "').attr('transform','translate('+newTransformX+','+newTransformY+')'); \
				d3.select('#" + to_text_id + "').text( "+this.containerid+"_range_to ); \
				mainCanvas.updateChart('"+this.chartId +"','"+this.axis_name+"', "+this.containerid+"_range_from ,"+this.containerid+"_range_to );	\
				}\
	}";
	
	eval(evalStr);
	
	$("#"+to_handle_id).bind("mousemove",tmp_function1);
	
	var evalStr = 'tmp_function2 = function(){'+to_handle_id+'slider_on = false;}';
	eval(evalStr)
	$("#"+to_handle_id).mouseout(tmp_function2)
	
	$("body").bind("mouseup",tmp_function2);
}

SVGSlider.prototype.genHorizontal = function() {
	
	this.addHLabel();

	var path_str = "M" + this.barAnchorX + "," 
					+ this.barAnchorY + "H" 
					+ (this.barAnchorX + this.sliderWidth) 
					+ "V" + ( this.barAnchorY + this.sliderHeight)
					+ "H" + this.barAnchorX;
	//console.log("rect_height = " + sliderHeight + ",sliderHeight=" +sliderHeight);
	console.log(path_str);
	d3.select("#"+this.containerid).append('path')
								.attr("d",path_str)
								.style("fill","grey");
	
	this.drawLeftHandle();
	this.drawRightHandle();
}


SVGSlider.prototype.genVertical = function() {
	this.addVLabel()
	var path_str = "M" + this.barAnchorX + "," 
					+ this.barAnchorY + "H" 
					+ (this.barAnchorX + this.sliderWidth) 
					+ "V" + ( this.barAnchorY + this.sliderHeight)
					+ "H" + this.barAnchorX;
	
	d3.select("#"+this.containerid).append('path')
								.attr("d",path_str)
								.style("fill","grey");
	this.drawUpperHandle();
	this.drawLowerHandle();
}

SVGSlider.prototype.addVLabel = function() {	
	//To add label
	var test = d3.select("#"+this.containerid).append("text")
							 .attr("x",this.width*0.1)
							 .attr("y",Math.floor(this.labelHeight/2))
							 .text(this.label)
							 .style("text-anchor", "start");
}

