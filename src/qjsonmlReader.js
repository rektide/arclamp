if(typeof exports === undefined)
	var exports = {}

/**
 * @name qjsonml
 * @description xml to json converter, based on JsonML, but element names are qualified, according to an optional namespace map, a blind copy scheme, or by default having the entire namespace injected whole as a prefix.  sax based to permit handling of very large documents.
 * @returns JSON rasterized xml document
 * @param doc input xml string to parse into json
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var qjsonmlReader = exports.QJsonMLReader = function(doc,writer,nsMap) {
	// insure context

	if(!(this instanceof qjsonmlReader))
		return new qjsonmlReader(doc,writer,nsMap)

	// parsing members

	/**
	  document to parse
	  @field
	  @private
	*/
	this.doc = doc

	/**
	  optional map to use when writing qname's out
	  @field
	  @private
	*/
	this.nsMap = nsMap

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
	  logger
	  @field
	  @private
	*/
	this.log = function(args,s,name) { console.log(args,s,name) }
	//this.log = function(args,s,name) {}

	// context members
	
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
		// create new element
		writer.startArray()
		// write element name
		writer.primitive(self.convertQName(qName,localName))
		// start attributes hash
		writer.startObject()
		// write attributes
		var atts = {}
		for(var j = 0; j < attributes.attsArray.length; ++j) {
			var att = attributes.attsArray[j]
			writer.startObjectEntry(self.convertQName(att.qName,att.localName))
			writer.primitive(att.value)
			writer.endObjectEntry()
		}
		writer.endObject()
	}
	/**
	  pop the element stack
	  @event
	*/
	this.__proto__.endElement = function(uri,localName,qName) {
		self.log(arguments,self,"endElement")
		writer.endArray()
	}
	/**
	  read in some character values
	  @event
	*/
	this.__proto__.characters = function(ch,start,length) {
		self.log(arguments,self,"characters")
		writer.primitive(ch)
	}
	this.__proto__.comment = function(ch,start,length) {
		// nop
	}

	// run

	this.wire() // connect sax parser to handlers
	this.parse() // run sax parser & build root
	return this.root
}

// execution functions

/**
  parse the qjsonml document
  @private
*/
qjsonmlReader.prototype.parse = function() {
	if(this.resetBetweenParses)
		this.root = []
	this.saxXmlReader.parseString(this.doc)
}
/**
  wire up qsjonml's handlers
  @private
*/
qjsonmlReader.prototype.wire = function() {
	this.defaultHandler2.endPrefixMapping = this.endPrefixMapping
	this.defaultHandler2.startPrefixMapping = this.startPrefixMapping
	this.defaultHandler2.startElement = this.startElement
	this.defaultHandler2.endElement= this.endElement
	this.saxXmlReader.setHandler(this.defaultHandler2)
}

/**
  retrieves a namespace from a qualified or unqualified qName.  looks at the local index of prefixes, where "" is a special element for the current default namespace.
  @param name an element name, with or without a prefix
  @returns the namespace of this element
  @private
*/ 
qjsonmlReader.prototype.parseQNameNS = function(name) {
	if(this.blindCopyQName)
		return name
	var i = name.indexOf(":"),
	  prefix = name.substring(0,i)
	return this.prefixes[prefix]
}

/**
  intakes an element name and converts it to our canonical prefix mapping.
  @param name an element name with or without a document local prefix
  @param localName optional localName to use instead of parsing the "name" element
  @returns the element name prefixed by the canonical prefix.
  @private
*/ 
qjsonmlReader.prototype.convertQName = function(name,localName) {
	if(this.blindCopyQName)
		return name
	var i = name.indexOf(":"),
	  prefix = name.substring(0,i),
	  ns = this.prefixes[prefix],
	  canonical = this.nsMap ? this.nsMap[ns] : null || ns
	return canonical+":"+(localName?localName:name.substring(i+1))
}
