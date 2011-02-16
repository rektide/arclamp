/**
 * @name jsoWriter
 * @returns the JsonContentHandler
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var jsoWriter = (this.exports||(exports = {})).JsoWriter = function() {
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
	  object being written to
	  @field
	*/
	this.content = null

	/**
	  element stack
	  @field
	  @private
	*/
	var stack = []
	
	var slot = null

	var self = this

	// utility functions

	/**
	  get the top element from an array
	  @private
	*/
	var top = function(array) {
		return array.length ? array[array.length-1] || null
	}
	/**
	  top of element stack
	  @private
	*/
	var topStack = function() { return top(self.stack) }

	var isArray = function(o) { return o ? o.constructor == Array : false }

	var startContent = function(o,name) {
		var cur = topStack()
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

	// methods

	this.startJSON = function() {
		if(stack.length)
			throw "Already parsing"
	}

	this.endJSON = function() {
		if(stack.length)
			throw "Stack depth still "+self.stack.length)
	}
	this.startObject = function() {
		var o = {}
		startContent(o)
		stack.push(o)
		
	}
	
	this.endObject = function() {
		var cur = topStack()
		if(isArray(cur))
			throw "endObject while parsing an Array"
		if(!cur)
			throw "endObject with nothing on the stack"
		stack.pop()
	}

	this.startObjectEntry = function(key) {
		var cur = topStack()
		if(isArray(cur))
			throw "startObjectEntry while parsing an Array"
		if(!cur)
			throw "startObjectEntry with an empty stack"
		slot = key
	}

	this.endObjectEntry = function() {
		var cur = topStack()
		if(isArray(cur)
			throw "endObjectEntry while parsing an array"
		if(!slot)
			throw "endObjectEntry with no slot selected"
		slot = null
	}

	this.startArray = function() {
		var o = []
		startContent(o)
		stack.push(o)
	}

	this.endArray = function() {
		var cur = topStack()
		if(!isArray(cur))
			throw "endArray while parsing an Object"
		if(!cur)
			throw "endArray with nothing on the stack"
		stack.pop()
	}

	this.primitive = function(val) {
		startContent(val)
	}

	return this
}
