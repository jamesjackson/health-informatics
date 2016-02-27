
var indico = require('indico.io');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');

// Image data
collection.predict("http://usercontent2.hubimg.com/8337749_f520.jpg")
  .then(console.log);



