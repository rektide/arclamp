if(typeof exports == "undefined")
	exports = {}

if(typeof require == "undefined")
	require = {}

var json = require("arclamp/jsonHandler")

/**
 * @name qjsonmlWriter
 * @description an JsonContentHandler implementation that will output SAX for valid QJsonML input.
 * @returns 
 * @param obj QJsonML object to write out for valid QJsonML input.
 * @param writer SAX writer to use for writing XML content.
 * @param prefixGenerator function which maps any given namespace into a prefix.
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var qjsonmlWriter = exports.QJsonMLWriter = function(obj,writer,nsGenerator) {
	// insure context

	if(!(this instanceof qjsonmlWriter))
		return new qjsonmlWriter(obj,writer,nsGenerator)

	// parsing members

	/**
	  optional map to use when writing qname's out
	  @field
	  @private
	*/
	//this.nsGenerator = nsGenerator

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

	/*
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
	*/

	this._expected = null
	this._tokenCount = 0

	this._handle = function(type,args) {
		++self._tokenCount
		var expected = self._expected
		if(expected.handle(type,args))
		{
			expected = expected.parent
		}
	}

	for(var name in json.JsonEnum) {
		var number = json.JsonEnum[name]
		this[name] = function() { return self._handle(number,arguments) }
	}

	this._expected_startDocument = function() {
		var self_startDocument = this
		this.handle = function(type,args) {
			if(type == json.startArray) {
				self._expected.push(new self._expected_element(self_startDocument))
			} if(type == json.startDocument || type == json.endDocument) {
			} else {
				self._validation_err("began with type other than an array or document:",type)
			}
		}
	}
	this.expected = new this._expected_startDocument()
	this.expected.parent = this.expected

	this._expected_element = function(parent) {
		this.parent = parent
		var self_element = this

		var pos = 0
		this._tagname = undefined

		this.handle = function(type,args) {
			if(pos !== undefined)
			{
				if(++pos == 1)
				{
					if(type == json.primitive)
						self_element._tagname = args[0]
					else
						self._validation_err("primitive tagname expected")
					return
				}
				else if(pos == 2 && type == json.startObject)
				{
					self._expected.push(new self._expected_attributes(self_element))
					return
				}
				else
				{
					self._handler.startElement("",self_element._tagname,"",null)
					pos = undefined
				}
			}
			if(type == json.primitive) {
				self._handler.characters(args[0])
			} else if(type == json.startElement) {
				self._expected.push(new self._expected_element())
			} else if(type instanceof self._expected_closeArray) {
				self._handler.endElement()
				return true
			} else {
				self._validation_err("expected_startArray can't pop a",type)
			}
			return
		}
	}

	this._expected_attributes = function(parent) {
		this.parent = parent
		this.attrs = {}
		var self_attributes = this
		this.handle = function(type,args,expective) {
			if(type == json.endObject) {
				self._handler.startElement("",parent.tag,"",self_attributes)
				return true
			}
		}
	}

	this._validation_err = function() {
	}

	return this
}

exports.makeGenerator=function(map) {
	return function(slot) {
		return map[slot]
	}
}
