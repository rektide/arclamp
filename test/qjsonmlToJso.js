var qr = require("arclamp/qjsonml/qjsonmlReader"),
  jw = require("arclamp/jso/jsoWriter")
  assert = require("assert"),
  util = require("util")

var map = process.argv[2]
if(map)
	map = fs.readFileSync(map,'ascii')

var buffer = []
process.stdin.on('data',function(data){
	buffer.push(data)
})
process.stdout.on('end',function(){
	var doc = buffer.join(""),
		jsoWriter = jw.JsoWriter(),
		reader = qr.QJsonMLReader(doc,writer,map)
	console.log(util.inspect(writer.getContent(),false,99)
})

