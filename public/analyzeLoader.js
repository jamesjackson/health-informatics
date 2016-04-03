/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function goIndex()
{
    window.location.href = "index.html";
}

function goSendToDoctor()
{
    window.location.href = "send.html";
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