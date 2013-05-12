jasmine.Matchers.prototype.toBeArray = function() {
	return (this.actual instanceof Array) ? true : false;
};

jasmine.Matchers.prototype.toBeObject = function() {
	return this.actual.constructor === Object;
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

jasmine.Matchers.prototype.toBeInstanceof = function(klass) {
	return (this.actual instanceof klass) ? true : false;
};

jasmine.Matchers.prototype.toNotBeInstanceof = function(klass) {
	return (this.actual instanceof klass) ? false : true;
};

jasmine.Matchers.prototype.toStrictlyEqual = function(x) {
	return this.actual === x;
};

jasmine.Matchers.prototype.toStrictlyNotEqual = function(x) {
	return this.actual !== x;
};

jasmine.Matchers.prototype.toBeEmptyArray = function() {
	return this.actual.length === 0;
};

jasmine.Matchers.prototype.toBeEmptyObject = function() {
	var empty = true;

	for (var key in this.actual) {
		if (this.actual.hasOwnProperty(key)) {
			empty = false;
			break;
		}
	}

	return empty;
};

jasmine.Matchers.prototype.toHaveProperty = function(x) {
	return this.actual.hasOwnProperty(x);
};

jasmine.Matchers.prototype.toNotHaveProperty = function(x) {
	return !this.actual.hasOwnProperty(x);
};

jasmine.Matchers.prototype.toBeString = function() {
	return (typeof this.actual === "string") ? true : false;
};
