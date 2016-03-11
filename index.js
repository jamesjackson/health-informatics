
//TODO: test against Heroku
//TODO: fixup client response for practitioner lookup (return only id ?)
//TODO: get age dynamically
//TODO: fix JSON encoding on communication
//TODO: error conditions


//curl -v -s -X POST -H '' -F 'record=@profile.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://myhealthapp.herokuapp.com/upload/foo'

//curl -v 'http://localhost:8080/1671251/login?first_name=FREDRICA&last_name=SMITH'
//curl -v 'http://localhost:8080/symptomslist'
//curl -v 'http://localhost:8080/practitioner?first_name=peter&last_name=lustig'
//curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/1671251/condition'
//curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'diagnosis=@diagnosis.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/1671251/communication/335901'


// /<patientID>/login?first_name=John&last_name=Doe (GET, validate that patient exists with this name and ID, no actual authentication)
// /symptomslist (GET, get list of questions to ask)
// /practitioner?first_name=Dr&last_name=Dre (GET, lookup doctor ID by name)
// /<patientID>/condition (multipart POST of pic + symptoms, perform diagnosis)
// /<patientID>/communication (POST, send report to doc)


var restify = require('restify');

var fs = require('fs');

var indico = require('indico.io');

var DecisionTree = require('decision-tree');

indico.apiKey =  '98c1cd8fda1c2c7ea39a702e09ec0f4c';

var collection = indico.Collection('my_collection4');


var training_data = [
    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":false, "rash_fluid":false, "diagnosis":"measles" },
    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":false, "rash_fluid":true, "diagnosis":"chicken_pox" },
    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":true, "rash_fluid":true, "diagnosis":"chicken_pox" },
    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":false, "rash_fluid":true, "diagnosis":"shingles" },
    {"age":"adult", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":false, "rash_fluid":true, "diagnosis":"shingles" },
    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":true, "rash_fluid":true, "diagnosis":"shingles" },
    {"age":"adult", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":true, "rash_fluid":true, "diagnosis":"shingles" },
    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":false, "rash_crusty":false, "rash_fluid":false, "diagnosis":"ringworm" }
];

var class_name = "diagnosis";
var features = ["age", "fever", "sore_throat", "rash_painful", "rash_crusty", "rash_fluid"];

// Train the decision tree at startup
var dt = new DecisionTree(training_data, class_name, features);


function diagnose_condition(req, res, next) {
    //console.log('XXXX: BODY', req.body);
    //console.log('XXXX params', req.params);
    //console.log('XXXX UPLOADED FILES', req.files);

    // Read JSON data
    fs.readFile(req.files.symptoms.path, function(err, data) {

        jsonSymptoms = JSON.parse(data);
        console.log(jsonSymptoms);

        // Predict diagnosis based on symptoms (local Decision Tree)
        var predicted_class = dt.predict(jsonSymptoms.symptoms);
        console.log(predicted_class);

        // Read photo data
        fs.readFile(req.files.photo.path, function(err, data) {
            base64data = new Buffer(data).toString('base64');

            // Predict diagnosis based on image (remote CV/ML)
            collection.predict(base64data)
                .then(function(result) {

                    console.log(result);

                    //Return result to client
                    res.send(201, {'decision_tree_pred' : predicted_class, 'cv_pred' : result});

                })
        });
    });

    return next();
};


function lookup_patient(req1, res1, next) {

// Creates a JSON client
    var client = restify.createJsonClient({
        url: 'http://fhirtest.uhn.ca'
    });


    first_name_in = req1.params.first_name;
    last_name_in = req1.params.last_name;
    console.log(first_name_in);
    console.log(last_name_in);

    client.get('/baseDstu2/Patient/' + req1.params.patient, function(err, req2, res2, obj) {
        //assert.ifError(err);

        first_name_back = obj.name[0].given[0].toString();
        last_name_back = obj.name[0].family[0].toString();

        console.log(first_name_back);
        console.log(last_name_back);

        //console.log(JSON.stringify(obj, null, 2));

        if ((last_name_back == last_name_in) && (first_name_back == first_name_in)) {
            console.log("auth success");
            res1.send(200, {'status' : 'ok'});
            next();
        } else {
            console.log("auth failure");
            return next(new restify.InvalidCredentialsError ("I just don't like you"));
        }


    });

};


function lookup_practitioner(req1, res1, next) {

// Creates a JSON client
    var client = restify.createJsonClient({
        url: 'http://fhirtest.uhn.ca'
    });


    first_name_in = req1.params.first_name;
    last_name_in = req1.params.last_name;
    console.log(first_name_in);
    console.log(last_name_in);

    client.get('/baseDstu2/Practitioner?family=' + last_name_in + '&given=' + first_name_in, function(err, req2, res2, obj) {
        //assert.ifError(err);

        //console.log(JSON.stringify(obj, null, 2));

            res1.send(200, obj);
            next();

    });

};


function symptoms_list(req, res, next) {

    var json_body =     {
        "symptoms": [
            {"name": "fever", "type": "boolean", "text" : "Have you experienced a fever ?"},
            {"name": "sore_throat", "type": "boolean", "text" : "Have you experienced a sore throat ?"},
            {"name": "rash_painful", "type": "boolean", "text" : "Is the rash painful ?"},
            {"name": "rash_crusty", "type": "boolean", "text" : "Is the rash crusty ?"},
            {"name": "rash_fluid", "type": "boolean", "text" : "Is the rash fluid filled ?"}
        ]
    }

    res.send(200, json_body);
    next();

};


function doctor_communication(req1, res1, next) {

    // Read JSON data (symptoms)
    fs.readFile(req1.files.symptoms.path, function(err, data) {

        jsonSymptoms = JSON.parse(data);
        console.log(jsonSymptoms);

        // Read JSON data (diagnosis)
        fs.readFile(req1.files.diagnosis.path, function(err, data) {

            jsonDiagnosis = JSON.parse(data);
            console.log(jsonDiagnosis);

            // Read photo data
            fs.readFile(req1.files.photo.path, function(err, data) {
                base64data = new Buffer(data).toString('base64');

                // Creates a JSON client
                var client = restify.createJsonClient({
                    url: 'http://fhirtest.uhn.ca'
                });

                var json_body = {
                    "resourceType": "Communication",
                    "text": {
                        "status": "generated",
                        "div": "<div>Message sent via Rash Analysis App</div>"
                    },
                    "sender": {
                        "reference": "Patient/" + req1.params.patient
                    },
                    "recipient": [
                        {
                            "reference": "Practitioner/" + req1.params.practitioner
                        }
                    ],
                    "payload": [
                        {
                            "contentAttachment": {
                                "contentType":"image/jpeg",
                                "data":base64data
                            }
                        },
                        {
                            "contentAttachment": {
                                "contentType":"application/json",
                                "data":jsonSymptoms
                            }
                        },
                        {
                            "contentAttachment": {
                                "contentType":"application/json",
                                "data":jsonDiagnosis
                            }
                        }
                    ],
                    "status": "completed",
                    "subject": {
                        "reference": "Patient/" + req1.params.patient
                    }
                }


                console.log(json_body);

                client.post('/baseDstu2/Communication', json_body,function(err, req2, res2, obj) {
                    //assert.ifError(err);

                    console.log(JSON.stringify(obj, null, 2));

                    res1.send(201, obj);
                    next();

                });
            });
        });
    });
};


var server = restify.createServer();

server.post('/:patient/condition', restify.bodyParser(), diagnose_condition);

server.get('/:patient/login', restify.queryParser(), lookup_patient);

server.get('/practitioner', restify.queryParser(), lookup_practitioner);

server.get('/symptomslist', symptoms_list);

server.post('/:patient/communication/:practitioner', restify.bodyParser(), doctor_communication);


server.listen(process.env.PORT || 8080, function() {
    return console.log('%s listening at %s', server.name, server.url);
});