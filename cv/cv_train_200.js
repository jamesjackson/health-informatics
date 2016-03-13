
//DONT RE-RUN THIS WITH SAME COLLECTION NAME !!!

var indico = require('indico.io');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection200');


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


// TRAIN MEASLES

//test is measles_1.jpg

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_2.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_3.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_5.jpg", "measles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/measles/measles_10.jpg", "measles"])
    .then(console.log);


// TRAIN RINGWORM

//test is ringworm1.jpg

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm2.jpg", "ringworm"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm3.jpg", "ringworm"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm4.jpg", "ringworm"])
    .then(console.log);


// TRAIN SHINGLES

//test is herpes_zoster_137.jpg

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_138.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_139.jpg", "shingles"])
    .then(console.log);

collection.addData(["https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_142.jpg", "shingles"])
    .then(console.log);



// Training
collection.train()
    .then(console.log);

// Waiting for Collection to be ready
collection.train()
    .wait().then(function() {
    // collection ready to predict!
});