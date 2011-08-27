if(typeof exports == "undefined")
	exports = {}

if(typeof require == "undefined")
	require = null

/**
 * @name qjsonmlWriter
 * @description QJsonML to XML converter. sax based to permit handling of very large objects.
 * @returns 
 * @param obj QJsonML object to write out.
 * @param writer SAX writer to use for writing XML content.
 * @param prefixGenerator function which maps any given namespace into a prefix.
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var qjsonmlWriter = exports.QJsonMLWriter = function(obj,writer,nsGenerator) {
	// insure context

	if(!(this instanceof qjsonmlWriter))
		return new qjsonmlWriter(obj,writer,nsMap)

	// parsing members

	/**
	  optional map to use when writing qname's out
	  @field
	  @private
	*/
	this.nsMap = nsMap

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
	  already mapped prefixes
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

	// [tagName, {"namespace": "value"}, foo, bar, baz]

	/**
	* indexes into debased name
	* @enum
	*/
	var NAME_NAMESPACE = 0,
	  NAME_LOCALNAME = 1,
	  NAME_PREFIX = 2,
	  NAME_QNAME = 3

	var debaseName = function(fullName) {
		var i = fullName.lastIndexOf(":")	
			namespace = fullName.substring(0,i1),
			prefix = nsGenerator(namespace)
			localName = fullName.substring(i+1)
		if(!self.prefixes[prefix]) {
			self.prefixes[prefix] = namespace
			writer.startPrefixMapping(prefix,namespace)
		}
		return [namespace, localName, prefix, prefix+":"+localName]
		
	}

	var outputStuff = function(o) {
		var rn = debaseName(o[0]),
			atts = []
		for(var i in o[1])
		{
			var an = debaseName[i]
			atts.push({namespaceURI: an[NAME_NAMESPACE], localName:an[NAME_LOCALNAME], prefix:an[NAME_PREFIX}, qName:attName[NAME_QNAME] }) // TODO: figure out wth is the "type" field supposed to be
		}
		writer.startElement(rn[NAME_NAMESPACE], rn[NAME_LOCALNAME], rn[NAME_QNAME], atts)
	}
	return this
}
