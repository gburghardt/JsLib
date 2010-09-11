function StockQuoteController() {
	this.constructor.apply( this, arguments );
}

StockQuoteController.prototype = {
	
	quoteService: null,

	view: null,
	
	constructor: function( quoteService, view ) {
		this.quoteService = quoteService;
		this.view = view;
	},
	
	init: function( symbol ) {
		this.view.init();
		this.quoteService.subscribe( "quoteUpdated", this, "updateQuote", symbol );
	},
	
	updateQuote: function( event ) {
		var quote = event.getData( "quote" );
		
		this.view.render( quote );
	}
	
};