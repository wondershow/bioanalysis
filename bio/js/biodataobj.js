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

BioDataCase.prototype.getAllNumericalProps = function () {
	var res = [], 
		i=0, 
		//pattern1 = "_c",
		pattern = "n";
	var regex = new RegExp(pattern+"$")
	for(i=0; i<this.props.length; i++) {
		 if(regex.test(this.props[i]))
			res.push(this.props[i]);
	}
	return res;
}

BioDataCase.prototype.getAllNumeratedProps = function () {
	var res = [], 
		i=0,
		pattern = "c";
	var regex = new RegExp(pattern+"$")
	for(i=0; i<this.props.length; i++) {
		 if(regex.test(this.props[i]))
			res.push(this.props[i]);
	}
	return res;
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

