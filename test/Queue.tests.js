( function( testController ) {

  function random(multiplier) {
    if (multiplier) {
      return Math.round(Math.random() * 100 * multiplier);
    }
    else {
      return Math.round(Math.random() * 100);
    }
  }

	var createTest = testController.createTestSuite( "Queue" );

	createTest("instantiate", function(test) {
		var queue = new Queue();
		return (
			test.assertEquals("Should be zero", queue.size(), 0) &&
			test.assertEquals("Should be zero", queue.getCompletedCount(), 0) &&
			test.assertEquals("Should be zero", queue.getRunningCount(), 0) &&
			test.assertEquals("Should be zero", queue.getPendingCount(), 0)
		);
	});

	createTest("addTask", function(test) {
		var queue = new Queue();
		var taskData = {
			foo: "bar"
		};
		var taskCallback = function(data, task) {
			
		};
		var id = queue.addTask(taskCallback, taskData);
		
		return (
			test.assertString("Should be a string", id) &&
			test.assertEquals("Size should be 1", queue.size(), 1) &&
			test.assertEquals("Completed should be 0", queue.getCompletedCount(), 0) &&
			test.assertEquals("Running should be 0", queue.getRunningCount(), 0) &&
			test.assertEquals("Pending should be 1", queue.getPendingCount(), 1) &&
			test.assertTrue("Task should exist in queue", queue.taskExists(id)) &&
			test.assertInstanceof("Returned task should be an instance of QueueTask", queue.getTask(id), QueueTask)
		);
	});

	createTest("addTaskMaxSize", function(test) {
		var queue = new Queue({maxSize: 1});
		var id1 = queue.addTask(function() {});
		var id2 = queue.addTask(function() {});
		
		return (
			test.assertString("id1 should be a string", id1) &&
			test.assertNull("id2 should be null", id2)
		);
	});

	createTest("removeTask", function(test) {
		var queue = new Queue();
		var id = queue.addTask(function() {});
		queue.removeTask(id);
		
		return test.assertFalse("Task should not exist", queue.taskExists(id));
	});

	createTest("synchronousProcessing", function(test) {
		var completeCalled = false;
		var complete = function(queue, errors) {
			completeCalled = true;
		};

		var testQueue = new Queue({onComplete: complete});
		var tasksCalled = [];

		testQueue.addTask(function(data, task) {
			test.assertFalse("complete should not have been called", completeCalled);
			tasksCalled.push(true);
			task.completed();
		});

		testQueue.addTask(function(data, task) {
			test.assertFalse("complete should not have been called", completeCalled);
			tasksCalled.push(true);
			task.completed();
		});

		testQueue.addTask(function(data, task) {
			test.assertFalse("complete should not have been called", completeCalled);
			tasksCalled.push(true);
			task.completed();
		});

		test.assertFalse("complete should not have been called", completeCalled);
		testQueue.process();

		return (
			test.assertTrue("complete should have been called", completeCalled) &&
			test.assertEquals("Not all tasks were called", tasksCalled.join(","), "true,true,true")
		);
	});

	createTest("asynchronousProcessing", function(test) {
		var completeCalled = false;
		var complete = function(queue, errors) {
			completeCalled = true;
			test.assertEquals("Not all tasks were marked complete", queue.getCompletedCount(), tasksCalled.length);
			test.pass();
		};

		var testQueue = new Queue({onComplete: complete});
		var tasksCalled = [];

		testQueue.addTask(function(data, task) {
			setTimeout(test.wrapCallback(function() {
				test.assertFalse("complete should not have been called", completeCalled);
				tasksCalled.push(true);
				task.completed();
			}), random());
		});

		testQueue.addTask(function(data, task) {
		  setTimeout(test.wrapCallback(function() {
		    test.assertFalse("complete should not have been called", completeCalled);
  			tasksCalled.push(true);
  			task.completed();
		  }), random());
		});

		testQueue.addTask(function(data, task) {
		  setTimeout(test.wrapCallback(function() {
		    test.assertFalse("complete should not have been called", completeCalled);
  			tasksCalled.push(true);
  			task.completed();
		  }), random(10));
		});

		test.assertFalse("complete should not have been called", completeCalled);
		testQueue.process();
		test.assertFalse("complete should not have been called", completeCalled);
	});

	createTest("timeout", function(test) {
		var onComplete = function(queue, errors) {
		  test.fail("The onComplete callback should not have been called");
		};
		
		var onTimeout = function(queue, errors) {
		  test.info("onTimeout called");
		  test.assertTrue("There should be at least one error", errors.length > 0);
		  test.assertEquals("There should be one running task", 1, queue.getRunningCount());
		  test.pass();
		};
		
		var onError = function(queue, errors) {
		  test.fail("The onError callback should not have been called");
		};
		
		window.queue = new Queue({maxTime: 500, onComplete: onComplete, onTimeout: onTimeout, onError: onError});
		
		queue.addTask(function(data, task) {
		  setTimeout(function() {
        task.completed();
		  }, 1000);
		});
		
		queue.process();
	});

	createTest("callProcessWhileProcessing", function(test) {
		var queue = new Queue({
		  onError: function(queue, errors) {
		    test.fail("The onError callback should not have been called");
		  },
		  onTimeout: function(queue, errors) {
		    test.fail("The onTimeout callback should not have been called");
		  }
		});
		
		queue.addTask(function(data, task) {
		  setTimeout(function() {
		    task.completed();
		  }, 1500);
		});
		
		queue.process();
		queue.process();
		return (
		  test.assertEquals("There should be one task running", 1, queue.getRunningCount()) &&
		  test.assertEquals("There should be zero completed tasks", 0, queue.getCompletedCount()) &&
		  test.assertEquals("There should be zero pending tasks", 0, queue.getPendingCount())
		);
	});

	createTest("callProcessWithNoTasks", function(test) {
		var queue = new Queue({
		  maxTime: 100,
		  onComplete: function() {
		    test.fail("The onComplete callback should not have been called");
		  },
		  onError: function() {
		    test.fail("The onError callback should not have been called");
		  },
		  onTimeout: function() {
		    test.fail("The onTimeout callback should not have been called");
		  }
		});
		
		queue.process();
		return true;
	});

	createTest("callProcessAfterTimeout", function(test) {
		var queue = new Queue({
		  maxTime: 100,
		  onComplete: function() {
		    test.fail("The onComplete callback should not have been called");
		  },
		  onError: function() {
		    test.fail("The onError callback should not have been called");
		  },
		  onTimeout: function() {
		    // required so onError isn't called
		  }
		});

    queue.addTask(function(data, task) {
      setTimeout(function() {
        task.completed();
      }, 1500);
    });
		
		queue.process();
		
		setTimeout(test.wrapCallback(function() {
		  test.assertEquals("There should be 1 running task", 1, queue.getRunningCount());
		  test.assertEquals("There should be zero completed tasks", 0, queue.getCompletedCount());
		  test.assertEquals("There should be zero pending tasks", 0, queue.getPendingCount());
		  queue.process();
		  test.assertEquals("There should be 1 running task", 1, queue.getRunningCount());
		  test.assertEquals("There should be zero completed tasks", 0, queue.getCompletedCount());
		  test.assertEquals("There should be zero pending tasks", 0, queue.getPendingCount());
		  test.pass();
		}), 500);
	});

	createTest("taskThrowsErrorCatastrophic", function(test) {
		var queue = new Queue({
		  maxTime: 1500,
		  onComplete: function() {
		    test.pass();
		  },
		  onError: function() {
		    test.fail("The onError callback should not have been called");
		  },
		  onTimeout: function() {
		    test.fail("The onTimeout callback should not have been called");
		  }
		});

    queue.addTask(function(data, task) {
      throw new Error("Intentional error");
    });
		
		queue.process();
    return 2000;
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