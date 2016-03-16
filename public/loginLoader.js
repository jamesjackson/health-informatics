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

//$.ajax({
//  type: "GET",
//  url: "http://myhealthapp.herokuapp.com/1671251/login?first_name=FREDRICA&last_name=SMITH&_sm_au_=iMVBMrSljBLFkr37",
//  cache: false,
//  headers: {'Access-Control-Allow-Origin': '*'}
//}).done(function (data) {
//          //load the lines
//          alert(data[0].status);
//      });;



function attemptLogin()
{
    var first_name = document.getElementById("first-name").value;
    var last_name = document.getElementById("last-name").value;
    var patient_ID = document.getElementById("patient-id").value;
    
    //alert(first_name + " " + last_name + " " + patient_ID);
    
    $.ajax({
    url: "http://myhealthapp.herokuapp.com/api/5401/login",
    data: { 
        first_name: first_name, 
        last_name: last_name, 
        _sm_au_: patient_ID
    },
    cache: false,
    type: "GET",
    headers: {'Access-Control-Allow-Origin': '*'}
}).done(function (data) {
          alert(data.status);
	  window.location.href = "index.html";
      });;
}

//$.get('http://myhealthapp.herokuapp.com/1671251/login', { first_name: 'FREDRICA', last_name: 'SMITH', _sm_au_: 'iMVBMrSljBLFkr37' }, function(data) {
//    alert(data.status);
//});
  
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
