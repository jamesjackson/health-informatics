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

function findPhysician()
{
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();	
	var url = "http://myhealthapp.herokuapp.com/api/practitioner";
	console.log('fdskafd');
	// ?first_name="+firstName+"&last_name="+lastName;
	
	$.ajax({
	    url: url,
	    data: { 
	        first_name: firstName, 
	        last_name: lastName
	    },
	    //cache: false,
	    type: "GET",
	    headers: {'Access-Control-Allow-Origin': '*'}
	}).done(console.log("fdaf"));
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