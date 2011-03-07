var LogFactory = function() {
	
	var _classReference;
	var _instances = {};
	var _jsonService;
	var _types = {
		console: ConsoleLogger,
		blackbird: BlackbirdLogger
	};
	
	function init(jsonService) {
		setJsonService(jsonService);
		jsonService = null;
	}
	
	function destructor() {
		destroyInstances();
		
		if (_types) {
			for (var key in _types) {
				if (_types.hasOwnProperty(key)) {
					_types[key] = null;
				}
			}
			
			_types = null;
		}
		
		_classReference = _jsonService = null;
	}
	
	function destroyInstances() {
		if (_instances) {
			for (var key in _instances) {
				if (_instances.hasOwnProperty(key)) {
					_instances[key] = null;
				}
			}
			
			_instances = null;
		}
	}
	
	function addType(type, classReference) {
		if (!_types[type]) {
			_types[type] = classReference;
			_classReference = null;
		}
		
		classReference = null;
	}
	
	function get(logHandle, level, debugMode, enabled) {
		if (!_instances[logHandle]) {
			var classReference = getClassReference();
			var instance = new classReference(logHandle, level, debugMode, enabled);
			
			instance.setJsonService(_jsonService);
			_instances[logHandle] = instance;
			instance = classReference = null;
		}
		
		return _instances[logHandle];
	}
	
	function getClassReference() {
		if (!_classReference) {
			var className, classReference, typeNames = [];
			
			for (var key in _types) {
				if (_types.hasOwnProperty(key)) {
					typeNames.push(key);
					classReference = _types[key];
					
					if (typeof classReference === "function" && classReference.isSupported()) {
						_classReference = classReference;
						break;
					}
				}
			}
			
			classReference = typeNames = null;
			
			if (!_classReference) {
				throw new Error("No logging class could be found for: " + typeNames.join(", "));
			}
		}
		
		return _classReference;
	}
	
	function removeType(type) {
		for (var key in _types) {
			if (_types.hasOwnProperty(key) && key === type) {
				_types[key] = null;
				delete _types[key];
				_classReference = null;
				break;
			}
		}
	}
	
	function setJsonService(jsonService) {
		if (jsonService && typeof jsonService === "object") {
			_jsonService = jsonService;
			destroyInstances();
			_instances = {};
		}
		
		jsonService = null;
	}
	
	// return public interface
	return {
		addType: addType,
		destructor: destructor,
		get: get,
		init: init,
		remoteType: removeType,
		setJsonService: setJsonService
	};
	
}();