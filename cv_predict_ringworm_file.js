
var indico = require('indico.io');
var fs = require('fs');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');

var filename = "/Users/jamesjackson/8337749_f520.jpg";

fs.readFile(filename, function(err, data) {
  base64data = new Buffer(data).toString('base64');
  collection.predict(base64data)
  .then(function(res) {
    console.log(res);
  })
});

