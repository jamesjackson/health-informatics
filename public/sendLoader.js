/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var globalImageVariable;
var BASE64_MARKER = ';base64,';

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
	var symptoms = JSON.parse(localStorage.getItem('symptoms'));
	console.log(symptoms);
	symptoms.symptoms.days_since_start = $('#days_since_start option:selected').text();
	symptoms.symptoms.notes = $('#notes').val();
	console.log(symptoms.symptoms.days_since_start);
	console.log(symptoms.symptoms.notes);
	var symptomsJSON = new Blob([JSON.stringify(symptoms)]);
	
	// Get Diagnosis JSON
	var diagnosis = JSON.parse(localStorage.getItem('diagnosis'));
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
        	console.log(data);
        	if (data.status == 'created')
        	{
        		// get resource id from description string
        		var descriptionString = data.description;
        		var tokens = descriptionString.split('/');
        		var communicationId = tokens[1];
        		console.log(communicationId);
        		
        		// show popup
        		$('#commId').text("Communication ID: "+communicationId);
        		$('#screenTransitionPopup').removeAttr('hidden');
            	$("#screenTransitionPopup").position({
         		   my: "center",
         		   at: "center",
         		   of: window
         		});
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
	html += "<tr><th>Select</th><th>First Name</th><th>Last Name</th><th>ID</th></tr>";
	html += "<tr><td>";
	html += "<form>";
	html += "<input id='physicianSelection' type='radio' name=\'"+data.id+"\'>";
	html += "</form><br>";
	html += "</td><td>"+data.first_name+"</td><td>"+data.last_name+"</td><td>"+data.id+"</td></tr>";
	
	return html;
}

function processImageFile(input)
{
	if (input.files && input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(image) {
			$('#imageViewer').attr('src', image.target.result).width(240).height(160);
			localStorage.setItem("image", image.target.result);
			//globalImageVariable = localStorage.getItem("image");
			globalImageVariable = input.files[0];
			localStorage.setItem("imageFile", input.files[0]);
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function loadImageFromCache(input)
{
	image = localStorage.getItem("image");
	$('#imageViewer').attr('src', image).width(240).height(160);
	console.log(convertDataURIToBinary(image));
	globalImageVariable = new Blob([convertDataURIToBinary(image)], {type: "image/jpeg"});
	console.log(globalImageVariable);
}


function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
