( function( testController ) {

	var createTest = testController.createTestSuite( "QueueTask" );

	createTest("instantiate", function(test) {
		var task = new QueueTask({}, function() {}, null, false);
		return test.assertEquals("Should be pending", "pending", task.getStatus());
	});

	createTest("callbackHappy", function(test) {
		var queue = {
			notifyTaskCompleted: function(task) {
				test.pass();
			}
		};

		var callback = function(data, task) {
			task.completed();
		};

		var testTask = new QueueTask(queue, callback, null, false);
		
		testTask.execute();
	});

	createTest("callbackErrorSilenced", function(test) {
		var queue = {
			notifyTaskCompleted: function(task) {
				test.assertTrue("Task should have an error", task.hasError());
				test.assertInstanceof("task.getError should return an Error", task.getError(), Error);
				test.pass();
			}
		};

		var callback = function(data, task) {
			throw new Error("This error should not show up.");
		};

		var testTask = new QueueTask(queue, callback, null, true);
		
		testTask.execute();
	});

	createTest("callbackThrowsError", function(test) {
		var queue = {
			notifyTaskCompleted: function(task) {
				test.fail("notifyTaskCompleted should not have been called");
			}
		};

		var callback = function(data, task) {
			throw new Error("This error should not show up.");
		};

		var testTask = new QueueTask(queue, callback, null, false);
		
		try {
			testTask.execute();
		}
		catch (error) {
			test.pass();
		}
	});


} )( TestController.getInstance() );