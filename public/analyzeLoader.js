/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var globalImageVariable;

jQuery.extend({
    postJSON: function(params) {
        return jQuery.ajax(jQuery.extend(params, {
            type: "POST",
            data: JSON.stringify(params.data),
            dataType: "json",
            contentType: "application/json",
            processData: false
        }));
    }
});

function setup()
{
	loadImageFromCache();
	loadSymptomList();
}

function goIndex()
{
    window.location.href = "index.html";
}

function goSendToDoctor()
{
    window.location.href = "send.html";
}

function loadSymptomList()
{
	$.ajax({
		url: "http://myhealthapp.herokuapp.com/api/symptomslist",
		dataType:'json',
		async: false,
		success: function(data){
			$('#symptomsQuestions').html(printSymptomsQuestions(data));
			// reveal submit button
			$('#submitForAnalysisButton').removeAttr('hidden');
		},
		error: function(){
			alert("Could not access server");
		}
	});
}

function processImageFile(input)
{
	if (input.files && input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(image) {
			$('#imageViewer').attr('src', image.target.result).width(240).height(160);
			localStorage.setItem("image", image.target.result);
			globalImageVariable = input.files[0];
			localStorage.setItem("imageFile", input.files[0]);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function printSymptomsQuestions(data)
{
	var result = "";
	result += "<form>";
	for (i = 0 ; i < data.symptoms.length ; i++)
	{
		symptom = data.symptoms[i];
		
		// input entry tag
		var options = [];
		if (symptom.type == "boolean")
		{
			options = ['Yes', 'No'];
		} else {
			tokens = symptom.type.split(':');
			options = tokens[1].split(',');
		}
		// select entry tag
		result += (symptom.text+"   ");
		result += "<select id=\""+symptom.name+"\">";
		
		// add options to select tag
		for (j = 0 ; j < options.length ; j++)
		{
			result += "<option value=\""+j+"\">";
			result += options[j];
			result += "</option>";
		}
		
		// select exit tag
		result += "</select>";
		
		// add break
		result += "<br>";
	}
	
	result += "</form>"
	return result;
}

function submitForAnalysis()
{
	// get data
	var age = $('#age option:selected').text(),
	fever = $('#fever option:selected').text(),
	fever_timing = $('#fever_timing option:selected').text(),
	rash_location_upper = getBooleanFromSelect('rash_location_upper'),
	rash_location_lower = getBooleanFromSelect('rash_location_lower'),
	rash_location_oneside = getBooleanFromSelect('rash_location_oneside'),
	rash_itchy = getBooleanFromSelect('rash_itchy'),
	rash_painful = getBooleanFromSelect('rash_painful'),
	exposure = getBooleanFromSelect('exposure');
	
	var symptoms_data_inner = {
		age: age,
		fever: fever,
		fever_timing: fever_timing,
		rash_location_upper: rash_location_upper,
		rash_location_lower: rash_location_lower,
		rash_location_oneside: rash_location_oneside,
		rash_itchy: rash_itchy,
		rash_painful: rash_painful,
		exposure: exposure
	};
	
	var symptoms_data = {
		symptoms: symptoms_data_inner
	};
	
	// send form data to server and get diagnosis
	var fd = new FormData();
    var photo = localStorage.getItem('image');
    fd.append('symptoms', new Blob([JSON.stringify(symptoms_data)]), { type: "application/json"});
    fd.append('photo', globalImageVariable);
    
    $.ajax({
        url: 'http://myhealthapp.herokuapp.com/api/5401/condition',
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
        	
        	var cv_pred = data.cv_pred;
        	
        	// Set Text of Computer Vision Prediction
        	var max = 0,
        	cv_pred_text = '';
        	if (cv_pred.chicken_pox > max) {
        		max = cv_pred.chicken_pox;
        		cv_pred_text = 'Chicken Pox';
        	}
        	if (cv_pred.measles > max) {
        		max = cv_pred.measles;
        		cv_pred_text = 'Measles';
        	}
        	if (cv_pred.ringworm > max) {
        		max = cv_pred.ringworm;
        		cv_pred_text = 'Ringworm';
			}
        	if (cv_pred.shingles > max) {
        		max = cv_pred.shingles;
				cv_pred_text = 'Shingles';
			}
			$('#cv_pred').text("Computer Vision Prediction: "+cv_pred_text);
        	
        	// Set Text of Decision Tree Prediction
        	$('#dt_pred').text("Decision Tree Prediction: "+data.decision_tree_pred);
        },
        failure: function(data) {
        	$('#cv_pred').text('');
        	$('#dt_pred').text('');
        }
    });

}

function getBooleanFromSelect(id)
{
	var text = $('#'+id+' option:selected').text();
	if (text == 'Yes')
	{
		return true;
	} else {
		return false;
	}
}

function loadImageFromCache(input)
{
	var image = localStorage.getItem("image");
	$('#imageViewer').attr('src', image).width(240).height(160); 
}