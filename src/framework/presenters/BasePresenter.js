/*

	class BasePresenter extends Object
		Public:
			modelToViewMap <Object>
			viewToModelMap <Object>
			constructor(BaseView view, Object modelToViewMap, EventPublisher eventDispatcher)
			destructor()
			init()
		Private:
		Protected:
			eventDispatcher <EventPublisher>
			eventHandlers <Array[String]>
			view <BaseView>
			destroyEventHandlers()
			getControlValue(String name) returns String
			setControlValue(String name, String value)

*/

function BasePresenter() {
	this.constructor.apply(this, arguments);
}

BasePresenter.prototype = {

// Access: Public

	modelToViewMap: null,

	viewToModelMap: null,

	constructor: function(view, modelToViewMap, eventDispatcher) {
		this.eventHandlers = [];

		if (view) {
			this.view = view;
		}

		if (modelToViewMap) {
			this.setModelToViewMap(modelToViewMap);
		}

		if (eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
		}
	},

	destructor: function() {
		if (this.view) {
			this.view.destructor();
			this.view = null;
		}

		if (this.eventHandlers) {
			var handlerName, i = 0, length = this.eventHandlers.length;
		
			for (i; i < length; ++i) {
				this[ this.eventHandlers[i] ].cleanup();
				this[ this.eventHandlers[i] ] = null;
			}
		
			this.eventHandlers = null;
		}
	},

	init: function() {
		var handlerName, i = 0, length = this.eventHandlers.length;
		this.view.setPresenter(this);
		this.view.init();
		
		for (i; i < length; ++i) {
			handlerName = this.eventHandlers[i];
			this[ handlerName ] = this[ handlerNamer ].bind(this);
		}
	},

	setModelToViewMap: function(modelToViewMap) {
		var key, i, length;
		this.modelToViewMap = {};
		this.viewToModelMap = {};

		if (modelToViewMap instanceof Array) {
			for (i = 0, length = modelToViewMap.length; i < length; ++i) {
				this.modelToViewMap[ modelToViewMap[i] ] = modelToViewMap[i];
			}

			this.viewToModelMap = this.modelToViewMap;
		}
		else {
			this.modelToViewMap = modelToViewMap;

			for (key in modelToViewMap) {
				if (modelToViewMap.hasOwnProperty(key)) {
					this.viewToModelMap[ modelToViewMap[key] ] = key;
				}
			}
		}
	},

// Access: Protected

	eventDispatcher: null,

	eventHandlers: null,

	view: null

// Access: Private

};
