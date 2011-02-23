if(typeof exports === undefined)
	exports = {}

/**
 * @name jsonHandler
 * @returns an empty interface implementing JsonHandler
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var jsonHandler = exports.jsonHandler = function() {

	if(!(this instanceof jsonHandler))
		return new jsonHandler()

	this.startJSON = function() {}
	this.endJSON = function() {}
	this.startObject = function() {}
	this.endObject = function() {}
	this.startObjectEntry = function(key) {}
	this.endObjectEntry = function() {}
	this.startArray = function() {}
	this.endArray = function() {}
	this.primitive = function(val) {}

	return this
}
