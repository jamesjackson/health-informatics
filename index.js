

var restify = require('restify');

var fs = require('fs');

var indico = require('indico.io');

indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');


function respond(req, res, next) {
    return res.send('hello ' + req.params.name);
};

function echo_upload_info(req, res, next) {
    //console.log('XXXX: BODY', req.body);
    //console.log('XXXX params', req.params);
    //console.log('XXXX UPLOADED FILES', req.files);


    fs.readFile(req.files.photo.path, function(err, data) {
        base64data = new Buffer(data).toString('base64');
        collection.predict(base64data)
            .then(function(result) {
                console.log(result);
                res.send(201, result);
            })
    });

    return next();
};

var server = restify.createServer();

//sample client multipart upload (JSON blob + image)
//curl -v -s -X POST -H '' -F 'symptoms=@profile.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/upload/foo'
server.post('/upload/:name', restify.bodyParser(), echo_upload_info);


server.listen(process.env.PORT || 8080, function() {
    return console.log('%s listening at %s', server.name, server.url);
});