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
