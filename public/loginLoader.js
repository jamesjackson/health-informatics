/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Initialize domain name variable
if (document.location.hostname === 'localhost') {
	var domainName = "http://" + document.location.hostname + ":9090"; //http:localhost:9090
}
else {
	var domainName = "http://" + document.location.host; //http:domain
	if (domainName.indexOf(":8181") > -1) {
		domainName = domainName.replace("8181", "9090");
	}
}

localStorage.setItem("currentSize","30");

function attemptLogin()
{    
		var first_name = document.getElementById("first-name").value;
		var last_name = document.getElementById("last-name").value;
		var patient_ID = document.getElementById("patient-id").value;
		var urlString = "http://myhealthapp.herokuapp.com/api/" +patient_ID+"/login?first_name=" + first_name +"&last_name=" +last_name;
		//alert(urlString);
		$.ajax({
			url: urlString,
			dataType:'json',
			async: false,
			success: function(data){
				alert("success" + data.status);
				setTimeout(function(){ window.location.href = "index.html";alert("bitches and hoes"); },1000);
			},
			error: function(){
				alert("unable to log in to user account");
			},
			complete: function(){
			}
		});
}

function changeSize() 
{
	  if(localStorage.getItem("currentSize") === "30")
	  {
		  localStorage.setItem("currentSize", "100");
		  $("#collapseFooter").css('height', '100px');
		  $("#collapseFooter").toggleClass('fa-angle-up fa-angle-down');
	  }
	  else
	  {
		  localStorage.setItem("currentSize", "30");
			$("#collapseFooter").css('height', '30px');
			$("#collapseFooter").toggleClass('fa-angle-down fa-angle-up');
	  }
}
