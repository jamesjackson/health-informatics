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

function showPhoto(input)
{
	if (input.files && input.files[0])
	{
		var reader = new FileReader();
		reader.onload = function(image) {
			$('#imageViewer').attr('src', image.target.result).width(150).height(200);
		}
		reader.readAsDataURL(input.files[0]);
	}
}