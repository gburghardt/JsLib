function OptionChainController() {
	this.constructor.apply( this, arguments );
}

OptionChainController.prototype = {
	
	quoteService: null,

	view: null,
	
	constructor: function( quoteService, view ) {
		this.quoteService = quoteService;
		this.view = view;
	},
	
	init: function( symbol ) {
		this.view.init();
		this.setSymbol( symbol );
	},
	
	updateQuote: function( event ) {
		var chain = event.getData( "chain" );
		
		this.view.render( chain );
		
		event = null;
		chain = null;
	},
	
	
	
	symbol: null,
	
	setSymbol: function( symbol ) {
		if ( typeof symbol === "string" && symbol !== "" ) {
			if ( this.currentSymbol ) {
				this.quoteService.unsubscribe( "optionQuoteUpdated", this, this.currentSymbol );
			}
			
			this.currentSymbol = symbol;
			this.quoteService.subscribe( "optionQuoteUpdated", this, "updateQuote", this.currentSymbol );
			
			return true;
		}
		else {
			return false;
		}
	}
	
};