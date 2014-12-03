	var HTML_COLORS = [ "green","orange", "black", "blue","red", "fuchsia", "gray", "lime", "maroon", "navy", "olive", "purple","silver", "teal", "white",  "yellow"];
	
	// ref: http://stackoverflow.com/a/1293163/2343
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }
    
    
    /**
  	Given an array of strings(colNameArr), and a string,
  	return the index of that string in the array, 
  	return -1 if nothing match
  **/
  function getColNum(colNameArr,colName) {
  	var i=0;
  	for(;i<colNameArr.length;i++) {
   	if(colNameArr[i] == colName) return i;
 	}
  return -1;
  }
  
  
  /***
	Given an array of numbers,
	return the max value
*/
function getMax(a) {
	var i=0;
	var res = -1;
	for(;i<a.length;i++) {
		if(parseInt(a[i]) > res)
			res = parseInt(a[i]);		
	}
	return res;
}


/**
Given an array of numbers,
return the minimum value
**/
function getMin(a){
var i = 0;
var res = 10000;
for(;i<a.length;i++) {
	if(parseInt(a[i]) < res)
		res = parseInt(a[i]);		
}
return res;
}

/*
returns if an array contains a key
*/
function arrayContains(a, obj) {
//console.log("I have " + a + ", incoding is " + obj);
	var i = a.length;
	while (i--) {
	//console.log("a["+i+"] = " + a[i] + ",obj = " +  obj+ " a[i] == obj = " + (a[i] == obj) );	
		if (a[i] == obj) {
  		return i;
		}
	}
	return false;
}

/**
This function returns an array with all the method names of an object
*/
function getMethods(obj) {
  var result = [];
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        result.push(id + ": " + obj[id].toString() + "\n");
		//result.push(*);
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}

/**
	This function uses items in dataset to 
	populate an HTML table and append it 
	to the end of HTML div 
**/
function createHTMLTable(div_id,data_set) {
	//var html_code = "<table  style='width:400;border: 2px solid black;border-collapse: collapse;'>";
	var html_code = "<table  style='border: 2px solid black;border-collapse: collapse;'>";
	var i=0;
	var width = data_set[0].length;
	var row_id = "";
	for(;i<data_set.length;i++){
		row_id = "table_row_id_" + i;
		html_code += "<tr id='"+row_id+"' style='border: 2px solid black;border-collapse: collapse;'  ondblclick='handle_table_row_selection(\""+i+"\")'>";
		var j=0;
		for(;j<width;j++)
			html_code += "<td style='border: 2px solid black;border-collapse: collapse;'>" + data_set[i][j]+"</td>";
		html_code += "</tr>";
	}
	
	html_code += "</table>";
	var tmp = document.getElementById(div_id);
	tmp.innerHTML = tmp.innerHTML + html_code;
}

function createHTMLTable1(div_id,data_set) {
	//var html_code = "<table  style='width:400;border: 2px solid black;border-collapse: collapse;'>";
	var html_code = "<div style='overflow:auto;'><table style='border: 2px solid black;border-collapse: collapse;'>";
	var i=0;
	var width = data_set[0].length;
	var row_id = "";
	for(;i<data_set.length;i++){
		row_id = "table_row_id_" + i;
		if(i==0) { // to add the head table
			html_code += "<tr id='"+row_id+"' style='border: 2px solid black;border-collapse: collapse;'  >";
			var j=0;
			for(;j<width;j++)
				html_code += "<td  style='border: 2px solid black;border-collapse: collapse; '>" + data_set[i][j]+"</td>";
			
			html_code += "</tr><tr id='"+row_id+"' style='border: 2px solid black;border-collapse: collapse;'  >";
			for(j=0;j<width;j++)
				html_code += "<th  height='1' style='border: 2px solid black;border-collapse: collapse; '>" + data_set[1][j]+"</th>";
				
			html_code += "</tr> </table>";
			
			
			
			html_code += "<table  style='border: 2px solid black;border-collapse: collapse;'>";
		} else {
			html_code += "<tr id='"+row_id+"' style='border: 2px solid black;border-collapse: collapse;'  ondblclick='handle_table_row_selection(\""+i+"\")'>";
			var j=0;
			for(;j<width;j++)
				html_code += "<td style='border: 2px solid black;border-collapse: collapse;'>" + data_set[i][j]+"</td>";
		}
		html_code += "</tr>";
	}
	html_code += "</table>";
	var tmp = document.getElementById(div_id);
	tmp.innerHTML = tmp.innerHTML + html_code;
}

