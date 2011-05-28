( function( testController ) {

	var createTest = testController.createTestSuite( "Queue" );

	createTest("instantiate", function(test) {
		var queue = new Queue();
	});

	createTest("addTask", function(test) {
		
	});

	createTest("addTaskMaxSize", function(test) {
		
	});

	createTest("removeTask", function(test) {
		
	});

	createTest("synchronousProcessing", function(test) {
		
	});

	createTest("asynchronousProcessing", function(test) {
		
	});

	createTest("timeout", function(test) {
		
	});

	createTest("callProcessWhileProcessing", function(test) {
		
	});

	createTest("callProcessWithNoTasks", function(test) {
		
	});

	createTest("callProcessAfterTimeout", function(test) {
		
	});

	createTest("completeNonRegisteredTask", function(test) {
		
	});

	createTest("completeTaskAfterTimeout", function(test) {
		
	});

	createTest("taskThrowsErrorCatastrophic", function(test) {
		
	});

	createTest("allTasksProcessedEvenWithErrors", function(test) {
		
	});

	createTest("stopOnError", function(test) {
		
	});

	createTest("allTasksHaveErrors", function(test) {
		
	});

	createTest("noTasksHaveErrors", function(test) {
		
	});

	createTest("processAllTasksAtOnce", function(test) {
		
	});

	createTest("processTwoPerTime", function(test) {
		
	});

} )( TestController.getInstance() );