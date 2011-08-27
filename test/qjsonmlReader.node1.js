var qr = require("arclamp/qjsonml/qjsonmlReader"),
  jw = require("arclamp/jso/jsoWriter")
  assert = require("assert"),
  util = require("util")

// input
var map = {
	"yoyodyne/y": "yy",
	"voodoowarez.com/schema/v": "vv",
	"eldergods.com/schema/e": "ee" },
  doc = "<root xmlns='yoyodyne/y' xmlns:y='yoyodyne/y' xmlns:v='voodoowarez.com/schema/v'><!-- comment one --><child><v:grand><!-- comment two --><distant xmlns='eldergods.com/schema/e' v:bar='foo' /><distant xmlns:e='eldergods.com/schema/e' defTag='defValue' v:tag='tagValue'>content</distant></v:grand></child></root>"

var writer = jw.JsoWriter(),
  reader = qr.QJsonMLReader(doc,writer,map),
  result = writer.getContent()

console.log(util.inspect(result,false,8))


