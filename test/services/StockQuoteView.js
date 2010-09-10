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
		this.rootNode.innerHTML = this.getMarkup();
	},
	
	getMarkup: function() {
		return [
			'<table cellpadding="3" cellspacing="0" border="1" id="' + this.rootNodeId + '">',
				'<caption>Stock Quote for <span id="' + this.rootNodeId + '-symbol"></span></caption>',
				'<thead>',
					'<tr>',
						'<th>Last</th>',
						'<th>Bid</th>',
						'<th>Ask</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td id="' + this.rootNodeId + '-last"></td>',
						'<td id="' + this.rootNodeId + '-bid"></td>',
						'<td id="' + this.rootNodeId + '-ask"></td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join("");
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