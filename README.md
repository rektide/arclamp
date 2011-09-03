# Arclamp #

streaming javascript object library
-----

# Essence #

Arclamp is a JavaScript library for streaming data; that is, a set of independent small tools for taking structured data and operating or inspecting it in a streaming and event based fashion. This will typically take the form of serialization, deserialization, and format conversion functions supporting a particular streaming format. 

The primary representations targetted for the current version of Arclamp are:
* JsonContentHandler[1], streaming JavaScript objects & JSON.
* XmlContentHandler SAX, streaming XML.
* On disk 'Caminus' storage format.

[1] content transfered through JSON.simple's SAX-inspired [ContentHandler](http://code.google.com/p/json-simple/source/browse/trunk/src/org/json/simple/parser/ContentHandler.java) interface.
[2] through SAX's [ContentHandler](http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html).

# Future Plans #

Additionally, Arclamp will support:

* diffing via Rob Sayre's [json-sync](http://github.com/sayrer/json-sync), which outputs differences between objects in JSON format.

