/**
	Based on the data format of JSONP from Google, we parse it
	and return an array of objects, each object is an instance of BioDataCase;
**/
function parseGoglJSonObj(jsonObj) {
	var res = [];
	//console.log("------------------------------------");
	//console.log(jsonObj)
	var rows = jsonObj["feed"]["entry"].length;
	var array = jsonObj["feed"]["entry"];
	var i;
	for(i=0;i<rows;i++) {
		var tmpStr = array[i].content.$t;
		var tmpArr = tmpStr.split(",");
		var j;
		var props = [];
		var values = [];
		for(j=0;j<tmpArr.length;j++) {
			var tmpLists = tmpArr[j].trim().split(":");
			props.push(tmpLists[0].trim());
			values.push(tmpLists[1].trim());
		}
		props.push("js_id");
		values.push(array[i].js_id);
		var bioCase = new BioDataCase(props,values);
		res.push(bioCase);
	}
	return res;
}

/**
We convert a JSon Object array to an array of BioDataCase object.
**/
function parseJosnObj(json_obj_arr) {
	var res = [];
	var i,j;
	for(i=0;i<json_obj_arr.length;i++){
		var json_obj = json_obj_arr[i];
		var props = [];
		var values = [];
		var value;
		var property;
		//key_name_arr = Object.keys(json_obj);
		for (var property in dbRowProps) {
			if (dbRowProps.hasOwnProperty(property)){
				console.log ("property  = " + property);
				eval ("value = json_obj['" +property+"'];");
				var prop_name; 
				if(dbRowProps[property] == "DECIMAL")
					prop_name = property + "n";
				else if(dbRowProps[property] == "CATGORICAL")
					prop_name = property + "c";
				else 
					prop_name = property + "s";
				props.push(prop_name);
				values.push(value);
			}
		}
		var bcase = new BioDataCase(props,values);
		res.push(bcase)
	}
	return res;
}
