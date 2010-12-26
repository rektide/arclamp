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
		// get a safe name for this element, and build it on it's parent.
		var parent = self.topStack(),
		  name = self.buildSafeName(localName,parent),
		  cur = self.buildElement(uri,localName,qName,attributes,name,parent)
		// descend into
		self.stack.push(cur)
		// decorate attributes
		for(var j = 0; j < attributes.attsArray.length; ++j) {
			var att = attributes.attsArray[j],
			   name = self.buildSafeName(att.localName,cur)
			self.buildAttribute(att,name,cur)
		}
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

// execution functions

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

// builder functions

/**
  builds an element object on to a parent element
  @param name a non-colliding name to use for this object when building on the parent
  @param parent the parent object to build on to
  @returns the new element object
  @private
*/
arclamp.prototype.buildElement = function(uri,localName,qName,attributes,name,parent) {
	return parent[name] = {namespaces:{"_":this.parseQNameNS(qName)}}
}

/**
  builds an attribute object on a parent element, given a computed safe name and the attribute
  @param att the attribute to convert
  @param name the name the attribute will use
  @param el the element to build the attribute on to
  @returns the new attribute object
  @private
*/
arclamp.prototype.buildAttribute = function(att,name,el) {
	el.namespaces[name] = this.parseQNameNS(att.qName)
	return el[name] = att.value
}

/**
  build a name on an object
  @param name a base name
  @param object the object being added to
  @returns the base name, permutted to avoid conflicts if any exist
  @private
*/
arclamp.prototype.buildSafeName= function(name,object) {
	if(!object[name])
		return name
	var i = 1,
	  proposal
	do {
		proposal = name+(i++)
	} while(object[proposal])
	return proposal
}

/**
  retrieves a namespace from a qualified or unqualified qName.  looks at the local index of prefixes, where "" is a special element for the current default namespace.
  @param a qName, with or without a prefix
  @returns the namespace of this qName
  @private
*/ 
arclamp.prototype.parseQNameNS = function(qName) {
	var i = qName.indexOf(":"),
	  prefix = qName.substring(0,i)
	return this.prefixes[prefix]
}
