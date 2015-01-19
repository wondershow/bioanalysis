/**
This file keeps some basic util methods
***/

/**
Test if a string is a valid numeric string
**/
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
Returns if an element is in an array
**/
function inArrayGSU(ele,arr) {
	var i = 0;
	for(i=0;i<arr.length;i++){
		if(arr[i]==ele)
			return true;
	}
	false;
}

/**
To remove an item from an array
**/
function arrayRemove(index,arr) {
	var i = 0;
	var res = [];
	for(;i<arr.length;i++) {
		if(i != index)
			res.push[arr[i]];
	}
	console.log("Remove " + index + " from " + arr + " is " + res);
	return res;
}

/**
To remove an item from an array
**/
function arrayRemoveVal(val,arr) {
	var i = 0;
	var res = [];
	for(;i<arr.length;i++) {
		if(arr[i] != val)
			res.push(arr[i]);
	}
	//console.log("Remove " + val + " from " + arr + " is " + res);
	return res;
}

/**
To get the position of an element
**/
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}
/**
	get two numbers in an expression/string
	"translate(30,40)"
	will return [30,40]
**/
function getParameters(strStr) {
	var numberPattern = /\d+/g;
	var numbers = strStr.match(numberPattern);
	if(numbers == null || numbers == undefined || numbers.length != 2)
		return null;
	return numbers;
}

/**
To get a corresponding tick on a specific position on a slider
length: the length of the slider
pos:the position on the slider
**/
function getTickOnSlider(min,max,length,pos) {
	return min + Math.floor( (pos/length )*(max-min) );
}

/**
to return a number from an excel string, 
sometimes this number string is ".","-"," ",
we return 0;
**/
function parseExcelNumber(numStr) {
	return parseInt(numStr)==NaN? 0:parseInt(numStr);;
}

/**
To return all the elements connected by ","
**/
function arrayToString(arr) {
	var i = 0,res = "";
	
	for(i=0;i<arr.length;i++) 
		res += arr[i] + ","
	
	return res;
}

/**
To preprocess string values, if they are empty or else,
return N/A
**/
function processStr(str) {
	if(str == null || str == undefined || str.trim() == "")
		return "N/A";
	else
		return str;
}

function componentToHex(c) {
	//c = parseInt(c);
	//console.log()
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
This returns a heatmap color when a value
is given. 
**/
function getColorFromVal(val,min,max) {
	//normalize value 
	
	var value;
		if(val == min) 
			value = 0;
		else if(val == max)
			value = 1;
		else
			value = (val-min)/(max-min);
	var NUM_COLORS = 4;
	//var color = [ [0,0,0], [0,0,1], [0,1,1], [0,1,0],[1,1,0],[1,0,0],[1,1,1]];
	var color = [[0,0,1], [0,1,0], [1,1,0], [1,0,0] ];
	
	var idx1;        // |-- Our desired color will be between these two indexes in "color".
	var idx2;        // |
	var fractBetween = 0; 

	if(value <= 0)      
		{  idx1 = idx2 = 0;            }    // accounts for an input <=0
	else if(value >= 1)  
		{  idx1 = idx2 = NUM_COLORS-1; }    // accounts for an input >=0
	else
	{
		value = value * (NUM_COLORS-1);        // Will multiply value by 3.
		idx1  = Math.floor(value);                  // Our desired color will be after this index.
		idx2  = idx1+1;                        // ... and before this index (inclusive).
		fractBetween = value - idx1;    // Distance between the two indexes (0-1).
	}

	//console.log("value = " + value + ",val = " + val + ", max = " + max + ", min = " + min );
	var red   = (color[idx2][0] - color[idx1][0])*fractBetween + color[idx1][0];
	var green = (color[idx2][1] - color[idx1][1])*fractBetween + color[idx1][1];
	var blue  = (color[idx2][2] - color[idx1][2])*fractBetween + color[idx1][2];
	
	//var i = Math.floor(256*(val-min)/(max-min));
	//console.log("red = " + Math.floor(255*red) + ", green = " + Math.floor(255*green) + ", blue = " + Math.floor(255*blue));
	//console.log("red = " + red + ", green = " +green + ", blue = " + blue);
	return rgbToHex(Math.floor(255*red),Math.floor(255*green),Math.floor(255*blue));
}

function getHazadasratio(coef,biocase) {
	var all_props = biocase.getAllPropNames();
	var i = 0;
	var res = 0;
	//console.log()
	//console.log(biocase);
	for(i=0;i<coef.length;i++) {
		var prop_val = biocase.getPropVal(coef[i].option);
		//console.log(coef[i].option + ":" + coef[i].coef + ":" + prop_val );
		res += parseFloat(prop_val) * parseFloat(coef[i].coef);
	}
	return res;
}
/**
To determine if an item is in an array,
the array consists of tuple items. 
*/
function inTupleArray(item,arr) {
	var i=0;
	for(i=0;i<arr.length;i++){
		if(item[0]==arr[i][0]&&item[1]==arr[i][1])
			return i;
	}
	return -1;
}
/**
To extend the string class method, add a new 
method endswith, test if a string is closed 
with an existing string.
**/
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

/**
To return all unique strings in an array.
**/
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

/**
To test if an dom node exists or not
*/
function ifDomEleExists(dom_id) {
	var myElem = document.getElementById(dom_id);
	if (myElem == null) return false;
	return true;
}

/**
To test if a given point(x,y) is in a rect area
**/
function inPlaneArea(x,y,from_x,from_y,to_x,to_y) {
	if( x < to_x && x< from_x)
		return false;
		
	if( x > to_x && x > from_x)
		return false;	
		
	if( y < to_y && y < from_y)
		return false;
		
	if( y > to_y && y > from_y)
		return false;
		
	return true;
}