var ackmark = function(doc) {
	if(!(this instanceof ackmark))
		return new ackmark(doc)
	this.root = {} // ackmark builds this object
	this.doc = doc // document to parse
	this.defaultHandler2 = new DefaultHandler2() // sax parser
	this.wire() // connect sax parser to handlers
	this.parse() // run sax parser & build root
	return this.root
}
ackmark.prototype.wire() {

}

ackmark.prototype.parse() {

}
