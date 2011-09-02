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

var nameToNumber = {
	"startJSON": 0,
	"endJSON": 1,
	"startObject": 2,
	"endObject": 3,
	"startObjectEntry": 4,
	"endObjectEntry": 5,
	"startArray": 6,
	"endArray": 7,
	"primitive": 8
	}

var numberToName = [
	"startJSON",
	"endJSON",
	"startObject",
	"endObject	",
	"startObjectEntry",
	"endObjectEntry",
	"startArray",
	"endArray",
	"primitive"
	]

var jsonEnum = exports.JsonEnum = function(key) {
	if(key) {
		return numberToName[key] || nameToNumber[key]
	}
	return nameToNumber
}

for(var i in numberToName)
	if(!isNaN(i))
		exports[numberToName[i]] = i
