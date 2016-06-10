

//{ shingles: 0.011210979680603602,
//    ringworm: 0.0010307183291078418,
//    chicken_pox: 0.9877010189294906,
//    measles: 0.000057283060797934416 }

//{ measles: 0.9973633760285995,
//    ringworm: 0.0018931501543086777,
//    chicken_pox: 0.00010610161842937671,
//    shingles: 0.0006373721986624303 }

//{ measles: 0.17136693937350964,
//    ringworm: 0.819275126446044,
//    chicken_pox: 0.008132675306236598,
//    shingles: 0.0012252588742095822 }

//{ shingles: 0.6346762522099035,
//    ringworm: 0.0009900470043737047,
//    chicken_pox: 0.00002864121742570323,
//    measles: 0.36430505956829706 }


var indico = require('indico.io');
indico.apiKey =  '*****';

var collection = indico.Collection('my_collection202');


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

collection.predict("https://s3.amazonaws.com/derm.openroar.net/shingles/herpes_zoster_133.jpg")
    .then(console.log);