"use strict";

var gCurrentEmployeeID;
var gEntries;

function getEntries() {

    gEntries = new Array();

	var json = localStorageGet("Entries", null); //Load the string we saved earlier

	if (json === null) {
	    return;
	}

	gEntries = JSON.parse(json); //Convert the string we loaded into an array
}

function saveEntries() {

    var json = JSON.stringify(gEntries); //Convert data array to a single string

    localStorageSet("Entries", json); //Store the string into local storage
}

function signinEmployee(employeeID, password) {

    var employees = new Array();

    employees.push({ EmployeeID: "user1", Password: "pass1" });
    employees.push({ EmployeeID: "user2", Password: "pass2" });
    employees.push({ EmployeeID: "user3", Password: "pass3" });
    employees.push({ EmployeeID: "user4", Password: "pass4" });
    employees.push({ EmployeeID: "user5", Password: "pass5" });

    for (var i = 0; i < employees.length; i++) {

        if (employees[i].EmployeeID.toLowerCase() === employeeID.toLowerCase() && employees[i].Password === password) {
            return true;
        }
    }

    return false;
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
