var PCDialog = function (div_id,num_prop_list,count_prop_list,x,y,obj_name) {
	this.divId = div_id;
	
	this.dialogId = "equation_dialog_"+Math.floor(Math.random()*10000);
	
	//List of all numerical properties
	this.numberList = num_prop_list;
	
	//List of all numerate properties
	this.countList = count_prop_list;
	
	this.objName = obj_name;
	
	this.selectedItems = ['ph3n','ki67n'];
	this.selectedCoef = [{option:'ph3n',coef:-0.0038},{option:'ki67n',coef:0.01117}];
	
	this.xAxis = x;
	this.yAxis = y;
}

PCDialog.prototype.genOptionList = function(id) {
	var html = "";
	var option_id = id + "_option";
	var input_id = id + "_input";
	
	html += "<div align='center' style='position:relative'>";
	html += "Item: <select id='" + option_id + "'> \n";
	
	
	var i = 0;
	
	for(i=0;i<this.numberList.length;i++) {
		if($.inArray(this.numberList[i],this.selectedItems) <0)
			html += "<option value='" + this.numberList[i] + "'> "+this.numberList[i]+" </option> \n";
	}
	
	for(i=0;i<this.countList.length;i++) {
		if($.inArray(this.countList[i],this.selectedItems) <0)
			html += "<option value='" + this.countList[i] + "'> "+this.countList[i]+" </option> \n";
	}
	
	html += "</select> \n";
	
	
	
	
	//To add listener on the onclick
	var eval_str =  option_id + "_click_function1 = function() { \
					var selection = document.getElementById('"+ option_id  +"');  \
					var selected_val = selection.options[selection.selectedIndex].value; \
					" +this.objName+ ".addItem(selected_val, 0);\
					\};"
	eval(eval_str);
	html += "<button onclick='"+option_id+"_click_function1()'> + </button> <br />";
	
	var i=0;
	html += "<table style='color: white;'>";
	for(i=0;i<this.selectedCoef.length;i++) {
		html += "<tr>";
		html += "<td>";
		html += this.selectedCoef[i].option;
		html += "</td>";
		html += "<td>";
		html += "<button onclick='" + this.objName + ".removeItem(\""+this.selectedCoef[i].option+"\")'>-</button> ";
		html += "<button onclick='" + this.objName + ".up(\""+this.selectedCoef[i].option+"\")'>Up</button> ";
		html += "<button onclick='" + this.objName + ".down(\""+this.selectedCoef[i].option+"\")'>Down</button> <br />";
		html += "</td>";
		html += "</tr>";
	}
	html += "</table>";
	
	var eval_str = this.dialogId + "_selectedItems = this.selectedItems;";
	
	eval(eval_str);
	
	var eval_str = this.dialogId +"_params = {items:" + this.dialogId + "_selectedItems\
						,type:'pc'};";
	eval(eval_str);
	
	//console.log("asdfasdf:"+this.dialogId);	
	html += "<button onclick='drawPCG("+this.dialogId+"_params);' style='align:center'> Draw PCD</button>"
	html += "</div>";
	
	return html;
}


PCDialog.prototype.removeItem = function(option_name) {
	var tmpArr = this.selectedCoef;
	this.selectedItems = [];
	this.selectedCoef = [];
	var i=0;
	for (i=0;i<tmpArr.length;i++) {
		if(tmpArr[i].option != option_name){
			this.selectedItems.push(tmpArr[i].option);
			this.selectedCoef.push(tmpArr[i]);
		}
	}
	$.modal.close();
	this.addEquEditor();
}


PCDialog.prototype.addItem = function(option_name,val) {
	this.selectedItems.push(option_name);
	this.selectedCoef.push({option:option_name,coef:val});
	$.modal.close();
	this.addEquEditor();
	console.log(this.selectedCoef);
	//var tmp = document.getElementById(this.dialogId);
	//tmp.innerHTML = "Just for fun";
}

PCDialog.prototype.addEquEditor = function(){
	var equation_id = "equation" + Math.floor(Math.random()*10000);
	var option_html = this.genOptionList(equation_id);
	$.modal(option_html,{minWidth:400,minHeight:200});
}

/**
	To generate the modal div 
**/
PCDialog.prototype.genModalDiv = function(){
	var html = "";
	html += "<div id='basic-modal-content'> \n";
	html += "just for fun";
	html += "</div> \n";
	return html;
}


PCDialog.prototype.up = function(item_name){
}

PCDialog.prototype.down = function(){
}