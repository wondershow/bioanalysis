/**
This file keeps some basic util methods
***/

/**
Test if a string is a valid numeric string
**/
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}