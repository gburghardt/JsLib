function OptionChainDemoApplication() {
	this.constructor.apply( this, arguments );
}

OptionChainDemoApplication.prototype = {
	
	chain: null,
	
	eventDispatcher: null,
	
	logger: null,
	
	optionQuoteService: null,
	
	constructor: function( logger, jsonService ) {
		this.logger = logger;
		this.logger.setJsonService( jsonService );
		
		this.eventDispatcher = new EventPublisher();
		this.optionQuoteService = new OptionQuoteService( this.eventDispatcher, "refreshRates.chain", 1000 );
		this.chain = new OptionChainController( this.optionQuoteService, new OptionChainView( "chain" ) );
		
		this.handleRefreshRateChanged = this.getFunctionInContext( this.handleRefreshRateChanged, this );
		this.handleSymbolChanged = this.getFunctionInContext( this.handleSymbolChanged, this );
		this.handleStreamingToggled = this.getFunctionInContext( this.handleStreamingToggled, this );
		
		this.logger.log( "Chain demo application instantiated", "constructor" );
	},
	
	destructor: function() {
		this.chain.destructor();
		this.chain = null;
		
		this.optionQuoteService.destructor();
		this.optionQuoteService = null;
		
		this.eventDispatcher.destructor();
		this.eventDispatcher = null;

		document.getElementById( "current-symbol-button" ).onclick = null;
		document.getElementById( "streaming-toggle" ).onclick = null;
		document.getElementById( "refreshRates-button" ).onclick = null;
		
		this.handleSymbolChanged.cleanup();
		this.handleSymbolChanged = null;
		
		this.handleStreamingToggled.cleanup();
		this.handleStreamingToggled = null;
		
		this.handleRefreshRateChanged.cleanup();
		this.handleRefreshRateChanged = null;
	},
	
	init: function() {
		var symbol = this.getCurrentSymbol();
		
		document.getElementById( "current-symbol-button" ).onclick = this.handleSymbolChanged;
		document.getElementById( "streaming-toggle" ).onclick = this.handleStreamingToggled;
		document.getElementById( "refreshRates-button" ).onclick = this.handleRefreshRateChanged;
		
		this.toggleStreaming();
		
		this.chain.init( symbol );
		this.optionQuoteService.init();
		
		this.logger.log( "Initialized fully and ready for use", "init" );
	},
	
	getCurrentSymbol: function() {
		var node = document.getElementById( "current-symbol" );
		var symbol = "GE";
		
		if ( node ) {
			symbol = node.value.toUpperCase();
			node = null;
		}
		
		return symbol;
	},
	
	handleRefreshRateChanged: function() {
		var rate = Number( document.getElementById( "refreshRates-input" ).value );
		var type = document.getElementById( "refreshRates-type" ).value;
		
		if ( "stock" === type ) {
			this.eventDispatcher.publish( "pollingPeriodChanged", {
				"refreshRates.stock": rate
			} );
		}
		else if ( "watchlist" === type ) {
			this.eventDispatcher.publish( "pollingPeriodChanged", {
				"refreshRates.watchlist": rate
			} );
		}
		else if ( "chain" === type ) {
			this.eventDispatcher.publish( "pollingPeriodChanged", {
				"refreshRates.chain": rate
			} );
		}
	},
	
	handleStreamingToggled: function() {
		this.toggleStreaming( document.getElementById( 'streaming-toggle' ).checked );
	},
	
	handleSymbolChanged: function() {
		this.chain.setSymbol( this.getCurrentSymbol() );
	},
	
	toggleStreaming: function( enabled ) {
		if ( typeof enabled !== "boolean" ) {
			enabled = document.getElementById( 'streaming-toggle' ).checked;
		}
		
		if ( enabled ) {
			this.logger.log( "Streaming enabled", "toggleStreaming" );
			this.eventDispatcher.publish( "startUpdates" );
		}
		else {
			this.logger.log( "Streaming disabled", "toggleStreaming" );
			this.eventDispatcher.publish( "stopUpdates" );
		}
	},
	
	
	
	// utilities
	
	getFunctionInContext: function( fn, ctx ) {
		var wrapper = function() {
			return fn.apply( ctx, arguments );
		};
	
		wrapper.cleanup = function() {
			fn = null;
			ctx = null;
		};
	
		return wrapper;
	}
};