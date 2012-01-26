( function( testController ) {

	var suite = testController.createTestSuite( "BaseView", true );

	var data = {};

	suite.setup(function() {
		data.form = document.createElement("form");
		data.formView = new FormView(data.form).init();
	});

	suite.teardown(function() {
		data.form = null;
		data.formView = null;
	});

	suite.createTest("getControlsByName", function(test) {
		data.form.innerHTML = [
			'<input type="text" name="test1" size="10">',
			'<select name="test2"></select>',
			'<select name="test2"></select>'
		].join("\n");
		var controls1 = data.formView.getControlsByName("test1"),
				controls2 = data.formView.getControlsByName("test2");

		return (
			test.assertEquals("Should be 1", controls1.length, 1) &&
			test.assertEquals("Should be 2", controls2.length, 2)
		);
	});

	suite.createTest("setControlValue input[type=text]", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "text";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=hidden]", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "hidden";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=search]", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "search";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=tel]", function(test) {
		var control = document.createElement("input"), value = "555-555-5555";
		control.type = "tel";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=url]", function(test) {
		var control = document.createElement("input"), value = "http://www.example.com/";
		control.type = "url";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=email]", function(test) {
		var control = document.createElement("input"), value = "example@example.com";
		control.type = "email";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=datetime]", function(test) {
		var control = document.createElement("input"), value = new Date().toUTCString();
		control.type = "datetime";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=date]", function(test) {
		var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		control.type = "datetime";
		data.formView.setControlValue(control, value);

		return (
			test.assertEquals("Value should be 'test'", control.value, value)
		);
	});

	suite.createTest("setControlValue input[type=month]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=week]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=time]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=datetime-local]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=number]", function(test) {
		var control = document.createElement("input");
		var values = [34, NaN, "38", "abc"];
		var expectedValues = ["34", "NaN", "38", "abc"];
		var success = true;
		control.type = "number";

		for (var i = 0, length = values.length; i < length; ++i) {
			data.formView.setControlValue(control, values[i]);
			success = success && test.assertEquals("Value should be '" + values[i] + "'", control.value, expectedValues[i]);
		}

		return success;
	});

	suite.createTest("setControlValue input[type=range]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=color]", function(test) {
		// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
		// control.type = "datetime";
		// data.formView.setControlValue(control, value);
		//
		// return (
		//	test.assertEquals("Value should be 'test'", control.value, value)
		// );
	});

	suite.createTest("setControlValue input[type=checkbox] matches value", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "checkbox";
		control.value = value;
		data.formView.setControlValue(control, value);

		return (
			test.assertTrue("Should be checked", control.checked)
		);
	});

	suite.createTest("setControlValue input[type=checkbox] does not match value", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "checkbox";
		control.value = "abc123";
		data.formView.setControlValue(control, value);

		return (
			test.assertFalse("Should not be checked", control.checked)
		);
	});

	suite.createTest("setControlValue input[type=radio] matches value", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "radio";
		control.value = value;
		data.formView.setControlValue(control, value);

		return (
			test.assertTrue("Should be checked", control.checked)
		);
	});

	suite.createTest("setControlValue input[type=radio] does not match value", function(test) {
		var control = document.createElement("input"), value = "test";
		control.type = "radio";
		control.value = "abc123";
		data.formView.setControlValue(control, value);

		return (
			test.assertFalse("Should not be checked", control.checked)
		);
	});

	suite.createTest("setControlValue select[multiple=true]", function(test) {
	});

	suite.createTest("setControlValue select[multiple=false]", function(test) {
	});

	suite.createTest("setControlValue textarea", function(test) {
	});

} )( TestController.getInstance() );
