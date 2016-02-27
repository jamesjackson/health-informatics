
var indico = require('indico.io');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');


//upload chicken pox samples (repoint to S3, and add many more)

collection.addData(["http://hardinmd.lib.uiowa.edu/pictures22/dermnet/varicella_44.jpg", "chicken_pox"])
  .then(console.log);

collection.addData(["http://hardinmd.lib.uiowa.edu/pictures22/dermnet/varicella_39.jpg", "chicken_pox"])
  .then(console.log);


//upload ringworm samples (repoint to S3, and add many more)

collection.addData(["http://www.healthline.com/hlcmsresource/images/Image-Galleries/Ringworm/ringworm_wrist.jpg", "ringworm"])
  .then(console.log);

collection.addData(["http://cdn.girlishh.com/wp-content/uploads/2013/04/Ringworm.jpg", "ringworm"])
  .then(console.log);


//add other types


// Training
collection.train()
  .then(console.log);

