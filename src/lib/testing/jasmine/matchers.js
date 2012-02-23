jasmine.Matchers.prototype.toBeArray = function() {
	return (this.actual instanceof Array) ? true : false;
};

jasmine.Matchers.prototype.toBeFalse = function() {
	return this.actual === false;
};

jasmine.Matchers.prototype.toBeFunction = function() {
	return (typeof this.actual === "function") ? true : false;
};

jasmine.Matchers.prototype.toBeTrue = function() {
	return this.actual === true;
};

jasmine.Matchers.prototype.toThrowError = function(errorKlass) {
	errorKlass = errorKlass || Error;

	if (typeof this.actual !== "function") {
		throw new Error("Actual is not a function");
	}
	else if (typeof errorKlass !== "function") {
		throw new Error("Argument to jasmine.Matchers#toThowError should be a function, " + Object.prototype.toString.call(errorKlass) + " given");
	}

	var result = false, exception = null, not = this.isNot ? "not " : "";

	try {
		this.actual();
	}
	catch (error) {
		exception = error;
	}

	if (exception) {
		result = (exception instanceof errorKlass) ? true : false;
	}

	this.message = function() {
		return "Expected function " + not + "to throw error " + Object.prototype.toString.call(errorKlass);
	};

	return result;
};