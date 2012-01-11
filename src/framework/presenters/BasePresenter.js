/*

	class BasePresenter extends Object
		Public:
			modelToViewMap <Object>
			viewToModelMap <Object>
			constructor(BaseView view)
			destructor()
			init()
		Private:
		Protected:
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

	constructor: function(view) {
		this.eventHandlers = [];
		this.view = view;
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

	eventHandlers: null,

	view: null

// Access: Private

};
