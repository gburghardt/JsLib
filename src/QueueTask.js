function QueueTask() {

	var _callback;
	var _data;
	var _error;
	var _id = QueueTask.createId();
	var _queue;
	var _silent = true;
	var _status = "pending";
	var _this = this;

	function constructor(queue, callback, data, silent) {
		_queue = queue;
		_callback = callback;
		_data = data || null;
		_silent = !!silent;

		queue = callback = data = null;
	}

	function destructor() {
		_callback = _data = _queue = null;
	}

	function completed() {
		_status = "complete";
		_queue.notifyTaskCompleted(_this);
	}

	function execute() {
		_status = "running";

		if (_silent) {
			try {
				_callback(getData(), _this);
			}
			catch (error) {
				_error = error;
				_status = "error";
			}
		}
		else {
			_callback(getData(), _this);
		}
	}

	function getCallback() {
		return _callback;
	}

	function getData() {
		return _data;
	}

	function getError() {
		return _error;
	}

	function getId() {
		return _id;
	}

	function getStatus() {
		return _status;
	}

	function hasError() {
		return !!_error;
	}


	// public interface
	this.constructor = constructor;
	this.destructor = destructor;
	this.completed = completed;
	this.execute = execute;
	this.getCallback = getCallback;
	this.getData = getData;
	this.getError = getError;
	this.getId = getId;
	this.getStatus = getStatus;
	this.hasError = hasError;

	// call constructor
	constructor.apply(this, arguments);
}

QueueTask.createId = function() {
	var i = -1;

	return function() {
		return "task-" + (i++);
	};
}();
