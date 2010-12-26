/**
 * @name arclamp
 * @description xml to json converter, sax based.
 * @returns JSON rasterized xml document
 * @param doc input xml string to parse into json
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var arclamp = (this.exports||(exports = {})).arclamp = function(doc) {
	// insure context

	if(!(this instanceof arclamp))
		return new arclamp(doc)

	// parsing members

	/**
	  document to parse
	  @field
	  @private
	*/
	this.doc = doc
	/**
	  sax handler
	  @field
	  @private
	*/
	this.defaultHandler2 = new DefaultHandler2()
	/**
	  sax reader
	  @field
	  @private
	*/
	this.saxXmlReader = XMLReaderFactory.createXMLReader()
	/**
	  optional step to clean root between parses
	  @field
	  @private
	*/
	this.resetBetweenParses = false
	/**
	  logger
	  @field
	  @private
        */
	this.log = function(args,s,name) { console.log(args,s,name) }
	//this.log = function(args,s,name) {}

	// context members

	/**
	  arclamp builds this JavaScript object
	  @field
	*/
	this.root = {}
	/**
	  element stack
	  @field
	  @private
	*/
	this.stack = [this.root]
	/**
	  default namespace stack
	  @field
	  @private
	*/
	this.defaultNamespaces = []
	/**
	  qualified prefixes
	  @field
	  @private
	*/
	this.prefixes = {}

	var self = this

	// utility functions

	/**
	  get the top element from an array
	  @private
	*/
	var top = function(array) {
		return array[array.length-1]
	}
	/**
	  top of element stack
	  @private
	*/
	this.topStack = function() { return top(self.stack) }
	/**
	  top of default namespace stack
	*/
	this.topNamespace = function() { return top(self.defaultNamespaces) }

	// sax event handlers

	/**
	  capture prefixes in the prefix map, and the default namespaces if appropriate.
	  @event
	*/
	this.__proto__.startPrefixMapping = function(prefix,uri) {
		self.log(arguments,self,"startPrefixMapping")
		self.prefixes[prefix] = uri
		if(!prefix)
			self.defaultNamespaces.push(uri)
	}
	/**
	  pop the default namespaces stack if we're ending a default namespace.
	  @event
	*/
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
	/**
	  builds & captures a new element on it's parent & descend into by adding to the elements stack.
	  @event
	*/
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
	/**
	  pop the element stack
	  @event
	*/
	this.__proto__.endElement = function(uri,localName,qName) {
		self.log(arguments,self,"endElement")
		self.stack.pop()
	}
	/**
	  read in some character values
	  @event
	*/
	this.__proto__.characters = function(ch,start,length) {
		self.log(arguments,self,"characters")
		var cur = self.topStack()
		(self.value||(self.value = "")) += ch
	}
	this.__proto__.comment = function(ch,start,length) {
		// nop
	}

	// run

	this.wire() // connect sax parser to handlers
	this.parse() // run sax parser & build root
	return this.root
}
/**
  parse the arclamp's document
*/
arclamp.prototype.parse = function() {
	if(this.resetBetweenParses)
		this.root = {}
	this.saxXmlReader.parseString(this.doc)
}
/**
  wire up arclamp's handlers
*/
arclamp.prototype.wire = function() {
	this.defaultHandler2.endPrefixMapping = this.endPrefixMapping
	this.defaultHandler2.startPrefixMapping = this.startPrefixMapping
	this.defaultHandler2.startElement = this.startElement
	this.defaultHandler2.endElement= this.endElement
	this.saxXmlReader.setHandler(this.defaultHandler2)
}
