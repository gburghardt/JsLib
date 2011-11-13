function BasicInfoController() {

	ViewController.prototype.constructor.apply(this, arguments);

	this.cancel = function() {
		console.info("Cancel basic info");
	};

	this.submit = function() {
		console.info("Submit basic info");
	};

}

BasicInfoController.prototype = new ViewController();