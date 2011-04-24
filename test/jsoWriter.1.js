var jw = require("arclamp/jsoWriter")
  assert = require("assert"),
  util = require("util")

var writer = jw.JsoWriter()
writer.startObject()
writer.startObjectEntry("foo")
writer.primitive("bar")
writer.endObjectEntry()
writer.startObjectEntry("seas")
writer.startArray()
writer.primitive("atlantic")
writer.primitive("indian")
writer.primitive("pacific")
writer.primitive("mediterranean")
writer.primitive("baltic")
writer.primitive("arctic")
writer.endArray()
writer.endObjectEntry()
writer.startObjectEntry("capitals")
writer.startObject()
writer.startObjectEntry("new hampshire")
writer.primitive("concord")
writer.endObjectEntry()
writer.startObjectEntry("maine")
writer.primitive("augusta")
writer.endObjectEntry()
writer.startObjectEntry("montana")
writer.primitive("helena")
writer.endObjectEntry()
writer.endObject()
writer.endObjectEntry()
writer.endObject()

var resultReal = writer.getContent(),
  resultExpected = {
	"foo": "bar",
	"seas": ["atlantic","indian","pacific","mediterranean","baltic","arctic"],
	"capitals": {
		"new hampshire": "concord",
		"maine": "augusta",
		"montana": "helena" } },
  stringReal = util.inspect(resultReal),
  stringExpected = util.inspect(resultExpected)

process.stdout.write("\nExpected: "+stringExpected)
process.stdout.write("\nOutput:   "+stringReal+"\n\n")
assert.ok(stringReal,stringExpected,"compared")
process.stdout.write("\n\ndone")
