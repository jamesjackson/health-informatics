
//DONT RE-RUN THIS WITH SAME COLLECTION NAME !!!

var indico = require('indico.io');
indico.apiKey =  '*****';

var collection = indico.Collection('my_collection202');


// TRAIN CHICKEN POX

//test is varicella_18.jpg

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_30.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_33.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_40.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_48.jpg", "chicken_pox"])
    .then(console.log);


collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_20.jpg", "chicken_pox"])
  .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_31.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_32.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_34.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_35.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_38.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_39.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_44.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_45.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_53.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_56.jpg", "chicken_pox"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_60.jpg", "chicken_pox"])
    .then(console.log);


// TRAIN MEASLES

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_2.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_3.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_5.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_10.jpg", "measles"])
    .then(console.log);


collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_4.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_6.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_7.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_8.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_9.jpg", "measles"])
    .then(console.log);




// TRAIN RINGWORM

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm2.jpg", "ringworm"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm3.jpg", "ringworm"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm4.jpg", "ringworm"])
    .then(console.log);


// TRAIN SHINGLES



collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_138.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_139.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_142.jpg", "shingles"])
    .then(console.log);



collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_135.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_137.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_275.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_317.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_437.jpg", "shingles"])
    .then(console.log);


// Training
collection.train()
    .then(console.log);

// Waiting for Collection to be ready
collection.train()
    .wait().then(function() {
    // collection ready to predict!
});