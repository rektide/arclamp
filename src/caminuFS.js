var fs = require('fs'),
  util = require('util')

var root = ""
if(typeof window !== 'undefined')
	root = window
if(typeof global !== 'undefined')
	root = global
if(typeof exports !== 'undefined')
	root = exports

/**
 * @name caminus
 * @description export json objects to the filesystem
 * @param o object to write to fs
 * @param dir root directory path for fs
 * @param callback callback(err,ok)
 * @author <a href="http://voodoowarez.com/rektide">rektide</a> &lt;<a href="mailto:rektide@voodoowarez.com">rektide@voodoowarez.com</a>&gt;
 */
var caminus = root.caminus = function(o, dir, callback) {
	// insure context

	if(!(this instanceof caminus))	
		return new caminus(o,dir)

	this.callback = callback || function(){}
	this.encoding = 'utf8'
	this.dirMode = 0750
	this.mode = 0640
	this.errs = []
	this.ref = 0

	this.dumpObject(o,dir)
}
caminus.prototype.dumpObject = function(o,dir) {
	if(this.errs.length) return
	var self = this
	for(var i in o) {
		++this.ref;
		var obj = o[i],
		  path = dir+"/"+i,
		  isDir = typeof obj == "object"
		fs.lstat(path,function(err,state) {
			// delete
			if(state && isDir != state.isDirectory)
			{
				
			}
			  

		})
		console.log("entering",util.inspect(arguments))
		if(typeof obj == "object") {
			// insure directory
						
			this.dumpObject(obj,path)
			
			// make directory
			fs.mkdir(path,this.dirMode,function(err) {
				console.log("path-o "+path,util.inspect(arguments))
				if(err && err['errno'] != 17) return self.throwError("error creating directory "+path,err)
				if(self.errs.length) return
				// write object
				self.dumpObject(obj,path)
				self.ref--
			})
		}
		else {
			// prepare value entry
			fs.open(path,'w',this.mode,function(err,fd){
				if(err) return self.open("error openning file "+path,err)
				if(self.errs.length) return
				// write value
				var buf = new Buffer(obj.toString(), encoding=self.encoding)
				console.log("path-d",path,buf.toString(),util.inspect(arguments))
				fs.write(fd,buf,0,buf.length,null,function(err,written) {
					console.log("path-w",path,util.inspect(arguments))
					if(err) self.throwException("error writing file "+path,err)
					if(isNaN(written) || written < buf.length) return self.throwException("write of unexpected size: "+written+" instead of "+buf.length)
					self.ref--
				})
			})
		}
	}
}

caminus.prototype.insureDirectory(path) {
	
}

caminus.prototype.insureFile(path) {
	
}

caminus.prototype.throwError = function(msg,err) {
	--this.refDecl
	var l = this.errs.push(err)
	if(l == 1)
		this.callback(msg+": "+err)
}
caminus.prototype.refDecl = function() {
	if(!--this.ref)
		this.callback(null,true)
}
