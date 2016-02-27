

var restify = require('restify');

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
        "contentType":"image/gif",
        "data":"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",
        "creation":"2015-09-03"
    }
}



client.post(options, json_body, function(err, req, res, obj) {
    //assert.ifError(err);
    console.log('%d -> %j', res.statusCode, res.headers);
    console.log('%j', obj);
});

