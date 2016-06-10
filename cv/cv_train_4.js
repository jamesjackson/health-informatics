
//DONT RE-RUN THIS WITH SAME COLLECTION NAME !!!

var indico = require('indico.io');
indico.apiKey =  '*****';

var collection = indico.Collection('my_collection4');


collection.addData(["http://hardinmd.lib.uiowa.edu/pictures22/dermnet/varicella_44.jpg", "chicken_pox"])
  .then(console.log);

collection.addData(["http://hardinmd.lib.uiowa.edu/pictures22/dermnet/varicella_39.jpg", "chicken_pox"])
  .then(console.log);


collection.addData(["http://www.healthline.com/hlcmsresource/images/Image-Galleries/Ringworm/ringworm_wrist.jpg", "ringworm"])
  .then(console.log);

collection.addData(["http://cdn.girlishh.com/wp-content/uploads/2013/04/Ringworm.jpg", "ringworm"])
  .then(console.log);


// Training
collection.train()
    .then(console.log);
