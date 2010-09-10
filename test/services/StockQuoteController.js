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
	
	init: function() {
		this.view.init();
		this.quoteService.subscribe( "quoteUpdated", this, "updateQuote", "GE" );
	},
	
	updateQuote: function( event ) {
		var quote = event.getData( "quote" );
		
		this.view.render( quote );
	}
	
};