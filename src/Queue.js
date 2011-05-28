function Queue() {

	var _completeCount = 0;
	var _errors = [];
	var _options = {
		maxSize: -1,
		maxTime: -1,
		silent: true,
		stopOnError: false,
		step: -1,

		// called when all tasks have been processed, regardless of outcome
		onComplete: function(queue, errors) {queue = null;},

		// called each time a task encounters an error, or if no onTimeout exists
		onError: function(error, task, queue) {error = task = queue = null;},

		// called before any tasks are processed
		onStart: function(queue) {queue = null;},

		// called when all tasks have processed successfully
		onSuccess: function(queue) {queue = null;},

		// called when processing tasks takes too long
		onTimeout: null
	};
	var _origPendingCount = null;
	var _pendingCount = 0;
	var _processing = false;
	var _runningCount = 0;
	var _pendingTasks = [];
	var _taskRegistry = {};
	var _this = this;
	var _timedOut = false;
	var _timer;

	function constructor(options) {
		configure(options);
		options = null;
	}

	function destructor() {
		if (_taskRegistry) {
			reset();
			_taskRegistery = null;
		}

		if (_options) {
			_options.onComplete = null;
			_options.onError = null;
			_options.onStart = null;
			_options.onSuccess = null;
			_options.onTimeout = null;
			_options = null;
		}

		_pendingTasks = null;
		_errors = null;
	}

	function addTask(callback, data) {
		var id = null;

		if (_options.maxSize < 1 || size() >= _options.maxSize) {
			task = new QueueTask(this, callback, data, _options.silent);
			id = task.getId();
			_taskRegistry[id] = task;
			_pendingTasks.push(task);
			_pendingCount++;
			added = true;
		}

		callback = data = null;

		return id;
	}

	function configure() {
		var i, length, key, options;

		for (i = 0, length = arguments.length; i < length; i++) {
			options = arguments[i];

			for (key in options) {
				if (options.hasOwnProperty(key)) {
					_options[key] = options[key];
				}
			}
		}

		options = null;
	}

	function completeTask(task) {
		_runningCount--;
		_completedCount++;

		if (task.hasError()) {
			_errors.push(task.getError());
			_options.onError(task.getError(), task, _this);
		}

		if (!_processing) {
			_options.onComplete(_this, _errors);
		}
		else if (_errors.length && _options.stopOnError) {
			_options.onComplete(_this, _errors);
		}
		else if (_completedCount === _origPendingCount) {
			// all tasks are complete

			if (_timer) {
				clearTimeout(_timer);
				_timer = null;
			}

			if (!_errors.length) {
				_options.onSuccess(_this);
			}

			_processing = false;
			_options.onComplete(_this, _errors);
			reset();
		}
		else if (_options.step && _completedCount % _options.step === 0) {
			processTasks(_options.step);
		}

		task = null;
	}

	function getCompletedCount() {
		return _completedCount;
	}

	function getPendingCount() {
		return _pendingCount;
	}

	function getRunningCount() {
		return _runningCount;
	}

	function notifyTaskCompleted(task) {
		if (_taskRegistry[task.getId()]) {
			completeTask(task);
		}

		task = null;
	}

	function process() {
		if (!_processing) {
			if (_options.maxTime > 0) {
				_timer = setTimeout(timerExpired, _options.maxTime);
			}

			processTasks(_options.step);
		}
	}

	function processTasks(n) {
		if (_origPendingCount === null) {
			_origPendingCount = _pendingCount;
		}

		_processing = true;

		if (n === -1) {
			// start processing all tasks at once
			while (_pendingTasks.length) {
				task = _pendingTasks.shift();
				_pendingCount--;
				_runningCount++;
				task.execute();
			}
		}
		else {
			// process only step number of tasks at once
			var i = 0, length = (n > _pendingTasks.length) ? _pendingTasks.length : n;

			for (i; i < length; i++) {
				task = _pendingTasks.shift();
				_pendingCount--;
				_runningCount++;
				task.execute();
			}
		}
	}

	function removeTask(id) {
		var removed = false;

		if (_taskRegistry[id]) {
			for (var i = 0, length = _pendingTasks.length; i < length; i++) {
				if (id === _pendingTasks[i].getId()) {
					_pendingTasks.splice(i, 1);
				}
			}

			_taskRegistry[id].destructor();
			_taskRegistry[id] = null;
			delete _taskRegistry[id];
			removed = true;
		}

		return removed;
	}

	function reset() {
		if (_timer) {
			clearTimeout(_timer);
		}

		_completedCount = 0;
		_pendingCount = 0;
		_runningCount = 0;
		_origPendingCount = null;
		_pendingTasks = [];
		_errors = [];

		for (var id in _taskRegistry) {
			if (_taskRegistry.hasOwnProperty(id)) {
				_taskRegistry[id].destructor();
				_taskRegistry[id] = null;
			}
		}

		_taskRegistry = {};
		_timedOut = false;
		_timer = null;
	}

	function size() {
		return _pendingCount + _runningCount;
	}

	function taskExists(id) {
		return !!_taskRegistry[id];
	}

	function timerExpired() {
		_timer = null;
		_processing = false;
		_timedOut = true;
		_errors.push(new Error("Timed out waiting for tasks to complete after " + (_options.maxTime * 1000) + " seconds."));

		if (_options.onTimeout) {
			_options.onTimeout(_this, _errors);
		}
		else {
			_options.onError(_this, _errors);
		}

		reset();
	}

	this.constructor = constructor;
	this.destructor = destructor;
	this.addTask = addTask;
	this.configure = configure;
	this.getCompletedCount = getCompletedCount;
	this.getPendingCount = getPendingCount;
	this.getRunningCount = getRunningCount;
	this.notifyTaskCompleted = notifyTaskCompleted;
	this.process = process;
	this.size = size;
	this.taskExists = taskExists;

	// call constructor
	constructor.apply(this, arguments);
}
