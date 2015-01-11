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
	var i = Math.floor(256*(val-min)/(max-min));
	return rgbToHex(i,256-i,256-i);
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