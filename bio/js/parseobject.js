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