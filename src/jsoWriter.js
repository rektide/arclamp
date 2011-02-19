if(typeof exports === undefined)
	var exports = {}

/**
 * @name jsoWriter
 * @returns the JsonContentHandler
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var jsoWriter = exports.JsoWriter = function() {
	// insure context

	if(!(this instanceof jsoWriter))
		return new jsoWriter()

	/**
	  logger
	  @field
	  @private
	*/
	var log = function(args,s,name) { console.log(args,s,name) }
	//var log = function(args,s,name) {}

	// context members

	/**
	  stack of elements towards the current object
	  @field
	  @private
	*/
	var stack = []

	/**
	  slot designated by startObjectEntry
	  @field
	  @private
	*/	
	var slot = null

	var self = this

	// utility functions

	/**
	  top of element stack
	  @private
	*/
	var getTopStack = function() { var s = self.getStack(); return s && s.length >= 0 ? s[s.length-1] : null } 

	var isArray = function(o) { return o ? o.constructor == Array : false }

	/**
	  add a new object on to the top of the stack
	*/
	var startContent = function(o,name) {
		var cur = getTopStack()
		if(slot) {
			if(cur[slot])
				throw name+" with content already in slot "+slot
			cur[slot] = o
		} else {
			if(!isArr(cur)&&!cur)
				throw name+" while parsing an object"
			cur.push(o)
		}
	
	}

	// JsonContentHandler implementors

	this.startJSON = function() {
		if(self.getStack().length)
			throw "Already parsing"
	}

	this.endJSON = function() {
		var len = self.getStack.length
		if(len)
			throw "Stack depth still: "+len
	}
	this.startObject = function() {
		var o = {}
		startContent(o,"startObject")
		self.getStack().push(o)
		
	}
	
	this.endObject = function() {
		var cur = getTopStack()
		if(!cur)
			throw "endObject with an empty stack"
		if(isArray(cur))
			throw "endObject while parsing an Array"
		self.getStack().pop()
	}

	this.startObjectEntry = function(key) {
		var cur = getTopStack()
		if(!cur)
			throw "startObjectEntry with an empty stack"
		if(isArray(cur))
			throw "startObjectEntry while parsing an Array"
		slot = key
	}

	this.endObjectEntry = function() {
		var cur = getTopStack()
		if(isArray(cur))
			throw "endObjectEntry while parsing an array"
		if(!slot)
			throw "endObjectEntry with no slot selected"
		slot = null
	}

	this.startArray = function() {
		var o = []
		startContent(o,"startArray")
		self.getStack().push(o)
	}

	this.endArray = function() {
		var cur = getTopStack()
		if(!isArray(cur))
			throw "endArray while parsing an Object"
		if(!cur)
			throw "endArray with nothing on the stack"
		self.getStack().pop()
	}

	this.primitive = function(val) {
		startContent(val,"primitive")
	}

	/**
	  get the object stack.
	  @field
	  @protected
	*/
	this.getStack = function() { return stack }

	/**
	  get the object being writen
	*/
	this.getContent = function() { return self.getStack()[0] || null; }

	return this
}
