/*

	class BasePresenter extends Object
		Public:
			modelToViewMap <Object>
			viewToModelMap <Object>
			constructor(BaseView view)
			destructor()
			init()
		Private:
			handleNodeClick(Event event)
			handleNodeSubmit(Event event)
			processEvent(Event event)
		Protected:
			eventHandlers <Array[String]>
			view <BaseView>
			destroyEventHandlers()
			getControlValue(String name) returns String
			getNode(String idSuffix) returns HTMLElement or null
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
		this.view.setPresenter(this);
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
		this.view.init();
		
		for (i; i < length; ++i) {
			handlerName = this.eventHandlers[i];
			this[ handlerName ] = this[ handlerNamer ].bind(this);
		}
	},

	setModelToViewMap: function(modelToViewMap) {
		this.modelToViewMap = modelToViewMap;
		// TODO: Create the inverse of this
	},

// Access: Protected

	eventHandlers: null,

	view: null

// Access: Private

};
