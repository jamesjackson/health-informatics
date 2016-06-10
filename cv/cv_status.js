
var indico = require('indico.io');
indico.apiKey =  '*****';


// Check status of all your collections
indico.collections()
.then(console.log);
