var arclamp = (this.exports||(exports = {})).arclamp = function(doc) {
	// insure context

	if(!(this instanceof arclamp))
		return new arclamp(doc)

	// parsing members
	
	this.doc = doc // document to parse
	this.defaultHandler2 = new DefaultHandler2() // sax handler
	this.saxXmlReader = XMLReaderFactory.createXMLReader() // sax reader
	this.resetBetweenParses = false // optional step to clean root
	this.log = function(args,s,name) { console.log(args,s,name) }
	//this.log = function(args,s,name) {}
	
	// context members

	this.root = {} // arclamp builds this object
	this.stack = [this.root] // element stack
	this.defaultNamespaces = [] // prefix stack
	this.prefixes = {} // named prefixes

	var self = this

	// utility functions
	var top = function(array) {
		return array[array.length-1]
	}
	this.__proto__.topStack = function() { return top(self.stack) }
	this.__proto__.topNamespace = function() { return top(self.defaultNamespaces) }

	// sax functions

	this.__proto__.startPrefixMapping = function(prefix,uri) {
		self.log(arguments,self,"startPrefixMapping")
		self.prefixes[prefix] = uri
		if(!prefix)
			self.defaultNamespaces.push(uri)
	}
	this.__proto__.endPrefixMapping = function(prefix) {
		self.log(arguments,self,"endPrefixMapping")
		if(prefix)
			delete self.prefixes[prefix]
		else {
			// remove existing
			self.defaultNamespaces.pop()
			// assert new default
			self.prefixes[""] = self.topNamespace()
		}
	}
	this.__proto__.startElement = function(uri,localName,qName,attributes) {
		self.log(arguments,self,"startElement")
		// build element & attach to tree
		var cur = self.topStack(),
		  neo = cur[localName] = {};
		// decorate namespace
		var i = qName.indexOf(":"),
		  prefix = qName.substring(0,i),
		  ns = self.prefixes[prefix]
		neo.namespace = ns
		// decorate attributes
		var atts = {}
		for(var j = 0; j < attributes.attsArray.length; ++j) {
			var orig = attributes.attsArray[j],
			  k = orig.qName.indexOf(":"),
			  prefix = orig.qName.substring(0,k),
			  ns = self.prefixes[prefix],
			  att = {namespace:ns,value:orig.value,name:orig.localName};
			(neo.attributes||(neo.attributes = {}))[orig.localName] = att
		}
		// descend into
		self.stack.push(neo)
	}
	this.__proto__.endElement = function(uri,localName,qName) {
		self.log(arguments,self,"endElement")
		self.stack.pop()
	}
	this.__proto__.characters = function(ch,start,length) {
		self.log(arguments,self,"characters")
		var cur = self.topStack()
		(self.value||(self.value = "")) += ch
	}
	this.__proto__.comment = function(ch,start,length) {
		// nop
	}

	this.wire() // connect sax parser to handlers
	this.parse() // run sax parser & build root
	return this.root
}
arclamp.prototype.parse = function() {
	this.saxXmlReader.parseString(this.doc)
}
arclamp.prototype.wire = function() {
	this.defaultHandler2.endPrefixMapping = this.endPrefixMapping
	this.defaultHandler2.startPrefixMapping = this.startPrefixMapping
	this.defaultHandler2.startElement = this.startElement
	this.defaultHandler2.endElement= this.endElement
	this.saxXmlReader.setHandler(this.defaultHandler2)
}
