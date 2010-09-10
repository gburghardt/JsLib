function StockQuoteView() {
	this.constructor.apply( this, arguments );
}

StockQuoteView.prototype = {
	
	rootNode: null,
	
	rootNodeId: null,
	
	nodes: null,
	
	constructor: function( rootNodeId ) {
		this.rootNodeId = rootNodeId;
		this.nodes = {};
	},
	
	init: function() {
		this.rootNode = document.getElementById( this.rootNodeId );
	},
	
	getNode: function( idSuffix ) {
		if ( !this.nodes[ idSuffix ] ) {
			this.nodes[ idSuffix ] = document.getElementById( this.rootNodeId + "-" + idSuffix );
		}
		
		return this.nodes[ idSuffix ];
	},
	
	render: function( quote ) {
		for ( var key in quote ) {
			if ( !quote.hasOwnProperty( key ) ) {
				continue;
			}
			
			this.getNode( key ).innerHTML = quote[ key ];
		}

		quote = null;
	}
	
};