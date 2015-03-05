var BioDataCase = function(propertyList,valueList) {
	this.props = propertyList;
	var i = 0;
	var json_obj = [];
	for(i=0;i<propertyList.length;i++) {
		var evalStr = "this."+propertyList[i]+"='"+valueList[i]+"'";
		eval(evalStr);
		evalStr =  "json_obj."+propertyList[i]+"='"+valueList[i]+"'";
		eval(evalStr);
	}
	this.jsonObj = json_obj;
};

BioDataCase.prototype.getAllPropNames = function () {
	//console.log(this.props);
	return this.props;
}

BioDataCase.prototype.getPropVal = function (propVal) {
	var tmp ;
	var evalStr = "tmp = this." + propVal;
	eval(evalStr);
	return tmp;
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
	//console.log(res);
	return res;
}

BioDataCase.prototype.getJSonObj = function () {
	return this.jsonObj;
}

