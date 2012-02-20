jasmine.Matchers.prototype.toBeArray = function() {
	return (this.actual instanceof Array) ? true : false;
};

jasmine.Matchers.prototype.toBeFalse = function() {
	return this.actual === false;
};

jasmine.Matchers.prototype.toBeTrue = function() {
	return this.actual === true;
};
