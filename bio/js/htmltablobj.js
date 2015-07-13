/**
This class defines an object that can output an html table.
the width, height, and style of html can be customized
**/
var HTMLTable  = function(data,head,head_div,body_div) {
	this.bodyDivId = body_div;
	this.headDivId = head_div;
	this.tableHd = head;
	this.tableData = data;
	
	//console.log(data);
	//by default table width/height is 100% of its container
	this.tableWidth = "100%";
	this.tableHeight = "100%";
	
	//to define the style of an selected row
	this.selectedStyle = "";
	
	//to remember indices all those selected rows
	this.selectedRows = [];
	
	
	//width of each cell
	this.cellWidth = "105px";
	
};

HTMLTable.prototype.addTableHeader = function() {
	var htmlcode = "<table  style='border: 2px solid black;border-collapse: collapse;table-layout: fixed;width:100%'>";
	var cols = this.tableHd.length;
	var i=0;
	htmlcode += htmlcode += "<tr style='border: 2px solid black;border-collapse: collapse;'  >";
	for(i=0;i<cols;i++){
		htmlcode += "<th style='border: 2px solid black;background-color:Aquamarine;border-collapse: collapse; width: "+this.cellWidth+";overflow: hidden;'>" + this.tableHd[i]+"&#x25B4;   </th>";
	}
	htmlcode += "</tr></table>";
	var tmp = document.getElementById(this.headDivId);
	tmp.innerHTML = htmlcode;
}


HTMLTable.prototype.addTable = function()  {
	this.addTableHeader();

	var htmlcode = "<table  style='border: 2px solid black;border-collapse: collapse;table-layout: fixed;width:100%'>";
	
	var i=0;
	var cols = this.tableHd.length;
	var row_id = "";
	
	
	for(i=0;i<this.tableData.length;i++){
		row_id = "table_row_id_" + dataCases[i].getPropVal("js_id");
		htmlcode += "<tr id='"+row_id+"' style='border: 2px solid black;border-collapse: collapse;'  ondblclick='handle_table_row_selection(\""+dataCases[i].getPropVal("js_id")+"\")'>";
		var j=0;
		
		for(;j<cols;j++)
			htmlcode += "<td style='border: 2px solid black;border-collapse: collapse; width: "+this.cellWidth+";overflow: hidden;text-align:center'>" + this.tableData[i][j]+"</td>";
		htmlcode += "</tr>";
	}
	
	htmlcode += "</table>";
	var tmp = document.getElementById(this.bodyDivId);
	tmp.innerHTML = tmp.innerHTML + htmlcode;
}

HTMLTable.prototype.selected = function(js_id)  {
	/*
	var index = 0;
	var i = 0;

	for(i=0;i<dataCases.length;i++) {
		//console.log('dataCases[i].getProVal("js_id")=' + dataCases[i].getProVal("js_id"));
		if(dataCases[i].getPropVal("js_id") == js_id) {
			index = i;
			break;
		}
	}*/
	
	var row_id = "table_row_id_" + js_id;
	d3.select("#"+row_id).attr("class","table_selected_row");
	this.scrollTo(js_id);
}

HTMLTable.prototype.deSelected = function(js_id)  {
	/*var index = 0;
	var i = 0;

	for(i=0;i<dataCases.length;i++) {
		//console.log('dataCases[i].getProVal("js_id")=' + dataCases[i].getProVal("js_id"));
		if(dataCases[i].getPropVal("js_id") == js_id) {
			index = i;
			break;
		}
	} */
	var row_id = "table_row_id_" + js_id;
	d3.select("#"+row_id).attr("class","table_normal_row");
}

HTMLTable.prototype.scrollTo = function (js_id) {
	var container = $('#'+this.bodyDivId);
	var scrollTo = $('#table_row_id_'+js_id);
	container.animate({
		scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
	});
}
