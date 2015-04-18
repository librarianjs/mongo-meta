var file = require( './File' )

function MongoMeta( options ){
  this.options = options
  this.File = file( this.options )
}

MongoMeta.prototype.sanitize = function( file ){
  if( Array.isArray( file ) ){
    return file.map( this.sanitize.bind( this ) )
  } else {
    file.id = file._id
    delete file._id
    return file
  }
}

MongoMeta.prototype.get = function( id, callback ){
  if( id === false ){
    return callback( null, false )
  }

  this.File.find( id ).then( function( file ){
    callback( null, this.sanitize( file ) )
  }.bind( this ), function(){
    callback( new Error( 'Could not retreive file ' + id ) )
  })
}

MongoMeta.prototype.all = function( callback ){
  this.File.findAll().then( function( files ){
    callback( null, this.sanitize( files ) )
  }.bind( this ) )
}

MongoMeta.prototype.patch = function( id, values, callback ){
  this.File.patch( id, values ).then( function( file ){
    callback( null, file )
  })
}

MongoMeta.prototype.new = function( meta, callback ){
  this.File.create( meta ).then( function( file ){
    callback( null, this.sanitize( file ) )
  }.bind( this ), function(){
    callback( new Error( 'Could not create record' ) )
  })
}

module.exports = MongoMeta
