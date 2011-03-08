if(typeof exports == "undefined")
	exports = {}

if(typeof require == "undefined")
	require = null

/**
 * @name jsoReader
 * @description reads from in-memory JavaScript Objects(/Arrays).
 * @param obj the object to read
 * @param writer the JsonHandler to write to
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var jsoReader = exports.JsoReader = function(obj,writer) {
	
	// insure context
	if(!(this instanceof jsoReader))
		return new jsoReader(obj,writer)

	var isArray = function(o) { return o ? o.constructor == Array : false }

	var parseContent = function(o) {
		if(typeof o != "object") {
			writer.primitive(o)
			return
		}
		if(isArray(o)) {
			writer.startArray()
			for(var i in o)
				parseContent(o[i])
			writer.endArray()
		}
		else {
			writer.startObject()
			for(var i in o) {
				writer.startObjectEntry(i)
				parseContent(o[i])
				writer.endObjectEntry()
			}
			writer.endObject()
		}
	}

	writer.startJson()
	parseContent(obj)
	writer.endJson()
}
