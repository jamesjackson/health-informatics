
var indico = require('indico.io');
indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';


// Check status of all your collections
indico.collections()
.then(console.log);
