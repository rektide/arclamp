if(typeof exports === undefined)
	exports = {}

/**
 * @name SaxHandler
 * @description based off of http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 * @returns an empty interface implementing SaxHandler
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var saxHandler = exports.SaxHandler = function() {

	if(!(this instanceof SaxHandler))
		return new SaxHandler()

	this.characters = function(str) {}
	this.endDocument = function() {}
	this.endElement = function() {}
	this.endPrefixMapping = function(prefix) {}
	this.ignorableWhitespace = function(str) {}
	this.processingInstruction = function(target,data) {}
	this.setDocumentLocator = function(locator) {}
	this.skippedEntity = function(name) {}
	this.startDocument = function() {}
	this.startElement = function(uri,localname,qName,atts)
	this.startPrefixMapping = function(prefix,uri)

	return this
}

var nameToNumber = {
	"characters": 0,
	"endDocument": 1,
	"endElement": 2,
	"endPrefixMapping": 3,
	"ignorableWhitespace": 4,
	"processingInstruction": 5,
	"setDocumentLocator": 6,
	"skippedEntity": 7,
	"startDocument": 8,
	"startElement": 9,
	"startPrefixMapping": 10
	}

var numberToName = [
	"characters",
	"endDocument",
	"endElement",
	"endPrefixMapping",
	"ignorableWhitespace",
	"processingInstruction",
	"setDocumentLocator",
	"skippedEntity",
	"startDocument",
	"startElement",
	"startPrefixMapping"
	]

var saxEnum = exports.SaxEnum = function(key) {
	if(key) {
		return numberToName[key] || nameToNumber[key]
	}
	return nameToNumber
}

for(var i in numberToName)
	if(!isNaN(i))
		exports[numberToName[i]] = i
