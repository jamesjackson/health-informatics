/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

function printPhysiciansHTML(data)
{
	var html = '';
	
	html += "<form>";
	html += "<input type='radio' name='physician'>"+data.first_name+" "+data.last_name+"<br>";
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