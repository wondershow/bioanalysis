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
	return res;
}