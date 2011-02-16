var base = require ? require("jsoWriter.js").JsoWriter || jsoWriter
var extend = require("util").inherits || function(constructor,superConstructor) {
	var withoutcon = function() {}
	withoutcon.prototype = superConstructor.prototype
	constructor.prototype = new withoutcon()
	return constructor
}

if(typeof exports === undefined)
	var exports = {}

/**
 * @name PathedJsoWriter
 * @returns the JsonContentHandler that keeps track of the parent's link to the present stack element.
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var pathedJsoWriter = exports.PathedJsoWriter = function() {

	// insure context

	if(!(this instanceof pathedJsoWriter))
		return new pathedJsoWriter()
	base.call(this)

	/**
	  logger
	  @field
	  @private
	*/
	var log = function(args,s,name) { console.log(args,s,name) }
	//var log = function(args,s,name) {}

	// context members

	/**
	  stack of slots to current object
	  @field
	  @private
	*/
	var slotStack = []

	var self = this

	// utility functions

	var isArray = function(o) { return o ? o.constructor == Array : false }

	var incrementSlotIfArray = function(o) { var l = o.length-1; if(!isNaN(o[l])) ++o[l] }

	var getBase = function() { return this.prototype }

	// JsonContentHandler method implementations

	this.startObject = function() {
		getBase().startObject()
		slotStack.push(null)
	}

	this.endObject = function() {
		getBase().endObject()
		slotStack.pop()
		incrementSlotIfArray(slotStack)
	}

	this.startObjectEntry = function(key) {	
		getBase().startObjectEntry(key)
		var s = self.getSlotStack(),
		  l = s.length-1
		s[l] = key
	}

	//this.endObjectEntry = function() {
	//	getBase().endObjectEntry()
	//}

	this.startArray = function() {
		getBase().startArray()
		slotStack.push(0)
	}

	this.endArray = function() {
		getBase().endArray()
		slotStack.pop()
		incrementSlotIfArray(slotStack)
	}

	this.primitive = function(val) {
		startContent(val)
		incrementSlotIfArray(slotStack)
	}

	this.getSlotStack = function() {
		return slotStack
	}

	/**
	  get the slot stack.
	  @field
	  @protected
	*/
	this.getSlotStack = function() { return slotStack }

	return this
}
extend(pathedJsoWriter,base)
