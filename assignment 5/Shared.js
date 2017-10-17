
"use strict";

var gCurrentEmployeeID;
var gEntries;

function getEntries() {

    gEntries = new Array();

     var url = "https://cs390-hw5.herokuapp.com/timelogs"
 
  fetch(url, {
    method: "GET", // can also be GET, although if you don't provide a method it's assumed GET
    headers: {
        'content-type': 'application/json'
    },
    //body: JSON.stringify(bodyData)
}).then(function(res) {
    /*
    // If the server responds, even with a non-OK status, it will still end up in then
    // so you need to manually check for whether the response was ok or not.
    // 404, 403, 500 responses for example, will still end up here.
    */
    if(res.status != 200){
      showAlert(res.statusText);  

    localStorage.setItem("Entries", null);
      return;
    }
        if (res.ok) {

            res.json().then(function(data) {
                // do something with that data
                //alert(JSON.parse(data));
            gEntries = data;
            saveEntries();
            //console.log(gEntries);
            //callback();
            return;
            });
        }
        else {
            //res.json().then(function(data) {
        // do something with the error data
        throw Error(res.statusText);
        return;
           //})
        }
    }).catch(function(err) {
    // this will only fire if the actual request TO the server fails, such as a network error.
    showAlert(err.toString());
    }); 
}

function saveEntries() {

    var json = JSON.stringify(gEntries); //Convert data array to a single string

    localStorageSet("Entries", json); //Store the string into local storage
}

function signinEmployee(employeeID, password) {
   // var emID = employeeID.toLowerCase();

     var bodyData = {"employeeID": employeeID, "password": password};
     var url = "https://cs390-hw5.herokuapp.com/auth/login"
 
  fetch(url, {
    method: "POST", // can also be GET, although if you don't provide a method it's assumed GET
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(bodyData)
}).then(function(res) {
    /*
    // If the server responds, even with a non-OK status, it will still end up in then
    // so you need to manually check for whether the response was ok or not.
    // 404, 403, 500 responses for example, will still end up here.
    */  

        if(res.status != 200){

            showAlert(res.statusText);  

            localStorage.setItem("Entries", null);
            return false;
            }
        if (res.ok) {

            res.json().then(function(data) {
                // do something with that data

            return true;
                
            });
        }
        else {
          // res.json().then(function(data) {
        // do something with the error data
        //document.getElementById("demo").innerHTML = JSON.parse(data);

            //})
            showAlert(res.statusText);
        throw Error(res.statusText);
        
        }
    }).catch(function(err) {
    // this will only fire if the actual request TO the server fails, such as a network error.
            showAlert(err);
            return false;
    }); 
 
}

function window_onclick(event) {
    if (event.target.className === "divModal" && event.target.id !== "divSignIn") {
        event.target.style.display = "none";
    }
}

function showAlert(message) {

    divAlertMessage.innerHTML = message;

    spanAlertX.onclick = btnAlertOK_onclick;
    btnAlertOK.onclick = btnAlertOK_onclick;

    divAlert.style.display = "flex";

    function btnAlertOK_onclick() {
        divAlert.style.display = "none";
    }
}

function showConfirm(yesCallback, message) {

    divConfirmMessage.innerHTML = message;

    btnConfirmYes.onclick = spanConfirmYes_onclick;
    spanConfirmX.onclick = spanConfirmNo_onclick;
    btnConfirmNo.onclick = spanConfirmNo_onclick;

    divConfirm.style.display = "flex";
    return;

    function spanConfirmYes_onclick() {
        divConfirm.style.display = "none";
        yesCallback();
    }

    function spanConfirmNo_onclick() {
        divConfirm.style.display = "none";
    }
}

function validDate(dateString) {

    var date = new Date(dateString);

    if (date === "Invalid Date") {
        return false;
    }

    return true;
}

function tryParse(stringValue, maxDecimals) {
    var char;
    var dotFound = false;
    var numberDecimals = 0;

    if (stringValue === "") {
        return false;
    }

    for (var i = 0; i < stringValue.length; i++) {

        char = stringValue.charAt(i);

        if (char === ".") {
            if (dotFound === true) {
                return false;
            }
            dotFound = true;
        }
        else if (char === "-") {
            if (i > 0) {
                return false;
            }
        }
        else if (char < "0" || char > "9") {
            return false;
        }
        else {

            // If we get here, we must have a number character.  Make sure we haven't found
            // too many decimal positions.

            if (dotFound === true) {
                numberDecimals++;
                if (numberDecimals > maxDecimals) {
                    return false;
                }
            }
        }
    }

    // If we get here, the value is OK.

    return true;
}

// These functions encapsulate local and session storage for consistencty and to simplify handling 
// default values.

function localStorageGet(token, defaultValue) {

    var value = localStorage.getItem(token);

    if (value === null) {
        return defaultValue;
    }

    return value;
}

function localStorageSet(token, value) {
    localStorage.setItem(token, value);
}
