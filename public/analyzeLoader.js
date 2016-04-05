/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
		console.log(symptom);
		
		// input entry tag
		var options = [];
		if (symptom.type == "boolean")
		{
			options = ['Yes', 'No'];
		} else {
			tokens = symptom.type.split(':');
			options = tokens[1].split(',');
		}
		console.log(options);
		// select entry tag
		result += (symptom.text+"   ");
		result += "<select>";
		
		// add options to select tag
		for (j = 0 ; j < options.length ; j++)
		{
			result += "<option>";
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

function loadImageFromCache(input)
{
	var image = localStorage.getItem("image");
	$('#imageViewer').attr('src', image).width(240).height(160); 
}