

var restify = require('restify');

var fs = require('fs');

var indico = require('indico.io');

indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');

function update_fhir(photo_b64) {

    // Creates a JSON client
    var client = restify.createJsonClient({
        url: 'http://fhirtest.uhn.ca'
    });

    var options = {
        path: '/baseDstu2/Media',
        headers: {
            'Accept': 'application/xml+fhir;q=1.0, application/json+fhir;q=1.0',
            'Accept-Charset': 'utf-8',
            'Accept-Encoding': 'gzip'
        },
        retry: {
            'retries': 0
        },
        agent: false
    };

    var json_body = {
        "resourceType":"Media",
        "language":[
            "en-US"
        ],
        "text":{
            "status":"generated",
            "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Diagram for Patient Still Itching<img alt=\"diagram\" src=\"#11\"/> \n                                                 </div>"
        },
        "type":"photo",
        "subtype":{
            "coding":[
                {
                    "system":"http://hl7.org/fhir/media-method",
                    "code":"diagram"
                }
            ]
        },
        "subject":{
            "reference":"Patient/P117"
        },
        "deviceName":"iPhone 6",
        "height":350,
        "width":80,
        "frames":1,
        "content":{
            "contentType":"image/jpeg",
            "data":photo_b64,
            "creation":"2015-09-03"
        }
    }

    //TODO #2: Pull reference, deviceName, height, width, creation, from client provided JSON


    //uncomment below to actually post media to UHN FHIR server

    //client.post(options, json_body, function(err, req, res, obj) {
    //    //assert.ifError(err);
    //    console.log('%d -> %j', res.statusCode, res.headers);
    //    console.log('%j', obj);
    //});

    //TODO #3: Update patient record (which resource ?) with other symptoms, auto-diagnosis, and reference to media object

};


function upload_data(req, res, next) {
    //console.log('XXXX: BODY', req.body);
    //console.log('XXXX params', req.params);
    //console.log('XXXX UPLOADED FILES', req.files);

    fs.readFile(req.files.photo.path, function(err, data) {
        base64data = new Buffer(data).toString('base64');
        collection.predict(base64data)
            .then(function(result) {

                //TODO #1: Select most likely disorder (if above threshold), combine with rules engine for final decision

                console.log(result);

                //Return result to client
                res.send(201, result);

                //Upload photo to FHIR server
                update_fhir(base64data);


            })
    });

    return next();
};

var server = restify.createServer();


//Sample client (server is local)
//curl -v -s -X POST -H '' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/upload/foo'

//Sample client (server is remote)
//curl -v -s -X POST -H '' -F 'photo=@test.jpg;type=image/jpeg"' 'http://myhealthapp.herokuapp.com/upload/foo'

server.post('/upload/:name', restify.bodyParser(), upload_data);


server.listen(process.env.PORT || 8080, function() {
    return console.log('%s listening at %s', server.name, server.url);
});