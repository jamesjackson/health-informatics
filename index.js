
//TODO: test against Heroku - DONE
//TODO: fixup client response for practitioner lookup (return only id) - FIXED
//TODO: fixup client response for communication - FIXED
//TODO: get age via FHIR
//TODO: fix JSON encoding on communication - FIXED
//TODO: error conditions - FIXED


// RESOURCES

// /<patientID>/login?first_name=FREDRICA&last_name=SMITH (GET)
// /symptomslist (GET)
// /<patientID>/condition (multipart POST)
// /practitioner?first_name=peter&last_name=lustig (GET)
// /<patientID>/communication/<practitionerID> (multipart POST)

// RUNNING LOCAL SERVER

// curl -v 'http://localhost:8080/1671251/login?first_name=FREDRICA&last_name=SMITH'
// curl -v 'http://localhost:8080/symptomslist'
// curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/1671251/condition'
// curl -v 'http://localhost:8080/practitioner?first_name=peter&last_name=lustig'
// curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'diagnosis=@diagnosis.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://localhost:8080/1671251/communication/335901'


// RUNNING HEROKU SERVER (myhealthapp.herokuapp.com)

// curl -v 'http://myhealthapp.herokuapp.com/1671251/login?first_name=FREDRICA&last_name=SMITH'
// curl -v 'http://myhealthapp.herokuapp.com/symptomslist'
// curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://myhealthapp.herokuapp.com/1671251/condition'
// curl -v 'http://myhealthapp.herokuapp.com/practitioner?first_name=peter&last_name=lustig'
// curl -v -s -X POST -H '' -F 'symptoms=@symptoms.json;type=application/json' -F 'diagnosis=@diagnosis.json;type=application/json' -F 'photo=@test.jpg;type=image/jpeg"' 'http://myhealthapp.herokuapp.com/1671251/communication/335901'




var restify = require('restify');

var fs = require('fs');

var indico = require('indico.io');

var DecisionTree = require('decision-tree');

indico.apiKey =  '*****';

var collection = indico.Collection('my_collection200');

var URLROOT = 'http://fhirtest.uhn.ca';
//var URLROOT = 'http://52.72.172.54:8080';


//
//var training_data = [
//    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":false, "rash_fluid":false, "diagnosis":"measles" },
//    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":false, "rash_fluid":true, "diagnosis":"chicken_pox" },
//    {"age":"child", "fever":true, "sore_throat":true, "rash_painful":false, "rash_crusty":true, "rash_fluid":true, "diagnosis":"chicken_pox" },
//    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":false, "rash_fluid":true, "diagnosis":"shingles" },
//    {"age":"adult", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":false, "rash_fluid":true, "diagnosis":"shingles" },
//    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":true, "rash_fluid":true, "diagnosis":"shingles" },
//    {"age":"adult", "fever":false, "sore_throat":false, "rash_painful":true, "rash_crusty":true, "rash_fluid":true, "diagnosis":"shingles" },
//    {"age":"child", "fever":false, "sore_throat":false, "rash_painful":false, "rash_crusty":false, "rash_fluid":false, "diagnosis":"ringworm" }
//];

//can ignore the attribs that don't matter i.e. any value works !!!


var training_data = [
    {"age":"child", "fever":"low", "fever_timing":"before_rash", "rash_location_upper":true, "rash_location_lower":false, "rash_location_oneside":false, "rash_itchy":true, "rash_painful":false, "exposure":true, "diagnosis":"chicken_pox" },
    {"age":"child", "fever":"low", "fever_timing":"with_rash", "rash_location_upper":true, "rash_location_lower":false, "rash_location_oneside":false, "rash_itchy":true, "rash_painful":false, "exposure":true, "diagnosis":"chicken_pox" },
    {"age":"child", "fever":"low", "fever_timing":"after_rash", "rash_location_upper":true, "rash_location_lower":false, "rash_location_oneside":false, "rash_itchy":true, "rash_painful":false, "exposure":true, "diagnosis":"chicken_pox" },
    {"age":"child", "fever":"high", "fever_timing":"before_rash", "rash_location_upper":true, "rash_location_lower":true, "rash_location_oneside":false, "rash_itchy":false, "rash_painful":false, "exposure":true, "diagnosis":"measles" },
    {"age":"adult", "fever":"none", "fever_timing":"n/a", "rash_location_upper":true, "rash_location_lower":true, "rash_location_oneside":true, "rash_itchy":false, "rash_painful":true, "exposure":false, "diagnosis":"shingles" },
    {"age":"adult", "fever":"none", "fever_timing":"n/a", "rash_location_upper":true, "rash_location_lower":false, "rash_location_oneside":true, "rash_itchy":false, "rash_painful":true, "exposure":false, "diagnosis":"shingles" },
    {"age":"adult", "fever":"none", "fever_timing":"n/a", "rash_location_upper":false, "rash_location_lower":true, "rash_location_oneside":true, "rash_itchy":false, "rash_painful":true, "exposure":false, "diagnosis":"shingles" },
    {"age":"adult", "fever":"low", "fever_timing":"before_rash", "rash_location_upper":true, "rash_location_lower":true, "rash_location_oneside":true, "rash_itchy":false, "rash_painful":true, "exposure":false, "diagnosis":"shingles" },
    {"age":"adult", "fever":"none", "fever_timing":"n/a", "rash_location_upper":false, "rash_location_lower":false, "rash_location_oneside":false, "rash_itchy":true, "rash_painful":false, "exposure":false, "diagnosis":"ringworm" }
];

var class_name = "diagnosis";

//var features = ["age", "fever", "sore_throat", "rash_painful", "rash_crusty", "rash_fluid"];

var features = ["age", "fever", "fever_timing", "rash_location_upper", "rash_location_lower", "rash_location_oneside", "rash_itchy", "rash_painful", "exposure"];


// Train the decision tree at startup
var dt = new DecisionTree(training_data, class_name, features);


function diagnose_condition(req, res, next) {

    if ((!req.files.symptoms)||(!req.files.photo))
        return next(new restify.BadRequestError ());

    // Read JSON data (symptoms)
    fs.readFile(req.files.symptoms.path, function(err, data) {

        if (err)
            return next(new restify.BadRequestError ());

        jsonSymptoms = JSON.parse(data);
        console.log(jsonSymptoms);

        // Predict diagnosis based on symptoms (local Decision Tree)
        var predicted_class = dt.predict(jsonSymptoms.symptoms);
        console.log(predicted_class);

        // Read photo data
        fs.readFile(req.files.photo.path, function(err, data) {

            if (err)
                return next(new restify.BadRequestError ());

            base64data = new Buffer(data).toString('base64');

            // Predict diagnosis based on image (remote CV/ML)
            collection.predict(base64data)
                .then(function(result) {

                    console.log(result);

                    //Return result to client
                    res.send(201, {'decision_tree_pred' : predicted_class, 'cv_pred' : result});
                    return next();

                })
        });
    });
};


function lookup_patient(req1, res1, next) {

    // Creates a JSON client
    var client = restify.createJsonClient({
        url: URLROOT
    });

    first_name_in = req1.params.first_name;
    last_name_in = req1.params.last_name;

    //console.log(first_name_in);
    //console.log(last_name_in);
    //console.log(req1.params);

    client.get('/baseDstu2/Patient/' + req1.params.patient, function(err, req2, res2, obj) {

        if (err) {
            res1.send(err.statusCode);
            return next();
        }

        first_name_back = obj.name[0].given[0].toString();
        last_name_back = obj.name[0].family[0].toString();

        //console.log(first_name_back);
        //console.log(last_name_back);
        //console.log(JSON.stringify(obj, null, 2));

        if ((last_name_back == last_name_in) && (first_name_back == first_name_in)) {
            console.log("auth success");
            res1.send(200, {'status' : 'ok'});
            next();
        } else {
            console.log("auth failure");
            return next(new restify.InvalidCredentialsError ());
        }
    });
};


function lookup_practitioner(req1, res1, next) {

// Creates a JSON client
    var client = restify.createJsonClient({
        url: URLROOT
    });


    first_name_in = req1.params.first_name;
    last_name_in = req1.params.last_name;
    //console.log(first_name_in);
    //console.log(last_name_in);

    client.get('/baseDstu2/Practitioner?family=' + last_name_in + '&given=' + first_name_in, function(err, req2, res2, obj) {

        //console.log(JSON.stringify(obj.entry[0], null, 2));

        if (err) {
            res1.send(err.statusCode);
            return next();
        }

        if (obj.total == 0) {
            return next(new restify.NotFoundError());
        }

        res1.send(200, {'id' : obj.entry[0].resource.id, 'first_name' : obj.entry[0].resource.name.given[0], 'last_name' : obj.entry[0].resource.name.family[0]});
        next();

    });
};




function symptoms_list(req, res, next) {

    //var json_body =     {
    //    "symptoms": [
    //        {"name": "fever", "type": "boolean", "text" : "Have you experienced a fever ?"},
    //        {"name": "sore_throat", "type": "boolean", "text" : "Have you experienced a sore throat ?"},
    //        {"name": "rash_painful", "type": "boolean", "text" : "Is the rash painful ?"},
    //        {"name": "rash_crusty", "type": "boolean", "text" : "Is the rash crusty ?"},
    //        {"name": "rash_fluid", "type": "boolean", "text" : "Is the rash fluid filled ?"}
    //    ]
    //}

    var json_body =     {
        "symptoms": [
            {"name": "age", "type": "factor:child,adult", "text" : "Is this affecting a child or an adult ?"},
            {"name": "fever", "type": "factor:none,low,high", "text" : "Have they experienced a fever ?"},
            {"name": "fever_timing", "type": "factor:n/a,before_rash,with_rash,after_rash", "text" : "When was the fever experienced ?"},
            {"name": "rash_location_upper", "type": "boolean", "text" : "Is the rash spread across the upper body ?"},
            {"name": "rash_location_lower", "type": "boolean", "text" : "Is the rash spread across the lower body ?"},
            {"name": "rash_location_oneside", "type": "boolean", "text" : "Is the rash spread on only one side of the body ?"},
            {"name": "rash_itchy", "type": "boolean", "text" : "Is the rash very itchy ?"},
            {"name": "rash_painful", "type": "boolean", "text" : "Is the rash very painful ?"},
            {"name": "exposure", "type": "boolean", "text" : "Has there been a clear history of exposure ?"}
        ]
    }

    res.send(200, json_body);
    next();

};


function doctor_communication(req1, res1, next) {

    if ((!req1.files.symptoms)||(!req1.files.photo)||(!req1.files.diagnosis))
        return next(new restify.BadRequestError ());

    // Read JSON data (symptoms)
    fs.readFile(req1.files.symptoms.path, function(err, data) {

        if (err)
            return next(new restify.BadRequestError ());

        jsonSymptoms = JSON.parse(data);
        console.log(jsonSymptoms);

        // Read JSON data (diagnosis)
        fs.readFile(req1.files.diagnosis.path, function(err, data) {

            if (err)
                return next(new restify.BadRequestError ());

            jsonDiagnosis = JSON.parse(data);
            console.log(jsonDiagnosis);

            // Read photo data
            fs.readFile(req1.files.photo.path, function(err, data) {

                if (err)
                    return next(new restify.BadRequestError ());

                base64data = new Buffer(data).toString('base64');

                // Creates a JSON client
                var client = restify.createJsonClient({
                    url: URLROOT
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
                                "data":JSON.stringify(jsonSymptoms)
                            }
                        },
                        {
                            "contentAttachment": {
                                "contentType":"application/json",
                                "data":JSON.stringify(jsonDiagnosis)
                            }
                        }
                    ],
                    "status": "completed",
                    "subject": {
                        "reference": "Patient/" + req1.params.patient
                    }
                }


                //console.log(JSON.stringify(json_body, null, 2));

                client.post('/baseDstu2/Communication', json_body,function(err, req2, res2, obj) {

                    if (err) {
                        res1.send(err.statusCode);
                        return next();
                    }

                    //console.log(JSON.stringify(obj, null, 2));

                    // res1.send(201, {'status' : 'created'});
                    // res1.send(201, obj.issue[0].diagnostics);
                    res1.send(201, {'status' : 'created', 'description' : obj.issue[0].diagnostics});
                    next();

                });
            });
        });
    });
};


var server = restify.createServer();

server.use(restify.CORS());

server.post('/api/:patient/condition', restify.bodyParser(), diagnose_condition);

server.get('/api/:patient/login', restify.queryParser(), lookup_patient);

server.get('/api/practitioner', restify.queryParser(), lookup_practitioner);

server.get('/api/symptomslist', symptoms_list);

server.post('/api/:patient/communication/:practitioner', restify.bodyParser(), doctor_communication);

//server.get(/\/public\/?.*/, restify.serveStatic({
//    directory: __dirname
//}));

server.get(/\/?.*/, restify.serveStatic({
    default: 'login.html',
    directory: './public'
}));

server.listen(process.env.PORT || 8080, function() {
    return console.log('%s listening at %s', server.name, server.url);
});