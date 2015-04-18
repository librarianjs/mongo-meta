var mongo = require( 'mongodb' )
var MongoClient = mongo.MongoClient
var ObjectID = mongo.ObjectID
var Promise = require( 'bluebird' )

module.exports = function setupMongoMeta( options ){
  options = options || {}
  var host = options.host || 'localhost:27017'
  var databaseName = options.databaseName || 'librarian'
  var collectionName = options.collectionName || 'librarian_uploads'

  var collection
  var fetching
  function getCollection(){
    if( collection ) {
      return Promise.resolve( collection )
    } else if ( fetching ) {
      return fetching.then( function(){
        return collection
      })
    } else {
      fetching = new Promise( function( resolve, reject ){
        MongoClient.connect( 'mongodb://' + host + '/' + databaseName, function( err, db ){
          if( err ){
            reject( err )
          } else {
            collection = db.collection( collectionName )
            resolve( collection )
          }
        })
      })

      return fetching
    }
  }

  function findOne( id ){
    return getCollection().then( function( collection ){
      return new Promise( function( resolve, reject ){
        var oID
        try {
          oID = ObjectID(id)
        } catch (e){ // Invalid objectID provided
          return resolve( false )
        }
        collection.findOne( { _id: oID }, function( err, res ){
          if( err ){
            reject( err )
          } else {
            resolve( res || false )
          }
        } )
      })
    })
  }

  function findAll(){
    return getCollection().then( function( collection ){
      return new Promise( function( resolve, reject ){
        collection.find({}).toArray(function( err, records ){
          if( err ){
            reject( err )
          } else {
            resolve( records )
          }
        } )
      })
    })
  }

  function patchOne( id, data ){
    return getCollection().then( function( collection ){
      return new Promise( function( resolve, reject ){
        var oID
        try {
          oID = ObjectID(id)
        } catch (e){ // Invalid objectID provided
          return resolve( false )
        }
        collection.updateOne( { _id: oID }, {
          $set: data
        }, function( err, record ){
          if( err ){
            reject( err )
          } else {
            return findOne( id ).then( function( doc ){
              resolve( doc )
            })
          }
        } )
      })
    })
  }

  function create( data ){
    return getCollection().then( function( collection ){
      return new Promise( function( resolve, reject ){
        collection.insert( data, function( err, res ){
          if( err ){
            reject( err )
          } else {
            resolve( res.ops[0] )
          }
        } )
      })
    })
  }

  return {
    find: findOne,
    findAll: findAll,
    patch: patchOne,
    create: create
  }
}
