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

jQuery.ajax = (function(_ajax){

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success){
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);

function attemptLogin()
{   
    alert("new new trial");
	var first_name = document.getElementById("first-name").value;
    var last_name = document.getElementById("last-name").value;
    var patient_ID = document.getElementById("patient-id").value;
    //alert(first_name + " " + last_name + " " + patient_ID);
    $.ajax({
    url: "http://myhealthapp.herokuapp.com/api/" + patient_ID + "/login",
    data: { 
        first_name: first_name, 
        last_name: last_name
    },
    cache: false,
    type: "GET",
    headers: {'Access-Control-Allow-Origin': '*'},
	error: function (xhr, textStatus, thrownError) {
		alert(textStatus);
        alert(xhr.status);
        alert(xhr.responseText);
      }
}).done(function (data) {
          if( data.status == 'ok')
			window.location.href = "index.html";
      });
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
