var PopUpDialog = function (div_id,num_prop_list,count_prop_list) {
	this.divId = div_id;
	
	//List of all numerical properties
	this.numberList = num_prop_list;
	
	//List of all numerate properties
	this.countList = count_prop_list;
}

/**
To create a div containing an add button
**/
PopUpDialog.prototype.genAddButton = function(){
	var html = "<div id='basic-modal'>" + 
				// we have set up css for flatbtn, see in the css file.
			   "<a class='flatbtn' id='modaltrigger'>+</a>" + 
			   "</div>";
	return html;
}

/**
To add a pop up button where we can add/remove diagrams
**/
PopUpDialog.prototype.addPopup = function(){
	var html = "";
	html += this.genAddButton();
	html += this.genModalDiv();
	
	//no idea why need this div, but keeping it makes the thing works.
	html += "<div style='display:none'> \
				<img src='img/x.png' alt='' /> \
			</div> ";
	
	var tmp = document.getElementById(this.divId);
	tmp.innerHTML = html;
}

/**
	To generate the modal div 
**/
PopUpDialog.prototype.genModalDiv = function(){
	var html = "";
	
	html += "<div id='basic-modal-content'> \n";
	
	
	html += "<table class='fixed' style='background-color:#99CCFF;width:100%;height=100%;padding=5px; border: 2px solid black;border-collapse: collapse;' align='center'> \n";
	html += "<col width='50%' /> \n	<col width='50%' /> \n";
	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'> T(risk factor): </td> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'>\n";
	html += this.genNumericalSelections("x_field");
	html += "</td></tr> \n";
	
	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'> R(outcome variable): </td> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'>\n";
	html += this.genNumericalSelections("y_field");
	html += "</td></tr> \n";
	
	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'>Grouping(optinal) : </td> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'>\n";
	html += this.genNumericalSelections("z_field");
	html += "</td></tr> \n";

	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'> Censoring indicator: </td> \n";
	html += "<td style='border: 2px solid black;border-collapse: collapse;'>\n";
	html += this.genNumerateSelections("d_field");
	html += "</td></tr> \n";
	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \
				<td align='center'  colspan=2 style='border: 2px solid black;border-collapse: collapse;'> \
					<input type='radio' name='group2_name' id='group2_1' value='scatter' checked> ScatterPlot  \
					<input type='radio' name='group2_name' id='group2_2' value='heatmap'> HeatMap  \
					<input type='radio' name='group2_name' id='group2_3' value='parallel'> Parallel \
					<input type='radio' name='group2_name' id='group2_4' value='optmal_analysis'> CutFind\
				</td>  \
			</tr> ";
	
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \
				<td align='center'  colspan=2 style='border: 2px solid black;border-collapse: collapse;'> \
					<button id='drawbutton' onclick='draw()'> Draw</button> \
				</td>  \
			</tr> ";
			
	html += "<tr style='border: 2px solid black;border-collapse: collapse;'> \
				<td align='center'  colspan=2 style='border: 2px solid black;border-collapse: collapse;'> \
					<font color='red' size='5'  face='courier' id='alertmsg'></font>  \
				</td>  \
			</tr> ";

	 		
	html += "</table> \n";
	html += "</div> \n";
	return html;
}


/***
To generate HTML code for a selection drop down list
***/
PopUpDialog.prototype.genNumericalSelections = function(id) {
	var html = "";
	html += "<select id='"+id+"'> \n";
	html += "<option></option> \n";
	
	var i = 0;
	
	for(i=0;i<this.numberList.length;i++) {
		html += "<option>"+this.numberList[i]+"</option> \n";
	}
	
	html += "</select> \n";
	return html;
}

/***
To generate HTML code for a selection drop down list
***/
PopUpDialog.prototype.genNumerateSelections = function(id) {
	var html = "";
	html += "<select id='"+id+"'> \n";
	html += "<option></option> \n";
	
	var i = 0;
	
	for(i=0;i<this.countList.length;i++) {
		html += "<option>"+this.countList[i]+"</option> \n";
	}
	
	html += "</select> \n";
	return html;
}
