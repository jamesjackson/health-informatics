

//{ shingles: 0.0018130387623253746,
//    ringworm: 0.001747688454854219,
//    chicken_pox: 0.9962754983631513,
//    measles: 0.00016377441966906983 }
//
//{ measles: 0.9979134963230073,
//    ringworm: 0.0017642801422562543,
//    chicken_pox: 0.00013453869416491442,
//    shingles: 0.0001876848405714867 }
//
//{ measles: 0.023301635205751958,
//    ringworm: 0.9696884952504534,
//    chicken_pox: 0.003297290520614488,
//    shingles: 0.0037125790231802313 }
//
//{ shingles: 0.7487049161104853,
//    ringworm: 0.24787743537160792,
//    chicken_pox: 0.0006440052883570077,
//    measles: 0.0027736432295497986 }


var indico = require('indico.io');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection200');


console.log('testing pox...\n');

collection.predict("https://s3.amazonaws.com/derm.openroar.net/chicken_pox/varicella_18.jpg")
  .then(console.log);


console.log('testing measles...\n');

collection.predict("https://s3.amazonaws.com/derm.openroar.net/measles/measles_1.jpg")
    .then(console.log);


console.log('testing ringworm...\n');

collection.predict("https://s3.amazonaws.com/derm.openroar.net/ringworm/ringworm1.jpg")
    .then(console.log);


console.log('testing shingles...\n');

collection.predict("https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_137.jpg")
    .then(console.log);