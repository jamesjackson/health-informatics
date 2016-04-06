/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var globalImageVariable;


function goIndex()
{
    window.location.href = "index.html";
}

function goAnalyze()
{
    window.location.href = "analyze.html";
}

function findPhysicians()
{
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();	
	var url = "http://myhealthapp.herokuapp.com/api/practitioner?first_name="+firstName+"&last_name="+lastName;
	console.log('About to send');
	console.log(url);
	
	$.ajax({
		url: url,
		dataType:'json',
		async: false,
		success: function(data){
			$('#physicianPrompt').text("Please confirm that we have the correct physician by selecting yours.");
			
			$('#physiciansList').html(printPhysiciansHTML(data));
			
			$('#sendInfoToPhysicianButton').removeAttr('hidden');
		},
		error: function(){
			// Hide everything and print out that no physicians could be found
			$('#physicianPrompt').text("We're sorry. No physicians matching the name you provided could be found.");
			$('#physiciansList').html('');
			$('#sendInfoToPhysicianButton').attr('hidden', 'true');
		}
	});
}

function sendInfoToPhysician()
{
	// Get User ID
	var userID = localStorage.getItem('patientID');
	
	// Get Physician ID
	var physicianID = $('input:checked').attr('name');
	
	// Make URL
	var url = 'http://myhealthapp.herokuapp.com/api/'+userID+'/communication/'+physicianID;
	
	// Get Symptoms JSON
	var symptoms = localStorage.getItem('symptoms');
	var symptomsJSON = new Blob([JSON.stringify(symptoms)]);
	
	// Get Diagnosis JSON
	var diagnosis = localStorage.getItem('diagnosis');
	var diagnosisJSON = new Blob([JSON.stringify(diagnosis)]);
	
	// Make FormData
	var fd = new FormData();
	fd.append('symptoms', symptomsJSON, { type: "application/json"});
	fd.append('diagnosis', diagnosisJSON, { type: "application/json"});
    fd.append('photo', globalImageVariable);
    
	// Make POST call to server
	$.ajax({
        url: url,
        data: fd,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
        	if (data.status == 'created')
        	{
        		console.log('success');
        	} else {
        		console.log('other string returned? '+data.status);
        	}
        	
        },
        failure: function(data) {
        	console.log('failure');
        }
    });

}

function printPhysiciansHTML(data)
{
	var html = '';
	
	html += "<form>";
	html += "<input id='physicianSelection' type='radio' name=\'"+data.id+"\'>"+data.first_name+" "+data.last_name+" ("+data.id+")<br>";
	html += "</form><br>";
	
	return html;
}

function processImageFile(input)
{
	if (input.files && input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(image) {
			$('#imageViewer').attr('src', image.target.result).width(240).height(160);
			globalImageVariable = input.files[0];
			localStorage.setItem("image", image.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function loadImageFromCache(input)
{
	var image = localStorage.getItem("image");
	$('#imageViewer').attr('src', image).width(240).height(160); 
}