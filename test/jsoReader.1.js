var jr = require("arclamp/jso/jsoReader"),
  assert = require("assert"),
  util = require("util")


// input to run through jsoReader
var input = {
	"foo": "bar",
	"seas": ["atlantic","indian","pacific","mediterranean","baltic","arctic"],
	"capitals": {
		"new hampshire": "concord",
		"maine": "augusta",
		"montana": "helena" } },
	// destination for dummy jsoWriter
	output = [],
	// dummy jsoWriter to target
	dummy = new (function(){
		this.startJSON = function() { output.push("startJSON") }
		this.endJSON = function() { output.push("endJSON") }
		this.startObject = function() { output.push("startObject") }
		this.endObject = function() { output.push("endObject") }
		this.startObjectEntry = function(key) { output.push("startObjectEntry:"+key) }
		this.endObjectEntry = function() { output.push("endObjectEntry") }
		this.startArray = function() { output.push("startArray") }
		this.endArray = function() { output.push("endArray") }
		this.primitive = function(primitive) { output.push("primitive:"+primitive) }
		return this
	})(),
	// jsoReader to test
	reader = jr.JsoReader(input,dummy)

process.stdout.write("tokens:" +util.inspect(output))

//var resultReal = writer.getContent(),
//  resultExpected =  stringReal = util.inspect(resultReal),
//  stringExpected = util.inspect(resultExpected)

//process.stdout.write("\nExpected: "+stringExpected)
//process.stdout.write("\nOutput:   "+stringReal+"\n\n")
//assert.ok(stringReal,stringExpected,"compared")
//process.stdout.write("\n\ndone")
