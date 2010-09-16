function OptionChainView() {
	this.constructor.apply( this, arguments );
}

OptionChainView.prototype = {
	
	rootNode: null,
	
	rootNodeId: null,
	
	nodes: null,
	
	viewEmpty: true,
	
	constructor: function( rootNodeId ) {
		this.rootNodeId = rootNodeId;
		this.nodes = {};
		this.rows = {};
	},
	
	init: function() {
		this.rootNode = document.getElementById( this.rootNodeId );
		this.rootNode.innerHTML = this.getMarkup();
	},
	
	destructor: function() {
		this.rootNode = null;
		
		for ( var key in this.nodes ) {
			if ( !this.nodes.hasOwnProperty( key ) ) {
				continue;
			}
			
			this.nodes[ key ] = null;
		}
		
		this.nodes = null;
		
		for ( var key in this.rows ) {
			if ( !this.rows.hasOwnProperty( key ) ) {
				continue;
			}
			
			this.rows[ key ] = null;
		}
		
		this.rows = null;
	},
	
	getMarkup: function() {
		return [
			'<table cellpadding="3" cellspacing="0" border="1" class="chain">',
				'<caption>Options for <span id="' + this.rootNodeId + '-symbol">--</span></caption>',
				'<thead>',
					'<tr class="callOrPut">',
						'<th colspan="5">Call</th>',
						'<th colspan="5">Put</th>',
					'</tr>',
					'<tr>',
						'<th>Last</th>',
						'<th>Bid</th>',
						'<th>Bid Size</th>',
						'<th>Ask</th>',
						'<th>Ask Size</th>',
						
						'<th>Last</th>',
						'<th>Bid</th>',
						'<th>Bid Size</th>',
						'<th>Ask</th>',
						'<th>Ask Size</th>',
					'</tr>',
				'</thead>',
				'<tbody id="' + this.rootNodeId + '-tbody">',
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
	
	render: function( chain ) {
		if ( !chain || !chain.call || !chain.call.length ) {
			this.renderEmptyChain( chain );
		}
		else {
			this.renderChain( chain );
		}
		
		chain = null;
	},
	
	renderChain: function( chain ) {
		if ( !chain ) {
			return;
		}
		
		var key = "";
		var quote = null;
		var row = null;
		var call = null;
		var put = null;
		var symbol = this.getNode( "symbol" );
		
		if ( this.viewEmpty ) {
			this.removeRows();
		}
		
		symbol.innerHTML = chain.symbol;
		
		for ( var i = 0, length = chain.call.length; i < length; i++ ) {
			call = chain.call[ i ];
			put = chain.put[ i ];
			key = call.securityKey + "-" + put.securityKey;
			row = this.getRow( key );
			
			row.cells[ 0 ].innerHTML = call.last;
			row.cells[ 1 ].innerHTML = call.bid;
			row.cells[ 2 ].innerHTML = call.bidSize;
			row.cells[ 3 ].innerHTML = call.ask;
			row.cells[ 4 ].innerHTML = call.askSize;
			
			row.cells[ 5 ].innerHTML = put.last;
			row.cells[ 6 ].innerHTML = put.bid;
			row.cells[ 7 ].innerHTML = put.bidSize;
			row.cells[ 8 ].innerHTML = put.ask;
			row.cells[ 9 ].innerHTML = put.askSize;
		}
		
		row = null;
		chain = null;
		quote = null;
		call = null;
		put = null;
		symbol = null;
		
		this.viewEmpty = false;
	},
	
	renderEmptyChain: function( chain ) {
		var tbody = this.getNode( "tbody" );
		var row = document.createElement( "tr" );
		var cell = document.createElement( "td" );
		
		this.removeRows();
		
		if ( typeof chain === "string" ) {
			cell.innerHTML = chain;
		}
		else if ( chain.symbol ) {
			cell.innerHTML = "No options were found for " + chain.symbol;
		}
		else {
			cell.innerHTML = "No options were found.";
		}
		
		cell.colSpan = 10;
		cell.className = "empty-list";
		row.appendChild( cell );
		tbody.appendChild( row );
		
		cell = null;
		row = null;
		tbody = null;
		chain = null;
		
		this.viewEmpty = true;
	},
	
	
	
	rows: null,
	
	createRow: function() {
		var row = document.createElement( "tr" );
		
		for ( var i = 0, length = 10; i < length; i++ ) {
			row.insertCell( i );
		}
		
		this.getNode( "tbody" ).appendChild( row );
		
		return row;
	},
	
	getRow: function( key ) {
		if ( !this.rows[ key ] ) {
			this.rows[ key ] = this.createRow();
		}
		
		return this.rows[ key ];
	},
	
	removeRows: function() {
		var tbody = this.getNode( "tbody" );
		var i = tbody.childNodes.length;
		
		while ( i-- ) {
			tbody.removeChild( tbody.childNodes [ i ] );
		}
		
		for ( var key in this.rows ) {
			if ( !this.rows.hasOwnProperty( key ) ) {
				continue;
			}
			
			this.rows[ key ] = null;
		}
		
		this.rows = {};
		
		tbody = null;
	}
	
};