var BioDataCase = function(propertyList,valueList) {
	this.props = propertyList;
	var i = 0;
	for(i=0;i<propertyList.length;i++) {
		var evalStr = "this."+propertyList[i]+"='"+valueList[i]+"'";
		eval(evalStr);
	}
};

BioDataCase.prototype.getAllPropNames = function () {
	return this.props;
}

BioDataCase.prototype.getAllValues = function () {
	var res = [], i=0,tmpStr;
	for(i=0;i<this.props.length;i++) {
		var tmpVal = null;
		var tmpStr = "tmpVal = this." +this.props[i] + ";"
		eval(tmpStr);
		res.push(tmpVal);
	}
	return res;
}