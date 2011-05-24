function Queue() {
  this.constructor.apply(this, arguments);
}
Queue.prototype.constructor = function(opts) {

	var _currentTask = 0;

	var _options = {
		maxSize: 256,
		step: 1,

		// callbacks
		onFinish: function(queue) {queue = null;},
		onStart: function(queue) {queue = null;}
	};

	var _running = false;

	var _tasks = [];

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

	function addTask(callback, data) {
		_tasks.push({
			callback: callback,
			data: data
		});
	}

	function executeTask(i) {
		var task = getTask(i);

		if (task) {
			
		}
	}

	function getTask(i) {
		var task = null;

		if (i >= 0 && i < _tasks.length) {
			task = _tasks[i];
		}

		return task;
	}

	function markTaskCompleted(callback) {
		
	}

	function pause() {
		if (_running) {
			_running = false;
		}
	}

	function removeTask(callback) {
		
	}

	function reset() {
		_currentTask = 0;
	}

	function size() {
		return _tasks.length;
	}

	function start() {
		if (!_running) {
			_running = true;
		}
	}

	function stop() {
		if (_running) {
			reset();
			_running = false;
		}
	}

	// constructor code
	configure(options);

	this.configure = configure;
	this.markTaskCompleted = markTaskCompleted;
	this.pause = pause;
	this.size = size;
	this.start = start;
	this.stop = stop;
};