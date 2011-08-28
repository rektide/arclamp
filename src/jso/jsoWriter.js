/**
 * @name jsoWriter
 * @description builds a real object when used as a JsonContentHandler.
 * @returns the JsonContentHandler, with getContent() to read the status.
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var jsoWriter = exports.JsoWriter = function() {

	// insure context
	if(!(this instanceof jsoWriter))
		return new jsoWriter()
	var self = this

	/**
	  logger
	  @field
	  @private
	*/
	//var log = function(args,s,name) { console.log(args,s,name) }
	var log = function(args,s,name) {}

	// context members

	/**
	  stack of elements towards the current object
	  @field
	  @private
	*/
	var stack = []
	this._getStack = function() { return stack }

	/**
	  self._slot designated by startObjectEntry
	  @field
	  @private
	*/	
	self._slot = null


	// utility functions

	this._getTop = function(s) { return s && s.length >= 0 ? s[s.length-1] : null } 

	/**
	  top of element stack
	  @private
	*/
	this._getTopStack = function() { return self._getTop(self._getStack()) }
	this._isArray = function(o) { return o ? o.constructor == Array : false }

	/**
	  add a new object on to the top of the stack
	*/
	this._startContent = function(o,name) {
		var cur = self._getTopStack()
		if(self._slot) {
			if(cur[self._slot])
				throw name+" with content already in self._slot "+self._slot
			cur[self._slot] = o
		} else if(cur) {
			if(!self._isArray(cur)&&!cur)
				throw name+" while parsing an object"
			cur.push(o)
		} else {
			// haven't begun yet
			self._getStack().push(o)
		}
	
	}

	// JsonContentHandler implementors

	this.startJSON = function() {
		if(self._getStack().length)
			throw "Already parsing"
	}

	this.endJSON = function() {
		var len = self._getStack().length
		if(len)
			throw "Stack depth still: "+len
	}
	this.startObject = function() {
		var o = {}
		self._startContent(o,"startObject")
		self._getStack().push(o)
		
	}
	
	this.endObject = function() {
		var cur = self._getTopStack()
		if(!cur)
			throw "endObject with an empty stack"
		if(self._isArray(cur))
			throw "endObject while parsing an Array"
		self._getStack().pop()
	}

	this.startObjectEntry = function(key) {
		var cur = self._getTopStack()
		if(!cur)
			throw "startObjectEntry with an empty stack"
		if(self._isArray(cur))
			throw "startObjectEntry while parsing an Array"
		self._slot = key
	}

	this.endObjectEntry = function() {
		var cur = self._getTopStack()
		if(self._isArray(cur))
			throw "endObjectEntry while parsing an array"
		self._slot = null
	}

	this.startArray = function() {
		var o = []
		self._startContent(o,"startArray")
		self._getStack().push(o)
		self._slot = null
	}

	this.endArray = function() {
		var cur = self._getTopStack()
		if(!self._isArray(cur))
			throw "endArray while parsing an Object"
		if(!cur)
			throw "endArray with nothing on the stack"
		self._getStack().pop()
	}

	this.primitive = function(val) {
		self._startContent(val,"primitive")
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
	this.getContent = function() { return self._getStack()[0] || null; }

	return this
}
