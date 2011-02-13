# Arclamp #
streaming javascript object library
-----

# Essence # 

Arclamp is a library for streaming content through JSON.simple's SAX-inspired [ContentHandler](http://code.google.com/p/json-simple/source/browse/trunk/src/org/json/simple/parser/ContentHandler.java) interface, built to allow visibility into large data sets across a wide spectrum of representations.  Just as it's the gap between anode & cathode in a light emitting arclamp, the arclamp streamer's luminence is in what's not there: only a minimum amount of data needs to reside in memory at any given time.  Just as a light emitting arclamp emits a wide spectrum of light, the arclamp streamer purports to offer stream readers and writers across a wide spectrum of representations.

The primary representations targetted for the current version of Arclamp are:
* in memory JSON
* XML (via the [JsonML](http://jsonml.org) derived Q-JsonML format)
* on disk

Additionally, Arclamp supports diffing via Rob Sayre's [json-sync](http://github.com/sayrer/json-sync), which outputs differences between objects in JSON format.

