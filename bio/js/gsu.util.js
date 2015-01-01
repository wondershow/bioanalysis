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
	console.log("Remove " + val + " from " + arr + " is " + res);
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