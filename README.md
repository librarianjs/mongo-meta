*Not compatible with librarian 2. Use librairan-mongo-data instead*

# Librarian Mongo Meta

## Installation
```
$ npm install librarian-mongo-meta
```

## Usage
```js
var express = require( 'express' )
var librarian = require( 'librarian' )
var MongoMeta = require( 'librarian-mongo-meta' )
var meta = new MongoMeta({
  host: '192.168.0.44:27017', // optional, defaults to 'localhost:27017'
  databaseName: 'myAwesomeDb', // optional, defaults to 'librarian'
  collectionName: 'myUploads' // optional, defaults to 'libarian_upload'
})

var app = express()
app.use( '/files', librarian({
    metadataEngine: meta
}) )

app.listen( 8888, function(){
    console.log( 'app listening' )
})
```
