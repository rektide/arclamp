var fs = require('fs'),
  util = require('util'),
  Q = require('q')

var root = ""
if(typeof window !== 'undefined')
	root = window
if(typeof global !== 'undefined')
	root = global
if(typeof exports !== 'undefined')
	root = exports

/**
 * @name caminus writer
 * @description export json objects to the filesystem
 * @param o object to write to fs
 * @param dir root directory path for fs
 * @param callback callback(err,ok)
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */

var caminusWriter = root.CaminusWriter = function(dir) {

	if(!(this instanceof caminusWriter))
		return new caminusWriter(dir)

	/**
	  logger
	  @field
	  @private
	*/
	//var log = function(args,s,name) { console.log(args,s,name) }
	var log = function(args,s,name) {}

	// context members

	var stackFrame = function() {

		if(!this instanceof stackFrame))
			return stackFrame()

		/**
		  directory building generators
		*/
		this.slotGenerator = undefined

		/**
		  slot designated by startObjectEntry, or enumerated index of startArray entries
		  @field
		  @private
		*/	
		this.slot = topStack ? topStack.slotGenerator() || "."

		/**
		  stack status defer
		*/
		this.status = Q.defer()

		pushStack(this)
	}

	/**
	  stack of elements towards the current object
	  @field
	  @private
	*/
	var topStack

	var self = this

	// utility members

	/**
	  get the path for the current slot stack
	*/
	var getSlotPath = function() {
		var paths = [],
			cursor = topStack
		while(cursor) {
			paths.unshift(cursor.slot)
			cursor = cursor.parent
		}
		return paths.join("/")
	}

	var popStack = function() {
		topStack = topStack.parent
	}
	var pushStack = function(frame) {
		frame.parent = topStack
		topStack = frame
	}

	var mkdir = function(frame) {
		if(!frame.parent) { // refuse to mkdir the root frame
			frame.status.resolve(true)
			return
		}

		var path = getSlotPath()
		Q.when(frame.parent.status,function() {
			fs.mkdir(path,function(err){
				if(err) errHandler()
				frame.status.resolve(!err)
			})
		},function(){frame.status.resolve(false)})
	}

	var errHandler = function(err) {
	}


	this.startJSON = function() {
		if(topStack)
			throw "startJSON cannot go; already working on JSON"
	}
	this.endJSON = function() {
		stack.splice(0,0)
	}
	this.startObject = function() {
		var frame = stackFrame()
		frame.slotGenerator = function() {return frame.index}
		mkdir(frame)
	}
	this.endObject = function() {
		popStack()
	}
	this.startObjectEntry = function(key) {
		topStack.index = key
	}
	this.endObjectEntry = function() {
		topStack.index = null
	}
	this.startArray = function() {
		var frame = stackFrame()
		frame.index = 0
		frame.slotGenerator = function() {return frame.index++}
		mkdir(frame)
	}
	this.endArray = function() {
		popStack()
	}
	this.primitive = function(val) {
		var parentPromise = topStack ? topStack.status : null,
		  frame = stackFrame(),
		  path = getSlotPath()
		if(parentPromise)
			Q.when(parentPromise,function(){
				fs.writeFile(path,val,function(err){
					frame.status.resolve(!err)
				})
			},function(){frame.status.resolve(false)})
		else
			throw "primitive error: cannot be only contents of JSON"
		popStack()
	}

	return this
}
