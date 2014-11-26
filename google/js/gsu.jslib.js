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