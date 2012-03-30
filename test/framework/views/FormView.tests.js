( function( testController ) {

	var suite = testController.createTestSuite( "FormView", true );

	var data = {};

	suite.setup(function() {
		data.form = document.createElement("form");
		data.formView = new FormView(data.form).init();
	});

	suite.teardown(function() {
		data.form = null;
		data.formView = null;
	});

	// suite.createTest("getControlsByName", function(test) {
	// 	data.form.innerHTML = [
	// 		'<input type="text" name="test1" size="10">',
	// 		'<select name="test2"></select>',
	// 		'<select name="test2"></select>'
	// 	].join("\n");
	// 	var controls1 = data.formView.getControlsByName("test1"),
	// 			controls2 = data.formView.getControlsByName("test2");
	// 
	// 	return (
	// 		test.assertEquals("Should be 1", controls1.length, 1) &&
	// 		test.assertEquals("Should be 2", controls2.length, 2)
	// 	);
	// });

	// suite.createTest("extractControValue input[type=text]", function(test) {
	// 	var control = document.createElement("input"), disabledControl = document.createElement("input");
	// 	var value = "test";
	// 	control.type = disabledControl.type = "text";
	// 	control.value = disabledControl.value = value;
	// 	disabledControl.disabled = true;
	// 	
	// 	return (
	// 		test.assertEquals("", value, data.formView.extractControlValue(control)) &&
	// 		test.assertNull("", data.formView.extractControlValue(disabledControl))
	// 	);
	// });

	// suite.createTest("extractControValue input[type=checkbox]", function(test) {
	// 	var checkedControl = document.createElement("input"), uncheckedControl = document.createElement("input");
	// 	var value = "testing";
	// 	checkedControl.type = uncheckedControl.type = "checkbox";
	// 	checkedControl.value = uncheckedControl.value = value;
	// 	checkedControl.checked = true;
	// 	test.assertEquals("", value, data.formView.extractControlValue(checkedControl));
	// 	test.assertNull("", data.formView.extractControlValue(uncheckedControl));
	// 	checkedControl.disabled = uncheckedControl.disabled = true;
	// 	
	// 	return (
	// 		test.assertNull("", data.formView.extractControlValue(uncheckedControl)) &&
	// 		test.assertNull("", data.formView.extractControlValue(checkedControl))
	// 	);
	// });

	// suite.createTest("extractControValue input[type=radio]", function(test) {
	// 	data.form.innerHTML = [
	// 		'<input type="radio" name="test" value="1" checked>',
	// 		'<input type="radio" name="test" value="2" disabled>',
	// 		'<input type="radio" name="test" value="3">'
	// 	].join("");
	// 	
	// 	test.assertEquals("", "1", data.formView.extractControlValue(data.form.childNodes[0]));
	// 	test.assertNull("", data.formView.extractControlValue(data.form.childNodes[1]));
	// 	test.assertNull("", data.formView.extractControlValue(data.form.childNodes[2]));
	// 	data.form.childNodes[0].disabled = true;
	// 	
	// 	return test.assertNull("", data.formView.extractControlValue(data.form.childNodes[0]));
	// });

	// suite.createTest("extractControValue textarea", function(test) {
	// 	data.form.innerHTML = [
	// 		'<textarea rows="3" cols="20" name="test1">testing1</textarea>',
	// 		'<textarea rows="3" cols="20" name="test2" disabled>testing2</textarea>'
	// 	].join("");
	// 	
	// 	return (
	// 		test.assertEquals("", "testing1", data.formView.extractControlValue(data.form.childNodes[0])) &&
	// 		test.assertNull("", data.formView.extractControlValue(data.form.childNodes[1]))
	// 	);
	// });

	// suite.createTest("extractControValue select", function(test) {
	// 	data.form.innerHTML = [
	// 		'<select name="testing1">',
	// 			'<option value="1">1</option>',
	// 			'<option value="2" selected>2</option>',
	// 			'<option value="3">3</option>',
	// 		'</select>',
	// 		'<select name="testing2" disabled>',
	// 			'<option value="1">1</option>',
	// 			'<option value="2" selected>2</option>',
	// 			'<option value="3">3</option>',
	// 		'</select>'
	// 	].join("");
	// 	
	// 	return (
	// 		test.assertEquals("", "2", data.formView.extractControlValue(data.form.childNodes[0])) &&
	// 		test.assertNull("", data.formView.extractControlValue(data.form.childNodes[1]))
	// 	);
	// });

	// suite.createTest("extractControValue select[multiple]", function(test) {
	// 	data.form.innerHTML = [
	// 		'<select name="testing1" multiple>',
	// 			'<option value="1" selected>1</option>',
	// 			'<option value="2" selected>2</option>',
	// 			'<option value="3">3</option>',
	// 		'</select>',
	// 		'<select name="testing2" multiple disabled>',
	// 			'<option value="1" selected>1</option>',
	// 			'<option value="2" selected>2</option>',
	// 			'<option value="3">3</option>',
	// 		'</select>'
	// 	].join("");
	// 	
	// 	var values = data.formView.extractControlValue(data.form.childNodes[0]);
	// 	var disabledValue = data.formView.extractControlValue(data.form.childNodes[1]);
	// 	
	// 	return (
	// 		test.assertArray("", values) &&
	// 		test.assertEquals("", "1", values[0]) &&
	// 		test.assertEquals("", "2", values[1]) &&
	// 		test.assertNull("", disabledValue)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=text]", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "text";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=hidden]", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "hidden";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=search]", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "search";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=tel]", function(test) {
	// 	var control = document.createElement("input"), value = "555-555-5555";
	// 	control.type = "tel";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=url]", function(test) {
	// 	var control = document.createElement("input"), value = "http://www.example.com/";
	// 	control.type = "url";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=email]", function(test) {
	// 	var control = document.createElement("input"), value = "example@example.com";
	// 	control.type = "email";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=datetime]", function(test) {
	// 	var control = document.createElement("input"), value = new Date().toUTCString();
	// 	control.type = "datetime";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=date]", function(test) {
	// 	var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	control.type = "datetime";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertEquals("Value should be 'test'", control.value, value)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=month]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=week]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=time]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=datetime-local]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=number]", function(test) {
	// 	var control = document.createElement("input");
	// 	var values = [34, NaN, "38", "abc"];
	// 	var expectedValues = ["34", "NaN", "38", "abc"];
	// 	var success = true;
	// 	control.type = "number";
	// 
	// 	for (var i = 0, length = values.length; i < length; ++i) {
	// 		data.formView.setControlValue(control, values[i]);
	// 		success = success && test.assertEquals("Value should be '" + values[i] + "'", control.value, expectedValues[i]);
	// 	}
	// 
	// 	return success;
	// });

	// suite.createTest("setControlValue input[type=range]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=color]", function(test) {
	// 	// var control = document.createElement("input"), date = new Date(), value = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
	// 	// control.type = "datetime";
	// 	// data.formView.setControlValue(control, value);
	// 	//
	// 	// return (
	// 	//	test.assertEquals("Value should be 'test'", control.value, value)
	// 	// );
	// });

	// suite.createTest("setControlValue input[type=checkbox] matches value", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "checkbox";
	// 	control.value = value;
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertTrue("Should be checked", control.checked)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=checkbox] does not match value", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "checkbox";
	// 	control.value = "abc123";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertFalse("Should not be checked", control.checked)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=radio] matches value", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "radio";
	// 	control.value = value;
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertTrue("Should be checked", control.checked)
	// 	);
	// });

	// suite.createTest("setControlValue input[type=radio] does not match value", function(test) {
	// 	var control = document.createElement("input"), value = "test";
	// 	control.type = "radio";
	// 	control.value = "abc123";
	// 	data.formView.setControlValue(control, value);
	// 
	// 	return (
	// 		test.assertFalse("Should not be checked", control.checked)
	// 	);
	// });

	// suite.createTest("setControlValue select[multiple=true]", function(test) {
	// 	var control = document.createElement("select");
	// 	var options = ["a", "b", "c", "d"];
	// 	var valuesToSelect = ["a", "c"];
	// 	var selectedValues = [];
	// 	var option, i, length;
	// 	control.multiple = true;
	// 
	// 	// add options
	// 	for (i = 0, length = options.length; i < length; ++i) {
	// 		option = document.createElement("option");
	// 		option.value = options[i];
	// 		option.text = options[i];
	// 		control.appendChild(option);
	// 	}
	// 
	// 	data.formView.setControlValue(control, valuesToSelect);
	// 
	// 	for (i = 0, length = control.options.length; i < length; ++i) {
	// 		if (control.options[i].selected) {
	// 			selectedValues.push(control.options[i].value);
	// 		}
	// 	}
	// 
	// 	return test.assertEquals("Selected values should be: " + valuesToSelect.join(", "), valuesToSelect.join(", "), selectedValues.join(", "));
	// });

	// suite.createTest("setControlValue select[multiple=false]", function(test) {
	// 	var control = document.createElement("select");
	// 	var values = ["a", "b", "c", "d"];
	// 	var expectedValues = ["a", "b", "c", "d"];
	// 	var success = true;
	// 	var option, i, length;
	// 	control.multiple = false;
	// 
	// 	// add options
	// 	for (i = 0, length = values.length; i < length; ++i) {
	// 		option = document.createElement("option");
	// 		option.value = values[i];
	// 		option.text = values[i];
	// 		control.appendChild(option);
	// 	}
	// 
	// 	for (i = 0, length = values.length; i < length; ++i) {
	// 		data.formView.setControlValue(control, values[i]);
	// 		success = success && test.assertEquals("Selected index should be " + i, control.options.selectedIndex, i)
	// 											&& test.assertEquals("Value should be '" + expectedValues[i] + "'", control.value, expectedValues[i]);
	// 	}
	// 
	// 	return success;
	// });

	// suite.createTest("setControlValue textarea", function(test) {
	// 	var control = document.createElement("textarea");
	// 	var value = "foo";
	// 	data.formView.setControlValue(control, value);
	// 	return test.assertEquals("failed", value, control.value);
	// });

} )( TestController.getInstance() );
